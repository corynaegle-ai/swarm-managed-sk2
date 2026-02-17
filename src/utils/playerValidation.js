/**
 * Player validation utility functions
 * Provides validation, sanitization, and duplicate checking for player names
 */

/**
 * Validates a player name based on length and character requirements
 * @param {string} name - The player name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validatePlayerName(name) {
  if (typeof name !== 'string') {
    return false;
  }
  
  const trimmedName = name.trim();
  
  // Check length (2-20 characters)
  if (trimmedName.length < 2 || trimmedName.length > 20) {
    return false;
  }
  
  // Check valid characters (letters, numbers, spaces, hyphens)
  const validCharacterPattern = /^[a-zA-Z0-9\s-]+$/;
  return validCharacterPattern.test(trimmedName);
}

/**
 * Checks if a player name already exists in the list of existing players
 * Performs case-insensitive comparison
 * @param {string} name - The player name to check
 * @param {Array} existingPlayers - Array of existing player objects or names
 * @returns {boolean} - True if duplicate found, false otherwise
 */
export function checkDuplicateName(name, existingPlayers) {
  if (typeof name !== 'string' || !Array.isArray(existingPlayers)) {
    return false;
  }
  
  const trimmedName = name.trim().toLowerCase();
  
  return existingPlayers.some(player => {
    // Handle both string arrays and object arrays with name property
    const playerName = typeof player === 'string' ? player : player.name;
    return typeof playerName === 'string' && playerName.trim().toLowerCase() === trimmedName;
  });
}

/**
 * Sanitizes a player name by trimming whitespace and normalizing spaces
 * @param {string} name - The player name to sanitize
 * @returns {string} - The sanitized name
 */
export function sanitizePlayerName(name) {
  if (typeof name !== 'string') {
    return '';
  }
  
  // Trim whitespace and replace multiple spaces with single space
  return name.trim().replace(/\s+/g, ' ');
}