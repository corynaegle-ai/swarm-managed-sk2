/**
 * bidding.js - Bid collection and validation module
 * Handles player bid input, validation, and submission
 */

(function() {
    'use strict';
    
    // Module state
    let gameState = {
        currentRound: 1,
        handsAvailable: 1,
        players: [],
        bids: {}
    };
    
    /**
     * Initialize the bidding interface
     * @param {number} round - Current round number
     * @param {number} hands - Number of hands available
     * @param {Array<string>} playerNames - Array of player names
     */
    function initializeBidding(round, hands, playerNames) {
        gameState.currentRound = round;
        gameState.handsAvailable = hands;
        gameState.players = playerNames || ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
        gameState.bids = {};
        
        updateRoundInfo();
        createPlayerBidInputs();
        attachFormHandlers();
    }
    
    /**
     * Update round and hands display
     */
    function updateRoundInfo() {
        const roundElement = document.getElementById('current-round');
        const handsElement = document.getElementById('hands-available');
        
        if (roundElement) roundElement.textContent = gameState.currentRound;
        if (handsElement) handsElement.textContent = gameState.handsAvailable;
    }
    
    /**
     * Create input fields for each player
     */
    function createPlayerBidInputs() {
        const container = document.getElementById('player-bids-container');
        
        if (!container) return;
        
        // Clear existing inputs
        container.innerHTML = '';
        
        // Create input for each player
        gameState.players.forEach((playerName, index) => {
            const fieldset = document.createElement('fieldset');
            fieldset.className = 'player-bid-input';
            
            const legend = document.createElement('legend');
            legend.textContent = playerName;
            fieldset.appendChild(legend);
            
            const label = document.createElement('label');
            label.setAttribute('for', `bid-${index}`);
            label.textContent = `${playerName}'s Bid:`;
            
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `bid-${index}`;
            input.name = `bid-${index}`;
            input.min = '0';
            input.max = gameState.currentRound.toString();
            input.required = true;
            input.dataset.playerIndex = index;
            input.dataset.playerName = playerName;
            
            fieldset.appendChild(label);
            fieldset.appendChild(input);
            container.appendChild(fieldset);
        });
    }
    
    /**
     * Validate all bids
     * Ensures no bid exceeds the round number
     * @returns {boolean} true if all bids are valid
     */
    function validateBids() {
        const inputs = document.querySelectorAll('input[type="number"]');
        let isValid = true;
        let errorMessages = [];
        
        inputs.forEach(input => {
            const bidValue = input.value;
            
            // Check if bid is empty
            if (bidValue === '' || bidValue === null) {
                isValid = false;
                errorMessages.push(`${input.dataset.playerName}: Bid is required`);
                return;
            }
            
            const bidNum = parseInt(bidValue, 10);
            
            // Check if bid is within valid range
            if (isNaN(bidNum) || bidNum < 0 || bidNum > gameState.currentRound) {
                isValid = false;
                errorMessages.push(`${input.dataset.playerName}: Bid must be between 0 and ${gameState.currentRound}`);
            }
        });
        
        // Display error messages if validation fails
        if (!isValid) {
            displayBidError(errorMessages.join(' | '));
        }
        
        return isValid;
    }
    
    /**
     * Collect all bids from form inputs
     * @returns {Array<number>|null} Array of player bids or null if incomplete
     */
    function collectAllBids() {
        if (!validateBids()) {
            return null;
        }
        
        const inputs = document.querySelectorAll('input[type="number"]');
        const bids = [];
        
        inputs.forEach(input => {
            const bidValue = parseInt(input.value, 10);
            bids.push(bidValue);
            gameState.bids[input.dataset.playerName] = bidValue;
        });
        
        return bids;
    }
    
    /**
     * Handle bid form submission
     * @param {Event} event - Form submission event
     */
    function handleBidSubmission(event) {
        event.preventDefault();
        
        const bids = collectAllBids();
        
        if (bids === null) {
            // Validation failed, error already displayed
            return;
        }
        
        // Clear error message on successful submission
        clearBidError();
        
        // Show success state
        displaySuccessState();
    }
    
    /**
     * Display bid validation error message
     * @param {string} message - Error message to display
     */
    function displayBidError(message) {
        const errorElement = document.getElementById('bid-error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    /**
     * Clear bid validation error message
     */
    function clearBidError() {
        const errorElement = document.getElementById('bid-error-message');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    /**
     * Display success state and allow proceeding to next phase
     */
    function displaySuccessState() {
        const formSection = document.getElementById('bid-form-section');
        const successSection = document.getElementById('bid-success-message');
        
        if (formSection) formSection.style.display = 'none';
        if (successSection) successSection.style.display = 'block';
    }
    
    /**
     * Attach event handlers to form
     */
    function attachFormHandlers() {
        const bidForm = document.getElementById('bid-form');
        const proceedBtn = document.getElementById('proceed-btn');
        
        if (bidForm) {
            bidForm.addEventListener('submit', handleBidSubmission);
        }
        
        if (proceedBtn) {
            proceedBtn.addEventListener('click', function() {
                // Trigger custom event for game flow
                const event = new CustomEvent('bids-submitted', {
                    detail: { bids: gameState.bids }
                });
                document.dispatchEvent(event);
            });
        }
    }
    
    /**
     * Reset the bidding interface for a new round
     */
    function resetBidding() {
        const formSection = document.getElementById('bid-form-section');
        const successSection = document.getElementById('bid-success-message');
        const bidForm = document.getElementById('bid-form');
        
        if (formSection) formSection.style.display = 'block';
        if (successSection) successSection.style.display = 'none';
        if (bidForm) bidForm.reset();
        
        clearBidError();
    }
    
    // Export public API
    window.biddingModule = {
        initialize: initializeBidding,
        validateBids: validateBids,
        collectAllBids: collectAllBids,
        handleBidSubmission: handleBidSubmission,
        resetBidding: resetBidding,
        getGameState: function() { return gameState; }
    };
    
    // Auto-initialize if bidding form exists in DOM
    if (document.getElementById('bid-form')) {
        // Default initialization - can be customized before page load
        initializeBidding(1, 1, ['Player 1', 'Player 2', 'Player 3', 'Player 4']);
    }
})();
