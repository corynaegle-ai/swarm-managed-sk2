const request = require('supertest');
const app = require('../server/app');
const Game = require('../server/models/Game');

describe('Scoring Phase Tests', () => {
  let gameId;
  
  beforeEach(async () => {
    const game = new Game({
      players: [
        { id: 'player1', name: 'Alice', bid: 2 },
        { id: 'player2', name: 'Bob', bid: 1 }
      ],
      handsInRound: 3,
      phase: 'bidding',
      bidsCollected: 2
    });
    await game.save();
    gameId = game._id;
  });

  test('should validate tricks taken within range', async () => {
    const response = await request(app)
      .post(`/api/games/${gameId}/score-player`)
      .send({ playerId: 'player1', tricksTaken: 5 });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Tricks taken must be between 0 and 3');
  });

  test('should only allow bonus points if bid was correct', async () => {
    const response = await request(app)
      .post(`/api/games/${gameId}/score-player`)
      .send({ playerId: 'player1', tricksTaken: 1, bonusPoints: 5 });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bonus points only allowed if bid was correct');
  });

  test('should return calculated score before advancing', async () => {
    const response = await request(app)
      .post(`/api/games/${gameId}/score-player`)
      .send({ playerId: 'player1', tricksTaken: 2, bonusPoints: 3 });
    
    expect(response.status).toBe(200);
    expect(response.body.data.scoredPlayer.roundScore).toBe(15); // 10 + 2 + 3
    expect(response.body.data.nextPlayer.id).toBe('player2');
  });
});