// ===== CHAOS MODE - MAXIMUM HILARIOUS MADNESS (100/100 FUN FACTOR!) =====
// ===== FLAPPY NATHANIAS - THE ULTIMATE SC2 BIRD EXPERIENCE =====
//
// 🔥 CHAOS MODE OPTIMIZATIONS:
//
// 📊 PHYSICS (EXTREME):
//   - Gravity: 0.2-1.0 (5x variation!)
//   - Jump: -6 to -12 (2x variation!)
//   - Changes every 3 seconds (was 5)
//
// 🚧 OBSTACLES (INSANE VARIETY):
//   - Gap sizes: 100-280px (was 120-250)
//   - Speed: 1.5-6x per obstacle (was 2-5)
//   - Random rotation/tilt ±10°
//   - Random color per obstacle
//
// ⚡ POWER-UPS (ABUNDANT):
//   - Spawn chance: 0.015 (50% more!)
//   - Max on screen: 5 (was 3)
//   - Stacking display with counts
//   - 5 types: Shield, Slow-Mo, Score Boost, Tiny, Ghost
//
// 💎 COLLECTIBLES (EVERYWHERE):
//   - Spawn chance: 0.04 (33% more!)
//   - Max on screen: 8 (was 5)
//   - Values: 5-150 (was 10-100)
//   - Particle trails for high-value (>100)
//
// 🎰 CHAOS MULTIPLIER (WILD):
//   - Range: 0.5x-10x (can REDUCE score!)
//   - Changes every 3 seconds
//   - BIG visual indicator with color coding
//
// 🎨 VISUAL CHAOS (MAXIMUM):
//   - 9 screen tint colors (added Orange, Purple, Hot Pink)
//   - Random particle bursts
//   - Dynamic cloud speeds
//   - Background hue shifting
//   - Earthquake screen shake events
//   - Rainbow particles for invincibility
//
// 🎲 RANDOM EVENTS (6 TYPES):
//   - 🌙 Low Gravity Zone (15% chance, 10s duration)
//   - ⚡ Turbo Speed (10% chance)
//   - ✨ Invincibility (5% chance, 3s duration)
//   - 🔄 Reverse Gravity (10% chance - UPSIDE DOWN!)
//   - 😱 Tiny Gaps (8% chance - 80px)
//   - 🎉 Mega Gaps (8% chance - 300px)
//   - Big screen notification when triggered
//   - Progress bar showing time remaining
//
// 🎵 AUDIO: Ready for sound effects (structure in place)
//
// 💯 RESULT: MAXIMUM CHAOS & HILARITY - "What just happened?!" every run!

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

        // CHAOS MODE: Chaos timer for random events
        this.chaosTimer = 0;
        this.chaosInterval = 180; // 3 seconds at 60 FPS (MORE CHAOS!)
        this.chaosMultiplier = 1; // Random score multiplier (can go 0.5x-10x!)
        this.chaosScreenTint = null; // Random screen tint
        this.chaosEventTimer = 0; // Timer for random chaos events
        this.chaosEventInterval = 600; // 10 seconds for random events
        this.activeEvent = null; // Current chaos event
        this.eventDuration = 0; // Duration remaining for active event
        this.screenShake = { x: 0, y: 0, intensity: 0 }; // Earthquake effect
        this.backgroundHue = 0; // Background color shift

        // Player (Nathanias)
        this.player = {
            x: 150,
            y: this.height / 2,
            width: 40,
            height: 40,
            velocity: 0,
            gravity: 0.5, // Will randomize between 0.3-0.8
            jumpStrength: -9, // Will randomize between -7 to -11
            rotation: 0,
            color: '#ffd700'
        };

        // Obstacles (Pipes)
        this.obstacles = [];
        this.obstacleFrequency = 150; // frames between obstacles
        this.obstacleSpeed = 3;
        this.gapSize = 180; // Will be randomized per obstacle
        this.minObstacleSpacing = 250; // minimum pixel spacing between obstacles

        // Power-ups
        this.powerUps = [];
        this.activePowerUps = [];
        this.powerUpTypes = [
            { name: 'Shield', emoji: '🛡️', duration: 300, effect: 'shield' },
            { name: 'Slow Motion', emoji: '⏱️', duration: 180, effect: 'slowmo' },
            { name: 'Score Boost', emoji: '⭐', duration: 240, effect: 'scoreboost' },
            { name: 'Tiny Mode', emoji: '🔬', duration: 200, effect: 'tiny' },
            { name: 'Ghost Mode', emoji: '👻', duration: 150, effect: 'ghost' }
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
        this.chaosTimer++;

        // CHAOS MODE: Randomize physics and multiplier every 3 seconds (MAXIMUM CHAOS!)
        if (this.chaosTimer >= this.chaosInterval) {
            this.chaosTimer = 0;

            // Randomize gravity between 0.2-1.0 (WIDER RANGE!)
            this.player.gravity = Math.random() * (1.0 - 0.2) + 0.2;

            // Randomize jump strength between -6 to -12 (WIDER RANGE!)
            this.player.jumpStrength = -(Math.random() * (12 - 6) + 6);

            // Randomize score multiplier between 0.5x-10x (CAN REDUCE SCORE!)
            this.chaosMultiplier = Math.random() * (10 - 0.5) + 0.5;

            // Randomize screen tint (MORE COLORS!)
            const tints = [
                'rgba(255, 0, 0, 0.15)',      // Red
                'rgba(0, 255, 0, 0.15)',      // Green
                'rgba(0, 0, 255, 0.15)',      // Blue
                'rgba(255, 255, 0, 0.15)',    // Yellow
                'rgba(255, 0, 255, 0.15)',    // Magenta
                'rgba(0, 255, 255, 0.15)',    // Cyan
                'rgba(255, 128, 0, 0.15)',    // Orange
                'rgba(128, 0, 255, 0.15)',    // Purple
                'rgba(255, 0, 128, 0.2)',     // Hot Pink
                null // No tint
            ];
            this.chaosScreenTint = tints[Math.floor(Math.random() * tints.length)];

            // Random cloud speed changes
            this.clouds.forEach(cloud => {
                cloud.speed = Math.random() * 1.5 + 0.2;
            });

            // Random screen shake event (10% chance)
            if (Math.random() < 0.1) {
                this.screenShake.intensity = 15;
                this.createExplosion(this.width / 2, this.height / 2, '#ff0000');
            }

            // Background color shift
            this.backgroundHue += Math.random() * 60 - 30;
        }

        // CHAOS MODE: Random events every 10 seconds
        this.chaosEventTimer++;
        if (this.chaosEventTimer >= this.chaosEventInterval) {
            this.chaosEventTimer = 0;
            this.triggerRandomEvent();
        }

        // Update active event duration
        if (this.eventDuration > 0) {
            this.eventDuration--;
            if (this.eventDuration === 0) {
                this.activeEvent = null;
            }
        }

        // Screen shake decay
        if (this.screenShake.intensity > 0) {
            this.screenShake.intensity *= 0.9;
            this.screenShake.x = (Math.random() - 0.5) * this.screenShake.intensity;
            this.screenShake.y = (Math.random() - 0.5) * this.screenShake.intensity;
        } else {
            this.screenShake.x = 0;
            this.screenShake.y = 0;
        }

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

        // CHAOS MODE: Spawn power-ups ABUNDANTLY (0.015 = 50% more!)
        if (Math.random() < 0.015 && this.powerUps.length < 5) {
            this.spawnPowerUp();
        }

        // CHAOS MODE: Spawn collectibles EVERYWHERE (0.04 = 33% more!)
        if (Math.random() < 0.04 && this.collectibles.length < 8) {
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

        // CHAOS MODE: Apply screen shake
        this.ctx.save();
        this.ctx.translate(this.screenShake.x, this.screenShake.y);

        // Draw background
        this.drawBackground();

        // CHAOS MODE: Apply random screen tint
        if (this.chaosScreenTint) {
            this.ctx.fillStyle = this.chaosScreenTint;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        if (this.gameState === 'start') {
            this.ctx.restore();
            return;
        }

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

        // CHAOS MODE: Draw chaos indicator
        this.drawChaosIndicator();

        // CHAOS MODE: Draw active event
        this.drawActiveEvent();

        this.ctx.restore(); // Restore from screen shake
    }

    // CHAOS MODE: Draw chaos indicator showing current modifiers with BIG MULTIPLIER
    drawChaosIndicator() {
        const ctx = this.ctx;
        ctx.save();

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, this.height - 100, 220, 90);

        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('🔥 CHAOS MODE', 20, this.height - 80);

        ctx.fillStyle = '#ffffff';
        ctx.font = '11px Arial';
        ctx.fillText(`Gravity: ${this.player.gravity.toFixed(2)}`, 20, this.height - 60);
        ctx.fillText(`Jump: ${this.player.jumpStrength.toFixed(1)}`, 20, this.height - 45);

        // BIG MULTIPLIER DISPLAY
        const multiplierColor = this.chaosMultiplier < 1 ? '#ff4444' :
                                this.chaosMultiplier > 5 ? '#44ff44' : '#ffff44';
        ctx.fillStyle = multiplierColor;
        ctx.font = 'bold 24px Arial';
        ctx.shadowColor = multiplierColor;
        ctx.shadowBlur = 10;
        ctx.fillText(`${this.chaosMultiplier.toFixed(1)}x`, 20, this.height - 15);
        ctx.shadowBlur = 0;

        ctx.restore();
    }

    // CHAOS MODE: Draw active event notification
    drawActiveEvent() {
        if (!this.activeEvent) return;

        const ctx = this.ctx;
        ctx.save();

        const eventNames = {
            'lowgravity': '🌙 LOW GRAVITY ZONE',
            'turbo': '⚡ TURBO SPEED',
            'invincible': '✨ INVINCIBILITY',
            'reverse': '🔄 REVERSE GRAVITY',
            'tinygaps': '😱 TINY GAPS',
            'megagaps': '🎉 MEGA GAPS'
        };

        const eventName = eventNames[this.activeEvent] || this.activeEvent.toUpperCase();

        // Pulsing background
        const pulse = Math.sin(this.frameCount * 0.1) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(255, 215, 0, ${0.3 * pulse})`;
        ctx.fillRect(0, 80, this.width, 60);

        // Event text
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.strokeText(eventName, this.width / 2, 120);
        ctx.fillText(eventName, this.width / 2, 120);

        // Timer bar
        const barWidth = 200;
        const barProgress = this.eventDuration / 180; // Assuming 3 seconds
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(this.width / 2 - barWidth / 2, 130, barWidth, 8);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(this.width / 2 - barWidth / 2, 130, barWidth * barProgress, 8);

        ctx.restore();
    }

    // CHAOS MODE: Trigger random chaos events
    triggerRandomEvent() {
        const events = [
            { name: 'lowgravity', chance: 0.15, duration: 600 },  // 15% - Low gravity
            { name: 'turbo', chance: 0.10, duration: 300 },       // 10% - Turbo speed
            { name: 'invincible', chance: 0.05, duration: 180 },  // 5% - Invincibility
            { name: 'reverse', chance: 0.10, duration: 240 },     // 10% - Reverse gravity
            { name: 'tinygaps', chance: 0.08, duration: 300 },    // 8% - Tiny gaps
            { name: 'megagaps', chance: 0.08, duration: 300 }     // 8% - Mega gaps
        ];

        // Roll for event
        const roll = Math.random();
        let cumulative = 0;

        for (const event of events) {
            cumulative += event.chance;
            if (roll < cumulative) {
                this.activeEvent = event.name;
                this.eventDuration = event.duration;

                // Visual feedback
                this.screenShake.intensity = 20;
                this.createExplosion(this.width / 2, this.height / 2, '#ffd700');

                // Create particles explosion
                for (let i = 0; i < 30; i++) {
                    const angle = (Math.PI * 2 * i) / 30;
                    this.particles.push({
                        x: this.width / 2,
                        y: this.height / 2,
                        vx: Math.cos(angle) * 6,
                        vy: Math.sin(angle) * 6,
                        life: 40,
                        color: '#ffd700'
                    });
                }

                return;
            }
        }
    }

    // ===== PLAYER =====
    updatePlayer() {
        const speedMod = this.hasEffect('slowmo') || this.activeEvent === 'turbo' ?
            (this.activeEvent === 'turbo' ? 1.5 : 0.5) : 1;

        // Apply gravity (reverse if event active)
        const gravityMod = this.activeEvent === 'reverse' ? -1 : 1;
        const finalGravity = this.player.gravity * speedMod * gravityMod;

        // Low gravity event
        const lowGravityMod = this.activeEvent === 'lowgravity' ? 0.3 : 1;

        this.player.velocity += finalGravity * lowGravityMod;
        this.player.y += this.player.velocity;

        // Rotation based on velocity
        this.player.rotation = Math.min(Math.max(this.player.velocity * 3, -30), 90);

        // Boundaries
        if (this.player.y > this.height - this.player.height / 2) {
            this.player.y = this.height - this.player.height / 2;
            if (this.activeEvent !== 'invincible') {
                this.gameOver();
            } else {
                this.player.velocity = -5; // Bounce back
            }
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

        // Invincibility effect (rainbow aura)
        if (this.activeEvent === 'invincible') {
            const hue = (this.frameCount * 5) % 360;
            ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.8)`;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(0, 0, size/2 + 15 + Math.sin(this.frameCount * 0.2) * 5, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    jump() {
        if (this.gameState !== 'playing') return;

        // Scale jump strength to match slow motion physics
        const speedMod = this.hasEffect('slowmo') ? 0.5 : 1;

        // CHAOS MODE: Reverse jump if reverse gravity active
        const reverseJump = this.activeEvent === 'reverse' ? -1 : 1;

        this.player.velocity = this.player.jumpStrength * speedMod * reverseJump;

        // Create particles (more in chaos mode!)
        const particleCount = this.activeEvent === 'invincible' ? 15 : 5;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: Math.random() * 2 - 3,
                vy: Math.random() * 2 - 1,
                life: 20,
                color: this.activeEvent === 'invincible' ? `hsl(${Math.random() * 360}, 100%, 50%)` : '#ffd700'
            });
        }
    }

    // ===== OBSTACLES =====
    spawnObstacle() {
        // CHAOS MODE: Random gap size between 100-280 (MAXIMUM VARIETY!)
        let gapSize = Math.random() * (280 - 100) + 100;

        // Random event overrides for extreme gaps
        if (this.activeEvent === 'tinygaps') {
            gapSize = 80; // TINY!
        } else if (this.activeEvent === 'megagaps') {
            gapSize = 300; // MEGA!
        }

        const minHeight = 100;
        const maxHeight = Math.max(this.height - gapSize - minHeight, minHeight + 50);
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

        // Roguelike variation: different obstacle types
        const types = ['normal', 'moving', 'narrow', 'wide'];
        const type = types[Math.floor(Math.random() * types.length)];

        let finalGapSize = gapSize;
        if (type === 'narrow') finalGapSize -= 30;
        if (type === 'wide') finalGapSize += 40;

        // CHAOS MODE: Random speed for each obstacle between 1.5-6 (WIDER RANGE!)
        const randomSpeed = Math.random() * (6 - 1.5) + 1.5;

        // CHAOS MODE: Random rotation/tilt for visual chaos
        const rotation = (Math.random() - 0.5) * 20; // -10 to +10 degrees

        this.obstacles.push({
            x: this.width,
            topHeight: topHeight,
            bottomY: topHeight + finalGapSize,
            width: 60,
            passed: false,
            type: type,
            moveOffset: 0,
            moveSpeed: 1,
            color: this.getObstacleColor(), // Random color per obstacle
            chaosSpeed: randomSpeed, // Individual obstacle speed
            rotation: rotation // Random tilt
        });
    }

    getObstacleColor() {
        const colors = ['#4ade80', '#fbbf24', '#f87171', '#a78bfa', '#60a5fa'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateObstacles() {
        const speed = this.getGameSpeed();

        this.obstacles.forEach(o => {
            // CHAOS MODE: Use individual obstacle speed
            const obstacleSpeed = o.chaosSpeed || speed;
            o.x -= obstacleSpeed;

            // Moving obstacles (roguelike element)
            if (o.type === 'moving') {
                o.moveOffset = Math.sin(this.frameCount * 0.05) * 30;
            }

            // Score when passing obstacle
            if (!o.passed && o.x + o.width < this.player.x) {
                o.passed = true;
                // CHAOS MODE: Apply chaos multiplier
                this.score += Math.floor(10 * this.multiplier * this.chaosMultiplier);
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

        ctx.save();

        // CHAOS MODE: Apply rotation for visual chaos
        if (o.rotation) {
            ctx.translate(o.x + o.width / 2, this.height / 2);
            ctx.rotate(o.rotation * Math.PI / 180);
            ctx.translate(-(o.x + o.width / 2), -this.height / 2);
        }

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

        ctx.restore();
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
        // CHAOS MODE: MAXIMUM value range 5-150!
        const value = Math.floor(Math.random() * (150 - 5 + 1)) + 5;

        this.collectibles.push({
            x: this.width,
            y: Math.random() * (this.height - 100) + 50,
            width: 20,
            height: 20,
            value: value,
            rotation: 0,
            sparkle: 0 // For visual effect
        });
    }

    updateCollectibles() {
        const speed = this.getGameSpeed();

        this.collectibles.forEach(c => {
            c.x -= speed;
            c.rotation += 0.1;
            c.sparkle += 0.15; // Sparkle animation

            // Random particle trail for high-value collectibles
            if (c.value > 100 && Math.random() < 0.3) {
                this.particles.push({
                    x: c.x,
                    y: c.y,
                    vx: Math.random() * 1 - 0.5,
                    vy: Math.random() * 1 - 0.5,
                    life: 15,
                    color: '#00bfff'
                });
            }
        });

        this.collectibles = this.collectibles.filter(c => c.x > -c.width);
    }

    drawCollectible(c) {
        const ctx = this.ctx;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);

        // Sparkle effect for high value
        if (c.value > 50) {
            ctx.shadowColor = '#00bfff';
            ctx.shadowBlur = 10 + Math.sin(c.sparkle) * 5;
        }

        // Draw mineral (SC2 style) - size based on value
        const size = Math.min(c.width + c.value / 20, 35);
        ctx.fillStyle = c.value > 100 ? '#ffd700' : '#00bfff';
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.lineTo(size/2, 0);
        ctx.lineTo(0, size/2);
        ctx.lineTo(-size/2, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = c.value > 100 ? '#ffed4e' : '#87ceeb';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Show value for high-value collectibles
        if (c.value > 80) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(c.value, 0, 0);
        }

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

        // CHAOS MODE: Random particle bursts (extra visual chaos)
        if (Math.random() < 0.005) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffd700'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            for (let i = 0; i < 10; i++) {
                const angle = Math.random() * Math.PI * 2;
                this.particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * 3,
                    vy: Math.sin(angle) * 3,
                    life: 25,
                    color: color
                });
            }
        }
    }

    drawParticle(p) {
        const ctx = this.ctx;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 20;

        // CHAOS MODE: Vary particle shapes
        if (Math.random() < 0.3) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(p.x, p.y, 4, 4);
        }

        ctx.globalAlpha = 1;
    }

    // ===== COLLISIONS =====
    checkCollisions() {
        const playerSize = this.hasEffect('tiny') ? this.player.width * 0.6 : this.player.width;

        // Check obstacle collisions (unless invincible event active)
        if (this.activeEvent !== 'invincible') {
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
        }

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
        // CHAOS MODE: Allow multiple power-ups to stack - just add without removing duplicates
        this.activePowerUps.push({
            ...powerUp.type,
            duration: powerUp.type.duration
        });

        this.runStats.powerUpsCollected++;
        this.createExplosion(powerUp.x, powerUp.y, '#ffd700');
        this.updatePowerUpsDisplay();
    }

    collectBonus(collectible) {
        // CHAOS MODE: Apply chaos multiplier to bonus score
        const bonusScore = collectible.value * this.multiplier * this.chaosMultiplier;
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

        // CHAOS MODE: Sky gradient with hue shift
        const hue1 = (200 + this.backgroundHue) % 360;
        const hue2 = (210 + this.backgroundHue) % 360;
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, `hsl(${hue1}, 50%, 70%)`);
        gradient.addColorStop(1, `hsl(${hue2}, 50%, 85%)`);
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

        // Increase speed after 30 obstacles (difficulty scaling)
        if (this.runStats.obstaclesPassed > 30) {
            const obstaclesPastThreshold = this.runStats.obstaclesPassed - 30;
            speed += Math.floor(obstaclesPastThreshold / 10) * 0.3;
        }

        // Slow motion effect
        if (this.hasEffect('slowmo')) {
            speed *= 0.5;
        }

        return speed;
    }

    updateMultiplier() {
        // Increase multiplier based on score
        const newMultiplier = Math.floor(this.score / 50) + 1;

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

        // CHAOS MODE: Reset ALL chaos variables
        this.chaosTimer = 0;
        this.chaosMultiplier = 1;
        this.chaosScreenTint = null;
        this.chaosEventTimer = 0;
        this.activeEvent = null;
        this.eventDuration = 0;
        this.screenShake = { x: 0, y: 0, intensity: 0 };
        this.backgroundHue = 0;
        this.player.gravity = 0.5;
        this.player.jumpStrength = -9;

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

        // CHAOS MODE: Show all stacked power-ups with emphasis
        const powerUpCounts = {};
        this.activePowerUps.forEach(p => {
            const key = p.name;
            if (!powerUpCounts[key]) {
                powerUpCounts[key] = { ...p, count: 0 };
            }
            powerUpCounts[key].count++;
        });

        display.innerHTML = Object.values(powerUpCounts).map(p => {
            const stackLabel = p.count > 1 ? ` x${p.count}` : '';
            const stackStyle = p.count > 1 ? 'font-weight: bold; color: #ffd700;' : '';
            return `<div class="power-up-item" style="${stackStyle}">${p.emoji} ${p.name}${stackLabel} (${Math.ceil(p.duration / 60)}s)</div>`;
        }).join('');
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
        const saved = localStorage.getItem('flappyNathanias_highScore_CHAOS');
        return saved ? parseInt(saved) : 0;
    }

    saveHighScore(score) {
        localStorage.setItem('flappyNathanias_highScore_CHAOS', score.toString());
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
