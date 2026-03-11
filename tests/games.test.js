const request = require('supertest');
const express = require('express');
const gamesRouter = require('../routes/games');
const db = require('../db/database');

const app = express();
app.use(express.json());
app.use('/games', gamesRouter);

describe('Games Routes - Score Storage', () => {
  beforeEach(() => {
    // Clean up test data
    db.prepare('DELETE FROM player_scores WHERE game_id LIKE "test_%"').run();
  });

  afterEach(() => {
    // Clean up test data
    db.prepare('DELETE FROM player_scores WHERE game_id LIKE "test_%"').run();
  });

  describe('POST /:gameId/rounds/:roundId/complete', () => {
    it('should store calculated scores in player_scores table', async () => {
      const gameId = 'test_game_1';
      const roundId = 'round_1';
      const playerScores = [
        { playerId: 'player1', score: 100 },
        { playerId: 'player2', score: 150 }
      ];

      const response = await request(app)
        .post(`/games/${gameId}/rounds/${roundId}/complete`)
        .send({ playerScores })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify scores are stored
      const storedScores = db.prepare(`
        SELECT player_id, round_score, running_total 
        FROM player_scores 
        WHERE game_id = ? AND round_id = ?
      `).all(gameId, roundId);

      expect(storedScores).toHaveLength(2);
      expect(storedScores.find(s => s.player_id === 'player1')).toMatchObject({
        round_score: 100,
        running_total: 100
      });
      expect(storedScores.find(s => s.player_id === 'player2')).toMatchObject({
        round_score: 150,
        running_total: 150
      });
    });

    it('should calculate running totals correctly across multiple rounds', async () => {
      const gameId = 'test_game_2';
      const playerScores1 = [{ playerId: 'player1', score: 100 }];
      const playerScores2 = [{ playerId: 'player1', score: 50 }];

      // First round
      await request(app)
        .post(`/games/${gameId}/rounds/round_1/complete`)
        .send({ playerScores: playerScores1 })
        .expect(200);

      // Second round
      await request(app)
        .post(`/games/${gameId}/rounds/round_2/complete`)
        .send({ playerScores: playerScores2 })
        .expect(200);

      // Verify running totals
      const allScores = db.prepare(`
        SELECT round_id, round_score, running_total 
        FROM player_scores 
        WHERE game_id = ? AND player_id = ?
        ORDER BY round_id
      `).all(gameId, 'player1');

      expect(allScores).toHaveLength(2);
      expect(allScores[0]).toMatchObject({
        round_id: 'round_1',
        round_score: 100,
        running_total: 100
      });
      expect(allScores[1]).toMatchObject({
        round_id: 'round_2',
        round_score: 50,
        running_total: 150
      });
    });

    it('should handle database errors with proper error response', async () => {
      const gameId = 'test_game_3';
      const roundId = 'round_1';
      const playerScores = [
        { playerId: null, score: 100 } // Invalid data to trigger error
      ];

      const response = await request(app)
        .post(`/games/${gameId}/rounds/${roundId}/complete`)
        .send({ playerScores })
        .expect(400);

      expect(response.body.error).toContain('Invalid playerId');
    });

    it('should rollback transaction on database errors', async () => {
      const gameId = 'test_game_4';
      const roundId = 'round_1';
      
      // First insert valid data
      const validScores = [{ playerId: 'player1', score: 100 }];
      await request(app)
        .post(`/games/${gameId}/rounds/${roundId}/complete`)
        .send({ playerScores: validScores })
        .expect(200);

      // Verify data exists
      let storedScores = db.prepare(`
        SELECT COUNT(*) as count FROM player_scores WHERE game_id = ?
      `).get(gameId);
      expect(storedScores.count).toBe(1);

      // Try to insert invalid data (should trigger validation error)
      const invalidScores = [{ playerId: '', score: 'invalid' }];
      await request(app)
        .post(`/games/${gameId}/rounds/round_2/complete`)
        .send({ playerScores: invalidScores })
        .expect(400);

      // Verify original data is still there (no corruption)
      storedScores = db.prepare(`
        SELECT COUNT(*) as count FROM player_scores WHERE game_id = ?
      `).get(gameId);
      expect(storedScores.count).toBe(1); // Should still be 1
    });
  });

  describe('GET /:gameId/scores', () => {
    it('should retrieve stored scores correctly', async () => {
      const gameId = 'test_game_5';
      
      // Insert test data
      const playerScores = [
        { playerId: 'player1', score: 100 },
        { playerId: 'player2', score: 200 }
      ];
      
      await request(app)
        .post(`/games/${gameId}/rounds/round_1/complete`)
        .send({ playerScores })
        .expect(200);

      // Retrieve scores
      const response = await request(app)
        .get(`/games/${gameId}/scores`)
        .expect(200);

      expect(response.body.gameId).toBe(gameId);
      expect(response.body.scores).toHaveLength(2);
      expect(response.body.scores).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            player_id: 'player1',
            round_score: 100,
            running_total: 100
          }),
          expect.objectContaining({
            player_id: 'player2',
            round_score: 200,
            running_total: 200
          })
        ])
      );
    });
  });
});
