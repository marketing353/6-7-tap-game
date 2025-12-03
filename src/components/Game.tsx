import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameStats, Difficulty, PowerUp, SpecialNumber } from '../types';
import { playSound } from '../utils/sound';

interface GameProps {
  onGameOver: (stats: GameStats) => void;
  difficulty: Difficulty;
  mode: 'timed' | 'practice';
  soundEnabled: boolean;
  onGoldenNumberCollected: () => void;
  onPowerUpCollected: () => void;
}

const GAME_DURATION = 30; // seconds

const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: {
    initialInterval: 1200,
    minInterval: 500,
    speedMultiplier: 0.985,
    targetProbabilityStart: 0.6,
    targetProbabilityMin: 0.45
  },
  [Difficulty.MEDIUM]: {
    initialInterval: 1000,
    minInterval: 350,
    speedMultiplier: 0.98,
    targetProbabilityStart: 0.5,
    targetProbabilityMin: 0.3
  },
  [Difficulty.HARD]: {
    initialInterval: 800,
    minInterval: 250,
    speedMultiplier: 0.975,
    targetProbabilityStart: 0.4,
    targetProbabilityMin: 0.2
  }
};

const Game: React.FC<GameProps> = ({
  onGameOver,
  difficulty,
  mode,
  soundEnabled,
  onGoldenNumberCollected,
  onPowerUpCollected
}) => {
  const config = DIFFICULTY_CONFIG[difficulty];
  const [timeLeft, setTimeLeft] = useState(mode === 'timed' ? GAME_DURATION : 0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [currentNumber, setCurrentNumber] = useState<SpecialNumber | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; color: string; id: number } | null>(null);
  const [isShake, setIsShake] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activePowerUp, setActivePowerUp] = useState<PowerUp | null>(null);

  // Refs for mutable state inside interval/timeouts to avoid closure staleness
  const gameStateRef = useRef({
    score: 0,
    combo: 0,
    maxCombo: 0,
    hits: 0,
    misses: 0,
    isPlaying: true,
    hasClickedCurrent: false,
    intervalMs: config.initialInterval,
    targetProbability: config.targetProbabilityStart
  });

  // Generate a random number with dynamic probability
  const generateNumber = useCallback((): SpecialNumber => {
    const state = gameStateRef.current;
    const isTarget = Math.random() < state.targetProbability;

    let val: number;
    let isGolden = false;
    let isPowerUp = false;
    let powerUpType: PowerUp['type'] | undefined;

    if (isTarget) {
      val = Math.random() < 0.5 ? 6 : 7;
      // 10% chance for golden number (extra points)
      if (Math.random() < 0.1) {
        isGolden = true;
      }
      // 5% chance for power-up instead
      if (!isGolden && Math.random() < 0.05) {
        isPowerUp = true;
        const powerUps: PowerUp['type'][] = ['double-points', 'slow-time', 'shield', 'multiplier'];
        powerUpType = powerUps[Math.floor(Math.random() * powerUps.length)];
      }
    } else {
      // Generate non-6/7 number (0-9)
      do {
        val = Math.floor(Math.random() * 10);
      } while (val === 6 || val === 7);
    }

    return {
      value: val,
      id: Date.now(),
      isTarget,
      isGolden,
      isPowerUp,
      powerUpType
    };
  }, []);

  const triggerFeedback = (text: string, color: string) => {
    setFeedback({ text, color, id: Date.now() });
    // Auto clear feedback after short time
    setTimeout(() => setFeedback(null), 500);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleTap = () => {
    const state = gameStateRef.current;
    if (!state.isPlaying || !currentNumber || state.hasClickedCurrent || isPaused) return;

    state.hasClickedCurrent = true;

    if (currentNumber.isTarget) {
      // HIT
      if (soundEnabled) playSound('hit');

      // Haptic feedback: Stronger vibration for hit
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(100);
      }

      const comboMultiplier = Math.min(Math.floor(state.combo / 5) + 1, 5); // Cap multiplier at 5x
      let points = 100 * comboMultiplier;

      // Golden number bonus
      if (currentNumber.isGolden) {
        points *= 3; // Triple points!
        triggerFeedback('✨ GOLDEN! x3 ✨', 'text-yellow-400');
        onGoldenNumberCollected();
      } else if (currentNumber.isPowerUp && currentNumber.powerUpType) {
        // Activate power-up
        const powerUp: PowerUp = {
          type: currentNumber.powerUpType,
          duration: 5000, // 5 seconds
          startTime: Date.now()
        };
        setActivePowerUp(powerUp);
        onPowerUpCollected();

        const powerUpNames = {
          'double-points': '⚡ DOUBLE POINTS!',
          'slow-time': '🕐 SLOW TIME!',
          'shield': '🛡️ SHIELD!',
          'multiplier': '✨ 5X MULTIPLIER!'
        };
        triggerFeedback(powerUpNames[powerUp.type], 'text-purple-400');
      } else {
        triggerFeedback(state.combo > 1 ? `${state.combo}x COMBO!` : 'PERFECT!', 'text-neon-yellow');
      }

      // Apply active power-up effects
      if (activePowerUp) {
        if (activePowerUp.type === 'double-points') {
          points *= 2;
        } else if (activePowerUp.type === 'multiplier') {
          points *= 5;
        }
      }

      state.score += points;
      state.combo += 1;
      state.maxCombo = Math.max(state.maxCombo, state.combo);
      state.hits += 1;

      setScore(state.score);
      setCombo(state.combo);

      // Speed up slightly on hit (rewarding speed)
      state.intervalMs = Math.max(config.minInterval, state.intervalMs - 15);

    } else {
      // MISS (Tapped wrong number)
      // Check if shield is active
      if (activePowerUp?.type === 'shield') {
        triggerFeedback('🛡️ PROTECTED!', 'text-blue-400');
        setActivePowerUp(null); // Consume shield
        return;
      }

      if (soundEnabled) playSound('miss');

      // Haptic feedback: Short, sharp vibration for miss
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }

      state.score = Math.max(0, state.score - 50);
      state.combo = 0;
      state.misses += 1;

      setScore(state.score);
      setCombo(0);
      setIsShake(true);
      setTimeout(() => setIsShake(false), 300);
      triggerFeedback('OOPS!', 'text-red-500');
    }
  };

  // Power-up expiration
  useEffect(() => {
    if (!activePowerUp) return;

    const timeRemaining = activePowerUp.duration - (Date.now() - activePowerUp.startTime);
    if (timeRemaining <= 0) {
      setActivePowerUp(null);
      return;
    }

    const timer = setTimeout(() => {
      setActivePowerUp(null);
    }, timeRemaining);

    return () => clearTimeout(timer);
  }, [activePowerUp]);

  // Game Loop
  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>;
    let gameLoopId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!gameStateRef.current.isPlaying || isPaused) return;

      const state = gameStateRef.current;

      // Logic for previous number (if missed a target)
      if (currentNumber && currentNumber.isTarget && !state.hasClickedCurrent) {
        if (state.combo > 0) {
           triggerFeedback('MISSED!', 'text-gray-400');
           state.combo = 0;
           setCombo(0);
        }
      }

      // Progressive Difficulty:
      // 1. Gradually increase speed every tick (compounding)
      state.intervalMs = Math.max(config.minInterval, state.intervalMs * config.speedMultiplier);

      // 2. Gradually decrease target probability (more noise numbers appear)
      state.targetProbability = Math.max(config.targetProbabilityMin, state.targetProbability - 0.005);

      // Spawn new number
      const nextNum = generateNumber();
      setCurrentNumber(nextNum);
      state.hasClickedCurrent = false;

      // Schedule next tick
      gameLoopId = setTimeout(tick, state.intervalMs);
    };

    const endGame = () => {
      gameStateRef.current.isPlaying = false;
      clearInterval(timerId);
      clearTimeout(gameLoopId);

      const totalActions = gameStateRef.current.hits + gameStateRef.current.misses;
      const accuracy = totalActions > 0 ? gameStateRef.current.hits / totalActions : 0;

      onGameOver({
        score: gameStateRef.current.score,
        maxCombo: gameStateRef.current.maxCombo,
        hits: gameStateRef.current.hits,
        misses: gameStateRef.current.misses,
        accuracy,
        difficulty,
        mode,
        timestamp: Date.now()
      });
    };

    // Start Timer
    if (mode === 'timed') {
      timerId = setInterval(() => {
        if (isPaused) return;
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Practice mode - count up
      timerId = setInterval(() => {
        if (isPaused) return;
        setTimeLeft((prev) => prev + 1);
      }, 1000);
    }

    // Initial tick
    if (!isPaused) tick();

    return () => {
      clearInterval(timerId);
      clearTimeout(gameLoopId);
    };
  }, [generateNumber, onGameOver, difficulty, mode, isPaused, config]);

  return (
    <div 
      className={`relative w-full h-full flex flex-col items-center justify-between bg-dark-bg p-6 touch-manipulation cursor-pointer select-none ${isShake ? 'animate-shake' : ''}`}
      onMouseDown={handleTap}
      onTouchStart={handleTap}
    >
      {/* HUD */}
      <div className="w-full flex justify-between items-start z-10 pointer-events-none">
        <div className="flex flex-col">
          <span className="text-gray-400 text-sm font-bold tracking-widest">SCORE</span>
          <span className="text-3xl text-white font-black game-font">{score.toLocaleString()}</span>
          <span className="text-xs text-gray-600 mt-1">{difficulty}</span>
          {/* Active Power-Up Indicator */}
          {activePowerUp && (
            <div className="mt-2 px-2 py-1 bg-purple-600 rounded text-xs font-bold animate-pulse">
              {activePowerUp.type === 'double-points' && '⚡ 2X'}
              {activePowerUp.type === 'slow-time' && '🕐 SLOW'}
              {activePowerUp.type === 'shield' && '🛡️ SHIELD'}
              {activePowerUp.type === 'multiplier' && '✨ 5X'}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center">
             <div className="text-4xl font-black text-white">{timeLeft}</div>
             <div className="text-xs text-gray-500 uppercase">
               {mode === 'timed' ? 'Seconds' : 'Time'}
             </div>
             <button
               onClick={(e) => { e.stopPropagation(); togglePause(); }}
               className="mt-2 px-3 py-1 bg-white/10 rounded-lg text-xs font-bold pointer-events-auto hover:bg-white/20 transition-colors"
             >
               {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
             </button>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-400 text-sm font-bold tracking-widest">COMBO</span>
          <span className={`text-3xl font-black game-font ${combo > 5 ? 'text-neon-pink animate-pulse' : 'text-neon-cyan'}`}>
            x{combo}
          </span>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex items-center justify-center relative w-full pointer-events-none">
        {/* Background pulses based on combo */}
        <div
            className={`absolute rounded-full filter blur-3xl transition-all duration-300 opacity-20
            ${combo > 5 ? 'bg-neon-pink w-80 h-80' : 'bg-neon-cyan w-40 h-40'}`}
        />

        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl font-black text-white">PAUSED</div>
              <div className="text-gray-400">Tap RESUME to continue</div>
            </div>
          </div>
        )}

        {currentNumber && !isPaused && (
            <div className="relative z-20">
              {/* Golden Number Glow Effect */}
              {currentNumber.isGolden && (
                <div className="absolute inset-0 blur-3xl bg-yellow-400 opacity-50 animate-pulse" />
              )}
              {/* Power-Up Glow Effect */}
              {currentNumber.isPowerUp && (
                <div className="absolute inset-0 blur-3xl bg-purple-500 opacity-50 animate-pulse" />
              )}

              <div
                key={currentNumber.id}
                className={`relative text-[12rem] md:text-[16rem] leading-none font-black game-font animate-pop
                ${currentNumber.isGolden ? 'text-yellow-400 drop-shadow-[0_0_50px_rgba(250,204,21,0.9)] animate-pulse' :
                  currentNumber.isPowerUp ? 'text-purple-400 drop-shadow-[0_0_50px_rgba(192,132,252,0.9)]' :
                  currentNumber.value === 6 || currentNumber.value === 7 ? 'text-neon-yellow drop-shadow-[0_0_35px_rgba(235,255,0,0.5)]' :
                  'text-white/80'}`}
              >
                {currentNumber.value}
                {/* Special indicators */}
                {currentNumber.isGolden && (
                  <span className="absolute -top-8 right-0 text-2xl animate-bounce">✨</span>
                )}
                {currentNumber.isPowerUp && (
                  <span className="absolute -top-8 right-0 text-2xl animate-spin">⚡</span>
                )}
              </div>
            </div>
        )}

        {/* Feedback Overlay */}
        {feedback && !isPaused && (
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-32 z-30 text-4xl font-black italic ${feedback.color} animate-pop`}>
            {feedback.text}
          </div>
        )}
      </div>

      {/* Controls Hint */}
      <div className="text-gray-500 text-sm uppercase tracking-widest pb-8 pointer-events-none">
        Tap screen for <span className="text-neon-yellow">6</span> or <span className="text-neon-yellow">7</span>
      </div>
    </div>
  );
};

export default Game;
