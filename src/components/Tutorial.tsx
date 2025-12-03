import React from 'react';

interface TutorialProps {
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-dark-bg text-white p-6 overflow-y-auto">
      <div className="w-full max-w-2xl space-y-6 animate-pop">
        <div className="text-center">
          <h2 className="text-5xl font-black game-font text-white mb-2">HOW TO PLAY</h2>
          <p className="text-gray-400">Master the art of lightning-fast reactions</p>
        </div>

        {/* Game Rules */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">🎯</div>
            <div>
              <h3 className="font-bold text-lg mb-1">The Goal</h3>
              <p className="text-gray-400 text-sm">
                Numbers flash on screen. Tap only when you see <span className="text-neon-yellow font-bold">6 or 7</span>.
                Don't tap any other numbers!
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="text-4xl">⚡</div>
            <div>
              <h3 className="font-bold text-lg mb-1">Build Combos</h3>
              <p className="text-gray-400 text-sm">
                Hit targets consecutively to build combos. Every 5 hits increases your multiplier up to <span className="text-neon-pink font-bold">5x</span>!
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="text-4xl">🔥</div>
            <div>
              <h3 className="font-bold text-lg mb-1">Progressive Difficulty</h3>
              <p className="text-gray-400 text-sm">
                The game speeds up and shows fewer targets over time. Stay sharp!
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="text-4xl">💯</div>
            <div>
              <h3 className="font-bold text-lg mb-1">Scoring</h3>
              <p className="text-gray-400 text-sm">
                Correct tap: <span className="text-green-400 font-bold">+100 × combo</span><br />
                Wrong tap: <span className="text-red-400 font-bold">-50 points</span> and combo reset
              </p>
            </div>
          </div>
        </div>

        {/* Game Modes */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
          <h3 className="font-bold text-lg mb-2">Game Modes</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-3">
              <span className="text-neon-cyan">⏱</span>
              <div>
                <span className="font-bold">Timed Mode:</span>
                <span className="text-gray-400 ml-2">30 seconds to get the highest score</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-neon-yellow">♾️</span>
              <div>
                <span className="font-bold">Practice Mode:</span>
                <span className="text-gray-400 ml-2">No timer, play at your own pace</span>
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Levels */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
          <h3 className="font-bold text-lg mb-2">Difficulty Levels</h3>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-green-400">⭐ Easy</span>
              <span className="text-gray-400">Slower pace, more targets</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-yellow-400">⭐⭐ Medium</span>
              <span className="text-gray-400">Balanced challenge</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-400">⭐⭐⭐ Hard</span>
              <span className="text-gray-400">Fast pace, fewer targets</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-neon-pink/10 to-neon-cyan/10 border border-neon-cyan/30 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-2 text-neon-cyan">💡 Pro Tips</h3>
          <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
            <li>Focus on the center of the screen</li>
            <li>Don't rush - accuracy matters more than speed</li>
            <li>Use pause if you need a break</li>
            <li>Enable sound for better feedback</li>
            <li>Practice mode is great for warming up</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-colors shadow-lg"
        >
          GOT IT!
        </button>
      </div>
    </div>
  );
};

export default Tutorial;
