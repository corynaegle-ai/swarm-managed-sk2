/**
 * Tricks Game Application
 * Main application logic for managing game state and UI interactions
 */

// Game state object
const gameState = {
  players: [],
  currentRound: 1,
  totalRounds: 13,
  scores: {}
};

/**
 * Initialize the game with players
 * @param {array} playerNames - Array of player names
 */
function initializeGame(playerNames) {
  gameState.players = playerNames;
  gameState.currentRound = 1;
  gameState.scores = {};
  
  // Initialize score tracking for each player
  playerNames.forEach(player => {
    gameState.scores[player] = {
      roundScores: [],
      totalScore: 0
    };
  });
}

/**
 * Get current round number
 * @returns {number} - Current round number
 */
function getCurrentRound() {
  return gameState.currentRound;
}

/**
 * Update player score for current round
 * @param {string} playerName - Name of player
 * @param {number} bid - Bid for the round
 * @param {number} tricks - Tricks won in the round
 */
function updatePlayerScore(playerName, bid, tricks) {
  if (!gameState.scores[playerName]) {
    gameState.scores[playerName] = {
      roundScores: [],
      totalScore: 0
    };
  }
  
  // Calculate round score
  const scoreResult = calculateRoundScore(bid, tricks);
  
  // Store round score
  gameState.scores[playerName].roundScores.push({
    round: gameState.currentRound,
    bid: bid,
    tricks: tricks,
    score: scoreResult.roundScore
  });
  
  // Update total score
  gameState.scores[playerName].totalScore += scoreResult.roundScore;
  
  return scoreResult;
}

/**
 * Get player's total score
 * @param {string} playerName - Name of player
 * @returns {number} - Total score for player
 */
function getPlayerTotalScore(playerName) {
  return gameState.scores[playerName]?.totalScore || 0;
}

/**
 * Get player's round scores
 * @param {string} playerName - Name of player
 * @returns {array} - Array of round scores
 */
function getPlayerRoundScores(playerName) {
  return gameState.scores[playerName]?.roundScores || [];
}

/**
 * Move to next round
 */
function advanceRound() {
  if (gameState.currentRound < gameState.totalRounds) {
    gameState.currentRound++;
  }
}

/**
 * Set up form event handlers
 */
