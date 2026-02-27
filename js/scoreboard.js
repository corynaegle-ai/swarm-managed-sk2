/**
 * GameState.js - Central state management for the SK2 game
 * Manages players, game state, and provides methods for game lifecycle
 */

class GameState {
  constructor() {
    this.players = [];
    this.gameStarted = false;
    this.nextPlayerId = 1;
  }

  /**
   * Get all players
   * @returns {Array} Array of player objects {id, name}
   */
  getPlayers() {
    return this.players;
  }

  /**
   * Get player count
   * @returns {number} Total number of players
   */
  getPlayerCount() {
    return this.players.length;
  }

  /**
   * Add a new player
   * @param {string} name - Player name
   * @returns {Object} Created player object or null if invalid
   */
  addPlayer(name) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return null;
    }

    // Check for duplicates
    if (this.players.some(p => p.name.toLowerCase() === name.trim().toLowerCase())) {
      return null;
    }

    const player = {
      id: this.nextPlayerId++,
      name: name.trim()
    };

    this.players.push(player);
    return player;
  }

  /**
   * Remove a player by ID
   * @param {number} playerId - ID of player to remove
   * @returns {boolean} True if removed, false if not found
   */
  removePlayer(playerId) {
    const initialLength = this.players.length;
    this.players = this.players.filter(p => p.id !== playerId);
    return this.players.length < initialLength;
  }

  /**
   * Check if game has started
   * @returns {boolean} True if game is in progress
   */
  isGameStarted() {
    return this.gameStarted;
  }

  /**
   * Start the game
   * @returns {boolean} True if game started successfully
   */
  startGame() {
    if (this.players.length < 2 || this.players.length > 8) {
      return false;
    }
    this.gameStarted = true;
    return true;
  }

  /**
   * Reset the game state
   */
  reset() {
    this.players = [];
    this.gameStarted = false;
    this.nextPlayerId = 1;
  }
}

// Create and export a singleton instance
const gameState = new GameState();
