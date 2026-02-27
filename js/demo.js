import { scoreEngine } from '../app.js';

// Get DOM elements
const demoForm = document.getElementById('demo-form');
const bidInput = document.getElementById('demo-bid');
const tricksInput = document.getElementById('demo-tricks');
const roundInput = document.getElementById('demo-round');
const calculateBtn = document.getElementById('demo-calculate-btn');
const errorDiv = document.getElementById('demo-error');
const resultsDiv = document.getElementById('demo-results');
const resultsContent = document.getElementById('demo-results-content');

// Handle form submission
demoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Clear previous error and results
    errorDiv.style.display = 'none';
    resultsDiv.style.display = 'none';
    errorDiv.textContent = '';
    resultsContent.innerHTML = '';
    
    // Get input values
    const bid = parseInt(bidInput.value, 10);
    const tricks = parseInt(tricksInput.value, 10);
    const round = parseInt(roundInput.value, 10);
    
    // Validate inputs
    if (isNaN(bid) || isNaN(tricks) || isNaN(round)) {
        showError('Please enter valid numbers for all fields.');
        return;
    }
    
    if (bid < 1 || bid > 13) {
        showError('Bid must be between 1 and 13.');
        return;
    }
    
    if (tricks < 0 || tricks > 13) {
        showError('Tricks taken must be between 0 and 13.');
        return;
    }
    
    if (round < 1 || round > 10) {
        showError('Round number must be between 1 and 10.');
        return;
    }
    
    try {
        // Calculate score using the score engine
        const scoreResult = scoreEngine.calculateScore(bid, tricks, round);
        
        // Display results
        displayResults(scoreResult, bid, tricks, round);
    } catch (error) {
        showError('Error calculating score: ' + error.message);
    }
});

// Show error message
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Display calculation results
function displayResults(scoreResult, bid, tricks, round) {
    const bidMet = tricks >= bid;
    const bidMetStatus = bidMet ? '✓ Bid Met' : '✗ Bid Not Met';
    
    let html = `
        <p><strong>Round:</strong> ${round}</p>
        <p><strong>Bid:</strong> ${bid} | <strong>Tricks Taken:</strong> ${tricks}</p>
        <p><strong>Status:</strong> <span class="bid-status ${bidMet ? 'bid-met' : 'bid-not-met'}">${bidMetStatus}</span></p>
        <p><strong>Points Earned:</strong> <span class="score-points">${scoreResult.points}</span></p>
    `;
    
    if (scoreResult.breakdown) {
        html += `<p><strong>Breakdown:</strong> ${scoreResult.breakdown}</p>`;
    }
    
    resultsContent.innerHTML = html;
    resultsDiv.style.display = 'block';
}
/**
 * Score Engine Demo Module
 * Provides interactive demonstration of the scoring engine with form inputs
 * and results display.
 */

import { scoreEngine } from './scoreEngine.js';

/**
 * Initialize the demo module
 */
function initializeDemo() {
    const demoForm = document.getElementById('demo-form');
    const errorElement = document.getElementById('demo-error');
    
    if (!demoForm) {
        console.error('Demo form element not found');
        return;
    }
    
    demoForm.addEventListener('submit', handleDemoSubmit);
}

/**
 * Handle demo form submission
 * @param {Event} event - Form submission event
 */
function handleDemoSubmit(event) {
    event.preventDefault();
    
    const bid = parseInt(document.getElementById('demo-bid').value, 10);
    const tricks = parseInt(document.getElementById('demo-tricks').value, 10);
    const round = parseInt(document.getElementById('demo-round').value, 10);
    
    const errorElement = document.getElementById('demo-error');
    const resultsElement = document.getElementById('demo-results');
    
    // Validate inputs
    const validationError = validateInputs(bid, tricks, round);
    if (validationError) {
        displayError(validationError);
        resultsElement.style.display = 'none';
        return;
    }
    
    // Clear any previous errors
    errorElement.style.display = 'none';
    errorElement.textContent = '';
    
    try {
        // Calculate score using the score engine
        const calculation = scoreEngine.calculateScore(bid, tricks, round);
        
        // Display results
        displayResults(calculation, bid, tricks, round);
    } catch (error) {
        displayError(`Error calculating score: ${error.message}`);
        resultsElement.style.display = 'none';
    }
}

