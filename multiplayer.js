// ===== FLAPPYKANT - MULTIPLAYER MANAGER =====
// Made with love for Katie ❤️

class MultiplayerManager {
    constructor(game) {
        this.game = game;
        this.ws = null;
        this.connected = false;
        this.roomId = null;
        this.playerNumber = null;
        this.playerName = '';
        this.opponentName = '';
        this.opponentState = null;
        this.spectating = false;
        this.opponentAlive = true;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;

        this.setupUI();
    }

    setupUI() {
        // Update title
        const title = document.querySelector('.header h1');
        if (title) {
            title.textContent = '🎮 FLAPPYKANT 🎮';
        }

        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            subtitle.textContent = 'LAN Multiplayer Edition - Made for Katie ❤️';
        }
    }

    connect(serverUrl = null) {
        const url = serverUrl || `ws://${window.location.hostname}:8081`;
        console.log('🔌 Connecting to:', url);

        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            console.log('✅ Connected to server');
            this.connected = true;
            this.reconnectAttempts = 0;
            this.updateStatus('Connected! Enter your name to start.');
            this.showNamePrompt();
        };

        this.ws.onmessage = (event) => {
            this.handleMessage(JSON.parse(event.data));
        };

        this.ws.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
            this.updateStatus('Connection error. Check server is running.');
        };

        this.ws.onclose = () => {
            console.log('🔌 Disconnected from server');
            this.connected = false;
            this.handleDisconnect();
        };
    }

    handleMessage(data) {
        console.log('📨 Received:', data.type);

        switch (data.type) {
            case 'waiting':
                this.updateStatus('Waiting for opponent...');
                break;

            case 'matched':
                this.handleMatched(data);
                break;

            case 'opponentState':
                this.opponentState = data.state;
                break;

            case 'opponentDied':
                this.handleOpponentDied(data);
                break;

            case 'opponentRestart':
                this.handleOpponentRestart(data);
                break;

            case 'opponentDisconnected':
                this.handleOpponentDisconnected(data);
                break;

            case 'pong':
                // Keep-alive response
                break;
        }
    }

    handleMatched(data) {
        this.roomId = data.roomId;
        this.playerNumber = data.playerNumber;
        this.opponentName = data.opponent;
        this.opponentAlive = true;

        console.log(`🎯 Matched with ${this.opponentName}!`);
        this.updateStatus(`Matched with ${this.opponentName}! Get ready...`);

        // Hide start screen and begin game
        setTimeout(() => {
            document.getElementById('startScreen').classList.add('hidden');
            this.game.reset();
            this.game.gameState = 'playing';
            this.showOpponentPanel();
        }, 2000);
    }

    handleOpponentDied(data) {
        console.log(`💀 ${data.playerName} died with score ${data.score}`);
        this.opponentAlive = false;

        // Show message that opponent died
        this.updateOpponentStatus(`${data.playerName} died! Score: ${data.score}`);

        // If we're also dead, show final comparison
        if (this.game.gameState === 'gameOver') {
            this.showGameComparison();
        }
    }

    handleOpponentRestart(data) {
        console.log(`🔄 ${data.playerName} restarted`);
        this.opponentAlive = true;
        this.opponentState = null;
        this.updateOpponentStatus(`${data.playerName} is playing again!`);
    }

    handleOpponentDisconnected(data) {
        console.log(`👋 ${data.playerName} disconnected`);
        this.updateStatus(`${data.playerName} disconnected. Waiting for new opponent...`);
        this.opponentName = '';
        this.opponentState = null;
        this.hideOpponentPanel();
    }

    handleDisconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            this.updateStatus(`Connection lost. Reconnecting (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => this.connect(), 2000);
        } else {
            this.updateStatus('Could not reconnect. Please refresh the page.');
        }
    }

    showNamePrompt() {
        const startScreen = document.getElementById('startScreen');
        const content = startScreen.querySelector('.screen-content');

        const namePrompt = document.createElement('div');
        namePrompt.id = 'namePrompt';
        namePrompt.innerHTML = `
            <h3 style="margin: 20px 0;">Enter Your Name</h3>
            <input type="text" id="playerNameInput" placeholder="Your name..."
                   style="padding: 10px; font-size: 1.2em; border-radius: 10px; border: 2px solid #fff;
                          background: rgba(255,255,255,0.2); color: #fff; text-align: center; width: 250px;">
            <button id="joinButton" class="game-button" style="margin-top: 15px;">JOIN GAME</button>
        `;

        // Remove old prompt if exists
        const oldPrompt = document.getElementById('namePrompt');
        if (oldPrompt) oldPrompt.remove();

        content.appendChild(namePrompt);

        // Handle join
        const joinHandler = () => {
            const input = document.getElementById('playerNameInput');
            const name = input.value.trim() || 'Player';
            this.playerName = name;
            this.send({
                type: 'join',
                name: name
            });
            namePrompt.remove();
        };

        document.getElementById('joinButton').addEventListener('click', joinHandler);
        document.getElementById('playerNameInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') joinHandler();
        });

        document.getElementById('playerNameInput').focus();
    }

    showOpponentPanel() {
        const panel = document.getElementById('opponentPanel');
        if (panel) {
            panel.classList.remove('hidden');
            document.getElementById('opponentNameDisplay').textContent = this.opponentName;
        }
    }

    hideOpponentPanel() {
        const panel = document.getElementById('opponentPanel');
        if (panel) {
            panel.classList.add('hidden');
        }
    }

    updateStatus(message) {
        const statusEl = document.getElementById('connectionStatus');
        if (statusEl) {
            statusEl.textContent = message;
        }
        console.log('📡', message);
    }

    updateOpponentStatus(message) {
        const statusEl = document.getElementById('opponentStatus');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    sendGameState() {
        if (!this.connected || !this.roomId) return;

        const state = {
            y: this.game.player.y,
            velocity: this.game.player.velocity,
            rotation: this.game.player.rotation,
            score: this.game.score,
            alive: this.game.gameState === 'playing'
        };

        this.send({
            type: 'gameState',
            state: state
        });
    }

    sendPlayerDied() {
        if (!this.connected || !this.roomId) return;

        this.send({
            type: 'playerDied',
            score: this.game.score
        });
    }

    sendRestart() {
        if (!this.connected || !this.roomId) return;

        this.send({
            type: 'restart'
        });
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    drawOpponent(ctx) {
        if (!this.opponentState || !this.opponentAlive) return;

        const opponentX = 650; // Right side of screen
        const p = {
            x: opponentX,
            y: this.opponentState.y,
            width: 40,
            height: 40,
            rotation: this.opponentState.rotation,
            color: '#ff69b4' // Katie's color - pink!
        };

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);

        // Make opponent slightly transparent
        ctx.globalAlpha = 0.7;

        const size = p.width;

        // Draw opponent (similar to player)
        ctx.fillStyle = p.color;
        ctx.fillRect(-size/2, -size/2, size, size);

        // Face
        ctx.fillStyle = '#ffb6d9';
        ctx.fillRect(-size/2 + 5, -size/2 + 5, size - 10, size - 10);

        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(-size/4 - 5, -size/4, 8, 8);
        ctx.fillRect(size/4 - 3, -size/4, 8, 8);

        // Heart symbol for Katie
        ctx.fillStyle = '#ff1493';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('♥', 0, 0);

        ctx.restore();

        // Draw opponent name
        ctx.fillStyle = '#ff69b4';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.opponentName, opponentX, this.opponentState.y - 40);

        // Draw opponent score
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText(`Score: ${this.opponentState.score}`, opponentX, this.opponentState.y - 25);
    }

    showGameComparison() {
        // This could show who won, scores comparison, etc.
        console.log('🏆 Game ended!');
        const myScore = this.game.score;
        const opponentScore = this.opponentState ? this.opponentState.score : 0;

        let resultMessage = '';
        if (myScore > opponentScore) {
            resultMessage = `🎉 You won! ${myScore} vs ${opponentScore}`;
        } else if (myScore < opponentScore) {
            resultMessage = `${this.opponentName} won! ${opponentScore} vs ${myScore}`;
        } else {
            resultMessage = `🤝 Tie game! Both scored ${myScore}`;
        }

        this.updateOpponentStatus(resultMessage);
    }

    // Keep-alive ping
    startKeepAlive() {
        setInterval(() => {
            if (this.connected) {
                this.send({ type: 'ping' });
            }
        }, 30000); // Every 30 seconds
    }
}

// Initialize multiplayer when game loads
let multiplayer = null;

window.addEventListener('load', () => {
    // Wait for game to be created
    setTimeout(() => {
        if (window.game) {
            multiplayer = new MultiplayerManager(window.game);
            multiplayer.connect();
            multiplayer.startKeepAlive();

            // Hook into game events
            const originalGameOver = window.game.gameOver.bind(window.game);
            window.game.gameOver = function() {
                originalGameOver();
                if (multiplayer) {
                    multiplayer.sendPlayerDied();
                }
            };

            const originalReset = window.game.reset.bind(window.game);
            window.game.reset = function() {
                originalReset();
                if (multiplayer) {
                    multiplayer.sendRestart();
                }
            };

            // Override draw to include opponent
            const originalDraw = window.game.draw.bind(window.game);
            window.game.draw = function() {
                originalDraw();
                if (multiplayer && window.game.gameState === 'playing') {
                    multiplayer.drawOpponent(window.game.ctx);
                }
            };

            // Send game state periodically
            setInterval(() => {
                if (multiplayer && window.game.gameState === 'playing') {
                    multiplayer.sendGameState();
                }
            }, 50); // 20 times per second
        }
    }, 100);
});
