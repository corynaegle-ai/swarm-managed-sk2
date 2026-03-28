const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/games/:gameId/scoreboard
// Returns current standings with player names, round-by-round scores, and running totals
router.get('/:gameId/scoreboard', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // Validate gameId is a valid UUID or number
    if (!gameId) {
      return res.status(400).json({ error: 'Game ID is required' });
    }
    
    // Check if game exists and get game info
    const gameQuery = `
      SELECT id, status, current_round, created_at, updated_at
      FROM games 
      WHERE id = ?
    `;
    
    const game = await db.get(gameQuery, [gameId]);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    // Get player standings with round-by-round scores
    const standingsQuery = `
      SELECT 
        p.id as player_id,
        p.name as player_name,
        s.round_number,
        s.score as round_score
      FROM players p
      LEFT JOIN scores s ON p.id = s.player_id AND s.game_id = ?
      WHERE p.game_id = ?
      ORDER BY p.id, s.round_number
    `;
    
    const rawScores = await db.all(standingsQuery, [gameId, gameId]);
    
    // Process scores to create player standings with running totals
    const playersMap = new Map();
    
    rawScores.forEach(row => {
      if (!playersMap.has(row.player_id)) {
        playersMap.set(row.player_id, {
          player_id: row.player_id,
          player_name: row.player_name,
          round_scores: [],
          running_total: 0
        });
      }
      
      const player = playersMap.get(row.player_id);
      
      if (row.round_number && row.round_score !== null) {
        player.round_scores.push({
          round: row.round_number,
          score: row.round_score
        });
        player.running_total += row.round_score;
      }
    });
    
    // Convert map to array and sort by running total (descending)
    const standings = Array.from(playersMap.values())
      .sort((a, b) => b.running_total - a.running_total);
    
    // Build response
    const response = {
      game_id: game.id,
      game_status: game.status,
      current_round: game.current_round || 1,
      standings: standings,
      total_players: standings.length,
      last_updated: game.updated_at
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Error fetching scoreboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;