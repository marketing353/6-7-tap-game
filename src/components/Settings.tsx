import React from 'react';
import { Difficulty, Theme, GameSettings } from '../types';

interface SettingsProps {
  settings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings, onBack }) => {
  const updateDifficulty = (difficulty: Difficulty) => {
    onUpdateSettings({ ...settings, difficulty });
  };

  const toggleSound = () => {
    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const updateTheme = (theme: Theme) => {
    onUpdateSettings({ ...settings, theme });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-dark-bg text-white p-6 overflow-y-auto">
      <div className="w-full max-w-md space-y-8 animate-pop">
        <div className="text-center">
          <h2 className="text-5xl font-black game-font text-white mb-2">SETTINGS</h2>
          <p className="text-gray-400 text-sm">Customize your game experience</p>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-3">
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Difficulty</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.values(Difficulty).map((diff) => (
              <button
                key={diff}
                onClick={() => updateDifficulty(diff)}
                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${
                  settings.difficulty === diff
                    ? 'bg-neon-cyan text-black shadow-lg shadow-neon-cyan/50'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {settings.difficulty === Difficulty.EASY && '⭐ Slower pace, more targets'}
            {settings.difficulty === Difficulty.MEDIUM && '⭐⭐ Balanced challenge'}
            {settings.difficulty === Difficulty.HARD && '⭐⭐⭐ Fast pace, fewer targets'}
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="space-y-3">
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Sound</h3>
          <button
            onClick={toggleSound}
            className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-between ${
              settings.soundEnabled
                ? 'bg-neon-pink text-black shadow-lg shadow-neon-pink/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span>{settings.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}</span>
            <span className="text-2xl">{settings.soundEnabled ? '✓' : '✗'}</span>
          </button>
        </div>

        {/* Theme Selection */}
        <div className="space-y-3">
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Theme</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(Theme).map((theme) => (
              <button
                key={theme}
                onClick={() => updateTheme(theme)}
                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 relative overflow-hidden ${
                  settings.theme === theme
                    ? 'ring-2 ring-white shadow-lg'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div className={`absolute inset-0 ${getThemeGradient(theme)}`}></div>
                <span className="relative z-10">{theme}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full py-4 rounded-xl font-bold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          ← BACK TO MENU
        </button>
      </div>
    </div>
  );
};

const getThemeGradient = (theme: Theme): string => {
  switch (theme) {
    case Theme.NEON:
      return 'bg-gradient-to-br from-neon-pink via-neon-cyan to-neon-yellow';
    case Theme.SUNSET:
      return 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600';
    case Theme.OCEAN:
      return 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600';
    case Theme.FOREST:
      return 'bg-gradient-to-br from-green-400 via-emerald-500 to-lime-600';
    default:
      return 'bg-gradient-to-br from-neon-pink to-neon-cyan';
  }
};

export default Settings;