/**
 * Validate input values
 * @param {number} bid - The bid value
 * @param {number} tricks - The tricks value
 * @param {number} round - The round value
 * @returns {string|null} Error message or null if valid
 */
function validateInputs(bid, tricks, round) {
    if (isNaN(bid) || bid < 1 || bid > 13) {
        return 'Bid must be between 1 and 13';
    }
    if (isNaN(tricks) || tricks < 0 || tricks > 13) {
        return 'Tricks must be between 0 and 13';
    }
    if (isNaN(round) || round < 1 || round > 10) {
        return 'Round must be between 1 and 10';
    }
    return null;
}

/**
 * Display error message
 * @param {string} message - Error message to display
 */
function displayError(message) {
    const errorElement = document.getElementById('demo-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Display calculation results
 * @param {Object} calculation - Score calculation result object
 * @param {number} bid - The bid value used
 * @param {number} tricks - The tricks value used
 * @param {number} round - The round value used
 */
function displayResults(calculation, bid, tricks, round) {
    const resultsElement = document.getElementById('demo-results');
    const resultsContent = document.getElementById('demo-results-content');
    
    if (!resultsElement || !resultsContent) {
        console.error('Results elements not found');
        return;
    }
    
    // Create results HTML
    let resultsHTML = '<div class="results-summary">';
    
    // Main results
    resultsHTML += `<div class="result-item">`;
    resultsHTML += `<strong>Points:</strong> <span class="result-value">${calculation.points}</span>`;
    resultsHTML += `</div>`;
    
    resultsHTML += `<div class="result-item">`;
    resultsHTML += `<strong>Bid Met:</strong> <span class="result-value ${calculation.bidMet ? 'bid-met-true' : 'bid-met-false'}">${calculation.bidMet ? 'Yes' : 'No'}</span>`;
    resultsHTML += `</div>`;
    
    // Breakdown details
    resultsHTML += `</div>`;
    resultsHTML += `<div class="results-breakdown">`;
    resultsHTML += `<h4>Calculation Breakdown</h4>`;
    resultsHTML += `<ul>`;
    
    resultsHTML += `<li><strong>Round:</strong> ${round}</li>`;
    resultsHTML += `<li><strong>Bid:</strong> ${bid}</li>`;
    resultsHTML += `<li><strong>Tricks Taken:</strong> ${tricks}</li>`;
    
    if (calculation.breakdown) {
        if (calculation.breakdown.baseTrickPoints !== undefined) {
            resultsHTML += `<li><strong>Base Trick Points:</strong> ${calculation.breakdown.baseTrickPoints}</li>`;
        }
        if (calculation.breakdown.bidBonus !== undefined) {
            resultsHTML += `<li><strong>Bid Bonus:</strong> ${calculation.breakdown.bidBonus}</li>`;
        }
        if (calculation.breakdown.overtrickPoints !== undefined) {
            resultsHTML += `<li><strong>Overtrick Points:</strong> ${calculation.breakdown.overtrickPoints}</li>`;
        }
        if (calculation.breakdown.penalty !== undefined) {
            resultsHTML += `<li><strong>Penalty:</strong> ${calculation.breakdown.penalty}</li>`;
        }
    }
    
    resultsHTML += `</ul>`;
    resultsHTML += `</div>`;
    
    // Update content and display
    resultsContent.innerHTML = resultsHTML;
    resultsElement.style.display = 'block';
}

// Initialize demo when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDemo);
} else {
    initializeDemo();
}