/**
 * GameState class manages the game state including player management.
 * Enforces game rules such as player limits and game state transitions.
 */
class GameState {
  #players = [];
  #gameStarted = false;
  #nextId = 1;

  /**
   * Adds a new player to the game.
   * @param {string} name - The name of the player to add
   * @returns {Object} The newly added player object with id, name, and score
   * @throws {Error} If the player limit is reached or the game has already started
   */
  addPlayer(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Player name must be a non-empty string');
    }

    if (!this.canAddPlayer()) {
      throw new Error('Cannot add player: game is full or has already started');
    }

    const player = {
      id: this.#nextId++,
      name: name.trim(),
      score: 0
    };

    this.#players.push(player);
    return player;
  }

  /**
   * Removes a player from the game by their ID.
   * @param {number} id - The ID of the player to remove
   * @returns {boolean} True if the player was removed, false if not found
   * @throws {Error} If the game has already started
   */
  removePlayer(id) {
    if (this.#gameStarted) {
      throw new Error('Cannot remove player: game has already started');
    }

    const initialLength = this.#players.length;
    this.#players = this.#players.filter(player => player.id !== id);

    return this.#players.length < initialLength;
  }

  /**
   * Gets the current list of players.
   * @returns {Array} A copy of the players array in consistent order
   */
  getPlayers() {
    return [...this.#players];
  }

  /**
   * Checks if a new player can be added.
   * @returns {boolean} True if a player can be added, false otherwise
   */
  canAddPlayer() {
    return this.#players.length < 8 && !this.#gameStarted;
  }

  /**
   * Checks if the game can be started with the current player count.
   * @returns {boolean} True if the game can start, false otherwise
   */
  canStartGame() {
    const playerCount = this.#players.length;
    return playerCount >= 2 && playerCount <= 8 && !this.#gameStarted;
  }

  /**
   * Starts the game, preventing further player modifications.
   * @throws {Error} If the game cannot be started (not enough or too many players)
   */
  startGame() {
    if (!this.canStartGame()) {
      throw new Error('Cannot start game: must have between 2 and 8 players');
    }
    this.#gameStarted = true;
  }

  /**
   * Resets the game state (useful for testing or restarting).
   */
  reset() {
    this.#players = [];
    this.#gameStarted = false;
    this.#nextId = 1;
  }
}
