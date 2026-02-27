/**
 * RoundManager - Manages round progression for Swarm Managed SK2
 * Tracks rounds 1-10 with hands equal to round number
 */
class RoundManager {
  constructor() {
    this.currentRound = 1;
    this.roundsCompleted = [];
  }

  /**
   * Get the current round number (1-10)
   * @returns {number} Current round number
   */
  getCurrentRound() {
    return this.currentRound;
  }

  /**
   * Get the number of hands for a given round
   * Hands equal the round number (e.g., round 1 = 1 hand, round 2 = 2 hands)
   * @param {number} round - The round number (optional, defaults to current round)
   * @returns {number} Number of hands for the round
   */
  getHandsForRound(round = this.currentRound) {
    if (round < 1 || round > 10) {
      throw new Error('Round must be between 1 and 10');
    }
    return round;
  }

  /**
   * Check if a round can be started
   * A round can only start if the previous round is complete
   * @returns {boolean} True if the current round can start
   */
  canStartRound() {
    // Round 1 can always start
    if (this.currentRound === 1) {
      return true;
    }
    // For other rounds, the previous round must be completed
    return this.roundsCompleted.includes(this.currentRound - 1);
  }

  /**
   * Mark the current round as completed and advance to the next round
   * @returns {boolean} True if successfully advanced, false if game is complete
   */
  startNextRound() {
    // Mark current round as completed
    if (!this.roundsCompleted.includes(this.currentRound)) {
      this.roundsCompleted.push(this.currentRound);
    }

    // Check if game is complete
    if (this.currentRound >= 10) {
      return false;
    }

    // Advance to next round
    this.currentRound += 1;
    return true;
  }

  /**
   * Check if the game is complete (all 10 rounds completed)
   * @returns {boolean} True if all 10 rounds have been completed
   */
  isGameComplete() {
    return this.currentRound > 10 || (this.currentRound === 10 && this.roundsCompleted.includes(10));
  }
}

// Export RoundManager class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RoundManager;
}
