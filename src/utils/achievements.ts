import { Achievement, PlayerProgress, GameStats, Theme } from '../types';

const PROGRESS_KEY = '6-7-tap-progress';

export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  // Score Achievements
  { id: 'first-blood', title: 'First Blood', description: 'Score your first points', icon: '🎯', maxProgress: 1 },
  { id: 'scorer', title: 'Rising Star', description: 'Score 1,000 points in a game', icon: '⭐', maxProgress: 1000 },
  { id: 'high-scorer', title: 'Pro Player', description: 'Score 5,000 points in a game', icon: '💫', maxProgress: 5000 },
  { id: 'master-scorer', title: 'Master', description: 'Score 10,000 points in a game', icon: '🏆', maxProgress: 10000 },
  { id: 'legend', title: 'Legend', description: 'Score 20,000 points in a game', icon: '👑', maxProgress: 20000 },

  // Combo Achievements
  { id: 'combo-starter', title: 'Combo Starter', description: 'Get a 5x combo', icon: '🔥', maxProgress: 5 },
  { id: 'combo-master', title: 'Combo Master', description: 'Get a 10x combo', icon: '⚡', maxProgress: 10 },
  { id: 'unstoppable', title: 'Unstoppable', description: 'Get a 20x combo', icon: '💥', maxProgress: 20 },
  { id: 'godlike', title: 'Godlike', description: 'Get a 30x combo', icon: '🌟', maxProgress: 30 },

  // Accuracy Achievements
  { id: 'sharpshooter', title: 'Sharpshooter', description: 'Finish with 90%+ accuracy', icon: '🎪', maxProgress: 90 },
  { id: 'perfect-game', title: 'Perfect Game', description: 'Finish with 100% accuracy', icon: '💯', maxProgress: 100 },

  // Streak Achievements
  { id: 'dedicated', title: 'Dedicated', description: 'Play 3 days in a row', icon: '📅', maxProgress: 3 },
  { id: 'committed', title: 'Committed', description: 'Play 7 days in a row', icon: '📆', maxProgress: 7 },
  { id: 'unstoppable-streak', title: 'Unstoppable', description: 'Play 14 days in a row', icon: '🔥', maxProgress: 14 },
  { id: 'legendary-streak', title: 'Legendary Streak', description: 'Play 30 days in a row', icon: '👑', maxProgress: 30 },

  // Games Played
  { id: 'beginner', title: 'Getting Started', description: 'Play 5 games', icon: '🎮', maxProgress: 5 },
  { id: 'regular', title: 'Regular Player', description: 'Play 25 games', icon: '🎯', maxProgress: 25 },
  { id: 'veteran', title: 'Veteran', description: 'Play 100 games', icon: '⚔️', maxProgress: 100 },
  { id: 'addict', title: 'Addicted', description: 'Play 500 games', icon: '🎲', maxProgress: 500 },

  // Special Achievements
  { id: 'golden-touch', title: 'Golden Touch', description: 'Collect 10 golden numbers', icon: '✨', maxProgress: 10 },
  { id: 'power-collector', title: 'Power Collector', description: 'Collect 20 power-ups', icon: '⚡', maxProgress: 20 },
  { id: 'speed-demon', title: 'Speed Demon', description: 'Score 100+ hits in a game', icon: '💨', maxProgress: 100 },
  { id: 'survivor', title: 'Survivor', description: 'Last 60 seconds in practice mode', icon: '🛡️', maxProgress: 60 },
];

export const getPlayerProgress = (): PlayerProgress => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
      const progress = JSON.parse(saved);
      // Merge with new achievements if any were added
      const existingIds = new Set(progress.achievements.map((a: Achievement) => a.id));
      const newAchievements = ACHIEVEMENT_DEFINITIONS
        .filter(def => !existingIds.has(def.id))
        .map(def => ({ ...def, unlocked: false, progress: 0 }));

      return {
        ...progress,
        achievements: [...progress.achievements, ...newAchievements],
        // Add defaults for new economy fields if they don't exist
        coins: progress.coins ?? 0,
        inventory: progress.inventory ?? {
          unlockedThemes: [Theme.NEON],
          powerUpBoosts: 0,
          shields: 0,
          doubleTapCards: 0
        },
        prestigeLevel: progress.prestigeLevel ?? 0,
        totalCoinsEarned: progress.totalCoinsEarned ?? 0,
        lastSpinDate: progress.lastSpinDate ?? ''
      };
    }
  } catch (error) {
    console.warn('Failed to load player progress:', error);
  }

  return {
    achievements: ACHIEVEMENT_DEFINITIONS.map(def => ({ ...def, unlocked: false, progress: 0 })),
    dailyStreak: 0,
    lastPlayedDate: '',
    totalScore: 0,
    totalGamesPlayed: 0,
    totalHits: 0,
    bestCombo: 0,
    bestScore: 0,
    powerUpsCollected: 0,
    goldenNumbersHit: 0,
    coins: 0,
    inventory: {
      unlockedThemes: [Theme.NEON],
      powerUpBoosts: 0,
      shields: 0,
      doubleTapCards: 0
    },
    prestigeLevel: 0,
    totalCoinsEarned: 0,
    lastSpinDate: ''
  };
};

export const savePlayerProgress = (progress: PlayerProgress): void => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn('Failed to save player progress:', error);
  }
};

