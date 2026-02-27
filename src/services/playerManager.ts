import { GameState } from '../models/gameState';
import { Player } from '../models/player';

/**
 * PlayerManager service handles player-related operations
 * and acts as a facade between UI and GameState
 */
export class PlayerManager {
  constructor(private gameState: GameState) {}

  /**
   * Add a new player with the given name
   * @param name - The player's name
   * @returns The created player
   * @throws Error if validation fails
   */
  addPlayer(name: string): Player {
    return this.gameState.addPlayer(name);
  }

  /**
   * Get all players in order
   * @returns Array of players sorted by ID
   */
  getPlayers(): Player[] {
    return this.gameState.getPlayers();
  }

  /**
   * Get the number of players currently in the game
   */
  getPlayerCount(): number {
    return this.gameState.getPlayerCount();
  }

  /**
   * Check if a player can be added
   * @returns true if the game is in setup phase and slots are available
   */
  canAddPlayer(): boolean {
    return !this.gameState.isGameStarted() && this.gameState.canAddMorePlayers();
  }

  /**
   * Get the number of remaining player slots
   */
  getRemainingSlots(): number {
    return this.gameState.getRemainingPlayerSlots();
  }

  /**
   * Get minimum number of players required
   */
  getMinPlayers(): number {
    return 2;
  }

  /**
   * Get maximum number of players allowed
   */
  getMaxPlayers(): number {
    return 8;
  }

  /**
   * Check if game can be started
   * @returns true if player count is within valid range
   */
  canStartGame(): boolean {
    const count = this.gameState.getPlayerCount();
    return count >= this.getMinPlayers() && count <= this.getMaxPlayers();
  }
}
