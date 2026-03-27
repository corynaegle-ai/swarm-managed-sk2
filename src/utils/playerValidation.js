/**
 * Validates player count and returns validation result
 * @param {number} playerCount - Current number of players
 * @returns {Object} Validation result with isValid and message
 */
export const validatePlayerCount = (playerCount) => {
  const MIN_PLAYERS = 2;
  const MAX_PLAYERS = 8;
  const WARN_THRESHOLD = 7; // Start warning at 7 players

  if (playerCount < MIN_PLAYERS) {
    return {
      isValid: false,
      message: `Need at least ${MIN_PLAYERS} players to start the game. Currently have ${playerCount}.`
    };
  }

  if (playerCount > MAX_PLAYERS) {
    return {
      isValid: false,
      message: `Maximum ${MAX_PLAYERS} players allowed. Currently have ${playerCount}.`
    };
  }

  if (playerCount >= WARN_THRESHOLD) {
    return {
      isValid: true,
      message: `Approaching maximum capacity: ${playerCount}/${MAX_PLAYERS} players.`
    };
  }

  return {
    isValid: true,
    message: `Ready to start with ${playerCount} players.`
  };
};

/**
 * Gets player count requirements
 * @returns {Object} Min and max player requirements
 */
export const getPlayerRequirements = () => {
  return {
    min: 2,
    max: 8
  };
};