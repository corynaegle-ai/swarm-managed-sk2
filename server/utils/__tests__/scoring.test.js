const { calculateScore, validateBonusPoints, calculateTotalScore, getScorePreview, handleEdgeCases, calculateRoundScores } = require('../scoring.js');

describe('Server Scoring Utilities', () => {
  describe('calculateScore', () => {
    test('should handle zero bid edge case', () => {
      expect(calculateScore(0, 0)).toBe(10);
      expect(calculateScore(0, 1)).toBe(-10);
    });
    
    test('should handle perfect scores', () => {
      expect(calculateScore(1, 1)).toBe(20);
      expect(calculateScore(5, 5)).toBe(100);
    });
    
    test('should handle missed bids', () => {
      expect(calculateScore(3, 1)).toBe(-30);
      expect(calculateScore(2, 4)).toBe(-20);
    });
  });
  
  describe('calculateRoundScores', () => {
    test('should calculate scores for multiple players', () => {
      const players = [
        { id: 'player1', bid: 2, tricksTaken: 2, bonusPoints: 10 },
        { id: 'player2', bid: 3, tricksTaken: 1, bonusPoints: 0 },
        { id: 'player3', bid: 0, tricksTaken: 0, bonusPoints: 5 }
      ];
      
      const results = calculateRoundScores(players);
      
      expect(results[0].totalScore).toBe(50); // 40 + 10
      expect(results[1].totalScore).toBe(-30);
      expect(results[2].totalScore).toBe(15); // 10 + 5
    });
    
    test('should handle player with invalid data gracefully', () => {
      const players = [
        { id: 'player1', bid: 'invalid', tricksTaken: 2 }
      ];
      
      const results = calculateRoundScores(players);
      expect(results[0].error).toBeDefined();
      expect(results[0].totalScore).toBe(0);
    });
  });
});