/**
 * Scoreboard Module
 * Handles all scoreboard logic and DOM manipulation for the game
 */

// Scoreboard state
const scoreboardState = {
  players: [], // Array of player objects with {id, name, score, roundScores}
  currentRound: 1,
  gamePhase: 'active', // 'active', 'paused', 'ended'
  roundBreakdownVisible: false
};

/**
 * Data validation helper
 * @param {number} score - The score to validate
 * @returns {boolean} - True if score is valid
 */
function validateScore(score) {
  return typeof score === 'number' && !isNaN(score) && score >= 0;
}

/**
 * Data validation helper for player object
 * @param {object} player - The player object to validate
 * @returns {boolean} - True if player is valid
 */
function validatePlayer(player) {
  return (
    player &&
    typeof player === 'object' &&
    typeof player.id === 'string' &&
    typeof player.name === 'string' &&
    typeof player.score === 'number' &&
    !isNaN(player.score) &&
    player.score >= 0 &&
    Array.isArray(player.roundScores)
  );
}

/**
 * Add a new player to the scoreboard
 * @param {string} playerId - Unique player identifier
 * @param {string} playerName - Display name for the player
 * @returns {boolean} - True if player was added successfully
 */
function addPlayerToScoreboard(playerId, playerName) {
  // Validate inputs
  if (typeof playerId !== 'string' || !playerId.trim()) {
    console.error('Invalid player ID: must be a non-empty string');
    return false;
  }
  if (typeof playerName !== 'string' || !playerName.trim()) {
    console.error('Invalid player name: must be a non-empty string');
    return false;
  }

  // Check if player already exists
  if (scoreboardState.players.some(p => p.id === playerId)) {
    console.error(`Player with ID "${playerId}" already exists`);
    return false;
  }

  // Create new player object
  const newPlayer = {
    id: playerId,
    name: playerName.trim(),
    score: 0,
    roundScores: [] // Array to store scores for each round
  };

  // Add to state
  scoreboardState.players.push(newPlayer);
  console.log(`Player "${playerName}" added to scoreboard`);
  return true;
}

/**
 * Remove a player from the scoreboard
 * @param {string} playerId - Unique player identifier
 * @returns {boolean} - True if player was removed successfully
 */
function removePlayerFromScoreboard(playerId) {
  // Validate input
  if (typeof playerId !== 'string' || !playerId.trim()) {
    console.error('Invalid player ID: must be a non-empty string');
    return false;
  }

  const initialLength = scoreboardState.players.length;
  scoreboardState.players = scoreboardState.players.filter(p => p.id !== playerId);

  if (scoreboardState.players.length < initialLength) {
    console.log(`Player with ID "${playerId}" removed from scoreboard`);
    return true;
  }

  console.error(`Player with ID "${playerId}" not found`);
  return false;
}

/**
 * Update a player's score for the current round
 * @param {string} playerId - Unique player identifier
 * @param {number} roundScore - Score for this round
 * @returns {boolean} - True if score was updated successfully
 */
function updatePlayerScore(playerId, roundScore) {
  // Validate inputs
  if (typeof playerId !== 'string' || !playerId.trim()) {
    console.error('Invalid player ID: must be a non-empty string');
    return false;
  }
  if (!validateScore(roundScore)) {
    console.error('Invalid round score: must be a non-negative number');
    return false;
  }

  // Find player
  const player = scoreboardState.players.find(p => p.id === playerId);
  if (!player) {
    console.error(`Player with ID "${playerId}" not found`);
    return false;
  }

  // Update score
  player.score += roundScore;
  player.roundScores.push({
    round: scoreboardState.currentRound,
    score: roundScore
  });

  console.log(`Score updated for player "${player.name}": +${roundScore}`);
  return true;
}

/**
 * Get players sorted by score in descending order
 * @returns {array} - Array of players sorted by score (highest first)
 */
function getSortedPlayers() {
  return [...scoreboardState.players].sort((a, b) => b.score - a.score);
}

