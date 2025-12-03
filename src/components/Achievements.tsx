import React from 'react';
import { PlayerProgress } from '../types';

interface AchievementsProps {
  progress: PlayerProgress;
  onClose: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ progress, onClose }) => {
  const unlockedCount = progress.achievements.filter(a => a.unlocked).length;
  const totalCount = progress.achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="w-full h-full bg-dark-bg text-white p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black game-font">Achievements</h1>
            <p className="text-gray-400 mt-1">
              {unlockedCount} / {totalCount} ({completionPercentage}%)
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-800 rounded-xl font-bold hover:bg-gray-700 transition-colors"
          >
            ← BACK
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-black text-neon-yellow">
              {progress.dailyStreak}
            </div>
            <div className="text-xs text-gray-400 uppercase">Day Streak</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-black text-neon-cyan">
              {progress.totalGamesPlayed}
            </div>
            <div className="text-xs text-gray-400 uppercase">Games Played</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-black text-neon-pink">
              {progress.bestCombo}
            </div>
            <div className="text-xs text-gray-400 uppercase">Best Combo</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-black text-white">
              {progress.bestScore.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 uppercase">Best Score</div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {progress.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative border rounded-xl p-4 transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-neon-cyan shadow-lg shadow-neon-cyan/20'
                  : 'bg-gray-900/50 border-gray-800 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`text-4xl ${achievement.unlocked ? 'grayscale-0' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{achievement.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>

                  {/* Progress Bar for Locked Achievements */}
                  {!achievement.unlocked && achievement.maxProgress && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>
                          {achievement.progress || 0} / {achievement.maxProgress}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neon-cyan transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              ((achievement.progress || 0) / achievement.maxProgress) * 100,
                              100
                            )}%`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Unlock Date */}
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-neon-cyan mt-2">
                      ✓ Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Unlocked Badge */}
              {achievement.unlocked && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-neon-cyan rounded-full flex items-center justify-center">
                    <span className="text-black text-xs font-bold">✓</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
