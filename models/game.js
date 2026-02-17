const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true
  },
  players: [{
    id: String,
    name: String,
    scores: {
      rounds: [Number],  // Score for each round
      total: {
        type: Number,
        default: 0
      }
    }
  }],
  currentRound: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed'],
    default: 'waiting'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
GameSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Get current round and total scores for all players
GameSchema.methods.getPlayerScores = function() {
  try {
    const playerScores = {};
    
    this.players.forEach(player => {
      const currentRoundIndex = this.currentRound - 1;
      const currentRoundScore = player.scores.rounds[currentRoundIndex] || 0;
      
      playerScores[player.id] = {
        playerId: player.id,
        playerName: player.name,
        currentRoundScore: currentRoundScore,
        totalScore: player.scores.total,
        roundScores: [...player.scores.rounds]
      };
    });
    
    return playerScores;
  } catch (error) {
    throw new Error(`Failed to get player scores: ${error.message}`);
  }
};

// Update scores for the current round
GameSchema.methods.updateRoundScores = async function(roundScores) {
  try {
    const currentRoundIndex = this.currentRound - 1;
    
    // Update each player's round score and recalculate total
    this.players.forEach(player => {
      if (roundScores[player.id] !== undefined) {
        // Ensure rounds array has enough elements
        while (player.scores.rounds.length <= currentRoundIndex) {
          player.scores.rounds.push(0);
        }
        
        // Update the round score
        player.scores.rounds[currentRoundIndex] = roundScores[player.id];
        
        // Recalculate total score
        player.scores.total = player.scores.rounds.reduce((sum, score) => sum + score, 0);
      }
    });
    
    // Save the updated game state
    await this.save();
    
    return this.getPlayerScores();
  } catch (error) {
    throw new Error(`Failed to update round scores: ${error.message}`);
  }
};

// Get cumulative scores across all rounds for all players
GameSchema.methods.getRunningTotals = function() {
  try {
    const runningTotals = {};
    
    this.players.forEach(player => {
      const runningScores = [];
      let cumulativeScore = 0;
      
      // Calculate running totals for each round
      player.scores.rounds.forEach(roundScore => {
        cumulativeScore += roundScore;
        runningScores.push(cumulativeScore);
      });
      
      runningTotals[player.id] = {
        playerId: player.id,
        playerName: player.name,
        runningTotals: runningScores,
        finalTotal: player.scores.total,
        roundCount: player.scores.rounds.length
      };
    });
    
    return runningTotals;
  } catch (error) {
    throw new Error(`Failed to get running totals: ${error.message}`);
  }
};

// Static method to find game by ID
GameSchema.statics.findByGameId = function(gameId) {
  return this.findOne({ gameId });
};

// Instance method to add a new player
GameSchema.methods.addPlayer = function(playerId, playerName) {
  const existingPlayer = this.players.find(p => p.id === playerId);
  if (existingPlayer) {
    throw new Error('Player already exists in this game');
  }
  
  this.players.push({
    id: playerId,
    name: playerName,
    scores: {
      rounds: [],
      total: 0
    }
  });
};

// Instance method to advance to next round
GameSchema.methods.nextRound = function() {
  this.currentRound += 1;
  return this.currentRound;
};

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;