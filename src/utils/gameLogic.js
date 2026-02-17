/**
 * Game Logic Utilities
 * Provides utility functions for bid validation and round management
 */

/**
 * Validates a bid submission
 * @param {number|string} bid - The bid value to validate
 * @param {string} playerId - The ID of the player submitting the bid
 * @returns {boolean} True if bid is valid, false otherwise
 */
export function validateBid(bid, playerId) {
  // Check if playerId exists and is not empty
  if (!playerId || typeof playerId !== 'string' || playerId.trim() === '') {
    return false;
  }

  // Convert bid to number if it's a string
  const bidNumber = typeof bid === 'string' ? parseFloat(bid) : bid;
  
  // Check if bid is a valid number
  if (isNaN(bidNumber) || !isFinite(bidNumber)) {
    return false;
  }

  // Check if bid is non-negative (assuming bids can't be negative)
  if (bidNumber < 0) {
    return false;
  }

  return true;
}

/**
 * Checks if all players have submitted bids and game can advance to playing phase
 * @param {Object} bids - Object containing player bids {playerId: bidValue}
 * @param {number} totalPlayers - Total number of players in the game
 * @returns {boolean} True if all players have submitted valid bids
 */
export function canAdvanceToPlaying(bids, totalPlayers) {
  // Check if bids is a valid object
  if (!bids || typeof bids !== 'object' || Array.isArray(bids)) {
    return false;
  }

  // Check if totalPlayers is a valid positive number
  if (!Number.isInteger(totalPlayers) || totalPlayers <= 0) {
    return false;
  }

  // Get the number of submitted bids
  const submittedBids = Object.keys(bids).length;
  
  // Check if number of submitted bids matches total players
  if (submittedBids !== totalPlayers) {
    return false;
  }

  // Validate each bid in the bids object
  for (const [playerId, bidValue] of Object.entries(bids)) {
    if (!validateBid(bidValue, playerId)) {
      return false;
    }
  }

  return true;
}

/**
 * Resets bid data for a new round
 * @returns {Object} Object containing empty bids and reset submission tracking
 */
export function resetBidsForNewRound() {
  return {
    bids: {},
    playersSubmittedBids: []
  };
}