const mongoose = require('mongoose');

const GAME_PHASES = {
  BIDDING: 'bidding',
  SCORING: 'scoring',
  ROUND_COMPLETE: 'round_complete',
  GAME_COMPLETE: 'game_complete'
};

const gameSchema = new mongoose.Schema({
  players: [{
    id: String,
    name: String,
    score: { type: Number, default: 0 },
    bid: Number,
    tricksTaken: Number,
    bonusPoints: { type: Number, default: 0 }
  }],
  currentRound: { type: Number, default: 1 },
  phase: { type: String, enum: Object.values(GAME_PHASES), default: GAME_PHASES.BIDDING },
  currentPlayerIndex: { type: Number, default: 0 },
  handsInRound: { type: Number, default: 1 },
  bidsCollected: { type: Number, default: 0 },
  scoresCollected: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

gameSchema.methods.transitionToScoringPhase = function() {
  if (this.phase === GAME_PHASES.BIDDING && this.bidsCollected === this.players.length) {
    this.phase = GAME_PHASES.SCORING;
    this.currentPlayerIndex = 0;
    this.scoresCollected = 0;
    this.updatedAt = new Date();
    return true;
  }
  return false;
};

gameSchema.methods.scorePlayer = function(playerId, tricksTaken, bonusPoints = 0) {
  if (this.phase !== GAME_PHASES.SCORING) {
    throw new Error('Game is not in scoring phase');
  }

  const player = this.players.find(p => p.id === playerId);
  if (!player) {
    throw new Error('Player not found');
  }

  // Validate tricks taken
  if (tricksTaken < 0 || tricksTaken > this.handsInRound) {
    throw new Error(`Tricks taken must be between 0 and ${this.handsInRound}`);
  }

  // Validate bonus points - only allowed if bid was correct
  const bidCorrect = player.bid === tricksTaken;
  if (bonusPoints > 0 && !bidCorrect) {
    throw new Error('Bonus points only allowed if bid was correct');
  }

  // Update player data
  player.tricksTaken = tricksTaken;
  player.bonusPoints = bonusPoints;

  // Calculate score
  let roundScore = 0;
  if (bidCorrect) {
    roundScore = 10 + tricksTaken + bonusPoints;
  } else {
    roundScore = tricksTaken;
  }

  player.score += roundScore;
  this.scoresCollected++;
  this.updatedAt = new Date();

  // Advance to next player or complete round
  if (this.scoresCollected < this.players.length) {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  } else {
    this.phase = GAME_PHASES.ROUND_COMPLETE;
  }

  return {
    player: {
      id: player.id,
      name: player.name,
      bid: player.bid,
      tricksTaken: player.tricksTaken,
      bonusPoints: player.bonusPoints,
      roundScore: roundScore,
      totalScore: player.score
    },
    nextPlayer: this.scoresCollected < this.players.length ? this.players[this.currentPlayerIndex] : null
  };
};

module.exports = mongoose.model('Game', gameSchema);
module.exports.GAME_PHASES = GAME_PHASES;