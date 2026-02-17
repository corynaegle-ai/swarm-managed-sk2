/**
 * Server-side Scoring Utilities for Skull King
 * Must match client-side logic exactly for consistency
 */

/**
 * Calculate base score for a player's bid and tricks taken
 * @param {number} bid - The player's bid
 * @param {number} tricksTaken - Number of tricks actually taken
 * @returns {number} Base score (positive or negative)
 */
function calculateScore(bid, tricksTaken) {
  // Input validation
  if (typeof bid !== 'number' || typeof tricksTaken !== 'number') {
    throw new Error('Bid and tricks taken must be numbers');
  }
  
  if (bid < 0 || tricksTaken < 0) {
    throw new Error('Bid and tricks taken must be non-negative');
  }

  // Perfect bid - score equals 20 * bid
  if (bid === tricksTaken) {
    return bid === 0 ? 10 : 20 * bid;
  }
  
  // Missed bid - lose 10 * bid (or 10 for zero bid)
  return bid === 0 ? -10 : -10 * bid;
}

/**
 * Validate if bonus points are allowed based on bid accuracy
 * Bonus points only apply when the bid is exactly correct
 * @param {number} bid - The player's bid
 * @param {number} tricksTaken - Number of tricks actually taken
 * @returns {boolean} True if bonus points are allowed
 */
function validateBonusPoints(bid, tricksTaken) {
  // Input validation
  if (typeof bid !== 'number' || typeof tricksTaken !== 'number') {
    return false;
  }
  
  if (bid < 0 || tricksTaken < 0) {
    return false;
  }

  // Bonus points only allowed when bid exactly matches tricks taken
  return bid === tricksTaken;
}

/**
 * Calculate total score including base score and bonus points
 * @param {number} bid - The player's bid
 * @param {number} tricksTaken - Number of tricks actually taken
 * @param {number} bonusPoints - Additional bonus points earned (default 0)
 * @returns {number} Total score for the round
 */
function calculateTotalScore(bid, tricksTaken, bonusPoints = 0) {
  const baseScore = calculateScore(bid, tricksTaken);
  
  // Only add bonus points if they're allowed
  if (validateBonusPoints(bid, tricksTaken)) {
    return baseScore + bonusPoints;
  }
  
  return baseScore;
}

/**
 * Get score preview for server-side calculations
 * @param {number} bid - The player's bid
 * @param {number} tricksTaken - Number of tricks actually taken
 * @param {number} bonusPoints - Additional bonus points earned
 * @returns {Object} Score breakdown for preview
 */
function getScorePreview(bid, tricksTaken, bonusPoints = 0) {
  const baseScore = calculateScore(bid, tricksTaken);
  const bonusAllowed = validateBonusPoints(bid, tricksTaken);
  const totalScore = calculateTotalScore(bid, tricksTaken, bonusPoints);
  
  return {
    baseScore,
    bonusPoints: bonusAllowed ? bonusPoints : 0,
    totalScore,
    bonusAllowed,
    bidCorrect: bid === tricksTaken
  };
}

/**
 * Handle edge case scoring
 * @param {number} bid - The player's bid
 * @param {number} tricksTaken - Number of tricks actually taken
 * @returns {Object} Edge case analysis
 */
function handleEdgeCases(bid, tricksTaken) {
  return {
    isZeroBid: bid === 0,
    isPerfectScore: bid === tricksTaken,
    isMaxPenalty: bid > 0 && tricksTaken === 0,
    scoringRule: bid === 0 ? 'zero_bid' : bid === tricksTaken ? 'perfect_bid' : 'missed_bid'
  };
}

/**
 * Calculate scores for all players in a round
 * @param {Array} players - Array of player objects with bid and tricksTaken
 * @returns {Array} Array of score results for each player
 */
function calculateRoundScores(players) {
  if (!Array.isArray(players)) {
    throw new Error('Players must be an array');
  }

  return players.map((player, index) => {
    try {
      const { bid, tricksTaken, bonusPoints = 0 } = player;
      const scorePreview = getScorePreview(bid, tricksTaken, bonusPoints);
      const edgeCases = handleEdgeCases(bid, tricksTaken);
      
      return {
        playerId: player.id || index,
        ...scorePreview,
        ...edgeCases
      };
    } catch (error) {
      return {
        playerId: player.id || index,
        error: error.message,
        totalScore: 0
      };
    }
  });
}

module.exports = {
  calculateScore,
  validateBonusPoints,
  calculateTotalScore,
  getScorePreview,
  handleEdgeCases,
  calculateRoundScores
};