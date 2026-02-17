import { sanitizePlayerName, validatePlayerName, checkDuplicateName } from './playerValidation';

describe('playerValidation', () => {
  describe('sanitizePlayerName', () => {
    it('should trim whitespace from player name', () => {
      expect(sanitizePlayerName('  John  ')).toBe('John');
    });
    
    it('should handle empty strings', () => {
      expect(sanitizePlayerName('')).toBe('');
    });
    
    it('should handle null/undefined', () => {
      expect(sanitizePlayerName(null)).toBe('');
      expect(sanitizePlayerName(undefined)).toBe('');
    });
  });

  describe('validatePlayerName', () => {
    it('should reject names shorter than 2 characters', () => {
      expect(validatePlayerName('A')).toBe('Name must be at least 2 characters long');
      expect(validatePlayerName('')).toBe('Name must be at least 2 characters long');
    });
    
    it('should reject names longer than 20 characters', () => {
      const longName = 'This name is way too long';
      expect(validatePlayerName(longName)).toBe('Name must be 20 characters or less');
    });
    
    it('should reject names with invalid characters', () => {
      expect(validatePlayerName('John@Doe')).toContain('invalid characters');
      expect(validatePlayerName('Player#1')).toContain('invalid characters');
    });
    
    it('should accept valid names', () => {
      expect(validatePlayerName('John')).toBe(null);
      expect(validatePlayerName('Player_1')).toBe(null);
      expect(validatePlayerName('Mary-Jane')).toBe(null);
      expect(validatePlayerName('Dr. Smith')).toBe(null);
    });
  });

  describe('checkDuplicateName', () => {
    const existingPlayers = [
      { name: 'John' },
      { name: 'Jane' },
      { name: 'Bob' }
    ];
    
    it('should detect duplicate names (case insensitive)', () => {
      expect(checkDuplicateName('john', existingPlayers)).toBe('A player with this name already exists');
      expect(checkDuplicateName('JANE', existingPlayers)).toBe('A player with this name already exists');
    });
    
    it('should allow unique names', () => {
      expect(checkDuplicateName('Alice', existingPlayers)).toBe(null);
    });
    
    it('should handle empty or invalid players array', () => {
      expect(checkDuplicateName('John', [])).toBe(null);
      expect(checkDuplicateName('John', null)).toBe(null);
      expect(checkDuplicateName('John', undefined)).toBe(null);
    });
  });
});