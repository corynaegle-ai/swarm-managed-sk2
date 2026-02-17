const { calculateScore, validateBonusPoints, getScorePreview, handleZeroBid } = require('../server/utils/scoring');

describe('Scoring Utilities', () => {
  describe('calculateScore', () => {
    test('correct bid gets base score', () => {
      expect(calculateScore(3, 3)).toBe(13); // 10 + 3
    });
    
    test('incorrect bid gets penalty', () => {
      expect(calculateScore(3, 2)).toBe(-1);
    });
    
    test('zero bid handled correctly', () => {
      expect(calculateScore(0, 0)).toBe(10);
    });
  });
  
  describe('validateBonusPoints', () => {
    test('allows bonus for correct bid', () => {
      expect(validateBonusPoints(3, 3)).toBe(true);
    });
    
    test('denies bonus for incorrect bid', () => {
      expect(validateBonusPoints(3, 2)).toBe(false);
    });
  });
  
  describe('getScorePreview', () => {
    test('updates correctly for perfect score', () => {
      const preview = getScorePreview(3, 3, 5);
      expect(preview.totalScore).toBe(18);
      expect(preview.isCorrect).toBe(true);
    });
  });
  
  describe('handleZeroBid', () => {
    test('handles zero bid edge case', () => {
      expect(handleZeroBid(0, 0)).toBe(10);
      expect(handleZeroBid(0, 1)).toBe(-1);
    });
  });
});