export const updateProgressWithGameStats = (
  stats: GameStats,
  goldenNumbers: number = 0,
  powerUps: number = 0
): { progress: PlayerProgress; newAchievements: Achievement[]; coinsEarned: number } => {
  const progress = getPlayerProgress();
  const newlyUnlocked: Achievement[] = [];

  // Update daily streak
  const today = new Date().toDateString();
  const lastPlayed = progress.lastPlayedDate;
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (lastPlayed !== today) {
    if (lastPlayed === yesterday) {
      progress.dailyStreak += 1;
    } else if (lastPlayed !== today) {
      progress.dailyStreak = 1;
    }
    progress.lastPlayedDate = today;
  }

  // Calculate coins earned
  const baseCoins = Math.floor(stats.score / 100); // 100 pts = 1 coin
  const comboBonus = Math.floor(stats.maxCombo / 10) * 5; // Bonus for high combos
  const goldenBonus = goldenNumbers * 10; // 10 coins per golden number
  const accuracyBonus = stats.accuracy >= 0.9 ? 50 : 0; // Bonus for 90%+ accuracy
  const coinsEarned = baseCoins + comboBonus + goldenBonus + accuracyBonus;

  // Update stats
  progress.totalScore += stats.score;
  progress.totalGamesPlayed += 1;
  progress.totalHits += stats.hits;
  progress.bestCombo = Math.max(progress.bestCombo, stats.maxCombo);
  progress.bestScore = Math.max(progress.bestScore, stats.score);
  progress.goldenNumbersHit += goldenNumbers;
  progress.powerUpsCollected += powerUps;
  progress.coins += coinsEarned;
  progress.totalCoinsEarned += coinsEarned;

  // Check achievements
  progress.achievements = progress.achievements.map(achievement => {
    if (achievement.unlocked) return achievement;

    let shouldUnlock = false;
    let newProgress = achievement.progress || 0;

    switch (achievement.id) {
      // Score achievements
      case 'first-blood':
        newProgress = stats.score > 0 ? 1 : 0;
        shouldUnlock = newProgress >= 1;
        break;
      case 'scorer':
        newProgress = Math.max(newProgress, stats.score);
        shouldUnlock = stats.score >= 1000;
        break;
      case 'high-scorer':
        newProgress = Math.max(newProgress, stats.score);
        shouldUnlock = stats.score >= 5000;
        break;
      case 'master-scorer':
        newProgress = Math.max(newProgress, stats.score);
        shouldUnlock = stats.score >= 10000;
        break;
      case 'legend':
        newProgress = Math.max(newProgress, stats.score);
        shouldUnlock = stats.score >= 20000;
        break;

      // Combo achievements
      case 'combo-starter':
        newProgress = Math.max(newProgress, stats.maxCombo);
        shouldUnlock = stats.maxCombo >= 5;
        break;
      case 'combo-master':
        newProgress = Math.max(newProgress, stats.maxCombo);
        shouldUnlock = stats.maxCombo >= 10;
        break;
      case 'unstoppable':
        newProgress = Math.max(newProgress, stats.maxCombo);
        shouldUnlock = stats.maxCombo >= 20;
        break;
      case 'godlike':
        newProgress = Math.max(newProgress, stats.maxCombo);
        shouldUnlock = stats.maxCombo >= 30;
        break;

      // Accuracy achievements
      case 'sharpshooter':
        newProgress = Math.round(stats.accuracy * 100);
        shouldUnlock = stats.accuracy >= 0.9;
        break;
      case 'perfect-game':
        newProgress = Math.round(stats.accuracy * 100);
        shouldUnlock = stats.accuracy >= 1.0 && stats.hits > 0;
        break;

      // Streak achievements
      case 'dedicated':
        newProgress = progress.dailyStreak;
        shouldUnlock = progress.dailyStreak >= 3;
        break;
      case 'committed':
        newProgress = progress.dailyStreak;
        shouldUnlock = progress.dailyStreak >= 7;
        break;
      case 'unstoppable-streak':
        newProgress = progress.dailyStreak;
        shouldUnlock = progress.dailyStreak >= 14;
        break;
      case 'legendary-streak':
        newProgress = progress.dailyStreak;
        shouldUnlock = progress.dailyStreak >= 30;
        break;

      // Games played
      case 'beginner':
        newProgress = progress.totalGamesPlayed;
        shouldUnlock = progress.totalGamesPlayed >= 5;
        break;
      case 'regular':
        newProgress = progress.totalGamesPlayed;
        shouldUnlock = progress.totalGamesPlayed >= 25;
        break;
      case 'veteran':
        newProgress = progress.totalGamesPlayed;
        shouldUnlock = progress.totalGamesPlayed >= 100;
        break;
      case 'addict':
        newProgress = progress.totalGamesPlayed;
        shouldUnlock = progress.totalGamesPlayed >= 500;
        break;

      // Special
      case 'golden-touch':
        newProgress = progress.goldenNumbersHit;
        shouldUnlock = progress.goldenNumbersHit >= 10;
        break;
      case 'power-collector':
        newProgress = progress.powerUpsCollected;
        shouldUnlock = progress.powerUpsCollected >= 20;
        break;
      case 'speed-demon':
        newProgress = Math.max(newProgress, stats.hits);
        shouldUnlock = stats.hits >= 100;
        break;
      case 'survivor':
        if (stats.mode === 'practice') {
          const timePlayed = (Date.now() - stats.timestamp) / 1000;
          newProgress = Math.max(newProgress, timePlayed);
          shouldUnlock = timePlayed >= 60;
        }
        break;
    }

    if (shouldUnlock && !achievement.unlocked) {
      const unlockedAchievement = {
        ...achievement,
        unlocked: true,
        unlockedAt: Date.now(),
        progress: newProgress
      };
      newlyUnlocked.push(unlockedAchievement);
      return unlockedAchievement;
    }

    return { ...achievement, progress: newProgress };
  });

  savePlayerProgress(progress);

  return { progress, newAchievements: newlyUnlocked, coinsEarned };
};
