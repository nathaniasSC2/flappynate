# 🎮 FlappyNate Game Modes - Complete Guide

Welcome to the FlappyNate multi-mode experience! This document covers all available game modes, their differences, and how to choose the right one for your play style.

## 📋 Quick Start

**Try the Mode Comparison Dashboard:**
Open `index-compare.html` in your browser to:
- View all modes side-by-side
- Compare parameters and features
- Get personalized recommendations
- Rate and rank your favorite modes
- Export/import your rankings

## 🎯 Available Game Modes

### 1. **Original Mode** (Classic Roguelike)
**File:** `index.html` + `game.js`

The original balanced experience that started it all.

**Parameters:**
- Gravity: 0.5
- Jump Strength: -9
- Obstacle Speed: 3
- Gap Size: 180px
- Power-up Spawn: 0.5%
- Difficulty Scaling: +0.3 speed after 30 obstacles

**Features:**
- 5 power-up types (Shield, Slow-mo, Score Boost, Tiny, Ghost)
- 4 obstacle types (normal, moving, narrow, wide)
- Roguelike progression with multipliers
- SC2-themed collectibles
- High score persistence

**Best For:** Players who want balanced, well-tested gameplay

---

### 2. **Casual Mode** ☁️ (Katie's Chill Flight)
**File:** `index-casual.html` + `game-casual.js`

Relaxed, forgiving experience for casual players and beginners.

**Parameters:**
- Gravity: 0.4 ⬇️ (-20% gentler)
- Jump Strength: -8 ⬇️ (softer control)
- Obstacle Speed: 2.5 ⬇️ (-17% slower)
- Gap Size: 220px ⬆️ (+40px wider)
- Power-up Spawn: 0.8% ⬆️ (+60% more)
- Difficulty Scaling: +0.2 speed after 50 obstacles (gentler)

**Features:**
- **50% longer power-up durations**
  - Shield: 7.5 seconds (vs 5 sec)
  - Slow Motion: 4.5 seconds (vs 3 sec)
  - Score Boost: 6 seconds (vs 4 sec)
  - Tiny Mode: 5 seconds (vs 3.3 sec)
  - Ghost Mode: 3.75 seconds (vs 2.5 sec)
- **No narrow gaps** - removed for friendliness
- **No moving obstacles** - predictable patterns only
- **50% more collectibles** (1.5% spawn rate)
- **More breathing room** - 300px obstacle spacing

**Best For:**
- New players learning the game
- Relaxation and stress-free play
- Building confidence
- Katie when she wants to chill

**Difficulty:** ⭐☆☆☆☆ (1/5)

---

### 3. **Hardcore Mode** 🏆 (Pro League Challenge)
**File:** `index-hardcore.html` + `game-hardcore.js`

Ultimate challenge for skilled players seeking mastery.

**Parameters:**
- Gravity: 0.6 ⬆️ (+20% faster falling)
- Jump Strength: -9.5 ⬆️ (twitchier control)
- Obstacle Speed: 4 ⬆️ (+33% faster)
- Gap Size: 150px ⬇️ (-30px tighter)
- Power-up Spawn: 0.3% ⬇️ (-40% rarer)
- Difficulty Scaling: +0.5 speed after 15 obstacles (aggressive)

**Features:**
- **33% shorter power-up durations**
  - Shield: 3.3 seconds (vs 5 sec)
  - Slow Motion: 2 seconds (vs 3 sec)
  - Score Boost: 2.7 seconds (vs 4 sec)
  - Tiny Mode: 2.2 seconds (vs 3.3 sec)
- **No Ghost Mode** - removed (too powerful)
- **50% fewer collectibles** - rarer rewards
- **Faster multiplier** - every 30 points (vs 50)
- **Tighter spacing** - 200px between obstacles
- **Earlier difficulty ramp** - starts at 15 obstacles

**Best For:**
- Experienced players
- Speedrunners
- Competitive players seeking leaderboard dominance
- Proving your skills

**Difficulty:** ⭐⭐⭐⭐⭐ (5/5)

---

### 4. **Speed Mode** ⚡ (Hyper Drive)
**File:** `index-speed.html` + `game-speed.js`

Lightning-fast reflex testing for adrenaline junkies.

**Parameters:**
- Gravity: 0.7 ⬆️ (+40% super responsive)
- Jump Strength: -10 ⬆️ (snappy jumps)
- Obstacle Speed: 5 ⬆️ (+67% FAST)
- Gap Size: 200px ⬆️ (slightly wider for speed)
- Obstacle Frequency: 100 frames ⬆️ (33% more frequent)
- Power-up Spawn: 0.7% ⬆️ (+40% more)
- Difficulty Scaling: +0.4 speed from obstacle 1 (immediate)

