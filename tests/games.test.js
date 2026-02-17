const request = require('supertest');
const express = require('express');
const gamesRouter = require('../routes/games');

const app = express();
app.use(express.json());
app.use('/api/games', gamesRouter);

describe('Games API', () => {
  let gameId;
  
  beforeEach(async () => {
    // Create a test game
    const response = await request(app)
      .post('/api/games')
      .send({
        name: 'Test Game',
        players: [
          { id: 'player1', name: 'Player 1' },
          { id: 'player2', name: 'Player 2' }
        ]
      });
    
    gameId = response.body.game.id;
  });
  
  describe('POST /api/games/:id/rounds/:roundId/complete', () => {
    it('should calculate scores automatically', async () => {
      const roundData = {
        players: [
          { id: 'player1', performance: 100, bonus: 20 },
          { id: 'player2', performance: 80, bonus: 10 }
        ]
      };
      
      const response = await request(app)
        .post(`/api/games/${gameId}/rounds/round1/complete`)
        .send(roundData)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.scores).toEqual({
        'player1': 120,
        'player2': 90
      });
    });
    
    it('should include calculated scores and updated totals in response', async () => {
      const roundData = {
        players: [
          { id: 'player1', performance: 100, bonus: 20 },
          { id: 'player2', performance: 80, bonus: 10 }
        ]
      };
      
      const response = await request(app)
        .post(`/api/games/${gameId}/rounds/round1/complete`)
        .send(roundData)
        .expect(200);
      
      // Should include scores
      expect(response.body.scores).toBeDefined();
      expect(typeof response.body.scores).toBe('object');
      
      // Should include running totals
      expect(response.body.runningTotals).toBeDefined();
      expect(typeof response.body.runningTotals).toBe('object');
      
      // Verify totals match scores for first round
      expect(response.body.runningTotals).toEqual(response.body.scores);
    });
    
    it('should return 404 for non-existent game', async () => {
      await request(app)
        .post('/api/games/nonexistent/rounds/round1/complete')
        .send({})
        .expect(404);
    });
    
    it('should handle errors gracefully', async () => {
      // Test with malformed data
      const response = await request(app)
        .post(`/api/games/${gameId}/rounds/round1/complete`)
        .send({ invalid: 'data' })
        .expect(200); // Should still work, just with empty scores
      
      expect(response.body.success).toBe(true);
      expect(response.body.scores).toEqual({});
    });
  });
});