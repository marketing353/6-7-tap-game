import React, { useState } from 'react';
import Game from './components/Game';
import Menu from './components/Menu';
import Results from './components/Results';
import Settings from './components/Settings';
import Tutorial from './components/Tutorial';
import Achievements from './components/Achievements';
import Stats from './components/Stats';
import Shop from './components/Shop';
import DailySpin from './components/DailySpin';
import AchievementNotification from './components/AchievementNotification';
import { GameState, GameStats, GameSettings, Achievement, PlayerProgress } from './types';
import { getSettings, saveSettings, getHighScore, saveHighScore, addGameToHistory } from './utils/storage';
import { getPlayerProgress, updateProgressWithGameStats } from './utils/achievements';
import { canSpinToday } from './utils/dailySpin';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [lastStats, setLastStats] = useState<GameStats | null>(null);
  const [gameMode, setGameMode] = useState<'timed' | 'practice'>('timed');
  const [settings, setSettings] = useState<GameSettings>(getSettings());
  const [highScore, setHighScore] = useState(getHighScore());
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(getPlayerProgress());
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [goldenNumbersCollected, setGoldenNumbersCollected] = useState(0);
  const [powerUpsCollected, setPowerUpsCollected] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [showDailySpin, setShowDailySpin] = useState(false);

  const startGame = (mode: 'timed' | 'practice') => {
    setGameMode(mode);
    setGameState(GameState.PLAYING);
    setGoldenNumbersCollected(0);
    setPowerUpsCollected(0);
  };

  const endGame = (stats: GameStats, goldenNumbers: number = 0, powerUps: number = 0) => {
    setLastStats(stats);

    // Only update high score for timed mode on medium difficulty
    if (stats.mode === 'timed' && stats.score > highScore) {
      setHighScore(stats.score);
      saveHighScore(stats.score);
    }

    // Save to history
    addGameToHistory(stats);

    // Update progress and check for achievements
    const { progress, newAchievements: unlockedAchievements, coinsEarned: coins } = updateProgressWithGameStats(
      stats,
      goldenNumbers,
      powerUps
    );
    setPlayerProgress(progress);
    setCoinsEarned(coins);

    // Show achievement notifications
    if (unlockedAchievements.length > 0) {
      setNewAchievements(unlockedAchievements);
    }

    setGameState(GameState.GAME_OVER);
  };

  const goHome = () => {
    setGameState(GameState.MENU);
    // Check if daily spin is available
    if (canSpinToday(playerProgress.lastSpinDate)) {
      setTimeout(() => setShowDailySpin(true), 500); // Small delay for smooth transition
    }
  };

  const closeDailySpin = () => {
    setShowDailySpin(false);
  };

  const restartGame = () => {
    setGameState(GameState.PLAYING);
  };

  const openSettings = () => {
    setGameState(GameState.SETTINGS);
  };

  const openTutorial = () => {
    setGameState(GameState.TUTORIAL);
  };

  const openAchievements = () => {
    setGameState(GameState.ACHIEVEMENTS);
  };

  const openStats = () => {
    setGameState(GameState.STATS);
  };

  const openShop = () => {
    setGameState(GameState.SHOP);
  };

  const updateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const updatePlayerProgress = (newProgress: PlayerProgress) => {
    setPlayerProgress(newProgress);
  };

  const dismissAchievement = () => {
    setNewAchievements((prev) => prev.slice(1));
  };

  // Update game callbacks
  const handleGameOver = (stats: GameStats) => {
    endGame(stats, goldenNumbersCollected, powerUpsCollected);
  };

  const onGoldenNumberCollected = () => {
    setGoldenNumbersCollected((prev) => prev + 1);
  };

  const onPowerUpCollected = () => {
    setPowerUpsCollected((prev) => prev + 1);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black" data-theme={settings.theme}>
      {gameState === GameState.MENU && (
        <Menu
          onStart={startGame}
          onSettings={openSettings}
          onTutorial={openTutorial}
          onAchievements={openAchievements}
          onStats={openStats}
          onShop={openShop}
          highScore={highScore}
          difficulty={settings.difficulty}
          soundEnabled={settings.soundEnabled}
          playerProgress={playerProgress}
        />
      )}
      {gameState === GameState.PLAYING && (
        <Game
          onGameOver={handleGameOver}
          difficulty={settings.difficulty}
          mode={gameMode}
          soundEnabled={settings.soundEnabled}
          onGoldenNumberCollected={onGoldenNumberCollected}
          onPowerUpCollected={onPowerUpCollected}
        />
      )}
      {gameState === GameState.GAME_OVER && lastStats && (
        <Results
          stats={lastStats}
          onRestart={restartGame}
          onHome={goHome}
          coinsEarned={coinsEarned}
        />
      )}
      {gameState === GameState.SETTINGS && (
        <Settings
          settings={settings}
          onUpdateSettings={updateSettings}
          onBack={goHome}
        />
      )}
      {gameState === GameState.TUTORIAL && (
        <Tutorial onClose={goHome} />
      )}
      {gameState === GameState.ACHIEVEMENTS && (
        <Achievements progress={playerProgress} onClose={goHome} />
      )}
      {gameState === GameState.STATS && (
        <Stats progress={playerProgress} onClose={goHome} />
      )}
      {gameState === GameState.SHOP && (
        <Shop
          progress={playerProgress}
          onUpdateProgress={updatePlayerProgress}
          onClose={goHome}
        />
      )}

      {/* Achievement Notifications */}
      {newAchievements.length > 0 && (
        <AchievementNotification
          achievement={newAchievements[0]}
          onClose={dismissAchievement}
        />
      )}

      {/* Daily Spin */}
      {showDailySpin && gameState === GameState.MENU && (
        <DailySpin
          progress={playerProgress}
          onUpdateProgress={updatePlayerProgress}
          onClose={closeDailySpin}
        />
      )}
    </div>
  );
};

export default App;