**Features:**
- **Speed-focused power-ups only**
  - Removed: Slow-mo (contradicts theme)
  - Removed: Tiny mode
  - Kept: Shield, Score Boost, Ghost
- **50% shorter durations** (but more frequent)
  - Shield: 2.5 seconds
  - Score Boost: 2 seconds
  - Ghost Mode: 1.25 seconds
- **2x more collectibles** (2% spawn rate)
- **No narrow gaps** - too punishing at high speed
- **Rapid obstacle spawning** - 180px spacing
- **Immediate difficulty** - no warm-up period

**Best For:**
- Reflex masters
- Speed game enthusiasts
- Quick sessions
- Testing your reaction time limits

**Difficulty:** ⭐⭐⭐⭐☆ (4/5 - Hard but fair)

---

### 5. **Chaos Mode** 🔥 (Madness)
**File:** `index-chaos.html` + `game-chaos.js`

Unpredictable hilarious madness with randomized everything.

**Parameters (All Randomized):**
- Gravity: **0.3-0.8** (changes every 5 seconds!)
- Jump Strength: **-7 to -11** (changes every 5 seconds!)
- Obstacle Speed: **2-5** (each obstacle different)
- Gap Size: **120-250px** (wildly varying per obstacle)
- Power-up Spawn: 1% ⬆️ (2x more)
- Collectible Spawn: 3% ⬆️ (3x more)

**Features:**
- **Dynamic Physics** - Gravity and jump randomize every 5 seconds
- **Variable obstacles** - Each has unique speed and gap size
- **Power-up stacking** - Multiple power-ups active simultaneously!
- **Chaos multiplier** - Random 1x-5x score multiplier every 5 seconds
- **Screen tints** - Random color overlays (Red, Green, Blue, Yellow, Magenta, Cyan)
- **Abundant collectibles** - Values range 10-100 points
- **Visual chaos indicator** - On-screen display of current values
- **All power-ups included** - Full 5 types available
- **Increased limits** - 3 power-ups, 5 collectibles on screen

**Unique Mechanics:**
- Power-ups can stack (imagine: Shield + Ghost + Tiny all active!)
- Physics change mid-flight (you adapt constantly)
- Score multiplier randomizes (high risk/reward)
- No predictable patterns (pure chaos)

**Best For:**
- Party games
- Streamers wanting chaos content
- Players who want to laugh
- "What just happened?!" moments
- Taking a break from serious play

**Difficulty:** ⭐⭐⭐☆☆ (3/5 - Chaotic, not necessarily hard)

---

### 6. **Multiplayer Mode** 🌐 (LAN Competition)
**File:** `index-multiplayer.html` + `game-multiplayer.js` + `server.js`

Real-time LAN multiplayer with character selection.

**Features:**
- Same physics as Original mode
- 4 playable characters (Nathanias, Lou, Kiki, Katie)
- WebSocket-based networking
- Auto-matchmaking (first 2 players paired)
- Real-time opponent state display
- Spectator mode after death
- Score comparison and winner determination

**Setup Required:**
1. `npm install`
2. `node server.js`
3. Both players open `index-multiplayer.html`
4. Connect to `ws://localhost:8081`

**Best For:**
- Playing with friends on LAN
- Competitive head-to-head
- Social gaming sessions

See `README-MULTIPLAYER.md` for full setup guide.

---

## 📊 Mode Comparison Table

| Feature | Original | Casual | Hardcore | Speed | Chaos |
|---------|----------|--------|----------|-------|-------|
| **Gravity** | 0.5 | 0.4 | 0.6 | 0.7 | 0.3-0.8 |
| **Jump** | -9 | -8 | -9.5 | -10 | -7 to -11 |
| **Speed** | 3 | 2.5 | 4 | 5 | 2-5 |
| **Gap Size** | 180 | 220 | 150 | 200 | 120-250 |
| **Power-ups** | 0.5% | 0.8% | 0.3% | 0.7% | 1% |
| **Collectibles** | 1% | 1.5% | 0.5% | 2% | 3% |
| **Duration Mod** | 100% | +50% | -33% | -50% | 100% |
| **Unique** | Balanced | Forgiving | Punishing | Fast | Random |
| **Difficulty** | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🎯 Which Mode Should You Play?

### Take the Quiz:

**Q1: How do you feel right now?**
- Relaxed, want to chill → **Casual Mode**
- Competitive, want a challenge → **Hardcore Mode**
- Energetic, want fast action → **Speed Mode**
- Silly, want to laugh → **Chaos Mode**
- Balanced → **Original Mode**