/**
 * Update and display the scoreboard in the DOM
 * Displays current player rankings in descending score order
 */
function updateScoreboard() {
  // Get sorted players
  const sortedPlayers = getSortedPlayers();

  // Get or create scoreboard container in DOM
  let scoreboardContainer = document.querySelector('.scoreboard-rankings');
  if (!scoreboardContainer) {
    const app = document.querySelector('#app');
    if (!app) {
      console.error('Cannot find #app container');
      return;
    }
    scoreboardContainer = document.createElement('div');
    scoreboardContainer.className = 'scoreboard-rankings';
    app.appendChild(scoreboardContainer);
  }

  // Build HTML for rankings
  if (sortedPlayers.length === 0) {
    scoreboardContainer.innerHTML = '<p>No players in the scoreboard yet.</p>';
    return;
  }

  let html = '<div class="rankings-list">';
  sortedPlayers.forEach((player, index) => {
    const rank = index + 1;
    html += `
      <div class="player-ranking" data-player-id="${player.id}">
        <span class="rank">#${rank}</span>
        <span class="player-name">${player.name}</span>
        <span class="player-score">${player.score} pts</span>
      </div>
    `;
  });
  html += '</div>';

  scoreboardContainer.innerHTML = html;
  console.log('Scoreboard updated in DOM');
}

/**
 * Toggle the visibility of round-by-round breakdown
 * @returns {boolean} - New visibility state
 */
function showRoundBreakdown() {
  scoreboardState.roundBreakdownVisible = !scoreboardState.roundBreakdownVisible;

  // Get or create breakdown container in DOM
  let breakdownContainer = document.querySelector('.scoreboard-breakdown');
  if (!breakdownContainer) {
    const app = document.querySelector('#app');
    if (!app) {
      console.error('Cannot find #app container');
      return scoreboardState.roundBreakdownVisible;
    }
    breakdownContainer = document.createElement('div');
    breakdownContainer.className = 'scoreboard-breakdown';
    app.appendChild(breakdownContainer);
  }

  if (scoreboardState.roundBreakdownVisible) {
    // Build HTML for breakdown
    let html = '<div class="breakdown-content"><h3>Round-by-Round Breakdown</h3>';

    if (scoreboardState.players.length === 0) {
      html += '<p>No player data available.</p>';
    } else {
      html += '<div class="breakdown-table">';
      scoreboardState.players.forEach(player => {
        html += `<div class="player-breakdown" data-player-id="${player.id}">`;
        html += `<h4>${player.name}</h4>`;
        if (player.roundScores.length === 0) {
          html += '<p>No round data.</p>';
        } else {
          html += '<ul>';
          player.roundScores.forEach(roundData => {
            html += `<li>Round ${roundData.round}: ${roundData.score} pts</li>`;
          });
          html += '</ul>';
        }
        html += '</div>';
      });
      html += '</div>';
    }

    html += '</div>';
    breakdownContainer.innerHTML = html;
    breakdownContainer.style.display = 'block';
    console.log('Round breakdown displayed');
  } else {
    // Hide breakdown
    breakdownContainer.style.display = 'none';
    console.log('Round breakdown hidden');
  }

  return scoreboardState.roundBreakdownVisible;
}

/**
 * Update the current round and game phase display
 * @param {number} roundNumber - The round number
 * @param {string} gamePhase - The game phase ('active', 'paused', 'ended')
 * @returns {boolean} - True if update was successful
 */
