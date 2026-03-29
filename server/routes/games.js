const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// POST /api/games/:gameId/score-player
router.post('/:gameId/score-player', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { playerId, tricksTaken, bonusPoints = 0 } = req.body;

    // Validate required fields
    if (!playerId || tricksTaken === undefined || tricksTaken === null) {
      return res.status(400).json({
        error: 'Missing required fields: playerId and tricksTaken are required'
      });
    }

    // Validate data types
    if (typeof tricksTaken !== 'number' || !Number.isInteger(tricksTaken)) {
      return res.status(400).json({
        error: 'tricksTaken must be an integer'
      });
    }

    if (typeof bonusPoints !== 'number' || !Number.isInteger(bonusPoints)) {
      return res.status(400).json({
        error: 'bonusPoints must be an integer'
      });
    }

    // Find the game
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Transition to scoring phase if still in bidding
    if (game.phase === 'bidding') {
      const transitioned = game.transitionToScoringPhase();
      if (!transitioned) {
        return res.status(400).json({
          error: 'Cannot transition to scoring phase - not all bids collected'
        });
      }
    }

    // Score the player
    const result = game.scorePlayer(playerId, tricksTaken, bonusPoints);

    // Save the game
    await game.save();

    // Return the calculated score and game state
    res.json({
      success: true,
      data: {
        scoredPlayer: result.player,
        nextPlayer: result.nextPlayer,
        gamePhase: game.phase,
        scoresCollected: game.scoresCollected,
        totalPlayers: game.players.length
      }
    });

  } catch (error) {
    console.error('Error scoring player:', error);
    
    // Handle validation errors
    if (error.message.includes('Tricks taken must be between') ||
        error.message.includes('Bonus points only allowed') ||
        error.message.includes('Player not found') ||
        error.message.includes('Game is not in scoring phase')) {
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;