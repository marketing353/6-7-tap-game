import { GameStats, GameHistory, GameSettings, Difficulty, Theme } from '../types';

const SETTINGS_KEY = '6-7-tap-settings';
const HISTORY_KEY = '6-7-tap-history';
const HIGH_SCORE_KEY = '6-7-tap-highscore';

export const getSettings = (): GameSettings => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load settings:', error);
  }

  return {
    difficulty: Difficulty.MEDIUM,
    soundEnabled: true,
    theme: Theme.NEON
  };
};

export const saveSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings:', error);
  }
};

export const getGameHistory = (): GameHistory => {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load game history:', error);
  }

  return {
    games: [],
    totalGamesPlayed: 0
  };
};

export const addGameToHistory = (stats: GameStats): void => {
  try {
    const history = getGameHistory();
    history.games.unshift(stats);
    // Keep only last 20 games
    if (history.games.length > 20) {
      history.games = history.games.slice(0, 20);
    }
    history.totalGamesPlayed += 1;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.warn('Failed to save game to history:', error);
  }
};

export const getHighScore = (): number => {
  try {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  } catch (error) {
    console.warn('Failed to load high score:', error);
    return 0;
  }
};

export const saveHighScore = (score: number): void => {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  } catch (error) {
    console.warn('Failed to save high score:', error);
  }
};
