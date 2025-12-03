export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  SETTINGS = 'SETTINGS',
  TUTORIAL = 'TUTORIAL',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  STATS = 'STATS',
  SHOP = 'SHOP',
  DAILY_SPIN = 'DAILY_SPIN'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum Theme {
  NEON = 'NEON',
  SUNSET = 'SUNSET',
  OCEAN = 'OCEAN',
  FOREST = 'FOREST'
}

export interface GameStats {
  score: number;
  maxCombo: number;
  hits: number;
  misses: number;
  accuracy: number;
  difficulty: Difficulty;
  mode: 'timed' | 'practice';
  timestamp: number;
}

export interface NumberItem {
  value: number;
  id: number;
  isTarget: boolean;
}

export interface AICommentary {
  title: string;
  message: string;
}

export interface GameSettings {
  difficulty: Difficulty;
  soundEnabled: boolean;
  theme: Theme;
}

export interface GameHistory {
  games: GameStats[];
  totalGamesPlayed: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
}

export interface PlayerProgress {
  achievements: Achievement[];
  dailyStreak: number;
  lastPlayedDate: string;
  totalScore: number;
  totalGamesPlayed: number;
  totalHits: number;
  bestCombo: number;
  bestScore: number;
  powerUpsCollected: number;
  goldenNumbersHit: number;
  coins: number;
  inventory: {
    unlockedThemes: Theme[];
    powerUpBoosts: number;
    shields: number;
    doubleTapCards: number;
  };
  prestigeLevel: number;
  totalCoinsEarned: number;
  lastSpinDate: string;
}

export interface PowerUp {
  type: 'double-points' | 'slow-time' | 'shield' | 'multiplier';
  duration: number;
  startTime: number;
}

export interface SpecialNumber extends NumberItem {
  isGolden?: boolean;
  isPowerUp?: boolean;
  powerUpType?: PowerUp['type'];
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  type: 'theme' | 'consumable' | 'permanent';
  value?: any;
}

export interface DailyReward {
  type: 'coins' | 'powerup' | 'theme';
  value: number | string;
  rarity: 'common' | 'rare' | 'legendary';
  icon: string;
  message: string;
}

export interface WagerChallenge {
  id: string;
  name: string;
  description: string;
  entryFee: number;
  reward: number;
  requirement: {
    type: 'score' | 'combo' | 'accuracy';
    target: number;
  };
}
