# 🎮 Flappy Nathanias - The Ultimate SC2 Bird Experience

A sleek, 60fps Flappy Bird clone featuring the legendary StarCraft 2 commentator Nathanias! Built with roguelike elements for infinite replayability.

## 💝 Made with Love for Katie 💝

## 🌐 NEW: Multiplayer Edition Available!

**Looking to play with Katie?** Check out **FLAPPYKANT** - the LAN multiplayer edition!

👉 **[See Multiplayer Setup Guide](README-MULTIPLAYER.md)**

Features:
- 🎮 Play together in real-time on LAN
- 👀 Spectate each other when you die
- 🏆 Compete for high scores
- 💕 All the roguelike features!

---

## ✨ Features

### Core Gameplay
- **Smooth 60fps Performance**: Buttery-smooth canvas rendering
- **Flappy Bird Mechanics**: Classic tap/click to flap gameplay
- **Nathanias Theming**: Play as Nathanias with his signature microphone!
- **Beautiful Aero UI**: Sleek glass-morphism design with glowing effects

### 🎲 Roguelike Elements
The game features extensive roguelike mechanics to ensure every run is unique:

1. **Randomized Power-ups**:
   - 🛡️ **Shield**: Protect yourself from one collision
   - ⏱️ **Slow Motion**: Slow down time for easier navigation
   - ⭐ **Score Boost**: Double your score multiplier
   - 🔬 **Tiny Mode**: Shrink to fit through tighter gaps
   - 👻 **Ghost Mode**: Phase through obstacles temporarily

2. **Obstacle Variations**:
   - Normal pipes
   - Moving pipes that oscillate
   - Narrow gaps for extra challenge
   - Wide gaps for relief
   - Randomly colored obstacles

3. **Collectibles**:
   - 💎 SC2-style minerals to collect
   - Bonus points that scale with your multiplier
   - Dynamic spawning throughout the run

4. **Progressive Difficulty**:
   - Speed increases as your score grows
   - Score multiplier system (increases every 50 points)
   - Combo system for passing multiple obstacles

5. **Run Statistics**:
   - Track power-ups collected
   - Count bonuses acquired
   - Monitor obstacles passed
   - Record maximum multiplier achieved

### 🏆 High Score System
- Persistent high score tracking using localStorage
- New high score celebrations
- Detailed run statistics at game over

## 🎮 How to Play

### Starting the Game
1. Open `index.html` in a modern web browser
2. Click "START GAME" or press any key
3. Get ready to flap!

### Controls
- **SPACE** or **CLICK**: Make Nathanias flap
- **ESC** or **P**: Pause/Resume game
- Navigate through obstacles while collecting power-ups!

### Tips
- Collect power-ups strategically - they can save your run!
- Watch for different colored pipes - they have varying behaviors
- Build your multiplier by passing many obstacles
- Ghost mode and shields are lifesavers in tight situations
- Grab minerals for bonus points (they multiply!)

## 🎨 SC2 Theming

The game features StarCraft 2 inspired elements:
- Nathanias as the player character (with his iconic microphone)
- SC2-branded obstacles/pipes
- Mineral collectibles
- High-energy commentator vibe

## 🛠️ Technical Details

### Technology Stack
- Pure vanilla JavaScript (no frameworks!)
- HTML5 Canvas for rendering
- CSS3 for UI animations and effects
- LocalStorage for high score persistence

### Performance
- Locked 60fps game loop using requestAnimationFrame
- Efficient particle system
- Optimized collision detection
- Smooth animations and transitions

## 📁 Project Structure

```
flappynate/
├── index.html          # Main HTML file
├── style.css           # Aero-themed styling
├── game.js             # Complete game logic
└── README.md           # This file
```

## 🚀 Running the Game

### Option 1: Direct File Open
Simply open `index.html` in your browser (Chrome, Firefox, Safari, Edge)

### Option 2: Local Server
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

## 🎯 Game Modes

The game currently features endless mode with progressive difficulty. Future enhancements could include:
- Daily challenge runs
- Leaderboard integration
- More power-up types
- Boss obstacles
- Themed seasonal events

## 💖 Credits

- **Game Design**: Built for Katie with love
- **Inspiration**: Nathanias - StarCraft 2's legendary commentator
- **Original Concept**: Flappy Bird by Dong Nguyen
- **Theme**: StarCraft 2 by Blizzard Entertainment

## 🎮 Have Fun!

Remember: Every run is different thanks to the roguelike elements. Keep playing to discover new power-up combinations and beat your high score!

**Good luck, Commander! Nathanias is counting on you! 🎤**
