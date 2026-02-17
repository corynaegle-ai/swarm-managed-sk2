/**
 * Player validation utilities
 */

/**
 * Sanitizes player name by trimming whitespace
 * @param {string} name - The player name to sanitize
 * @returns {string} - The sanitized name
 */
export function sanitizePlayerName(name) {
  return name ? name.trim() : '';
}

/**
 * Validates player name according to game rules
 * @param {string} name - The player name to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
export function validatePlayerName(name) {
  if (!name || name.length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  if (name.length > 20) {
    return 'Name must be 20 characters or less';
  }
  
  // Check for invalid characters - only allow letters, numbers, spaces, and basic punctuation
  const validNamePattern = /^[a-zA-Z0-9\s\-_\.]+$/;
  if (!validNamePattern.test(name)) {
    return 'Name contains invalid characters. Only letters, numbers, spaces, hyphens, underscores, and periods are allowed';
  }
  
  return null;
}

/**
 * Checks if player name already exists in the players list
 * @param {string} name - The player name to check
 * @param {Array} players - Array of existing players
 * @returns {string|null} - Error message if duplicate, null if unique
 */
export function checkDuplicateName(name, players) {
  if (!players || !Array.isArray(players)) {
    return null;
  }
  
  const normalizedName = name.toLowerCase().trim();
  const isDuplicate = players.some(player => 
    player.name && player.name.toLowerCase().trim() === normalizedName
  );
  
  return isDuplicate ? 'A player with this name already exists' : null;
}