import { validatePlayerName, checkDuplicateName, sanitizePlayerName } from '../playerValidation';

describe('validatePlayerName', () => {
  test('returns true for valid names', () => {
    expect(validatePlayerName('John')).toBe(true);
    expect(validatePlayerName('Player 1')).toBe(true);
    expect(validatePlayerName('Player-2')).toBe(true);
    expect(validatePlayerName('AB')).toBe(true);
    expect(validatePlayerName('A'.repeat(20))).toBe(true);
  });
  
  test('returns false for invalid names', () => {
    expect(validatePlayerName('A')).toBe(false); // too short
    expect(validatePlayerName('A'.repeat(21))).toBe(false); // too long
    expect(validatePlayerName('Player@123')).toBe(false); // invalid character
    expect(validatePlayerName('')).toBe(false); // empty
    expect(validatePlayerName('  ')).toBe(false); // only spaces
    expect(validatePlayerName(null)).toBe(false); // null
    expect(validatePlayerName(undefined)).toBe(false); // undefined
  });
});

describe('checkDuplicateName', () => {
  test('detects duplicate names case-insensitively', () => {
    const existingPlayers = ['John', 'Jane', 'Player 1'];
    expect(checkDuplicateName('john', existingPlayers)).toBe(true);
    expect(checkDuplicateName('JANE', existingPlayers)).toBe(true);
    expect(checkDuplicateName('player 1', existingPlayers)).toBe(true);
  });
  
  test('returns false for unique names', () => {
    const existingPlayers = ['John', 'Jane'];
    expect(checkDuplicateName('Bob', existingPlayers)).toBe(false);
    expect(checkDuplicateName('Player 1', existingPlayers)).toBe(false);
  });
  
  test('handles object arrays with name property', () => {
    const existingPlayers = [{ name: 'John' }, { name: 'Jane' }];
    expect(checkDuplicateName('john', existingPlayers)).toBe(true);
    expect(checkDuplicateName('Bob', existingPlayers)).toBe(false);
  });
});

describe('sanitizePlayerName', () => {
  test('trims whitespace and normalizes spaces', () => {
    expect(sanitizePlayerName('  John  ')).toBe('John');
    expect(sanitizePlayerName('Player   1')).toBe('Player 1');
    expect(sanitizePlayerName('\tJohn\n')).toBe('John');
    expect(sanitizePlayerName('A   B   C')).toBe('A B C');
  });
  
  test('handles edge cases', () => {
    expect(sanitizePlayerName('')).toBe('');
    expect(sanitizePlayerName('   ')).toBe('');
    expect(sanitizePlayerName(null)).toBe('');
    expect(sanitizePlayerName(undefined)).toBe('');
  });
});