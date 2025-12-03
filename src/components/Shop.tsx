import React, { useState } from 'react';
import { PlayerProgress, ShopItem, Theme } from '../types';
import { savePlayerProgress } from '../utils/achievements';

interface ShopProps {
  progress: PlayerProgress;
  onUpdateProgress: (progress: PlayerProgress) => void;
  onClose: () => void;
}

const SHOP_ITEMS: ShopItem[] = [
  // Themes
  {
    id: 'theme-sunset',
    name: 'Sunset Theme',
    description: 'Warm orange and purple gradient',
    icon: '🌅',
    cost: 2500,
    type: 'theme',
    value: Theme.SUNSET
  },
  {
    id: 'theme-ocean',
    name: 'Ocean Theme',
    description: 'Cool blue and turquoise vibes',
    icon: '🌊',
    cost: 2500,
    type: 'theme',
    value: Theme.OCEAN
  },
  {
    id: 'theme-forest',
    name: 'Forest Theme',
    description: 'Natural green and earthy tones',
    icon: '🌲',
    cost: 2500,
    type: 'theme',
    value: Theme.FOREST
  },
  {
    id: 'golden-theme',
    name: 'Golden Theme',
    description: 'EXCLUSIVE! Luxurious gold theme',
    icon: '👑',
    cost: 10000,
    type: 'theme',
    value: 'GOLDEN' // Would need to add this to Theme enum
  },

  // Consumables
  {
    id: 'shield-boost',
    name: 'Shield Boost',
    description: 'Start next game with a shield',
    icon: '🛡️',
    cost: 200,
    type: 'consumable',
    value: 'shield'
  },
  {
    id: 'powerup-boost',
    name: 'Power-Up Starter',
    description: 'Start with a random power-up',
    icon: '⚡',
    cost: 250,
    type: 'consumable',
    value: 'powerup'
  },
  {
    id: 'double-tap-card',
    name: 'Double Tap Card',
    description: '2x score for entire game (1 use)',
    icon: '💎',
    cost: 500,
    type: 'consumable',
    value: 'double-tap'
  },

  // Permanent Upgrades
  {
    id: 'coin-multiplier',
    name: 'Coin Multiplier',
    description: 'Earn 10% more coins forever',
    icon: '💰',
    cost: 5000,
    type: 'permanent',
    value: 'coin-boost'
  }
];

const Shop: React.FC<ShopProps> = ({ progress, onUpdateProgress, onClose }) => {
  const [purchaseMessage, setPurchaseMessage] = useState<{ text: string; success: boolean } | null>(null);

  const handlePurchase = (item: ShopItem) => {
    // Check if can afford
    if (progress.coins < item.cost) {
      setPurchaseMessage({ text: 'Not enough coins!', success: false });
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    // Check if already owned (for themes and permanents)
    if (item.type === 'theme' && progress.inventory.unlockedThemes.includes(item.value)) {
      setPurchaseMessage({ text: 'Already owned!', success: false });
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    // Process purchase
    const updatedProgress = { ...progress };
    updatedProgress.coins -= item.cost;

    switch (item.type) {
      case 'theme':
        updatedProgress.inventory.unlockedThemes.push(item.value);
        break;
      case 'consumable':
        if (item.value === 'shield') {
          updatedProgress.inventory.shields += 1;
        } else if (item.value === 'powerup') {
          updatedProgress.inventory.powerUpBoosts += 1;
        } else if (item.value === 'double-tap') {
          updatedProgress.inventory.doubleTapCards += 1;
        }
        break;
      case 'permanent':
        // Would need to track permanent upgrades
        break;
    }

    savePlayerProgress(updatedProgress);
    onUpdateProgress(updatedProgress);

    setPurchaseMessage({ text: `Purchased ${item.name}!`, success: true });
    setTimeout(() => setPurchaseMessage(null), 2000);

    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  const isOwned = (item: ShopItem) => {
    if (item.type === 'theme') {
      return progress.inventory.unlockedThemes.includes(item.value);
    }
    return false;
  };

  const getInventoryCount = (item: ShopItem) => {
    if (item.type === 'consumable') {
      if (item.value === 'shield') return progress.inventory.shields;
      if (item.value === 'powerup') return progress.inventory.powerUpBoosts;
      if (item.value === 'double-tap') return progress.inventory.doubleTapCards;
    }
    return 0;
  };

  return (
    <div className="w-full h-full bg-dark-bg text-white p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black game-font">Shop</h1>
            <p className="text-gray-400 mt-1">Spend your hard-earned coins</p>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-800 rounded-xl font-bold hover:bg-gray-700 transition-colors"
          >
            ← BACK
          </button>
        </div>

        {/* Coin Balance */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/50 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">💰</div>
            <div>
              <p className="text-xs text-yellow-200 uppercase tracking-wider">Your Balance</p>
              <p className="text-3xl font-black text-yellow-400">{progress.coins.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Purchase Message */}
        {purchaseMessage && (
          <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-bold animate-pop ${
            purchaseMessage.success ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {purchaseMessage.text}
          </div>
        )}

        {/* Themes Section */}
        <div>
          <h2 className="text-2xl font-black mb-4">🎨 Themes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SHOP_ITEMS.filter(item => item.type === 'theme').map(item => (
              <div
                key={item.id}
                className={`border rounded-xl p-5 transition-all ${
                  isOwned(item)
                    ? 'bg-green-900/30 border-green-500'
                    : 'bg-gray-900 border-gray-800 hover:border-yellow-500'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{item.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-yellow-400 font-black text-xl">
                    💰 {item.cost.toLocaleString()}
                  </div>
                  {isOwned(item) ? (
                    <div className="px-4 py-2 bg-green-600 rounded-lg font-bold text-sm">
                      ✓ OWNED
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={progress.coins < item.cost}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        progress.coins >= item.cost
                          ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      BUY NOW
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consumables Section */}
        <div>
          <h2 className="text-2xl font-black mb-4">⚡ Power Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SHOP_ITEMS.filter(item => item.type === 'consumable').map(item => (
              <div
                key={item.id}
                className="bg-gray-900 border border-gray-800 hover:border-purple-500 rounded-xl p-5 transition-all"
              >
                <div className="text-center mb-3">
                  <div className="text-5xl mb-2">{item.icon}</div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                  {getInventoryCount(item) > 0 && (
                    <div className="mt-2 px-3 py-1 bg-purple-600/30 rounded-full text-xs font-bold">
                      Owned: {getInventoryCount(item)}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-yellow-400 font-black text-xl text-center">
                    💰 {item.cost.toLocaleString()}
                  </div>
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={progress.coins < item.cost}
                    className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${
                      progress.coins >= item.cost
                        ? 'bg-purple-600 hover:bg-purple-500'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    BUY
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permanent Upgrades Section */}
        <div>
          <h2 className="text-2xl font-black mb-4">🌟 Permanent Upgrades</h2>
          <div className="grid grid-cols-1 gap-4">
            {SHOP_ITEMS.filter(item => item.type === 'permanent').map(item => (
              <div
                key={item.id}
                className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-2 border-purple-500 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{item.icon}</div>
                    <div>
                      <h3 className="font-bold text-xl">{item.name}</h3>
                      <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-black text-2xl mb-2">
                      💰 {item.cost.toLocaleString()}
                    </div>
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={progress.coins < item.cost}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${
                        progress.coins >= item.cost
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-80'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      PURCHASE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
