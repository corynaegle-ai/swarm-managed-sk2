/**
 * PlayerManager.js - Manages player UI and interactions
 * Handles adding/removing players, updating display, and managing game start
 */

class PlayerManager {
  constructor() {
    this.gameState = null;
    this.addPlayerForm = null;
    this.playerNameInput = null;
    this.playerCountDisplay = null;
    this.playerListContainer = null;
    this.startGameBtn = null;
    this.errorDisplay = null;
    this.MIN_PLAYERS = 2;
    this.MAX_PLAYERS = 8;
  }

  /**
   * Initialize the PlayerManager with required DOM elements and gameState
   * @param {Object} gameState - GameState instance with player management methods
   * @returns {boolean} True if initialization successful, false otherwise
   */
  init(gameState) {
    if (!gameState) {
      console.error('PlayerManager: gameState is required for initialization');
      return false;
    }

    this.gameState = gameState;

    // Get references to all required DOM elements
    this.addPlayerForm = document.getElementById('add-player-form');
    this.playerNameInput = document.getElementById('player-name-input');
    this.playerCountDisplay = document.getElementById('player-count');
    this.playerListContainer = document.getElementById('player-list');
    this.startGameBtn = document.getElementById('start-game-btn');
    this.errorDisplay = document.getElementById('player-form-error');

    // Validate all required DOM elements exist
    if (!this.addPlayerForm || !this.playerNameInput || !this.playerCountDisplay ||
        !this.playerListContainer || !this.startGameBtn || !this.errorDisplay) {
      console.error('PlayerManager: One or more required DOM elements not found');
      return false;
    }

    // Attach event listeners
    this.addPlayerForm.addEventListener('submit', (e) => this.handleAddPlayer(e));
    this.startGameBtn.addEventListener('click', () => this.handleStartGame());

    // Initial render
    this.updatePlayerList();
    this.updatePlayerCountDisplay();

    return true;
  }

  /**
   * Sanitize player name to prevent injection attacks
   * Allows: alphanumeric, spaces, hyphens, and apostrophes
   * @param {string} name - Raw player name
   * @returns {string} Sanitized name
   */
  sanitizeName(name) {
    if (typeof name !== 'string') return '';
    // Allow alphanumeric, spaces, hyphens, apostrophes
    return name.replace(/[^a-zA-Z0-9\s'-]/g, '').trim();
  }

  /**
   * Validate player name
   * @param {string} name - Player name to validate
   * @returns {Object} {valid: boolean, error: string}
   */
  validateName(name) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return { valid: false, error: 'Player name cannot be empty.' };
    }

    if (trimmedName.length < 2) {
      return { valid: false, error: 'Player name must be at least 2 characters.' };
    }

    if (trimmedName.length > 50) {
      return { valid: false, error: 'Player name cannot exceed 50 characters.' };
    }

    const sanitized = this.sanitizeName(trimmedName);
    if (sanitized !== trimmedName) {
      return { valid: false, error: 'Player name contains invalid characters. Use only letters, numbers, spaces, hyphens, and apostrophes.' };
    }

    // Check for duplicates (case-insensitive)
    const isDuplicate = this.gameState.getPlayers().some(
      p => p.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      return { valid: false, error: `Player "${trimmedName}" already exists.` };
    }

    return { valid: true, error: null };
  }

  /**
   * Show error message in the error display
   * @param {string} message - Error message to display
   */
  showError(message) {
    if (!this.errorDisplay) return;
    this.errorDisplay.textContent = message;
    this.errorDisplay.style.display = 'block';
  }

  /**
   * Clear error message
   */
  clearError() {
    if (!this.errorDisplay) return;
    this.errorDisplay.textContent = '';
    this.errorDisplay.style.display = 'none';
  }

  /**
   * Handle add player form submission
   * @param {Event} e - Form submit event
   */
  handleAddPlayer(e) {
    e.preventDefault();

    const name = this.playerNameInput.value;

    // Validate input
    const validation = this.validateName(name);
    if (!validation.valid) {
      this.showError(validation.error);
      return;
    }

    this.clearError();

    // Attempt to add player
    const player = this.gameState.addPlayer(name);
    if (!player) {
      this.showError('Failed to add player. Please try again.');
      return;
    }

    // Clear input and update UI
    this.playerNameInput.value = '';
    this.playerNameInput.focus();
    this.updatePlayerList();
    this.updatePlayerCountDisplay();
  }

