/**
 * Scoring Module for Tricks Game
 * Handles all scoring calculations and input validation
 */

/**
 * Validate bid input
 * Bid must be a valid number between 0 and 13 (maximum tricks in game)
 * @param {string|number} bid - Bid value to validate
 * @param {number} roundNumber - Current round number (not used for bid validation but included for consistency)
 * @returns {object} - { isValid: boolean, error: string|null }
 */
function validateBid(bid, roundNumber) {
  // Convert to number
  const bidNum = Number(bid);
  
  // Check if it's a valid number
  if (isNaN(bidNum)) {
    return { isValid: false, error: 'Bid must be a number' };
  }
  
  // Check if it's an integer
  if (!Number.isInteger(bidNum)) {
    return { isValid: false, error: 'Bid must be a whole number' };
  }
  
  // Check if it's non-negative
  if (bidNum < 0) {
    return { isValid: false, error: 'Bid cannot be negative' };
  }
  
  // Check if it exceeds maximum possible tricks (13 in a standard game)
  if (bidNum > 13) {
    return { isValid: false, error: 'Bid cannot exceed 13 tricks' };
  }
  
  return { isValid: true, error: null };
}

/**
 * Validate tricks input
 * Tricks must be between 0 and the current round number (max tricks available in that round)
 * @param {string|number} tricks - Tricks value to validate
 * @param {number} roundNumber - Current round number
 * @returns {object} - { isValid: boolean, error: string|null }
 */
function validateTricks(tricks, roundNumber) {
  // Convert to number
  const tricksNum = Number(tricks);
  
  // Check if it's a valid number
  if (isNaN(tricksNum)) {
    return { isValid: false, error: 'Tricks must be a number' };
  }
  
  // Check if it's an integer
  if (!Number.isInteger(tricksNum)) {
    return { isValid: false, error: 'Tricks must be a whole number' };
  }
  
  // Check if it's non-negative
  if (tricksNum < 0) {
    return { isValid: false, error: 'Tricks cannot be negative' };
  }
  
  // Check if it exceeds the round number (maximum tricks available)
  if (tricksNum > roundNumber) {
    return { isValid: false, error: `Tricks cannot exceed round number (${roundNumber})` };
  }
  
  return { isValid: true, error: null };
}

/**
 * Calculate round score based on bid and tricks won
 * Bonus points are only applied when tricks exactly equals bid
 * Base scoring: 1 point per trick won
 * Bonus scoring: 10 bonus points if tricks === bid
 * @param {string|number} bid - Bid for the round
 * @param {string|number} tricks - Tricks won in the round
 * @returns {object} - { roundScore: number, baseScore: number, bonusScore: number, metBid: boolean }
 */
function calculateRoundScore(bid, tricks) {
  // Convert to numbers
  const bidNum = Number(bid);
  const tricksNum = Number(tricks);
  
  // Calculate base score (1 point per trick)
  const baseScore = tricksNum;
  
  // Calculate bonus score (10 bonus points only if tricks === bid)
  const metBid = tricksNum === bidNum;
  const bonusScore = metBid ? 10 : 0;
  
  // Total round score
  const roundScore = baseScore + bonusScore;
  
  return {
    roundScore: roundScore,
    baseScore: baseScore,
    bonusScore: bonusScore,
    metBid: metBid
  };
}
