import React, { useEffect } from 'react';
import { Achievement } from '../types';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-pop">
      <div className="bg-gradient-to-r from-neon-pink to-neon-cyan p-1 rounded-2xl shadow-2xl">
        <div className="bg-gray-900 rounded-2xl p-6 min-w-[300px]">
          <div className="flex items-center gap-4">
            <div className="text-5xl animate-bounce">{achievement.icon}</div>
            <div className="flex-1">
              <div className="text-xs text-neon-cyan font-bold uppercase tracking-wider mb-1">
                Achievement Unlocked!
              </div>
              <div className="text-xl font-black text-white">{achievement.title}</div>
              <div className="text-sm text-gray-400 mt-1">{achievement.description}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;
