import { validatePlayerCount, getPlayerRequirements } from './playerValidation';

describe('playerValidation', () => {
  describe('validatePlayerCount', () => {
    it('should return invalid for less than 2 players', () => {
      const result = validatePlayerCount(1);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Need at least 2 players');
    });

    it('should return invalid for more than 8 players', () => {
      const result = validatePlayerCount(9);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Maximum 8 players allowed');
    });

    it('should return valid for 2-6 players', () => {
      const result = validatePlayerCount(4);
      expect(result.isValid).toBe(true);
      expect(result.message).toContain('Ready to start with 4 players');
    });

    it('should return valid with warning for 7-8 players', () => {
      const result = validatePlayerCount(7);
      expect(result.isValid).toBe(true);
      expect(result.message).toContain('Approaching maximum capacity');
    });

    it('should handle edge case of 0 players', () => {
      const result = validatePlayerCount(0);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Currently have 0');
    });
  });

  describe('getPlayerRequirements', () => {
    it('should return correct min and max values', () => {
      const requirements = getPlayerRequirements();
      expect(requirements.min).toBe(2);
      expect(requirements.max).toBe(8);
    });
  });
});