function setupFormHandlers() {
  const trickForm = document.getElementById('trick-form');
  const bidInput = document.getElementById('bid-input');
  const tricksInput = document.getElementById('tricks-input');
  const scorePreview = document.getElementById('score-preview');
  const roundScoreDisplay = document.getElementById('round-score-display');
  const errorDisplay = document.getElementById('error-message');
  const successDisplay = document.getElementById('success-message');
  
  if (!trickForm) return; // Form not present on page
  
  // Real-time score preview as user types
  const updateScorePreview = () => {
    const bid = bidInput?.value;
    const tricks = tricksInput?.value;
    
    // Clear error message
    if (errorDisplay) {
      errorDisplay.textContent = '';
      errorDisplay.style.display = 'none';
      errorDisplay.style.color = '';
    }
    
    // Don't show preview if fields empty
    if (!bid || !tricks) {
      if (scorePreview) {
        scorePreview.textContent = '';
        scorePreview.style.display = 'none';
      }
      return;
    }
    
    // Validate inputs
    const bidValidation = validateBid(bid, gameState.currentRound);
    const tricksValidation = validateTricks(tricks, gameState.currentRound);
    
    if (!bidValidation.isValid || !tricksValidation.isValid) {
      if (scorePreview) {
        scorePreview.textContent = '';
        scorePreview.style.display = 'none';
      }
      return;
    }
    
    // Calculate and display round score
    const scoreResult = calculateRoundScore(bid, tricks);
    if (scorePreview) {
      const bonusIndicator = scoreResult.metBid ? ' ✓ BONUS MET!' : '';
      scorePreview.textContent = `Round Score: ${scoreResult.roundScore} (Base: ${scoreResult.baseScore}, Bonus: ${scoreResult.bonusScore})${bonusIndicator}`;
      scorePreview.style.display = 'block';
    }
  };
  
  // Add input event listeners for real-time preview
  if (bidInput) {
    bidInput.addEventListener('input', updateScorePreview);
  }
  if (tricksInput) {
    tricksInput.addEventListener('input', updateScorePreview);
  }
  
  // Form submission handler
  trickForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const bid = bidInput?.value;
    const tricks = tricksInput?.value;
    const playerSelect = document.getElementById('player-select');
    const playerName = playerSelect?.value;
    
    // Clear previous messages
    if (errorDisplay) {
      errorDisplay.textContent = '';
      errorDisplay.style.display = 'none';
      errorDisplay.style.color = '';
    }
    if (successDisplay) {
      successDisplay.textContent = '';
      successDisplay.style.display = 'none';
    }
    
    // Validate all inputs are present
    if (!playerName || !bid || !tricks) {
      if (errorDisplay) {
        errorDisplay.textContent = 'Please fill in all fields';
        errorDisplay.style.display = 'block';
        errorDisplay.style.color = '';
      }
      return;
    }
    
    // Validate bid
    const bidValidation = validateBid(bid, gameState.currentRound);
    if (!bidValidation.isValid) {
      if (errorDisplay) {
        errorDisplay.textContent = bidValidation.error;
        errorDisplay.style.display = 'block';
        errorDisplay.style.color = '';
      }
      return;
    }
    
    // Validate tricks
    const tricksValidation = validateTricks(tricks, gameState.currentRound);
    if (!tricksValidation.isValid) {
      if (errorDisplay) {
        errorDisplay.textContent = tricksValidation.error;
        errorDisplay.style.display = 'block';
        errorDisplay.style.color = '';
      }
      return;
    }
    
    // All validation passed - calculate score first
    try {
      const scoreResult = calculateRoundScore(bid, tricks);
      
      // Display round score BEFORE adding to total (Acceptance Criterion 6)
      if (roundScoreDisplay) {
        const bonusText = scoreResult.metBid ? ' (BONUS MET!)' : '';
        roundScoreDisplay.innerHTML = `
          <div style="padding: 10px; background-color: #f0f0f0; border-radius: 4px; margin-bottom: 10px;">
            <strong>Round ${gameState.currentRound} Score Preview:</strong><br>
            Bid: ${bid}, Tricks: ${tricks}<br>
            Base Score: ${scoreResult.baseScore}, Bonus: ${scoreResult.bonusScore}<br>
            <strong>Round Score: ${scoreResult.roundScore}${bonusText}</strong>
          </div>
        `;
        roundScoreDisplay.style.display = 'block';
      }
      
      // Now update player score (adds to total)
      updatePlayerScore(playerName, bid, tricks);
      
      // Display updated scores
      updateScoreDisplay(playerName, scoreResult);
      
      // Clear form
      bidInput.value = '';
      tricksInput.value = '';
      
      // Clear score preview
      if (scorePreview) {
        scorePreview.textContent = '';
        scorePreview.style.display = 'none';
      }
      
      // Show success message
      if (successDisplay) {
        successDisplay.textContent = `Score recorded for ${playerName}! Round ${gameState.currentRound} score of ${scoreResult.roundScore} added to total.`;
        successDisplay.style.display = 'block';
        setTimeout(() => {
          if (successDisplay) {
            successDisplay.style.display = 'none';
          }
        }, 3000);
      }
    } catch (error) {
      if (errorDisplay) {
        errorDisplay.textContent = 'Error recording score: ' + error.message;
        errorDisplay.style.display = 'block';
        errorDisplay.style.color = '';
      }
    }
  });
}

/**
 * Update score display after submission
 * @param {string} playerName - Name of player
 * @param {object} scoreResult - Result from calculateRoundScore
 */
function updateScoreDisplay(playerName, scoreResult) {
  // Update round score display
  const roundScoreElement = document.getElementById(`round-score-${playerName}`);
  if (roundScoreElement) {
    roundScoreElement.textContent = scoreResult.roundScore;
  }
  
  // Update total score display
  const totalScoreElement = document.getElementById(`total-score-${playerName}`);
  if (totalScoreElement) {
    const totalScore = getPlayerTotalScore(playerName);
    totalScoreElement.textContent = totalScore;
  }
  
  // Update score breakdown display if available
  const scoreBreakdownElement = document.getElementById(`score-breakdown-${playerName}`);
  if (scoreBreakdownElement) {
    const roundScores = getPlayerRoundScores(playerName);
    const lastRound = roundScores[roundScores.length - 1];
    scoreBreakdownElement.textContent = `Round ${lastRound.round}: Bid ${lastRound.bid}, Tricks ${lastRound.tricks} = ${lastRound.score}`;
  }
}

/**
 * Initialize application when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupFormHandlers();
  });
} else {
  setupFormHandlers();
}
