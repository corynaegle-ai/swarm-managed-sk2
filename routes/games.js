const express = require('express');
const router = express.Router();

// In-memory storage for games (replace with database in production)
const games = new Map();
const rounds = new Map();

// Helper function to calculate scores for a round
function calculateRoundScores(roundData) {
  // Basic scoring logic - can be extended based on game rules
  const scores = {};
  
  if (roundData.players && Array.isArray(roundData.players)) {
    roundData.players.forEach(player => {
      // Example scoring: base score + bonus points
      const baseScore = player.performance || 0;
      const bonusPoints = player.bonus || 0;
      scores[player.id] = baseScore + bonusPoints;
    });
  }
  
  return scores;
}

// Helper function to update running totals
function updateRunningTotals(gameId, roundScores) {
  const game = games.get(gameId);
  if (!game) return {};
  
  // Initialize or update running totals
  if (!game.runningTotals) {
    game.runningTotals = {};
  }
  
  Object.entries(roundScores).forEach(([playerId, score]) => {
    if (!game.runningTotals[playerId]) {
      game.runningTotals[playerId] = 0;
    }
    game.runningTotals[playerId] += score;
  });
  
  return game.runningTotals;
}

// POST /api/games/:id/rounds/:roundId/complete
router.post('/:id/rounds/:roundId/complete', async (req, res) => {
  try {
    const { id: gameId, roundId } = req.params;
    const roundData = req.body;
    
    // Validate game exists
    if (!games.has(gameId)) {
      return res.status(404).json({
        error: 'Game not found',
        gameId: gameId
      });
    }
    
    // Validate round exists
    const roundKey = `${gameId}-${roundId}`;
    if (!rounds.has(roundKey)) {
      // Create round if it doesn't exist
      rounds.set(roundKey, {
        id: roundId,
        gameId: gameId,
        status: 'in_progress',
        ...roundData
      });
    }
    
    const round = rounds.get(roundKey);
    
    // Calculate scores for this round
    const calculatedScores = calculateRoundScores(roundData);
    
    // Update running totals
    const updatedTotals = updateRunningTotals(gameId, calculatedScores);
    
    // Mark round as complete
    round.status = 'completed';
    round.scores = calculatedScores;
    round.completedAt = new Date().toISOString();
    
    // Update round in storage
    rounds.set(roundKey, round);
    
    // Return success response with calculated scores and updated totals
    res.status(200).json({
      success: true,
      round: {
        id: roundId,
        gameId: gameId,
        status: 'completed',
        completedAt: round.completedAt
      },
      scores: calculatedScores,
      runningTotals: updatedTotals,
      message: 'Round completed successfully'
    });
    
  } catch (error) {
    console.error('Error completing round:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to complete round'
    });
  }
});

// GET /api/games/:id - Get game details
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  if (!games.has(id)) {
    return res.status(404).json({
      error: 'Game not found',
      gameId: id
    });
  }
  
  const game = games.get(id);
  res.status(200).json(game);
});

// POST /api/games - Create new game
router.post('/', (req, res) => {
  const gameData = req.body;
  const gameId = `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const newGame = {
    id: gameId,
    createdAt: new Date().toISOString(),
    status: 'active',
    runningTotals: {},
    ...gameData
  };
  
  games.set(gameId, newGame);
  
  res.status(201).json({
    success: true,
    game: newGame
  });
});

module.exports = router;