  /**
   * Handle remove player button click
   * @param {number} playerId - ID of player to remove
   */
  handleRemovePlayer(playerId) {
    if (this.gameState.isGameStarted()) {
      this.showError('Cannot remove players after game has started.');
      return;
    }

    this.gameState.removePlayer(playerId);
    this.updatePlayerList();
    this.updatePlayerCountDisplay();
    this.clearError();
  }

  /**
   * Handle start game button click
   */
  handleStartGame() {
    if (this.gameState.getPlayerCount() < this.MIN_PLAYERS ||
        this.gameState.getPlayerCount() > this.MAX_PLAYERS) {
      this.showError(`Game requires between ${this.MIN_PLAYERS} and ${this.MAX_PLAYERS} players.`);
      return;
    }

    const success = this.gameState.startGame();
    if (!success) {
      this.showError('Failed to start game. Please try again.');
      return;
    }

    this.clearError();
    this.updatePlayerList();
    this.updatePlayerCountDisplay();
    this.updateStartGameButton();

    // Dispatch custom event for app.js to handle
    window.dispatchEvent(new CustomEvent('gameStarted', {
      detail: { players: this.gameState.getPlayers() }
    }));
  }

  /**
   * Update the start game button state
   */
  updateStartGameButton() {
    const playerCount = this.gameState.getPlayerCount();
    const isValidRange = playerCount >= this.MIN_PLAYERS && playerCount <= this.MAX_PLAYERS;
    const isGameStarted = this.gameState.isGameStarted();

    this.startGameBtn.disabled = !isValidRange || isGameStarted;
  }

  /**
   * Update player count display
   */
  updatePlayerCountDisplay() {
    const playerCount = this.gameState.getPlayerCount();
    const isValidRange = playerCount >= this.MIN_PLAYERS && playerCount <= this.MAX_PLAYERS;

    // Find the count span (should be .count-invalid or .count-valid)
    const countSpan = this.playerCountDisplay.querySelector('.count-invalid, .count-valid');
    if (!countSpan) {
      console.warn('PlayerManager: Count display span not found');
      return;
    }

    // Update text
    countSpan.textContent = `Players: ${playerCount}`;

    // Update class based on validity
    countSpan.classList.remove('count-invalid', 'count-valid');
    countSpan.classList.add(isValidRange ? 'count-valid' : 'count-invalid');

    // Update button state
    this.updateStartGameButton();
  }

  /**
   * Update the player list display
   */
  updatePlayerList() {
    const players = this.gameState.getPlayers();
    const isGameStarted = this.gameState.isGameStarted();

    // Clear current list
    this.playerListContainer.innerHTML = '';

    if (players.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.className = 'player-list-empty';
      emptyMsg.textContent = 'No players added yet. Add players to begin.';
      this.playerListContainer.appendChild(emptyMsg);
      return;
    }

    // Create list of player items
    const playerList = document.createElement('ul');
    playerList.className = 'player-list';

    players.forEach(player => {
      const listItem = document.createElement('li');
      listItem.className = 'player-item';
      listItem.setAttribute('data-player-id', player.id);

      // Player name
      const nameSpan = document.createElement('span');
      nameSpan.className = 'player-name';
      nameSpan.textContent = player.name; // Safe: textContent, not innerHTML

      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'remove-player-btn';
      removeBtn.textContent = 'Remove';
      removeBtn.disabled = isGameStarted; // Disable if game started
      removeBtn.addEventListener('click', () => this.handleRemovePlayer(player.id));

      listItem.appendChild(nameSpan);
      listItem.appendChild(removeBtn);
      playerList.appendChild(listItem);
    });

    this.playerListContainer.appendChild(playerList);
  }

  /**
   * Reset the player manager (clear all players, reset UI)
   */
  reset() {
    if (!this.gameState) return;

    // Clone array to avoid mutation during iteration
    const playersToRemove = [...this.gameState.getPlayers()];
    playersToRemove.forEach(player => {
      this.gameState.removePlayer(player.id);
    });

    this.playerNameInput.value = '';
    this.clearError();
    this.updatePlayerList();
    this.updatePlayerCountDisplay();
  }
}

// Create and export a singleton instance
const playerManager = new PlayerManager();
