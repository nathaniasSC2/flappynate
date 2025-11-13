// ===== FLAPPYKANT - LAN MULTIPLAYER SERVER =====
// Made with love for Katie ❤️

const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const WS_PORT = 8081;

// Create HTTP server for serving game files
const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index-multiplayer.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('🎮 FLAPPYKANT - LAN Multiplayer Server 🎮');
    console.log('💝 Made with love for Katie 💝\n');
    console.log(`Game server running at http://localhost:${PORT}/`);
    console.log(`WebSocket server running on port ${WS_PORT}\n`);
    console.log('📡 LAN Setup:');
    console.log('1. Both players connect to: http://[YOUR-LOCAL-IP]:8080/');
    console.log('2. Find your local IP with: ipconfig (Windows) or ifconfig (Mac/Linux)');
    console.log('3. Example: http://192.168.1.100:8080/\n');
    console.log('Press Ctrl+C to stop the server\n');
});

// Create WebSocket server
const wss = new WebSocket.Server({ port: WS_PORT });

// Game state
const gameRooms = new Map();
let waitingPlayer = null;

// Player connection handler
wss.on('connection', (ws) => {
    console.log('🎮 New player connected');

    let currentPlayer = {
        ws: ws,
        id: generateId(),
        name: '',
        roomId: null,
        ready: false
    };

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            switch (data.type) {
                case 'join':
                    handlePlayerJoin(currentPlayer, data);
                    break;

                case 'gameState':
                    handleGameState(currentPlayer, data);
                    break;

                case 'playerDied':
                    handlePlayerDied(currentPlayer, data);
                    break;

                case 'restart':
                    handleRestart(currentPlayer);
                    break;

                case 'ping':
                    ws.send(JSON.stringify({ type: 'pong' }));
                    break;
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        console.log(`👋 Player ${currentPlayer.name || currentPlayer.id} disconnected`);
        handlePlayerDisconnect(currentPlayer);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

function handlePlayerJoin(player, data) {
    player.name = data.name || `Player ${player.id.substring(0, 4)}`;
    console.log(`✨ ${player.name} joined`);

    // Try to match with waiting player
    if (waitingPlayer && waitingPlayer !== player) {
        // Create a room with both players
        const roomId = generateId();
        const room = {
            id: roomId,
            players: [waitingPlayer, player],
            gameState: 'waiting'
        };

        gameRooms.set(roomId, room);
        waitingPlayer.roomId = roomId;
        player.roomId = roomId;

        // Notify both players they're matched
        waitingPlayer.ws.send(JSON.stringify({
            type: 'matched',
            roomId: roomId,
            opponent: player.name,
            playerNumber: 1
        }));

        player.ws.send(JSON.stringify({
            type: 'matched',
            roomId: roomId,
            opponent: waitingPlayer.name,
            playerNumber: 2
        }));

        console.log(`🎯 Room created: ${waitingPlayer.name} vs ${player.name}`);
        waitingPlayer = null;
    } else {
        // Player is waiting for opponent
        waitingPlayer = player;
        player.ws.send(JSON.stringify({
            type: 'waiting',
            message: 'Waiting for opponent...'
        }));
        console.log(`⏳ ${player.name} is waiting for an opponent`);
    }
}

function handleGameState(player, data) {
    if (!player.roomId) return;

    const room = gameRooms.get(player.roomId);
    if (!room) return;

    // Broadcast to opponent
    const opponent = room.players.find(p => p.id !== player.id);
    if (opponent && opponent.ws.readyState === WebSocket.OPEN) {
        opponent.ws.send(JSON.stringify({
            type: 'opponentState',
            state: data.state
        }));
    }
}

function handlePlayerDied(player, data) {
    if (!player.roomId) return;

    const room = gameRooms.get(player.roomId);
    if (!room) return;

    // Notify opponent that this player died
    const opponent = room.players.find(p => p.id !== player.id);
    if (opponent && opponent.ws.readyState === WebSocket.OPEN) {
        opponent.ws.send(JSON.stringify({
            type: 'opponentDied',
            playerName: player.name,
            score: data.score
        }));
    }

    console.log(`💀 ${player.name} died with score ${data.score}`);
}

function handleRestart(player) {
    if (!player.roomId) return;

    const room = gameRooms.get(player.roomId);
    if (!room) return;

    // Notify opponent about restart
    const opponent = room.players.find(p => p.id !== player.id);
    if (opponent && opponent.ws.readyState === WebSocket.OPEN) {
        opponent.ws.send(JSON.stringify({
            type: 'opponentRestart',
            playerName: player.name
        }));
    }

    console.log(`🔄 ${player.name} restarted`);
}

function handlePlayerDisconnect(player) {
    // Remove from waiting list
    if (waitingPlayer === player) {
        waitingPlayer = null;
    }

    // Handle room cleanup
    if (player.roomId) {
        const room = gameRooms.get(player.roomId);
        if (room) {
            const opponent = room.players.find(p => p.id !== player.id);
            if (opponent && opponent.ws.readyState === WebSocket.OPEN) {
                opponent.ws.send(JSON.stringify({
                    type: 'opponentDisconnected',
                    playerName: player.name
                }));

                // Put opponent back in waiting
                opponent.roomId = null;
                waitingPlayer = opponent;
                opponent.ws.send(JSON.stringify({
                    type: 'waiting',
                    message: 'Opponent disconnected. Waiting for new opponent...'
                }));
            }

            gameRooms.delete(player.roomId);
        }
    }
}

function generateId() {
    return Math.random().toString(36).substring(2, 15);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down Flappykant server...');
    wss.clients.forEach((client) => {
        client.close();
    });
    server.close(() => {
        console.log('💝 Thanks for playing! 💝');
        process.exit(0);
    });
});