**Q2: What's your skill level?**
- Beginner → **Casual Mode**
- Intermediate → **Original or Speed Mode**
- Expert → **Hardcore Mode**
- Just want fun → **Chaos Mode**

**Q3: How much time do you have?**
- Quick 2-minute session → **Speed Mode**
- Relaxed 10+ minutes → **Casual Mode**
- Grinding for high score → **Hardcore Mode**
- Party/stream content → **Chaos Mode**

**Q4: What frustrates you?**
- Unfair difficulty → **Casual Mode**
- Game too easy → **Hardcore Mode**
- Slow pace → **Speed Mode**
- Predictability → **Chaos Mode**

---

## 🏆 Ranking Your Experience

Use the **Mode Comparison Dashboard** (`index-compare.html`) to:

1. **Play each mode** - Try them all first
2. **Rate them** - Click stars (1-5) based on enjoyment
3. **Add notes** - Write what you liked/disliked
4. **Compare** - See parameters side-by-side
5. **Export** - Save your rankings as JSON
6. **Share** - Send rankings to friends

Your ratings are saved automatically to localStorage!

---

## 🎮 Controls (All Modes)

- **Space** or **Click** - Jump
- **P** - Pause/Resume
- **Space** (on game over) - Quick restart
- **ESC** - Return to menu (if implemented)

---

## 🔧 Technical Details

### File Structure

```
flappynate/
├── index.html              # Original mode
├── index-casual.html       # Casual mode
├── index-hardcore.html     # Hardcore mode
├── index-speed.html        # Speed mode
├── index-chaos.html        # Chaos mode
├── index-multiplayer.html  # Multiplayer mode
├── index-compare.html      # Mode comparison dashboard
├── game.js                 # Original game logic
├── game-casual.js          # Casual mode logic
├── game-hardcore.js        # Hardcore mode logic
├── game-speed.js           # Speed mode logic
├── game-chaos.js           # Chaos mode logic
├── game-multiplayer.js     # Multiplayer game (same as game.js)
├── multiplayer.js          # Networking and characters
├── server.js               # WebSocket server
├── style.css               # Shared styling
├── style-multiplayer.css   # Additional multiplayer styles
├── README.md               # Main README
├── README-MULTIPLAYER.md   # Multiplayer setup guide
└── README-GAME-MODES.md    # This file
```

### High Scores

Each mode saves its own high score:
- Original: `flappyNathanias_highScore`
- Casual: `flappyNathanias_highScore_CASUAL`
- Hardcore: `flappyNathanias_highScore_HARDCORE`
- Speed: `flappyNathanias_highScore_SPEED`
- Chaos: `flappyNathanias_highScore_CHAOS`

Stored in browser's localStorage.

### Modding

To create your own mode:
1. Copy `game.js` to `game-custom.js`
2. Modify parameters in the constructor (lines 3-69)
3. Copy `index.html` to `index-custom.html`
4. Update script src to load `game-custom.js`
5. Customize title and dedication

---

## 🎨 Mode Personalities

**Original** - "The balanced classic that Katie deserves"
**Casual** - "Katie's chill flight through clouds ☁️"
**Hardcore** - "Only the best for the best, Katie 🏆"
**Speed** - "Feel the rush, Katie! ⚡"
**Chaos** - "Embrace the chaos, Katie! 🔥"
**Multiplayer** - "Dedicated to Katie with all my love ❤️"

---

## 📈 Recommended Progression

1. Start with **Casual Mode** to learn mechanics
2. Graduate to **Original Mode** for balanced play
3. Try **Speed Mode** for a different challenge
4. Test your skills in **Hardcore Mode**
5. Take a break with **Chaos Mode** for laughs
6. Compete with friends in **Multiplayer Mode**

---

## 🐛 Known Differences

### Casual Mode
- Easier than original by design
- No moving/narrow obstacles
- Power-ups last longer

### Hardcore Mode
- Much harder than original
- No Ghost mode power-up
- Aggressive difficulty scaling

### Speed Mode
- No Slow-mo or Tiny power-ups (removed for theme)
- Instant difficulty ramp
- Obstacles spawn faster

### Chaos Mode
- Physics change during gameplay
- Each obstacle has unique properties
- Power-ups can stack (unlike other modes)
- Score multiplier randomizes

---

## 💝 Made with Love

All modes created with love for Katie.

Try the **Mode Comparison Dashboard** to find your favorite!

Open `index-compare.html` and start ranking! 🎮

---

## 🙏 Credits

- Original Game: FlappyNate by Nathanias
- Game Modes: Created via parallel AI agent analysis
- Inspiration: StarCraft 2 community & Katie
- Testing: You! (Please rate the modes!)

Enjoy the multiverse of FlappyNate experiences! 🎮✨
