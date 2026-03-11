import { calculateScore, validateBonusPoints, calculateTotalScore, getScorePreview, handleEdgeCases } from '../gameLogic.js';

describe('Game Logic Utilities', () => {
  describe('calculateScore', () => {
    test('should return 10 for zero bid with zero tricks', () => {
      expect(calculateScore(0, 0)).toBe(10);
    });
    
    test('should return -10 for zero bid with non-zero tricks', () => {
      expect(calculateScore(0, 1)).toBe(-10);
    });
    
    test('should return 20*bid for perfect non-zero bid', () => {
      expect(calculateScore(3, 3)).toBe(60);
      expect(calculateScore(5, 5)).toBe(100);
    });
    
    test('should return -10*bid for missed non-zero bid', () => {
      expect(calculateScore(3, 2)).toBe(-30);
      expect(calculateScore(4, 6)).toBe(-40);
    });
    
    test('should throw error for invalid inputs', () => {
      expect(() => calculateScore('invalid', 2)).toThrow();
      expect(() => calculateScore(-1, 2)).toThrow();
    });
  });
  
  describe('validateBonusPoints', () => {
    test('should return true when bid equals tricks taken', () => {
      expect(validateBonusPoints(0, 0)).toBe(true);
      expect(validateBonusPoints(3, 3)).toBe(true);
    });
    
    test('should return false when bid does not equal tricks taken', () => {
      expect(validateBonusPoints(2, 3)).toBe(false);
      expect(validateBonusPoints(0, 1)).toBe(false);
    });
    
    test('should return false for invalid inputs', () => {
      expect(validateBonusPoints('invalid', 2)).toBe(false);
      expect(validateBonusPoints(-1, 2)).toBe(false);
    });
  });
  
  describe('getScorePreview', () => {
    test('should include bonus points when bid is correct', () => {
      const preview = getScorePreview(3, 3, 20);
      expect(preview.bonusAllowed).toBe(true);
      expect(preview.bonusPoints).toBe(20);
      expect(preview.totalScore).toBe(80); // 60 + 20
    });
    
    test('should exclude bonus points when bid is incorrect', () => {
      const preview = getScorePreview(3, 2, 20);
      expect(preview.bonusAllowed).toBe(false);
      expect(preview.bonusPoints).toBe(0);
      expect(preview.totalScore).toBe(-30);
    });
  });
});