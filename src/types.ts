export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  SETTINGS = 'SETTINGS',
  TUTORIAL = 'TUTORIAL',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  STATS = 'STATS'
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
