const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Round completion handler
router.post('/:gameId/rounds/:roundId/complete', (req, res) => {
  const { gameId, roundId } = req.params;
  const { playerScores } = req.body; // Expected format: [{ playerId, score }]

  if (!playerScores || !Array.isArray(playerScores)) {
    return res.status(400).json({ error: 'Invalid player scores data' });
  }

  // Validate each player score entry
  for (const entry of playerScores) {
    if (!entry.playerId || typeof entry.playerId !== 'string') {
      return res.status(400).json({ error: 'Invalid playerId: must be a non-empty string' });
    }
    if (typeof entry.score !== 'number' || isNaN(entry.score)) {
      return res.status(400).json({ error: 'Invalid score: must be a number' });
    }
  }

  try {
    // Use better-sqlite3 transaction pattern
    const transaction = db.transaction((playerScores) => {
      for (const { playerId, score } of playerScores) {
        // Insert the individual round score
        const insertScoreQuery = `
          INSERT INTO player_scores (game_id, player_id, round_id, round_score, created_at)
          VALUES (?, ?, ?, ?, datetime('now'))
        `;
        
        db.prepare(insertScoreQuery).run(gameId, playerId, roundId, score);

        // Calculate running total by querying existing scores
        const runningTotalQuery = `
          SELECT COALESCE(SUM(round_score), 0) as total
          FROM player_scores 
          WHERE game_id = ? AND player_id = ?
        `;
        
        const result = db.prepare(runningTotalQuery).get(gameId, playerId);
        const runningTotal = result.total;

        // Update the running total for this player in the current record
        const updateTotalQuery = `
          UPDATE player_scores 
          SET running_total = ?
          WHERE game_id = ? AND player_id = ? AND round_id = ?
        `;
        
        db.prepare(updateTotalQuery).run(runningTotal, gameId, playerId, roundId);
      }
    });

    // Execute transaction
    transaction(playerScores);

    res.json({ 
      success: true, 
      message: 'Round completed and scores stored successfully',
      gameId,
      roundId
    });

  } catch (error) {
    console.error('Database error during round completion:', error);
    res.status(500).json({ 
      error: 'Failed to store scores', 
      details: error.message 
    });
  }
});

// Get player scores for a game
router.get('/:gameId/scores', (req, res) => {
  const { gameId } = req.params;

  try {
    const query = `
      SELECT 
        player_id,
        round_id,
        round_score,
        running_total,
        created_at
      FROM player_scores 
      WHERE game_id = ?
      ORDER BY player_id, round_id
    `;
    
    const scores = db.prepare(query).all(gameId);
    res.json({ gameId, scores });

  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ 
      error: 'Failed to fetch scores', 
      details: error.message 
    });
  }
});

module.exports = router;