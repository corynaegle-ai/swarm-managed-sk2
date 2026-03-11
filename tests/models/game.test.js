const mongoose = require('mongoose');
const Game = require('../../models/game');

// Mock MongoDB connection for testing
beforeAll(async () => {
  const url = 'mongodb://127.0.0.1/test_game_scores';
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Game.deleteMany({});
});

describe('Game Model - Score Tracking', () => {
  let testGame;
  
  beforeEach(async () => {
    testGame = new Game({
      gameId: 'TEST-001',
      players: [
        {
          id: 'player1',
          name: 'Alice',
          scores: {
            rounds: [10, 15],
            total: 25
          }
        },
        {
          id: 'player2',
          name: 'Bob',
          scores: {
            rounds: [12, 18],
            total: 30
          }
        }
      ],
      currentRound: 2
    });
    await testGame.save();
  });
  
  describe('getPlayerScores()', () => {
    test('should return current round and total scores for all players', () => {
      const scores = testGame.getPlayerScores();
      
      expect(scores.player1).toBeDefined();
      expect(scores.player1.currentRoundScore).toBe(15);
      expect(scores.player1.totalScore).toBe(25);
      expect(scores.player1.playerName).toBe('Alice');
      
      expect(scores.player2).toBeDefined();
      expect(scores.player2.currentRoundScore).toBe(18);
      expect(scores.player2.totalScore).toBe(30);
      expect(scores.player2.playerName).toBe('Bob');
    });
    
    test('should handle missing current round score', () => {
      testGame.currentRound = 5; // Round that doesn't exist
      const scores = testGame.getPlayerScores();
      
      expect(scores.player1.currentRoundScore).toBe(0);
      expect(scores.player2.currentRoundScore).toBe(0);
    });
  });
  
  describe('updateRoundScores()', () => {
    test('should update scores and recalculate totals', async () => {
      const newScores = {
        player1: 20,
        player2: 22
      };
      
      const updatedScores = await testGame.updateRoundScores(newScores);
      
      expect(updatedScores.player1.currentRoundScore).toBe(20);
      expect(updatedScores.player1.totalScore).toBe(30); // 10 + 20
      expect(updatedScores.player2.currentRoundScore).toBe(22);
      expect(updatedScores.player2.totalScore).toBe(34); // 12 + 22
    });
    
    test('should expand rounds array if needed', async () => {
      testGame.currentRound = 5;
      const newScores = {
        player1: 25
      };
      
      await testGame.updateRoundScores(newScores);
      
      expect(testGame.players[0].scores.rounds.length).toBe(5);
      expect(testGame.players[0].scores.rounds[4]).toBe(25);
    });
  });
  
  describe('getRunningTotals()', () => {
    test('should return cumulative scores across all rounds', () => {
      const runningTotals = testGame.getRunningTotals();
      
      expect(runningTotals.player1.runningTotals).toEqual([10, 25]);
      expect(runningTotals.player1.finalTotal).toBe(25);
      expect(runningTotals.player1.roundCount).toBe(2);
      
      expect(runningTotals.player2.runningTotals).toEqual([12, 30]);
      expect(runningTotals.player2.finalTotal).toBe(30);
      expect(runningTotals.player2.roundCount).toBe(2);
    });
    
    test('should handle empty rounds array', () => {
      testGame.players[0].scores.rounds = [];
      testGame.players[0].scores.total = 0;
      
      const runningTotals = testGame.getRunningTotals();
      
      expect(runningTotals.player1.runningTotals).toEqual([]);
      expect(runningTotals.player1.finalTotal).toBe(0);
      expect(runningTotals.player1.roundCount).toBe(0);
    });
  });
});