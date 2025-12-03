import React, { useState } from 'react';
import Game from './components/Game';
import Menu from './components/Menu';
import Results from './components/Results';
import Settings from './components/Settings';
import Tutorial from './components/Tutorial';
import { GameState, GameStats, GameSettings } from './types';
import { getSettings, saveSettings, getHighScore, saveHighScore, addGameToHistory } from './utils/storage';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [lastStats, setLastStats] = useState<GameStats | null>(null);
  const [gameMode, setGameMode] = useState<'timed' | 'practice'>('timed');
  const [settings, setSettings] = useState<GameSettings>(getSettings());
  const [highScore, setHighScore] = useState(getHighScore());

  const startGame = (mode: 'timed' | 'practice') => {
    setGameMode(mode);
    setGameState(GameState.PLAYING);
  };

  const endGame = (stats: GameStats) => {
    setLastStats(stats);

    // Only update high score for timed mode on medium difficulty
    if (stats.mode === 'timed' && stats.score > highScore) {
      setHighScore(stats.score);
      saveHighScore(stats.score);
    }

    // Save to history
    addGameToHistory(stats);

    setGameState(GameState.GAME_OVER);
  };

  const goHome = () => {
    setGameState(GameState.MENU);
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

  const updateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black" data-theme={settings.theme}>
      {gameState === GameState.MENU && (
        <Menu
          onStart={startGame}
          onSettings={openSettings}
          onTutorial={openTutorial}
          highScore={highScore}
          difficulty={settings.difficulty}
          soundEnabled={settings.soundEnabled}
        />
      )}
      {gameState === GameState.PLAYING && (
        <Game
          onGameOver={endGame}
          difficulty={settings.difficulty}
          mode={gameMode}
          soundEnabled={settings.soundEnabled}
        />
      )}
      {gameState === GameState.GAME_OVER && lastStats && (
        <Results
          stats={lastStats}
          onRestart={restartGame}
          onHome={goHome}
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
    </div>
  );
};

export default App;
