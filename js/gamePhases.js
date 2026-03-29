/**
 * PhaseManager - Game Phase State Machine
 * Manages game phases and validates transitions following strict rules
 */

class PhaseManager {
  /**
   * Initialize PhaseManager with initial phase and current round
   * @param {string} initialPhase - Starting phase (default: 'setup')
   * @param {number} currentRound - Current game round (default: 1)
   */
  constructor(initialPhase = 'setup', currentRound = 1) {
    this.VALID_PHASES = ['setup', 'bidding', 'scoring', 'complete'];
    this.FINAL_ROUND = 10;
    
    if (!this.VALID_PHASES.includes(initialPhase)) {
      throw new Error(`Invalid initial phase: ${initialPhase}. Must be one of ${this.VALID_PHASES.join(', ')}`);
    }
    
    this.currentPhase = initialPhase;
    this.currentRound = currentRound;
  }

  /**
   * Get the current phase
   * @returns {string} Current phase
   */
  getCurrentPhase() {
    return this.currentPhase;
  }

  /**
   * Set the phase to a new value with validation
   * @param {string} phase - Phase to transition to
   * @returns {boolean} True if phase was set successfully
   * @throws {Error} If phase is invalid or transition is not allowed
   */
  setPhase(phase) {
    if (!this.VALID_PHASES.includes(phase)) {
      throw new Error(`Invalid phase: ${phase}. Must be one of ${this.VALID_PHASES.join(', ')}`);
    }

    if (!this.canTransitionTo(phase)) {
      throw new Error(
        `Cannot transition from '${this.currentPhase}' to '${phase}'. Valid transitions: ${this.getValidTransitions().join(', ')}`
      );
    }

    this.currentPhase = phase;
    return true;
  }

  /**
   * Check if a transition to the given phase is valid
   * @param {string} phase - Target phase
   * @returns {boolean} True if transition is allowed
   */
  canTransitionTo(phase) {
    if (!this.VALID_PHASES.includes(phase)) {
      return false;
    }

    const validTransitions = this.getValidTransitions();
    return validTransitions.includes(phase);
  }

  /**
   * Get all valid next phases from current phase
   * @returns {Array<string>} Array of valid phases to transition to
   */
  getValidTransitions() {
    const transitionMatrix = {
      'setup': ['bidding'],
      'bidding': ['scoring'],
      'scoring': this.currentRound >= this.FINAL_ROUND ? ['complete'] : ['setup'],
      'complete': []
    };

    return transitionMatrix[this.currentPhase] || [];
  }

  /**
   * Set the current round number
   * @param {number} round - Round number
   */
  setRound(round) {
    if (typeof round !== 'number' || round < 1) {
      throw new Error('Round must be a positive number');
    }
    this.currentRound = round;
  }

  /**
   * Get the current round number
   * @returns {number} Current round
   */
  getRound() {
    return this.currentRound;
  }

  /**
   * Check if the game is complete
   * @returns {boolean} True if current phase is 'complete'
   */
  isGameComplete() {
    return this.currentPhase === 'complete';
  }

  /**
   * Check if final round has been reached
   * @returns {boolean} True if current round is the final round
   */
  isFinalRound() {
    return this.currentRound >= this.FINAL_ROUND;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PhaseManager;
}
