/**
 * Server-side scoring utilities - matches client logic exactly
 */

/**
 * Calculate base score for a correct bid
 * @param {number} bid - The bid amount
 * @param {number} actualTricks - Actual tricks taken
 * @returns {number} Base score points
 */
function calculateBaseScore(bid, actualTricks) {
  if (bid === actualTricks) {
    // Correct bid: 10 points + bid amount
    return 10 + bid;
  }
  return 0;
}

/**
 * Calculate total score including penalties
 * @param {number} bid - The bid amount
 * @param {number} actualTricks - Actual tricks taken
 * @returns {number} Total score (can be negative)
 */
function calculateScore(bid, actualTricks) {
  const baseScore = calculateBaseScore(bid, actualTricks);
  
  if (bid === actualTricks) {
    return baseScore;
  }
  
  // Incorrect bid: penalty of difference
  const penalty = Math.abs(bid - actualTricks);
  return -penalty;
}

/**
 * Validate if bonus points are allowed based on bid accuracy
 * @param {number} bid - The bid amount
 * @param {number} actualTricks - Actual tricks taken
 * @returns {boolean} True if bonus points are allowed
 */
function validateBonusPoints(bid, actualTricks) {
  return bid === actualTricks;
}

/**
 * Calculate score with optional bonus points
 * @param {number} bid - The bid amount
 * @param {number} actualTricks - Actual tricks taken
 * @param {number} bonusPoints - Additional bonus points (default: 0)
 * @returns {number} Total score including bonus
 */
function calculateTotalScore(bid, actualTricks, bonusPoints = 0) {
  const baseScore = calculateScore(bid, actualTricks);
  
  // Only add bonus points if bid was correct
  if (validateBonusPoints(bid, actualTricks)) {
    return baseScore + bonusPoints;
  }
  
  return baseScore;
}

/**
 * Get score preview for server-side calculations
 * @param {number} bid - The bid amount
 * @param {number} actualTricks - Actual tricks taken
 * @param {number} bonusPoints - Additional bonus points (default: 0)
 * @returns {Object} Score breakdown object
 */
function getScorePreview(bid, actualTricks, bonusPoints = 0) {
  const baseScore = calculateBaseScore(bid, actualTricks);
  const isCorrect = validateBonusPoints(bid, actualTricks);
  const penalty = isCorrect ? 0 : Math.abs(bid - actualTricks);
  const appliedBonus = isCorrect ? bonusPoints : 0;
  const totalScore = calculateTotalScore(bid, actualTricks, bonusPoints);
  
  return {
    baseScore,
    penalty,
    bonusPoints: appliedBonus,
    totalScore,
    isCorrect,
    canReceiveBonus: isCorrect
  };
}

/**
 * Handle edge cases for score calculations
 * @param {number} bid - The bid amount
 * @param {number} actualTricks - Actual tricks taken
 * @returns {Object} Validation result
 */
function validateScoreInputs(bid, actualTricks) {
  const errors = [];
  
  if (typeof bid !== 'number' || bid < 0) {
    errors.push('Bid must be a non-negative number');
  }
  
  if (typeof actualTricks !== 'number' || actualTricks < 0) {
    errors.push('Actual tricks must be a non-negative number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Check if this is a perfect score scenario
 * @param {number} bid - The bid amount
 * @param {number} actualTricks - Actual tricks taken
 * @returns {boolean} True if perfect score (correct bid with no penalty)
 */
function isPerfectScore(bid, actualTricks) {
  return bid === actualTricks;
}

/**
 * Handle zero bid edge case
 * @param {number} bid - The bid amount
 * @param {number} actualTricks - Actual tricks taken
 * @returns {number} Score for zero bid scenario
 */
function handleZeroBid(bid, actualTricks) {
  if (bid === 0) {
    return calculateScore(bid, actualTricks);
  }
  throw new Error('Not a zero bid scenario');
}

module.exports = {
  calculateScore,
  calculateBaseScore,
  validateBonusPoints,
  calculateTotalScore,
  getScorePreview,
  validateScoreInputs,
  isPerfectScore,
  handleZeroBid
};