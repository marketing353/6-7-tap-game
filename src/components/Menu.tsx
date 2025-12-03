import React from 'react';
import { playSound } from '../utils/sound';
import { Difficulty, PlayerProgress } from '../types';

interface MenuProps {
  onStart: (mode: 'timed' | 'practice') => void;
  onSettings: () => void;
  onTutorial: () => void;
  onAchievements: () => void;
  onStats: () => void;
  highScore: number;
  difficulty: Difficulty;
  soundEnabled: boolean;
  playerProgress: PlayerProgress;
}

const Menu: React.FC<MenuProps> = ({
  onStart,
  onSettings,
  onTutorial,
  onAchievements,
  onStats,
  highScore,
  difficulty,
  soundEnabled,
  playerProgress
}) => {
  const handleStart = (mode: 'timed' | 'practice') => {
    if (soundEnabled) playSound('start');
    onStart(mode);
  };

  const unlockedAchievements = playerProgress.achievements.filter(a => a.unlocked).length;
  const totalAchievements = playerProgress.achievements.length;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-dark-bg text-white p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-neon-pink opacity-20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-neon-cyan opacity-20 blur-3xl rounded-full animate-pulse delay-700"></div>

      <div className="z-10 text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-black game-font tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-yellow via-neon-pink to-neon-cyan animate-pulse">
            6-7 TAP!
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium tracking-wide">
            SEE 6 OR 7? <span className="text-neon-yellow font-bold">TAP IT.</span>
            <br />
            SEE ANYTHING ELSE? <span className="text-red-500 font-bold">DON'T.</span>
          </p>
        </div>

        <div className="py-4 space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 px-4 py-3 border-2 border-gray-800 rounded-xl bg-gray-900/50 backdrop-blur-sm">
              <p className="text-gray-400 text-xs uppercase tracking-wider">High Score</p>
              <p className="text-2xl font-bold text-white">{highScore.toLocaleString()}</p>
            </div>
            <div className="flex-1 px-4 py-3 border-2 border-gray-800 rounded-xl bg-gray-900/50 backdrop-blur-sm">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Streak</p>
              <p className="text-2xl font-bold text-neon-pink">{playerProgress.dailyStreak} 🔥</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Current: <span className="text-neon-cyan">{difficulty}</span> • Sound {soundEnabled ? '🔊' : '🔇'}
            <br />
            Achievements: <span className="text-neon-yellow">{unlockedAchievements}/{totalAchievements}</span>
          </div>
        </div>

        <div className="space-y-3 w-full max-w-sm">
          <button
            onClick={() => handleStart('timed')}
            className="group relative w-full px-10 py-5 bg-white text-black font-black text-2xl md:text-3xl rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)]"
          >
            <span className="relative z-10">⏱ PLAY (30s)</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-pink to-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-md -z-10"></div>
          </button>

          <button
            onClick={() => handleStart('practice')}
            className="w-full px-8 py-4 bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan font-bold text-lg rounded-full transition-all duration-200 hover:bg-neon-cyan/30 hover:scale-105 active:scale-95"
          >
            ♾️ PRACTICE MODE
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onAchievements}
              className="px-4 py-3 bg-gradient-to-r from-neon-pink/20 to-neon-cyan/20 border border-neon-cyan text-white font-bold rounded-xl transition-all hover:from-neon-pink/30 hover:to-neon-cyan/30"
            >
              🏆 ACHIEVEMENTS
            </button>
            <button
              onClick={onStats}
              className="px-4 py-3 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500 text-white font-bold rounded-xl transition-all hover:from-purple-900/40 hover:to-blue-900/40"
            >
              📊 STATS
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onTutorial}
              className="flex-1 px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 font-bold rounded-xl transition-colors hover:bg-gray-700"
            >
              📖 TUTORIAL
            </button>
            <button
              onClick={onSettings}
              className="flex-1 px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 font-bold rounded-xl transition-colors hover:bg-gray-700"
            >
              ⚙️ SETTINGS
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 text-gray-600 text-xs text-center max-w-md">
        Enable sound for best experience.
      </div>
    </div>
  );
};

export default Menu;
