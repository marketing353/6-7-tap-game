import { DailyReward, Theme } from '../types';

export const DAILY_REWARDS: DailyReward[] = [
  // Common (60% chance)
  { type: 'coins', value: 50, rarity: 'common', icon: '💰', message: '+50 Coins' },
  { type: 'coins', value: 100, rarity: 'common', icon: '💰', message: '+100 Coins' },
  { type: 'coins', value: 150, rarity: 'common', icon: '💰', message: '+150 Coins' },
  { type: 'coins', value: 200, rarity: 'common', icon: '💰', message: '+200 Coins' },

  // Rare (30% chance)
  { type: 'coins', value: 500, rarity: 'rare', icon: '💎', message: '+500 Coins!' },
  { type: 'powerup', value: 1, rarity: 'rare', icon: '⚡', message: 'Power-Up Boost!' },
  { type: 'powerup', value: 1, rarity: 'rare', icon: '🛡️', message: 'Shield Boost!' },

  // Legendary (10% chance)
  { type: 'coins', value: 1000, rarity: 'legendary', icon: '🎁', message: '+1000 Coins!!' },
  { type: 'theme', value: Theme.SUNSET, rarity: 'legendary', icon: '🌅', message: 'Sunset Theme!' },
  { type: 'theme', value: Theme.OCEAN, rarity: 'legendary', icon: '🌊', message: 'Ocean Theme!' }
];

export const spinWheel = (): DailyReward => {
  const random = Math.random();

  let pool: DailyReward[];

  if (random < 0.6) {
    // 60% - Common
    pool = DAILY_REWARDS.filter(r => r.rarity === 'common');
  } else if (random < 0.9) {
    // 30% - Rare
    pool = DAILY_REWARDS.filter(r => r.rarity === 'rare');
  } else {
    // 10% - Legendary
    pool = DAILY_REWARDS.filter(r => r.rarity === 'legendary');
  }

  return pool[Math.floor(Math.random() * pool.length)];
};

export const canSpinToday = (lastSpinDate: string): boolean => {
  const today = new Date().toDateString();
  return lastSpinDate !== today;
};
