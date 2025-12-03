import React from 'react';
import { PlayerProgress } from '../types';
import { getGameHistory } from '../utils/storage';

interface StatsProps {
  progress: PlayerProgress;
  onClose: () => void;
}

const Stats: React.FC<StatsProps> = ({ progress, onClose }) => {
  const history = getGameHistory();
  const recentGames = history.games.slice(0, 10);

  const avgScore = recentGames.length > 0
    ? Math.round(recentGames.reduce((sum, g) => sum + g.score, 0) / recentGames.length)
    : 0;

  const avgAccuracy = recentGames.length > 0
    ? Math.round((recentGames.reduce((sum, g) => sum + g.accuracy, 0) / recentGames.length) * 100)
    : 0;

  return (
    <div className="w-full h-full bg-dark-bg text-white p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black game-font">Statistics</h1>
            <p className="text-gray-400 mt-1">Your performance over time</p>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-800 rounded-xl font-bold hover:bg-gray-700 transition-colors"
          >
            ← BACK
          </button>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-black text-neon-yellow mb-2">
              {progress.totalGamesPlayed}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Total Games</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-black text-neon-cyan mb-2">
              {progress.totalScore.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Total Score</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-black text-neon-pink mb-2">
              {progress.totalHits.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Total Hits</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-black text-white mb-2">
              {progress.bestScore.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Best Score</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-black text-white mb-2">
              {progress.bestCombo}x
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Best Combo</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-black text-white mb-2">
              {progress.dailyStreak} 🔥
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Day Streak</div>
          </div>
        </div>

        {/* Recent Performance */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-black mb-4">Recent Performance</h2>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-gray-400 text-sm mb-1">Avg Score (Last 10)</div>
              <div className="text-3xl font-bold">{avgScore.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Avg Accuracy (Last 10)</div>
              <div className="text-3xl font-bold">{avgAccuracy}%</div>
            </div>
          </div>
        </div>

        {/* Special Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-yellow-900/30 to-gray-900 border border-yellow-700/30 rounded-xl p-6 text-center">
            <div className="text-5xl mb-2">✨</div>
            <div className="text-3xl font-black text-yellow-400 mb-1">
              {progress.goldenNumbersHit}
            </div>
            <div className="text-sm text-gray-400 uppercase">Golden Numbers</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-gray-900 border border-purple-700/30 rounded-xl p-6 text-center">
            <div className="text-5xl mb-2">⚡</div>
            <div className="text-3xl font-black text-purple-400 mb-1">
              {progress.powerUpsCollected}
            </div>
            <div className="text-sm text-gray-400 uppercase">Power-Ups</div>
          </div>
        </div>

        {/* Recent Games */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-black mb-4">Recent Games</h2>
          <div className="space-y-2">
            {recentGames.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No games played yet</p>
            ) : (
              recentGames.map((game, index) => (
                <div
                  key={game.timestamp}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-gray-500 font-bold w-8">#{index + 1}</div>
                    <div>
                      <div className="font-bold text-white">{game.score.toLocaleString()} pts</div>
                      <div className="text-xs text-gray-400">
                        {new Date(game.timestamp).toLocaleDateString()} •{' '}
                        {game.difficulty} • {game.mode}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-neon-cyan font-bold">{game.maxCombo}x combo</div>
                    <div className="text-xs text-gray-400">{Math.round(game.accuracy * 100)}% acc</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
