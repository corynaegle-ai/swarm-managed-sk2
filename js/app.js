/**
 * Scorekeeper Application
 * Mobile-responsive scorekeeper for tracking game scores
 */

class Scorekeeper {
    constructor() {
        this.players = [];
        this.maxPlayers = 6;
        this.startingScore = 0;
        this.pointsInput = 1;
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.renderScoreboard();
        this.addDefaultPlayers();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        const addPlayerBtn = document.getElementById('addPlayerBtn');
        const resetBtn = document.getElementById('resetBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        const closeSettingsBtn = document.getElementById('closeSettingsBtn');
        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        const pointsInput = document.getElementById('pointsInput');
        const quickInputBtns = document.querySelectorAll('.quick-input-btn');
        const settingsModal = document.getElementById('settingsModal');

        // Add player button
        if (addPlayerBtn) {
            addPlayerBtn.addEventListener('click', () => this.addPlayer());
        }

        // Reset button
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetScores());
        }

        // Settings button
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }

        // Close settings button
        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        }

        // Save settings button
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }

        // Close modal on outside click
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) {
                    this.closeSettings();
                }
            });
        }

        // Points input change
        if (pointsInput) {
            pointsInput.addEventListener('change', (e) => {
                this.pointsInput = parseInt(e.target.value) || 1;
            });
        }

        // Quick input buttons
        quickInputBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const value = parseInt(e.target.dataset.value);
                this.pointsInput = value;
                if (pointsInput) {
                    pointsInput.value = value;
                }
            });
        });
    }

    /**
     * Add default players to the scoreboard
     */
    addDefaultPlayers() {
        if (this.players.length === 0) {
            for (let i = 1; i <= 2; i++) {
                this.players.push({
                    id: this.generateId(),
                    name: `Player ${i}`,
                    score: this.startingScore
                });
            }
            this.renderScoreboard();
        }
    }

    /**
     * Add a new player
     */
    addPlayer() {
        if (this.players.length >= this.maxPlayers) {
            this.showNotification(`Maximum ${this.maxPlayers} players allowed`);
            return;
        }

        const newPlayer = {
            id: this.generateId(),
            name: `Player ${this.players.length + 1}`,
            score: this.startingScore
        };

        this.players.push(newPlayer);
        this.renderScoreboard();
        this.scrollToBottom();
    }

    /**
     * Remove a player
     */
    removePlayer(id) {
        if (this.players.length <= 2) {
            this.showNotification('At least 2 players required');
            return;
        }

        this.players = this.players.filter(p => p.id !== id);
        this.renderScoreboard();
    }

    /**
     * Update player score
     */
    updateScore(id, delta) {
        const player = this.players.find(p => p.id === id);
        if (player) {
            player.score += delta;
            this.renderScoreboard();
        }
    }

    /**
     * Update player name
     */
    updatePlayerName(id, name) {
        const player = this.players.find(p => p.id === id);
        if (player && name.trim()) {
            player.name = name.trim();
            this.renderScoreboard();
        }
    }

    /**
     * Reset all scores
     */
    resetScores() {
        if (confirm('Reset all scores to starting value?')) {
            this.players.forEach(p => {
                p.score = this.startingScore;
            });
            this.renderScoreboard();
        }
    }

    /**
     * Render the scoreboard
     */
    renderScoreboard() {
        const scoreboard = document.getElementById('scoreboard');
        if (!scoreboard) return;

        scoreboard.innerHTML = '';

        this.players.forEach(player => {
            const card = this.createPlayerCard(player);
            scoreboard.appendChild(card);
        });
    }

    /**
     * Create a player card element
     */
    createPlayerCard(player) {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.setAttribute('data-player-id', player.id);

        const info = document.createElement('div');
        info.className = 'player-info';

        const nameElement = document.createElement('div');
        nameElement.className = 'player-name';
        nameElement.textContent = player.name;
        nameElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.editPlayerName(player.id, nameElement);
        });

        info.appendChild(nameElement);

        const scoreElement = document.createElement('div');
        scoreElement.className = 'player-score';
        scoreElement.textContent = player.score;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'player-actions';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'player-action-btn';
        removeBtn.textContent = '🗑️';
        removeBtn.setAttribute('aria-label', 'Remove player');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removePlayer(player.id);
        });

        actionsDiv.appendChild(removeBtn);

        card.appendChild(info);
        card.appendChild(scoreElement);
        card.appendChild(actionsDiv);

        // Tap to add points
        card.addEventListener('click', () => {
            this.updateScore(player.id, this.pointsInput);
        });

        return card;
    }

    /**
     * Edit player name
     */
    editPlayerName(id, nameElement) {
        const player = this.players.find(p => p.id === id);
        if (!player) return;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'player-name-input';
        input.value = player.name;
        input.inputMode = 'text';

        nameElement.replaceWith(input);
        input.focus();
        input.select();

        const save = () => {
            this.updatePlayerName(id, input.value);
        };

        input.addEventListener('blur', save);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                save();
            }
        });
    }

    /**
     * Open settings modal
     */
    openSettings() {
        const modal = document.getElementById('settingsModal');
        const maxPlayersInput = document.getElementById('maxPlayers');
        const startingScoreInput = document.getElementById('startingScore');

        if (maxPlayersInput) {
            maxPlayersInput.value = this.maxPlayers;
        }
        if (startingScoreInput) {
            startingScoreInput.value = this.startingScore;
        }

        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
        }
    }

    /**
     * Close settings modal
     */
    closeSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Save settings
     */
    saveSettings() {
        const maxPlayersInput = document.getElementById('maxPlayers');
        const startingScoreInput = document.getElementById('startingScore');

        if (maxPlayersInput) {
            this.maxPlayers = Math.max(2, Math.min(10, parseInt(maxPlayersInput.value) || 6));
        }
        if (startingScoreInput) {
            this.startingScore = parseInt(startingScoreInput.value) || 0;
        }

        localStorage.setItem('scorekeeperSettings', JSON.stringify({
            maxPlayers: this.maxPlayers,
            startingScore: this.startingScore
        }));

        this.closeSettings();
        this.showNotification('Settings saved');
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('scorekeeperSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.maxPlayers = settings.maxPlayers || 6;
                this.startingScore = settings.startingScore || 0;
            }
        } catch (e) {
            console.warn('Could not load settings:', e);
        }
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Scroll to bottom of scoreboard
     */
    scrollToBottom() {
        setTimeout(() => {
            const wrapper = document.querySelector('.scoreboard-wrapper');
            if (wrapper) {
                wrapper.scrollTop = wrapper.scrollHeight;
            }
        }, 100);
    }

    /**
     * Show notification
     */
    showNotification(message) {
        // Simple notification using browser alert
        // Could be enhanced with a custom notification UI
        console.log('Notification:', message);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new Scorekeeper();
    });
} else {
    window.app = new Scorekeeper();
}
