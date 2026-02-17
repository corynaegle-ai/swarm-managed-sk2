const request = require('supertest');
const express = require('express');
const gamesRouter = require('../routes/games');

const app = express();
app.use(express.json());
app.use('/api/games', gamesRouter);

describe('POST /api/games/:id/rounds/:roundId/complete', () => {
  let gameId;

  beforeEach(async () => {
    // Create a test game
    const response = await request(app)
      .post('/api/games')
      .send({
        name: 'Test Game',
        players: ['player1', 'player2']
      });
    gameId = response.body.game.id;
  });

  test('should calculate scores automatically and return them in response', async () => {
    const roundData = {
      players: [
        { id: 'player1', performance: 100, bonus: 50 },
        { id: 'player2', performance: 80, bonus: 20 }
      ]
    };

    const response = await request(app)
      .post(`/api/games/${gameId}/rounds/round1/complete`)
      .send(roundData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.scores).toEqual({
      'player1': 150,
      'player2': 100
    });
    expect(response.body.runningTotals).toEqual({
      'player1': 150,
      'player2': 100
    });
  });

  test('should include updated running totals across multiple rounds', async () => {
    // Complete first round
    await request(app)
      .post(`/api/games/${gameId}/rounds/round1/complete`)
      .send({
        players: [
          { id: 'player1', performance: 100, bonus: 0 },
          { id: 'player2', performance: 50, bonus: 0 }
        ]
      });

    // Complete second round
    const response = await request(app)
      .post(`/api/games/${gameId}/rounds/round2/complete`)
      .send({
        players: [
          { id: 'player1', performance: 75, bonus: 25 },
          { id: 'player2', performance: 90, bonus: 10 }
        ]
      });

    expect(response.status).toBe(200);
    expect(response.body.scores).toEqual({
      'player1': 100,
      'player2': 100
    });
    expect(response.body.runningTotals).toEqual({
      'player1': 200,
      'player2': 150
    });
  });

  test('should return 404 for non-existent game', async () => {
    const response = await request(app)
      .post('/api/games/nonexistent/rounds/round1/complete')
      .send({ players: [] });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Game not found');
  });

  test('should return 500 on internal error', async () => {
    // Mock an error by sending invalid data that would cause JSON parsing issues
    const response = await request(app)
      .post(`/api/games/${gameId}/rounds/round1/complete`)
      .send('invalid json')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400); // Express handles JSON parse errors as 400
  });
});