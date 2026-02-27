import { Player } from './player';

type GamePhase = 'setup' | 'playing' | 'finished';

export class GameState {
  private players: Player[] = [];
  private phase: GamePhase = 'setup';
  private nextPlayerId: number = 1;
  private readonly MIN_PLAYERS = 2;
  private readonly MAX_PLAYERS = 8;

  constructor() {}

  /**
   * Add a player to the game
   * @param name - The player's name
   * @returns The created player
   * @throws Error if game has already started
   * @throws Error if player limit is reached
   * @throws Error if name is invalid
   */
  addPlayer(name: string): Player {
    this.validateGameNotStarted();
    this.validatePlayerName(name);
    this.validatePlayerCount();

    const player = new Player(this.nextPlayerId, name);
    this.nextPlayerId++;
    this.players.push(player);

    return player;
  }

  /**
   * Get all players in consistent order (by ID)
   * @returns Array of players sorted by ID
   */
  getPlayers(): Player[] {
    return [...this.players].sort((a, b) => a.getId() - b.getId());
  }

  /**
   * Get player count
   * @returns Number of players currently in the game
   */
  getPlayerCount(): number {
    return this.players.length;
  }

  /**
   * Get a specific player by ID
   * @param playerId - The player's unique ID
   * @returns The player or undefined if not found
   */
  getPlayerById(playerId: number): Player | undefined {
    return this.players.find(p => p.getId() === playerId);
  }

  /**
   * Check if the game has started
   * @returns true if game is in 'playing' or 'finished' phase
   */
  isGameStarted(): boolean {
    return this.phase !== 'setup';
  }

  /**
   * Start the game
   * @throws Error if player count is not between 2-8
   */
  startGame(): void {
    if (this.players.length < this.MIN_PLAYERS) {
      throw new Error(`At least ${this.MIN_PLAYERS} players are required to start the game`);
    }
    if (this.players.length > this.MAX_PLAYERS) {
      throw new Error(`Maximum ${this.MAX_PLAYERS} players allowed`);
    }
    this.phase = 'playing';
  }

  /**
   * End the game
   */
  endGame(): void {
    this.phase = 'finished';
  }

  /**
   * Get current game phase
   * @returns The current phase
   */
  getPhase(): GamePhase {
    return this.phase;
  }

  /**
   * Reset game state for a new game
   */
  reset(): void {
    this.players = [];
    this.phase = 'setup';
    this.nextPlayerId = 1;
  }

  /**
   * Check if more players can be added
   * @returns true if player limit not reached
   */
  canAddMorePlayers(): boolean {
    return this.players.length < this.MAX_PLAYERS;
  }

  /**
   * Get remaining player slots
   * @returns Number of players that can still be added
   */
  getRemainingPlayerSlots(): number {
    return this.MAX_PLAYERS - this.players.length;
  }

  // Private validation methods

  private validateGameNotStarted(): void {
    if (this.isGameStarted()) {
      throw new Error('Cannot add players after the game has started');
    }
  }

  private validatePlayerName(name: string): void {
    if (!name || typeof name !== 'string') {
      throw new Error('Player name must be a non-empty string');
    }
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error('Player name cannot be empty or whitespace only');
    }
    if (trimmedName.length > 50) {
      throw new Error('Player name must be 50 characters or less');
    }
  }

  private validatePlayerCount(): void {
    if (this.players.length >= this.MAX_PLAYERS) {
      throw new Error(`Maximum ${this.MAX_PLAYERS} players allowed`);
    }
  }
}
