// HARDCORE MODE - Skilled players seeking mastery
// ===== FLAPPY NATHANIAS - THE ULTIMATE SC2 BIRD EXPERIENCE =====

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Game state
        this.gameState = 'start'; // start, playing, paused, gameOver
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.frameCount = 0;
        this.multiplier = 1;

        // Player (Nathanias)
        this.player = {
            x: 150,
            y: this.height / 2,
            width: 40,
            height: 40,
            velocity: 0,
            gravity: 0.6,
            jumpStrength: -9.5,
            rotation: 0,
            color: '#ffd700'
        };

        // Obstacles (Pipes)
        this.obstacles = [];
        this.obstacleFrequency = 150; // frames between obstacles
        this.obstacleSpeed = 4;
        this.gapSize = 150;
        this.minObstacleSpacing = 200; // minimum pixel spacing between obstacles

        // Power-ups
        this.powerUps = [];
        this.activePowerUps = [];
        this.powerUpTypes = [
            { name: 'Shield', emoji: '🛡️', duration: 200, effect: 'shield' },
            { name: 'Slow Motion', emoji: '⏱️', duration: 120, effect: 'slowmo' },
            { name: 'Score Boost', emoji: '⭐', duration: 160, effect: 'scoreboost' },
            { name: 'Tiny Mode', emoji: '🔬', duration: 134, effect: 'tiny' }
        ];

        // Collectibles
        this.collectibles = [];

        // Particles
        this.particles = [];

        // Run statistics
        this.runStats = {
            powerUpsCollected: 0,
            bonusesCollected: 0,
            obstaclesPassed: 0,
            maxMultiplier: 1
        };

        // Background
        this.clouds = this.generateClouds();
        this.backgroundOffset = 0;

        // Setup
        this.setupEventListeners();
        this.updateUI();
        this.startGameLoop();
    }

    // ===== GAME LOOP =====
    startGameLoop() {
        const targetFPS = 60;
        const frameDelay = 1000 / targetFPS;
        let lastFrameTime = 0;

        const loop = (currentTime) => {
            const deltaTime = currentTime - lastFrameTime;

            if (deltaTime >= frameDelay) {
                this.update();
                this.draw();
                lastFrameTime = currentTime - (deltaTime % frameDelay);
            }

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    update() {
        if (this.gameState !== 'playing') return;

        this.frameCount++;

        // Update player
        this.updatePlayer();

        // Update obstacles
        this.updateObstacles();

        // Update power-ups
        this.updatePowerUps();

        // Update collectibles
        this.updateCollectibles();

        // Update particles
        this.updateParticles();

        // Update background
        this.backgroundOffset -= this.getGameSpeed() * 0.5;

        // Spawn obstacles (with minimum spacing check)
        if (this.frameCount % Math.floor(this.obstacleFrequency / this.getGameSpeed()) === 0) {
            // Check if last obstacle is far enough away
            if (this.obstacles.length === 0 ||
                this.width - this.obstacles[this.obstacles.length - 1].x >= this.minObstacleSpacing) {
                this.spawnObstacle();
            }
        }

        // Spawn power-ups (roguelike element)
        if (Math.random() < 0.003 && this.powerUps.length < 2) {
            this.spawnPowerUp();
        }

        // Spawn collectibles
        if (Math.random() < 0.005 && this.collectibles.length < 3) {
            this.spawnCollectible();
        }

        // Check collisions
        this.checkCollisions();

        // Update multiplier based on score
        this.updateMultiplier();

        // Update active power-up durations
        this.updateActivePowerUps();

        // Update UI
        this.updateUI();
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw background
        this.drawBackground();

        if (this.gameState === 'start') return;

        // Draw collectibles
        this.collectibles.forEach(c => this.drawCollectible(c));

        // Draw obstacles
        this.obstacles.forEach(o => this.drawObstacle(o));

        // Draw power-ups
        this.powerUps.forEach(p => this.drawPowerUp(p));

        // Draw particles
        this.particles.forEach(p => this.drawParticle(p));

        // Draw player (Nathanias)
        this.drawPlayer();

        // Draw active effects
        this.drawActiveEffects();
    }

    // ===== PLAYER =====
    updatePlayer() {
        const speedMod = this.hasEffect('slowmo') ? 0.5 : 1;

        this.player.velocity += this.player.gravity * speedMod;
        this.player.y += this.player.velocity;

        // Rotation based on velocity
        this.player.rotation = Math.min(Math.max(this.player.velocity * 3, -30), 90);

        // Boundaries
        if (this.player.y > this.height - this.player.height / 2) {
            this.player.y = this.height - this.player.height / 2;
            this.gameOver();
        }

        if (this.player.y < this.player.height / 2) {
            this.player.y = this.player.height / 2;
            this.player.velocity = 0;
        }
    }

    drawPlayer() {
        const ctx = this.ctx;
        const p = this.player;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);

        // Apply effects
        if (this.hasEffect('ghost')) {
            ctx.globalAlpha = 0.5;
        }

        const size = this.hasEffect('tiny') ? p.width * 0.6 : p.width;

        // Draw Nathanias (simplified character)
        // Body
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-size/2, -size/2, size, size);

        // Face
        ctx.fillStyle = '#ffed4e';
        ctx.fillRect(-size/2 + 5, -size/2 + 5, size - 10, size - 10);

        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(-size/4 - 5, -size/4, 8, 8);
        ctx.fillRect(size/4 - 3, -size/4, 8, 8);

        // Microphone
        ctx.fillStyle = '#333';
        ctx.fillRect(size/2 - 3, size/4, 10, 15);
        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.arc(size/2 + 2, size/4, 6, 0, Math.PI * 2);
        ctx.fill();

        // Text "N"
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('N', 0, 0);

        // Shield effect
        if (this.hasEffect('shield')) {
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, size/2 + 10 + Math.sin(this.frameCount * 0.1) * 3, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    jump() {
        if (this.gameState !== 'playing') return;

        // Scale jump strength to match slow motion physics
        const speedMod = this.hasEffect('slowmo') ? 0.5 : 1;
        this.player.velocity = this.player.jumpStrength * speedMod;

        // Create particles
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: Math.random() * 2 - 3,
                vy: Math.random() * 2 - 1,
                life: 20,
                color: '#ffd700'
            });
        }
    }

    // ===== OBSTACLES =====
    spawnObstacle() {
        const minHeight = 100;
        const maxHeight = this.height - this.gapSize - minHeight;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

        // Roguelike variation: different obstacle types
        const types = ['normal', 'moving', 'narrow', 'wide'];
        const type = types[Math.floor(Math.random() * types.length)];

        let gapSize = this.gapSize;
        if (type === 'narrow') gapSize -= 30;
        if (type === 'wide') gapSize += 40;

        this.obstacles.push({
            x: this.width,
            topHeight: topHeight,
            bottomY: topHeight + gapSize,
            width: 60,
            passed: false,
            type: type,
            moveOffset: 0,
            moveSpeed: 1,
            color: this.getObstacleColor()
        });
    }

    getObstacleColor() {
        const colors = ['#4ade80', '#fbbf24', '#f87171', '#a78bfa', '#60a5fa'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateObstacles() {
        const speed = this.getGameSpeed();

        this.obstacles.forEach(o => {
            o.x -= speed;

            // Moving obstacles (roguelike element)
            if (o.type === 'moving') {
                o.moveOffset = Math.sin(this.frameCount * 0.05) * 30;
            }

            // Score when passing obstacle
            if (!o.passed && o.x + o.width < this.player.x) {
                o.passed = true;
                this.score += Math.floor(10 * this.multiplier);
                this.runStats.obstaclesPassed++;

                // Combo effect
                this.createScorePopup(o.x, this.height / 2);
            }
        });

        // Remove off-screen obstacles
        this.obstacles = this.obstacles.filter(o => o.x > -o.width);
    }

    drawObstacle(o) {
        const ctx = this.ctx;

        // Apply moving offset if applicable
        const offset = o.moveOffset || 0;

        // Top pipe
        ctx.fillStyle = o.color;
        ctx.fillRect(o.x, 0, o.width, o.topHeight + offset);

        // Pipe cap
        ctx.fillStyle = this.lightenColor(o.color, 20);
        ctx.fillRect(o.x - 5, o.topHeight + offset - 20, o.width + 10, 20);

        // Bottom pipe
        ctx.fillStyle = o.color;
        ctx.fillRect(o.x, o.bottomY + offset, o.width, this.height - (o.bottomY + offset));

        // Pipe cap
        ctx.fillStyle = this.lightenColor(o.color, 20);
        ctx.fillRect(o.x - 5, o.bottomY + offset, o.width + 10, 20);

        // SC2 detail
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SC2', o.x + o.width/2, o.topHeight + offset - 30);
    }

    // ===== POWER-UPS =====
    spawnPowerUp() {
        const type = this.powerUpTypes[Math.floor(Math.random() * this.powerUpTypes.length)];

        this.powerUps.push({
            x: this.width,
            y: Math.random() * (this.height - 100) + 50,
            width: 30,
            height: 30,
            type: type,
            bobOffset: Math.random() * Math.PI * 2
        });
    }

    updatePowerUps() {
        const speed = this.getGameSpeed();

        this.powerUps.forEach(p => {
            p.x -= speed;
        });

        this.powerUps = this.powerUps.filter(p => p.x > -p.width);
    }

    drawPowerUp(p) {
        const ctx = this.ctx;
        const bob = Math.sin(this.frameCount * 0.05 + p.bobOffset) * 5;

        // Glow effect
        ctx.save();
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 15;

        // Draw power-up
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.type.emoji, p.x + p.width/2, p.y + bob);

        ctx.restore();
    }

    updateActivePowerUps() {
        this.activePowerUps.forEach(p => {
            p.duration--;
        });

        this.activePowerUps = this.activePowerUps.filter(p => p.duration > 0);
        this.updatePowerUpsDisplay();
    }

    hasEffect(effect) {
        return this.activePowerUps.some(p => p.effect === effect);
    }

    // ===== COLLECTIBLES =====
    spawnCollectible() {
        this.collectibles.push({
            x: this.width,
            y: Math.random() * (this.height - 100) + 50,
            width: 20,
            height: 20,
            value: Math.floor(Math.random() * 5 + 1) * 10,
            rotation: 0
        });
    }

    updateCollectibles() {
        const speed = this.getGameSpeed();

        this.collectibles.forEach(c => {
            c.x -= speed;
            c.rotation += 0.1;
        });

        this.collectibles = this.collectibles.filter(c => c.x > -c.width);
    }

    drawCollectible(c) {
        const ctx = this.ctx;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);

        // Draw mineral (SC2 style)
        ctx.fillStyle = '#00bfff';
        ctx.beginPath();
        ctx.moveTo(0, -c.height/2);
        ctx.lineTo(c.width/2, 0);
        ctx.lineTo(0, c.height/2);
        ctx.lineTo(-c.width/2, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#87ceeb';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    // ===== PARTICLES =====
    updateParticles() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // gravity
            p.life--;
        });

        this.particles = this.particles.filter(p => p.life > 0);
    }

    drawParticle(p) {
        const ctx = this.ctx;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 20;
        ctx.fillRect(p.x, p.y, 4, 4);
        ctx.globalAlpha = 1;
    }

    // ===== COLLISIONS =====
    checkCollisions() {
        const playerSize = this.hasEffect('tiny') ? this.player.width * 0.6 : this.player.width;

        // Check obstacle collisions
        this.obstacles.forEach(o => {
            const offset = o.moveOffset || 0;

            if (this.player.x + playerSize/2 > o.x &&
                this.player.x - playerSize/2 < o.x + o.width) {

                if (this.player.y - playerSize/2 < o.topHeight + offset ||
                    this.player.y + playerSize/2 > o.bottomY + offset) {

                    if (!this.hasEffect('shield') && !this.hasEffect('ghost')) {
                        this.gameOver();
                    } else if (this.hasEffect('shield')) {
                        // Remove shield
                        this.activePowerUps = this.activePowerUps.filter(p => p.effect !== 'shield');
                        this.createExplosion(this.player.x, this.player.y, '#00bfff');
                    }
                }
            }
        });

        // Check power-up collisions
        this.powerUps = this.powerUps.filter(p => {
            if (this.checkCircleCollision(
                this.player.x, this.player.y, playerSize/2,
                p.x, p.y, p.width/2
            )) {
                this.collectPowerUp(p);
                return false;
            }
            return true;
        });

        // Check collectible collisions
        this.collectibles = this.collectibles.filter(c => {
            if (this.checkCircleCollision(
                this.player.x, this.player.y, playerSize/2,
                c.x, c.y, c.width/2
            )) {
                this.collectBonus(c);
                return false;
            }
            return true;
        });
    }

    checkCircleCollision(x1, y1, r1, x2, y2, r2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < r1 + r2;
    }

    collectPowerUp(powerUp) {
        this.activePowerUps.push({
            ...powerUp.type,
            duration: powerUp.type.duration
        });

        this.runStats.powerUpsCollected++;
        this.createExplosion(powerUp.x, powerUp.y, '#ffd700');
        this.updatePowerUpsDisplay();
    }

    collectBonus(collectible) {
        const bonusScore = collectible.value * this.multiplier;
        this.score += bonusScore;
        this.runStats.bonusesCollected++;
        this.createScorePopup(collectible.x, collectible.y, `+${bonusScore}`);
        this.createExplosion(collectible.x, collectible.y, '#00bfff');
    }

    // ===== EFFECTS =====
    createExplosion(x, y, color) {
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 * i) / 15;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * 4,
                vy: Math.sin(angle) * 4,
                life: 30,
                color: color
            });
        }
    }

    createScorePopup(x, y, text = '+10') {
        // This would typically be a DOM element or canvas text animation
        // For simplicity, we'll use particles
        this.createExplosion(x, y, '#ffd700');
    }

    drawActiveEffects() {
        // Visual effects overlay
        if (this.hasEffect('slowmo')) {
            this.ctx.fillStyle = 'rgba(100, 100, 255, 0.1)';
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        if (this.hasEffect('scoreboost')) {
            this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
            this.ctx.lineWidth = 5;
            this.ctx.strokeRect(5, 5, this.width - 10, this.height - 10);
        }
    }

    // ===== BACKGROUND =====
    generateClouds() {
        const clouds = [];
        for (let i = 0; i < 8; i++) {
            clouds.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height * 0.6,
                width: Math.random() * 80 + 40,
                height: Math.random() * 40 + 20,
                speed: Math.random() * 0.5 + 0.2
            });
        }
        return clouds;
    }

    drawBackground() {
        const ctx = this.ctx;

        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(1, '#e0f6ff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // Clouds
        this.clouds.forEach(cloud => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.ellipse(
                cloud.x + this.backgroundOffset * cloud.speed,
                cloud.y,
                cloud.width,
                cloud.height,
                0, 0, Math.PI * 2
            );
            ctx.fill();

            // Wrap around
            if (cloud.x + this.backgroundOffset * cloud.speed < -cloud.width) {
                cloud.x += this.width + cloud.width * 2;
            }
        });

        // Ground
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(0, this.height - 30, this.width, 30);
        ctx.fillStyle = '#a0826d';
        ctx.fillRect(0, this.height - 30, this.width, 5);
    }

    // ===== GAME LOGIC =====
    getGameSpeed() {
        let speed = this.obstacleSpeed;

        // Increase speed after 15 obstacles (difficulty scaling)
        if (this.runStats.obstaclesPassed > 15) {
            const obstaclesPastThreshold = this.runStats.obstaclesPassed - 15;
            speed += Math.floor(obstaclesPastThreshold / 10) * 0.5;
        }

        // Slow motion effect
        if (this.hasEffect('slowmo')) {
            speed *= 0.5;
        }

        return speed;
    }

    updateMultiplier() {
        // Increase multiplier based on score
        const newMultiplier = Math.floor(this.score / 30) + 1;

        if (this.hasEffect('scoreboost')) {
            this.multiplier = newMultiplier * 2;
        } else {
            this.multiplier = newMultiplier;
        }

        if (this.multiplier > this.runStats.maxMultiplier) {
            this.runStats.maxMultiplier = this.multiplier;
        }
    }

    gameOver() {
        if (this.gameState === 'gameOver') return;

        this.gameState = 'gameOver';

        // Save high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore(this.highScore);
        }

        // Show game over screen
        this.showGameOverScreen();
    }

    reset() {
        this.gameState = 'playing';
        this.score = 0;
        this.frameCount = 0;
        this.multiplier = 1;

        this.player.y = this.height / 2;
        this.player.velocity = 0;

        this.obstacles = [];
        this.powerUps = [];
        this.activePowerUps = [];
        this.collectibles = [];
        this.particles = [];

        this.runStats = {
            powerUpsCollected: 0,
            bonusesCollected: 0,
            obstaclesPassed: 0,
            maxMultiplier: 1
        };

        this.updateUI();
        this.updatePowerUpsDisplay();
    }

    // ===== UI =====
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
        document.getElementById('multiplier').textContent = this.multiplier + 'x';
    }

    updatePowerUpsDisplay() {
        const display = document.getElementById('powerUpsDisplay');

        if (this.activePowerUps.length === 0) {
            display.innerHTML = '<div style="color: rgba(255,255,255,0.5);">No active power-ups</div>';
            return;
        }

        display.innerHTML = this.activePowerUps.map(p =>
            `<div class="power-up-item">${p.emoji} ${p.name} (${Math.ceil(p.duration / 60)}s)</div>`
        ).join('');
    }

    showGameOverScreen() {
        const screen = document.getElementById('gameOverScreen');
        const finalScore = document.getElementById('finalScore');
        const highScoreMsg = document.getElementById('highScoreMessage');
        const runStats = document.getElementById('runStats');

        finalScore.textContent = `Final Score: ${this.score}`;

        if (this.score === this.highScore && this.score > 0) {
            highScoreMsg.textContent = '🎉 NEW HIGH SCORE! 🎉';
        } else {
            highScoreMsg.textContent = `High Score: ${this.highScore}`;
        }

        runStats.innerHTML = `
            <h3 style="text-align: center; margin-bottom: 10px;">Run Statistics</h3>
            <div>🎯 Obstacles Passed: ${this.runStats.obstaclesPassed}</div>
            <div>⚡ Power-ups Collected: ${this.runStats.powerUpsCollected}</div>
            <div>💎 Bonuses Collected: ${this.runStats.bonusesCollected}</div>
            <div>🔥 Max Multiplier: ${this.runStats.maxMultiplier}x</div>
        `;

        screen.classList.remove('hidden');
    }

    // ===== STORAGE =====
    loadHighScore() {
        const saved = localStorage.getItem('flappyNathanias_highScore');
        return saved ? parseInt(saved) : 0;
    }

    saveHighScore(score) {
        localStorage.setItem('flappyNathanias_highScore', score.toString());
    }

    // ===== UTILITIES =====
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#",""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
            (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255))
            .toString(16).slice(1);
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Canvas click
        this.canvas.addEventListener('click', () => {
            if (this.gameState === 'playing') {
                this.jump();
            }
        });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.gameState === 'playing') {
                e.preventDefault();
                this.jump();
            }

            // Quick restart with space on game over
            if (e.code === 'Space' && this.gameState === 'gameOver') {
                e.preventDefault();
                document.getElementById('gameOverScreen').classList.add('hidden');
                this.reset();
            }

            if ((e.code === 'Escape' || e.code === 'KeyP') && this.gameState === 'playing') {
                this.gameState = 'paused';
                document.getElementById('pauseScreen').classList.remove('hidden');
            }

            if ((e.code === 'Escape' || e.code === 'KeyP') && this.gameState === 'paused') {
                this.gameState = 'playing';
                document.getElementById('pauseScreen').classList.add('hidden');
            }
        });

        // Start button
        document.getElementById('startButton').addEventListener('click', () => {
            document.getElementById('startScreen').classList.add('hidden');
            this.reset();
        });

        // Restart button
        document.getElementById('restartButton').addEventListener('click', () => {
            document.getElementById('gameOverScreen').classList.add('hidden');
            this.reset();
        });

        // Resume button
        document.getElementById('resumeButton').addEventListener('click', () => {
            document.getElementById('pauseScreen').classList.add('hidden');
            this.gameState = 'playing';
        });
    }
}

// ===== INITIALIZE GAME =====
let game;
window.addEventListener('load', () => {
    game = new Game();
});
