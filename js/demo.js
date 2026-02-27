import { scoreEngine } from './scoreEngine.js';

let demoForm;
let demoBidInput;
let demoTricksInput;
let demoRoundInput;
let demoErrorDiv;
let demoResultsDiv;
let demoResultsContent;

/**
 * Initialize the demo module by setting up DOM references and event listeners.
 * Called after DOM is ready.
 */
function initializeDemo() {
  demoForm = document.getElementById('demo-form');
  demoBidInput = document.getElementById('demo-bid');
  demoTricksInput = document.getElementById('demo-tricks');
  demoRoundInput = document.getElementById('demo-round');
  demoErrorDiv = document.getElementById('demo-error');
  demoResultsDiv = document.getElementById('demo-results');
  demoResultsContent = document.getElementById('demo-results-content');

  if (demoForm) {
    demoForm.addEventListener('submit', handleDemoSubmit);
  }
}

/**
 * Validate user input values.
 * @param {number} bid - The bid value (1-13)
 * @param {number} tricks - The tricks taken (0-13)
 * @param {number} round - The round number (1-10)
 * @returns {string|null} Error message if validation fails, null if valid
 */
function validateInputs(bid, tricks, round) {
  if (bid < 1 || bid > 13) {
    return 'Bid must be between 1 and 13.';
  }
  if (tricks < 0 || tricks > 13) {
    return 'Tricks taken must be between 0 and 13.';
  }
  if (round < 1 || round > 10) {
    return 'Round number must be between 1 and 10.';
  }
  return null;
}

/**
 * Display an error message in the demo error div.
 * @param {string} message - The error message to display
 */
function displayError(message) {
  demoErrorDiv.textContent = message;
  demoErrorDiv.style.display = 'block';
  demoResultsDiv.style.display = 'none';
}

/**
 * Display the scoring calculation results.
 * @param {object} scoreResult - The ScoreCalculation object returned by scoreEngine
 * @param {number} bid - The bid value
 * @param {number} tricks - The tricks taken
 * @param {number} round - The round number
 */
function displayResults(scoreResult, bid, tricks, round) {
  demoErrorDiv.style.display = 'none';
  demoResultsDiv.style.display = 'block';

  // Build the results HTML using textContent for user-derived and engine-derived data
  const resultsHTML = `
    <p><strong>Bid:</strong> <span>${bid}</span></p>
    <p><strong>Tricks Taken:</strong> <span>${tricks}</span></p>
    <p><strong>Round:</strong> <span>${round}</span></p>
    <p><strong>Points:</strong> <span>${scoreResult.points}</span></p>
    <p><strong>Bid Met:</strong> <span>${scoreResult.bidMet ? 'Yes' : 'No'}</span></p>
    <p><strong>Breakdown:</strong></p>
    <ul>
      <li>Base Points: <span>${scoreResult.breakdown.basePoints}</span></li>
      <li>Bonus Points: <span>${scoreResult.breakdown.bonusPoints}</span></li>
      <li>Penalty: <span>${scoreResult.breakdown.penalty}</span></li>
    </ul>
  `;

  demoResultsContent.innerHTML = resultsHTML;
}

/**
 * Handle demo form submission.
 * Validates inputs, calls scoreEngine.calculateScore(), and displays results.
 */
function handleDemoSubmit(event) {
  event.preventDefault();

  // Parse input values
  const bid = parseInt(demoBidInput.value, 10);
  const tricks = parseInt(demoTricksInput.value, 10);
  const round = parseInt(demoRoundInput.value, 10);

  // Validate inputs
  const validationError = validateInputs(bid, tricks, round);
  if (validationError) {
    displayError(validationError);
    return;
  }

  // Call the score engine to calculate the score
  let scoreResult;
  try {
    scoreResult = scoreEngine.calculateScore(bid, tricks, round);
  } catch (error) {
    displayError(`Error calculating score: ${error.message}`);
    return;
  }

  // Display the results
  displayResults(scoreResult, bid, tricks, round);
}

// Initialize the demo when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDemo);
} else {
  initializeDemo();
}
