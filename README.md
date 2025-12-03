# 6-7 Tap! 🎮

A hyper-casual reaction game where you must tap only when you see 6 or 7!

![Game Preview](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-teal)

## 🎯 How to Play

- Numbers flash on screen (0-9)
- **TAP** when you see **6** or **7** (highlighted in yellow)
- **DON'T TAP** for any other number
- Build combos for higher scores!
- Game lasts 30 seconds

## ✨ Features

- 🎵 Synthesized sound effects (no external audio files)
- 📳 Haptic feedback on mobile devices
- 🔥 Combo system with multipliers (up to 5x)
- 📈 Progressive difficulty (speed increases, more distractors)
- 💾 Local high score persistence
- 🎨 Neon-styled UI with animations

## 🚀 Run Locally

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Web Audio API (for sounds)

## 📁 Project Structure

```
src/
├── components/
│   ├── Game.tsx      # Main game logic
│   ├── Menu.tsx      # Start screen
│   └── Results.tsx   # Game over screen
├── services/
│   └── feedbackService.ts  # Performance feedback
├── utils/
│   └── sound.ts      # Sound synthesis
├── types.ts          # TypeScript types
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## 🎮 Game Mechanics

- **Scoring:** 100 points per correct tap, with combo multipliers
- **Combos:** Every 5 consecutive hits increases your multiplier
- **Penalties:** -50 points for wrong taps, combo reset
- **Difficulty:** Speed increases from 1000ms to 350ms intervals
- **Target Rate:** Starts at 50%, decreases to 30% over time

## 📝 License

MIT
