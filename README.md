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

### Core Gameplay
- 🎵 Synthesized sound effects (toggleable, no external audio files)
- 📳 Haptic feedback on mobile devices
- 🔥 Combo system with multipliers (up to 5x)
- 📈 Progressive difficulty (speed increases, more distractors)
- 💾 Local high score persistence
- 🎨 Multiple visual themes (Neon, Sunset, Ocean, Forest)

### Game Modes
- ⏱ **Timed Mode**: Classic 30-second challenge
- ♾️ **Practice Mode**: Endless gameplay with no time limit

### Difficulty Levels
- ⭐ **Easy**: Slower pace (1200-500ms), more targets (60-45%)
- ⭐⭐ **Medium**: Balanced challenge (1000-350ms), moderate targets (50-30%)
- ⭐⭐⭐ **Hard**: Fast pace (800-250ms), fewer targets (40-20%)

### Quality of Life
- ⏸ **Pause/Resume**: Take a break anytime during gameplay
- 🎓 **Tutorial**: Interactive how-to-play guide
- ⚙️ **Settings**: Customize difficulty, sound, and themes
- 📊 **Game History**: Track your last 20 games locally
- 🎯 **Adaptive UI**: Shows current difficulty and mode during play

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
- **Combos:** Every 5 consecutive hits increases your multiplier (up to 5x)
- **Penalties:** -50 points for wrong taps, combo reset
- **Difficulty:** Dynamic speed based on difficulty level
  - Easy: 1200ms → 500ms
  - Medium: 1000ms → 350ms
  - Hard: 800ms → 250ms
- **Target Rate:** Progressively decreases based on difficulty
  - Easy: 60% → 45%
  - Medium: 50% → 30%
  - Hard: 40% → 20%

## 🎨 Customization

### Themes
Switch between four beautiful color themes:
- **Neon** (Default): Cyan, magenta, and yellow
- **Sunset**: Orange, pink, and purple gradients
- **Ocean**: Blue and teal hues
- **Forest**: Green and emerald tones

### Sound
Toggle sound effects on/off in settings to play with or without audio feedback.

## 📊 Statistics

The game automatically tracks:
- High scores (for timed mode)
- Last 20 game sessions with full statistics
- Total games played
- Difficulty and mode for each session

## 📝 License

MIT