function updateCurrentRound(roundNumber, gamePhase = null) {
  // Validate round number
  if (typeof roundNumber !== 'number' || roundNumber < 1 || !Number.isInteger(roundNumber)) {
    console.error('Invalid round number: must be a positive integer');
    return false;
  }

  // Validate game phase if provided
  const validPhases = ['active', 'paused', 'ended'];
  if (gamePhase && !validPhases.includes(gamePhase)) {
    console.error(`Invalid game phase: must be one of ${validPhases.join(', ')}`);
    return false;
  }

  // Update state
  scoreboardState.currentRound = roundNumber;
  if (gamePhase) {
    scoreboardState.gamePhase = gamePhase;
  }

  // Update DOM
  let roundIndicator = document.querySelector('.round-indicator');
  if (!roundIndicator) {
    const app = document.querySelector('#app');
    if (!app) {
      console.error('Cannot find #app container');
      return false;
    }
    roundIndicator = document.createElement('div');
    roundIndicator.className = 'round-indicator';
    app.appendChild(roundIndicator);
  }

  const phaseDisplay = gamePhase || scoreboardState.gamePhase;
  roundIndicator.innerHTML = `
    <div class="round-info">
      <span class="round-number">Round ${roundNumber}</span>
      <span class="game-phase" data-phase="${phaseDisplay}">${phaseDisplay.toUpperCase()}</span>
    </div>
  `;
  roundIndicator.style.display = 'block';

  console.log(`Round updated: Round ${roundNumber}, Phase: ${phaseDisplay}`);
  return true;
}

/**
 * Get the current scoreboard state
 * @returns {object} - Current state object
 */
function getScoreboardState() {
  return {
    players: [...scoreboardState.players],
    currentRound: scoreboardState.currentRound,
    gamePhase: scoreboardState.gamePhase,
    roundBreakdownVisible: scoreboardState.roundBreakdownVisible
  };
}

/**
 * Reset the scoreboard to initial state
 */
function resetScoreboard() {
  scoreboardState.players = [];
  scoreboardState.currentRound = 1;
  scoreboardState.gamePhase = 'active';
  scoreboardState.roundBreakdownVisible = false;

  // Clear DOM elements
  const scoreboardContainer = document.querySelector('.scoreboard-rankings');
  if (scoreboardContainer) {
    scoreboardContainer.innerHTML = '';
  }
  const breakdownContainer = document.querySelector('.scoreboard-breakdown');
  if (breakdownContainer) {
    breakdownContainer.innerHTML = '';
  }
  const roundIndicator = document.querySelector('.round-indicator');
  if (roundIndicator) {
    roundIndicator.innerHTML = '';
  }

  console.log('Scoreboard reset');
}

/**
 * Initialize event listeners for scoreboard controls
 * Attaches listeners to common scoreboard UI elements
 */
function initializeEventListeners() {
  // Listen for update scoreboard button clicks
  const updateBtn = document.querySelector('[data-action="update-scoreboard"]');
  if (updateBtn) {
    updateBtn.addEventListener('click', updateScoreboard);
  }

  // Listen for toggle breakdown button clicks
  const toggleBtn = document.querySelector('[data-action="toggle-breakdown"]');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', showRoundBreakdown);
  }

  // Listen for next round button clicks
  const nextRoundBtn = document.querySelector('[data-action="next-round"]');
  if (nextRoundBtn) {
    nextRoundBtn.addEventListener('click', () => {
      const newRound = scoreboardState.currentRound + 1;
      updateCurrentRound(newRound);
    });
  }

  // Listen for reset button clicks
  const resetBtn = document.querySelector('[data-action="reset-scoreboard"]');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetScoreboard);
  }

  console.log('Scoreboard event listeners initialized');
}

// Export functions for use by the main game logic
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addPlayerToScoreboard,
    removePlayerFromScoreboard,
    updatePlayerScore,
    updateScoreboard,
    showRoundBreakdown,
    updateCurrentRound,
    getScoreboardState,
    resetScoreboard,
    initializeEventListeners,
    getSortedPlayers
  };
}

// Make functions available globally if not in a module environment
if (typeof window !== 'undefined') {
  window.scoreboardModule = {
    addPlayerToScoreboard,
    removePlayerFromScoreboard,
    updatePlayerScore,
    updateScoreboard,
    showRoundBreakdown,
    updateCurrentRound,
    getScoreboardState,
    resetScoreboard,
    initializeEventListeners,
    getSortedPlayers
  };
}
