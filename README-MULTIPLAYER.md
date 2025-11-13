# 💝 FLAPPYKANT - LAN Multiplayer Edition 💝

**Made with love for Katie ❤️**

A special LAN multiplayer version of Flappy Nathanias where you and Katie can play together in real-time!

## ✨ Multiplayer Features

- **🌐 Auto-Matchmaking**: Automatically pairs players on the same LAN
- **👀 Spectator Mode**: Watch your opponent when you die
- **💕 Real-Time Sync**: See each other's positions live during gameplay
- **🏆 Score Competition**: Compete to see who gets the highest score
- **🎮 All Roguelike Features**: Keep all the power-ups, variations, and fun!

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

First, make sure you have Node.js installed. Then run:

```bash
npm install
```

### Step 2: Start the Server

One person needs to run the server (can be either player):

```bash
npm start
```

You'll see output like:
```
🎮 FLAPPYKANT - LAN Multiplayer Server 🎮
💝 Made with love for Katie 💝

Game server running at http://localhost:8080/
WebSocket server running on port 8081

📡 LAN Setup:
1. Both players connect to: http://[YOUR-LOCAL-IP]:8080/
...
```

### Step 3: Find Your Local IP Address

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x or 10.0.x.x)

**On Mac/Linux:**
```bash
ifconfig
```
or
```bash
ip addr
```
Look for "inet" under your active network interface (en0, eth0, wlan0, etc.)

### Step 4: Connect Both Players

1. **Player 1 (Server Host)**: Open browser to `http://localhost:8080/`
2. **Player 2 (Katie)**: Open browser to `http://[SERVER-IP]:8080/`
   - Example: `http://192.168.1.100:8080/`

### Step 5: Enter Names and Play!

1. Both players enter their names
2. Wait for auto-matching (should be instant!)
3. Game starts automatically when both are connected
4. Have fun! 🎮

## 🎮 How It Works

### Gameplay

- **Playing Together**: Both players see each other's bird on screen
  - You appear as the golden Nathanias (with 'N')
  - Your opponent appears in pink (with '♥' for Katie!)

- **When You Die**:
  - You can spectate your opponent and see how they're doing
  - Score comparison shown at the end
  - Press SPACE to restart and play again

- **Automatic Reconnection**: If connection drops, game tries to reconnect automatically

### Controls

- **SPACE** or **CLICK**: Flap
- **ESC** or **P**: Pause
- **SPACE** (on game over): Quick restart

## 🛠️ Technical Details

### Architecture

- **Frontend**: Pure JavaScript with Canvas rendering
- **Backend**: Node.js WebSocket server
- **Communication**: Real-time WebSocket messaging
- **Network**: LAN-based (local network only)

### Files

- `server.js` - WebSocket server for matchmaking and state sync
- `multiplayer.js` - Multiplayer manager and networking logic
- `game.js` - Core game engine (same as single player)
- `index-multiplayer.html` - Multiplayer UI
- `style-multiplayer.css` - Multiplayer-specific styles
- `package.json` - Node.js dependencies

### Ports Used

- **8080**: HTTP server (game files)
- **8081**: WebSocket server (multiplayer communication)

Make sure these ports aren't blocked by firewall!

## 🔧 Troubleshooting

### "Connection error" message

1. Make sure the server is running (`npm start`)
2. Check your firewall isn't blocking ports 8080 and 8081
3. Verify both players are on the same network
4. Try using the IP address instead of hostname

### Can't connect from other computer

1. Verify the IP address is correct
2. Try pinging the server: `ping [SERVER-IP]`
3. Temporarily disable firewall to test
4. Make sure you're using the right local IP (not 127.0.0.1)

### "Waiting for opponent" forever

1. Make sure both players are connected to the server
2. Check the server console for connection messages
3. Refresh both browsers and try again
4. Restart the server

### Game is laggy

1. Check your network connection
2. Close other applications using network
3. Try using wired connection instead of WiFi
4. Make sure no one is downloading/streaming on network

## 🎯 Network Requirements

- **Local Network**: Both players must be on same WiFi/LAN
- **Internet**: NOT required (works offline on LAN)
- **Bandwidth**: Minimal (< 1 KB/s per player)
- **Latency**: Best with < 50ms ping

## 💡 Tips for Best Experience

1. **Use Wired Connection**: For lowest latency
2. **Same Room**: Most fun when you can see each other's reactions!
3. **Voice Chat**: Consider using Discord/phone call for banter
4. **Tournament Mode**: Play best of 3 or 5 rounds
5. **Handicap**: Better player can try without power-ups!

## 🏆 Game Modes to Try

### Speed Run
- Who can reach 100 points fastest?

### Survival
- Last one standing wins!

### Best of 5
- Most wins in 5 rounds wins the match

### Power-Up Challenge
- Must collect at least 3 power-ups per run

## 🌟 Customization Ideas

Want to personalize it more? Here are some things you could modify:

1. **Colors**: Change player colors in `multiplayer.js` (line with `color: '#ff69b4'`)
2. **Names**: Pre-set names in the code
3. **Rules**: Add custom scoring or challenges
4. **Sounds**: Add sound effects for opponent actions

## ❤️ Credits

- **Made for**: Katie (with all my love!)
- **Featuring**: Nathanias - StarCraft 2 legend
- **Inspired by**: Flappy Bird
- **Built with**: Love, JavaScript, and late-night coding sessions

## 📞 Support

If you run into any issues:

1. Check the server console for errors
2. Check browser console (F12) for errors
3. Restart both server and browsers
4. Make sure you're using a modern browser (Chrome, Firefox, Edge, Safari)

---

## 🎮 Have Fun Playing Together! 🎮

Remember: It's not about who wins, it's about spending time together! 💕

Though winning is pretty cool too. 😉

**Happy Flapping!** 🐦✨
