import { validatePlayerName, validatePlayerUniqueness, validatePlayerCount, validatePlayer, MAX_PLAYERS } from './playerValidation';

describe('playerValidation', () => {
  describe('validatePlayerName', () => {
    it('should validate valid names', () => {
      expect(validatePlayerName('John')).toEqual({ isValid: true, error: null });
      expect(validatePlayerName('Alice Smith')).toEqual({ isValid: true, error: null });
    });

    it('should reject empty names', () => {
      expect(validatePlayerName('')).toEqual({ isValid: false, error: 'Player name cannot be empty' });
      expect(validatePlayerName('   ')).toEqual({ isValid: false, error: 'Player name cannot be empty' });
    });

    it('should reject short names', () => {
      expect(validatePlayerName('A')).toEqual({ isValid: false, error: 'Player name must be at least 2 characters long' });
    });

    it('should reject long names', () => {
      const longName = 'A'.repeat(51);
      expect(validatePlayerName(longName)).toEqual({ isValid: false, error: 'Player name cannot exceed 50 characters' });
    });

    it('should handle validation errors gracefully', () => {
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      // Force an error by passing null
      const result = validatePlayerName(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Player name is required');
      
      console.error = originalConsoleError;
    });
  });

  describe('validatePlayerUniqueness', () => {
    const players = [
      { name: 'John' },
      { name: 'Alice' }
    ];

    it('should allow unique names', () => {
      expect(validatePlayerUniqueness('Bob', players)).toEqual({ isValid: true, error: null });
    });

    it('should reject duplicate names', () => {
      expect(validatePlayerUniqueness('John', players)).toEqual({ isValid: false, error: 'A player with this name already exists' });
    });

    it('should be case insensitive', () => {
      expect(validatePlayerUniqueness('JOHN', players)).toEqual({ isValid: false, error: 'A player with this name already exists' });
    });
  });

  describe('validatePlayerCount', () => {
    it('should allow adding when under limit', () => {
      const players = new Array(MAX_PLAYERS - 1).fill({ name: 'Player' });
      expect(validatePlayerCount(players)).toEqual({ isValid: true, error: null });
    });

    it('should reject when at max capacity', () => {
      const players = new Array(MAX_PLAYERS).fill({ name: 'Player' });
      expect(validatePlayerCount(players)).toEqual({ 
        isValid: false, 
        error: `Maximum ${MAX_PLAYERS} players allowed` 
      });
    });
  });

  describe('validatePlayer', () => {
    it('should validate comprehensive player data', () => {
      const players = [{ name: 'John' }];
      expect(validatePlayer('Alice', players)).toEqual({ isValid: true, error: null });
    });

    it('should handle all validation failures', () => {
      const players = new Array(MAX_PLAYERS).fill({ name: 'Player' });
      const result = validatePlayer('NewPlayer', players);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Maximum');
    });
  });
});