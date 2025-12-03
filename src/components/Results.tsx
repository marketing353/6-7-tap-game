import React, { useEffect, useState } from 'react';
import { GameStats, AICommentary } from '../types';
import { generateGameFeedback } from '../services/feedbackService';
import { playSound } from '../utils/sound';

interface ResultsProps {
  stats: GameStats;
  onRestart: () => void;
  onHome: () => void;
  coinsEarned: number;
}

const Results: React.FC<ResultsProps> = ({ stats, onRestart, onHome, coinsEarned }) => {
  const [commentary, setCommentary] = useState<AICommentary | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareMessage, setShareMessage] = useState<string>('');

  useEffect(() => {
    if (stats.mode === 'timed') {
      playSound('gameover');
    }

    const fetchFeedback = async () => {
      const data = await generateGameFeedback(stats);
      setCommentary(data);
      setLoading(false);
    };

    fetchFeedback();
  }, [stats]);

  const handleShare = async () => {
    const text = `🎮 6-7 TAP Game!\n\n🏆 Score: ${stats.score.toLocaleString()}\n🔥 Max Combo: ${stats.maxCombo}x\n🎯 Accuracy: ${Math.round(stats.accuracy * 100)}%\n⚡ Mode: ${stats.mode.toUpperCase()}\n💪 Difficulty: ${stats.difficulty}\n\nCan you beat my score?`;

    // Try native share API first
    if (navigator.share) {
      try {
        await navigator.share({ text });
        setShareMessage('Shared!');
        setTimeout(() => setShareMessage(''), 2000);
        return;
      } catch (err) {
        // User cancelled or share failed, fall through to clipboard
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(text);
      setShareMessage('Copied to clipboard!');
      setTimeout(() => setShareMessage(''), 2000);
    } catch (err) {
      setShareMessage('Failed to copy');
      setTimeout(() => setShareMessage(''), 2000);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-dark-bg p-6 text-white overflow-y-auto">
      <div className="w-full max-w-md space-y-8 animate-pop">
        
        <div className="text-center space-y-2">
          <h2 className="text-5xl font-black game-font text-white">
            {stats.mode === 'timed' ? 'GAME OVER' : 'SESSION END'}
          </h2>
          <p className="text-gray-400 uppercase tracking-widest">
            {stats.difficulty} • {stats.mode === 'timed' ? "Time's Up" : 'Practice Session'}
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-pink to-neon-cyan"></div>
            
            <div className="grid grid-cols-2 gap-6 text-center mb-6">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase">Final Score</p>
                    <p className="text-4xl font-black text-neon-yellow">{stats.score.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase">Best Combo</p>
                    <p className="text-4xl font-black text-neon-cyan">{stats.maxCombo}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-sm border-t border-gray-800 pt-4">
                <div>
                    <p className="text-gray-500">Hits</p>
                    <p className="font-bold">{stats.hits}</p>
                </div>
                <div>
                    <p className="text-gray-500">Misses</p>
                    <p className="font-bold text-red-400">{stats.misses}</p>
                </div>
                <div>
                    <p className="text-gray-500">Acc</p>
                    <p className="font-bold">{Math.round(stats.accuracy * 100)}%</p>
                </div>
            </div>
        </div>

        {/* Coins Earned */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/50 p-6 rounded-2xl flex items-center justify-between shadow-lg shadow-yellow-500/20">
          <div className="flex items-center gap-4">
            <div className="text-6xl animate-bounce">💰</div>
            <div>
              <p className="text-yellow-200 text-xs font-bold uppercase tracking-wider">Coins Earned</p>
              <p className="text-4xl font-black text-yellow-400">+{coinsEarned}</p>
              <p className="text-xs text-yellow-200/70 mt-1">
                Keep playing to unlock themes & power-ups!
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="min-h-[140px] flex items-center justify-center">
            {loading ? (
                <div className="flex flex-col items-center space-y-3">
                     <div className="w-6 h-6 border-2 border-neon-pink border-t-transparent rounded-full animate-spin"></div>
                     <p className="text-xs text-gray-500 animate-pulse">Analyzing performance...</p>
                </div>
            ) : (
                <div className="text-center space-y-2 w-full bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-neon-pink font-bold uppercase tracking-wider text-sm">
                        {commentary?.title || "Rank Unknown"}
                    </p>
                    <p className="text-gray-200 italic font-medium leading-relaxed">
                        "{commentary?.message}"
                    </p>
                </div>
            )}
        </div>

        {/* Share Button */}
        <div className="relative">
          <button
            onClick={handleShare}
            className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-neon-pink to-neon-cyan text-white hover:opacity-80 transition-opacity"
          >
            📤 SHARE SCORE
          </button>
          {shareMessage && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap animate-pop">
              {shareMessage}
            </div>
          )}
        </div>

        <div className="flex gap-4 w-full">
            <button
                onClick={onHome}
                className="flex-1 py-4 rounded-xl font-bold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
                MENU
            </button>
            <button
                onClick={onRestart}
                className="flex-1 py-4 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
            >
                PLAY AGAIN
            </button>
        </div>

      </div>
    </div>
  );
};

export default Results;
