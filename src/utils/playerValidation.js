/**
 * Player validation utilities
 */

// Maximum number of players allowed
export const MAX_PLAYERS = 8;

/**
 * Validates player name
 * @param {string} name - Player name to validate
 * @returns {Object} - Validation result with isValid boolean and error message
 */
export const validatePlayerName = (name) => {
  try {
    if (!name || typeof name !== 'string') {
      return {
        isValid: false,
        error: 'Player name is required'
      };
    }

    const trimmedName = name.trim();
    
    if (trimmedName.length === 0) {
      return {
        isValid: false,
        error: 'Player name cannot be empty'
      };
    }

    if (trimmedName.length < 2) {
      return {
        isValid: false,
        error: 'Player name must be at least 2 characters long'
      };
    }

    if (trimmedName.length > 50) {
      return {
        isValid: false,
        error: 'Player name cannot exceed 50 characters'
      };
    }

    // Check for invalid characters
    const invalidChars = /[<>"'&]/;
    if (invalidChars.test(trimmedName)) {
      return {
        isValid: false,
        error: 'Player name contains invalid characters'
      };
    }

    return {
      isValid: true,
      error: null
    };
  } catch (error) {
    console.error('Error in validatePlayerName:', error);
    return {
      isValid: false,
      error: 'Unable to validate player name. Please try again.'
    };
  }
};

/**
 * Checks if player name is unique in the list
 * @param {string} name - Player name to check
 * @param {Array} players - List of existing players
 * @returns {Object} - Validation result
 */
export const validatePlayerUniqueness = (name, players = []) => {
  try {
    if (!Array.isArray(players)) {
      return {
        isValid: false,
        error: 'Invalid player list provided'
      };
    }

    const trimmedName = name.trim().toLowerCase();
    const isDuplicate = players.some(player => 
      player && player.name && player.name.trim().toLowerCase() === trimmedName
    );

    if (isDuplicate) {
      return {
        isValid: false,
        error: 'A player with this name already exists'
      };
    }

    return {
      isValid: true,
      error: null
    };
  } catch (error) {
    console.error('Error in validatePlayerUniqueness:', error);
    return {
      isValid: false,
      error: 'Unable to check player name uniqueness. Please try again.'
    };
  }
};

/**
 * Checks if more players can be added
 * @param {Array} players - Current list of players
 * @returns {Object} - Validation result
 */
export const validatePlayerCount = (players = []) => {
  try {
    if (!Array.isArray(players)) {
      return {
        isValid: false,
        error: 'Invalid player list provided'
      };
    }

    if (players.length >= MAX_PLAYERS) {
      return {
        isValid: false,
        error: `Maximum ${MAX_PLAYERS} players allowed`
      };
    }

    return {
      isValid: true,
      error: null
    };
  } catch (error) {
    console.error('Error in validatePlayerCount:', error);
    return {
      isValid: false,
      error: 'Unable to validate player count. Please try again.'
    };
  }
};

/**
 * Comprehensive player validation
 * @param {string} name - Player name
 * @param {Array} players - Existing players list
 * @returns {Object} - Validation result
 */
export const validatePlayer = (name, players = []) => {
  try {
    // Validate player count first
    const countValidation = validatePlayerCount(players);
    if (!countValidation.isValid) {
      return countValidation;
    }

    // Validate player name
    const nameValidation = validatePlayerName(name);
    if (!nameValidation.isValid) {
      return nameValidation;
    }

    // Check uniqueness
    const uniquenessValidation = validatePlayerUniqueness(name, players);
    if (!uniquenessValidation.isValid) {
      return uniquenessValidation;
    }

    return {
      isValid: true,
      error: null
    };
  } catch (error) {
    console.error('Error in validatePlayer:', error);
    return {
      isValid: false,
      error: 'Validation failed. Please try again.'
    };
  }
};