const request = require('supertest');
const express = require('express');
const gamesRouter = require('../routes/games');
const db = require('../db/database');

const app = express();
app.use(express.json());
app.use('/games', gamesRouter);

// Mock database
jest.mock('../db/database');

describe('Games Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /games/:gameId/rounds/:roundId/complete', () => {
    it('should store calculated scores in player_scores table', async () => {
      const mockTransaction = {
        begin: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn(),
        prepare: jest.fn(() => ({
          run: jest.fn(),
          get: jest.fn(() => ({ total: 150 }))
        }))
      };
      
      db.transaction.mockReturnValue(mockTransaction);

      const response = await request(app)
        .post('/games/game1/rounds/round1/complete')
        .send({
          playerScores: [
            { playerId: 'player1', score: 100 },
            { playerId: 'player2', score: 85 }
          ]
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockTransaction.begin).toHaveBeenCalled();
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should handle database errors with rollback', async () => {
      const mockTransaction = {
        begin: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn(),
        prepare: jest.fn(() => {
          throw new Error('Database error');
        })
      };
      
      db.transaction.mockReturnValue(mockTransaction);

      const response = await request(app)
        .post('/games/game1/rounds/round1/complete')
        .send({
          playerScores: [
            { playerId: 'player1', score: 100 }
          ]
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to store scores');
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should validate player scores input', async () => {
      const response = await request(app)
        .post('/games/game1/rounds/round1/complete')
        .send({
          playerScores: 'invalid'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid player scores data');
    });
  });

  describe('GET /games/:gameId/scores', () => {
    it('should fetch player scores from database', async () => {
      const mockScores = [
        { player_id: 'player1', round_id: 'round1', round_score: 100, running_total: 100 }
      ];
      
      db.prepare.mockReturnValue({
        all: jest.fn().mockReturnValue(mockScores)
      });

      const response = await request(app)
        .get('/games/game1/scores');

      expect(response.status).toBe(200);
      expect(response.body.scores).toEqual(mockScores);
    });
  });
});