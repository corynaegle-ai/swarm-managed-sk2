/**
 * Scoring logic for the Tricks game
 * Handles validation of tricks, bonus calculation, and round score computation
 */

/**
 * Validates that tricks are within valid range (0 to round number)
 * @param {number} tricks - Number of tricks won
 * @param {number} roundNumber - Current round number
 * @returns {object} - {isValid: boolean, error: string|null}
 */
function validateTricks(tricks, roundNumber) {
  // Convert to number if string
  const tricksNum = Number(tricks);
  
  // Check if valid number
  if (isNaN(tricksNum)) {
    return { isValid: false, error: 'Tricks must be a number' };
  }
  
  // Check if integer
  if (!Number.isInteger(tricksNum)) {
    return { isValid: false, error: 'Tricks must be a whole number' };
  }
  
  // Check if non-negative
  if (tricksNum < 0) {
    return { isValid: false, error: 'Tricks cannot be negative' };
  }
  
  // Check if within round range
  if (tricksNum > roundNumber) {
    return { isValid: false, error: `Tricks cannot exceed round number (${roundNumber})` };
  }
  
  return { isValid: true, error: null };
}

/**
 * Calculates the score for a round
 * Base points equal the number of tricks won
 * Bonus points (10) only apply when tricks equals bid exactly
 * @param {number} bid - Number of tricks bid
 * @param {number} tricks - Number of tricks actually won
 * @returns {object} - {roundScore: number, baseScore: number, bonusScore: number}
 */
function calculateRoundScore(bid, tricks) {
  // Convert to numbers
  const bidNum = Number(bid);
  const tricksNum = Number(tricks);
  
  // Base score is the number of tricks won
  const baseScore = tricksNum;
  
  // Bonus is 10 points only when bid is met exactly (bid === tricks)
  const bonusScore = (bidNum === tricksNum) ? 10 : 0;
  
  // Total round score
  const roundScore = baseScore + bonusScore;
  
  return {
    roundScore: roundScore,
    baseScore: baseScore,
    bonusScore: bonusScore
  };
}

/**
 * Validates bid value
 * @param {number} bid - Number of tricks bid
 * @param {number} roundNumber - Current round number
 * @returns {object} - {isValid: boolean, error: string|null}
 */
function validateBid(bid, roundNumber) {
  // Convert to number if string
  const bidNum = Number(bid);
  
  // Check if valid number
  if (isNaN(bidNum)) {
    return { isValid: false, error: 'Bid must be a number' };
  }
  
  // Check if integer
  if (!Number.isInteger(bidNum)) {
    return { isValid: false, error: 'Bid must be a whole number' };
  }
  
  // Check if non-negative
  if (bidNum < 0) {
    return { isValid: false, error: 'Bid cannot be negative' };
  }
  
  // Check if within round range
  if (bidNum > roundNumber) {
    return { isValid: false, error: `Bid cannot exceed round number (${roundNumber})` };
  }
  
  return { isValid: true, error: null };
}
