/**
 * Game Logic Utilities
 * Provides utility functions for bid validation and round management
 */

/**
 * Validates a bid submission
 * @param {number} bid - The bid amount
 * @param {string} playerId - The ID of the player making the bid
 * @returns {boolean} - True if bid is valid, false otherwise
 */
export function validateBid(bid, playerId) {
  // Check if playerId is provided and is a non-empty string
  if (!playerId || typeof playerId !== 'string' || playerId.trim() === '') {
    return false;
  }

  // Check if bid is a valid number
  if (typeof bid !== 'number' || isNaN(bid) || !isFinite(bid)) {
    return false;
  }

  // Check if bid is non-negative (assuming negative bids are invalid)
  if (bid < 0) {
    return false;
  }

  return true;
}

/**
 * Checks if all players have submitted bids and can advance to playing phase
 * @param {Object} bids - Object containing player bids {playerId: bidAmount}
 * @param {number} totalPlayers - Total number of players expected to submit bids
 * @returns {boolean} - True if all players have submitted valid bids
 */
export function canAdvanceToPlaying(bids, totalPlayers) {
  // Validate inputs
  if (!bids || typeof bids !== 'object') {
    return false;
  }

  if (typeof totalPlayers !== 'number' || totalPlayers <= 0 || !isFinite(totalPlayers)) {
    return false;
  }

  // Get the number of submitted bids
  const submittedBids = Object.keys(bids).length;

  // Check if we have the expected number of bids
  if (submittedBids !== totalPlayers) {
    return false;
  }

  // Validate each bid
  for (const [playerId, bid] of Object.entries(bids)) {
    if (!validateBid(bid, playerId)) {
      return false;
    }
  }

  return true;
}

/**
 * Resets bids and submission tracking for a new round
 * @returns {Object} - Object containing reset bids array and submission tracking
 */
export function resetBidsForNewRound() {
  return {
    bids: {},
    playersSubmittedBids: []
  };
}