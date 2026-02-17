const request = require('supertest');
const express = require('express');
const gamesRouter = require('../routes/games');
const db = require('../database/db');

// Mock the database
jest.mock('../database/db');

const app = express();
app.use('/api/games', gamesRouter);

describe('GET /api/games/:gameId/scoreboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return scoreboard for valid game ID', async () => {
    const mockGame = {
      id: 'game-123',
      status: 'active',
      current_round: 2,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T01:00:00Z'
    };

    const mockScores = [
      { player_id: 'p1', player_name: 'Alice', round_number: 1, round_score: 10 },
      { player_id: 'p1', player_name: 'Alice', round_number: 2, round_score: 15 },
      { player_id: 'p2', player_name: 'Bob', round_number: 1, round_score: 12 },
      { player_id: 'p2', player_name: 'Bob', round_number: 2, round_score: 8 }
    ];

    db.get.mockResolvedValue(mockGame);
    db.all.mockResolvedValue(mockScores);

    const response = await request(app)
      .get('/api/games/game-123/scoreboard')
      .expect(200);

    expect(response.body).toHaveProperty('game_id', 'game-123');
    expect(response.body).toHaveProperty('game_status', 'active');
    expect(response.body).toHaveProperty('current_round', 2);
    expect(response.body.standings).toHaveLength(2);
    expect(response.body.standings[0]).toHaveProperty('running_total', 25);
    expect(response.body.standings[1]).toHaveProperty('running_total', 20);
  });

  test('should return 404 for non-existent game', async () => {
    db.get.mockResolvedValue(null);

    const response = await request(app)
      .get('/api/games/nonexistent/scoreboard')
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Game not found');
  });

  test('should handle database errors gracefully', async () => {
    db.get.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .get('/api/games/game-123/scoreboard')
      .expect(500);

    expect(response.body).toHaveProperty('error', 'Internal server error');
  });
});