import React, { useState } from 'react';
import { PlayerProgress, DailyReward, Theme } from '../types';
import { spinWheel } from '../utils/dailySpin';
import { savePlayerProgress } from '../utils/achievements';

interface DailySpinProps {
  progress: PlayerProgress;
  onUpdateProgress: (progress: PlayerProgress) => void;
  onClose: () => void;
}

const DailySpin: React.FC<DailySpinProps> = ({ progress, onUpdateProgress, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [reward, setReward] = useState<DailyReward | null>(null);
  const [showReward, setShowReward] = useState(false);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    // Spin animation duration
    setTimeout(() => {
      const wonReward = spinWheel();
      setReward(wonReward);
      setIsSpinning(false);
      setShowReward(true);

      // Apply reward
      const updatedProgress = { ...progress };

      if (wonReward.type === 'coins') {
        updatedProgress.coins += Number(wonReward.value);
        updatedProgress.totalCoinsEarned += Number(wonReward.value);
      } else if (wonReward.type === 'powerup') {
        updatedProgress.inventory.powerUpBoosts += Number(wonReward.value);
      } else if (wonReward.type === 'theme') {
        if (!updatedProgress.inventory.unlockedThemes.includes(wonReward.value as Theme)) {
          updatedProgress.inventory.unlockedThemes.push(wonReward.value as Theme);
        } else {
          // If already owned, give coins instead
          updatedProgress.coins += 500;
          updatedProgress.totalCoinsEarned += 500;
        }
      }

      // Update last spin date
      updatedProgress.lastSpinDate = new Date().toDateString();

      savePlayerProgress(updatedProgress);
      onUpdateProgress(updatedProgress);

      // Haptic feedback
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }, 2000); // 2 second spin
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-600 to-gray-800';
      case 'rare':
        return 'from-purple-600 to-blue-600';
      case 'legendary':
        return 'from-yellow-500 to-orange-600';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {!showReward ? (
          <div className="bg-gray-900 border-2 border-yellow-500 rounded-2xl p-8 text-center space-y-6 animate-pop">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-yellow-400">Daily Spin!</h2>
              <p className="text-gray-300">Spin the wheel for your daily reward</p>
            </div>

            {/* Spinning Wheel */}
            <div className="relative w-64 h-64 mx-auto">
              <div
                className={`w-full h-full rounded-full bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center ${
                  isSpinning ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: isSpinning ? '0.5s' : '0s' }}
              >
                <div className="w-56 h-56 rounded-full bg-gray-900 flex items-center justify-center">
                  <div className="text-6xl">🎰</div>
                </div>
              </div>

              {/* Arrow pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-yellow-400"></div>
              </div>
            </div>

            {/* Spin Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full py-4 rounded-xl font-black text-2xl transition-all ${
                isSpinning
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:scale-105 active:scale-95'
              }`}
            >
              {isSpinning ? 'SPINNING...' : '🎰 SPIN NOW!'}
            </button>

            <p className="text-xs text-gray-500">Available once per day</p>
          </div>
        ) : (
          // Reward Display
          reward && (
            <div
              className={`bg-gradient-to-br ${getRarityColor(
                reward.rarity
              )} border-4 border-white rounded-2xl p-8 text-center space-y-6 animate-pop`}
            >
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider opacity-80">
                  {reward.rarity.toUpperCase()} REWARD!
                </p>
                <h2 className="text-5xl font-black text-white">YOU WON!</h2>
              </div>

              {/* Reward Icon */}
              <div className="text-9xl animate-bounce">{reward.icon}</div>

              {/* Reward Message */}
              <div className="bg-black/30 rounded-xl p-6">
                <p className="text-3xl font-black text-white">{reward.message}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full py-4 rounded-xl font-black text-xl bg-white text-black hover:bg-gray-200 transition-all"
              >
                AWESOME!
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DailySpin;
