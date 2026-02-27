/**
 * Form handler for tricks and bonus entry
 * Manages form validation and score calculation
 */

(function() {
    const form = document.getElementById('tricksForm');
    const playersContainer = document.getElementById('playersContainer');
    const scoresSummary = document.getElementById('scoresSummary');
    const scoresList = document.getElementById('scoresList');

    /**
     * Validate tricks input against current round constraints
     * @param {HTMLInputElement} input - The tricks input element
     * @param {number} maxTricks - Maximum tricks allowed for this round
     */
    function validateTricksInput(input, maxTricks = 13) {
        const value = parseInt(input.value, 10);
        const isValid = !isNaN(value) && value >= 0 && value <= maxTricks;
        
        input.setAttribute('aria-invalid', !isValid);
        
        const messageElement = input.parentElement.querySelector('.validation-message');
        if (messageElement) {
            if (value < 0) {
                messageElement.textContent = 'Tricks won must be 0 or greater';
            } else if (value > maxTricks) {
                messageElement.textContent = `Tricks won cannot exceed ${maxTricks}`;
            } else {
                messageElement.textContent = '';
            }
        }
        
        return isValid;
    }

    /**
     * Validate bonus points input
     * @param {HTMLInputElement} input - The bonus points input element
     */
    function validateBonusInput(input) {
        const value = input.value;
        const isValid = !isNaN(value) && value !== '';
        
        input.setAttribute('aria-invalid', !isValid);
        
        const messageElement = input.parentElement.querySelector('.validation-message');
        if (messageElement) {
            if (!isValid) {
                messageElement.textContent = 'Please enter a valid number';
            } else {
                messageElement.textContent = '';
            }
        }
        
        return isValid;
    }

    /**
     * Handle input validation on change
     */
    function setupInputValidation() {
        const tricksInputs = playersContainer.querySelectorAll('input[name*="-tricks"]');
        const bonusInputs = playersContainer.querySelectorAll('input[name*="-bonus"]');

        tricksInputs.forEach(input => {
            input.addEventListener('change', function() {
                validateTricksInput(this);
            });
            
            input.addEventListener('input', function() {
                // Real-time validation feedback
                if (this.value) {
                    validateTricksInput(this);
                }
            });
        });

        bonusInputs.forEach(input => {
            input.addEventListener('change', function() {
                validateBonusInput(this);
            });
            
            input.addEventListener('input', function() {
                // Real-time validation feedback
                if (this.value) {
                    validateBonusInput(this);
                }
            });
        });
    }

    /**
     * Calculate round scores from form inputs
     * @returns {Array} Array of player score objects
     */
    function calculateRoundScores() {
        const scores = [];
        const players = playersContainer.querySelectorAll('.player-entry');
        let isValid = true;

        players.forEach((playerEntry, index) => {
            const playerNum = index + 1;
            const nameElement = playerEntry.querySelector('.player-name');
            const bidElement = playerEntry.querySelector('.bid-display');
            const tricksInput = playerEntry.querySelector(`input[name="player${playerNum}-tricks"]`);
            const bonusInput = playerEntry.querySelector(`input[name="player${playerNum}-bonus"]`);

            // Validate tricks input
            if (!validateTricksInput(tricksInput)) {
                isValid = false;
            }

            // Validate bonus input
            if (!validateBonusInput(bonusInput)) {
                isValid = false;
            }

            const playerName = nameElement ? nameElement.textContent : `Player ${playerNum}`;
            const bid = bidElement ? parseInt(bidElement.textContent, 10) : 0;
            const tricks = parseInt(tricksInput.value, 10);
            const bonus = parseInt(bonusInput.value, 10);

            // Calculate base score
            let baseScore = 0;
            let roundScore = 0;

            if (tricks === bid) {
                // Made the bid - award points equal to bid amount plus 10
                baseScore = bid + 10;
            } else {
                // Missed the bid - lose points equal to absolute difference
                baseScore = -(Math.abs(tricks - bid));
            }

            // Add bonus points (can be positive or negative)
            roundScore = baseScore + bonus;

            scores.push({
                name: playerName,
                bid: bid,
                tricks: tricks,
                bonus: bonus,
                baseScore: baseScore,
                roundScore: roundScore
            });
        });

        return { scores, isValid };
    }

    /**
     * Display scores summary
     * @param {Array} scores - Array of score objects
     */
    function displayScoresSummary(scores) {
        scoresList.innerHTML = '';

        scores.forEach(score => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';
            scoreItem.innerHTML = `
                <div>
                    <div class="score-item-name">${score.name}</div>
                    <div class="score-item-details" style="font-size: 0.875rem; color: var(--color-text-light); margin-top: 0.25rem;">
                        Bid: ${score.bid} | Tricks: ${score.tricks} | Bonus: ${score.bonus > 0 ? '+' : ''}${score.bonus}
                    </div>
                </div>
                <div class="score-item-value">${score.roundScore > 0 ? '+' : ''}${score.roundScore}</div>
            `;
            scoresList.appendChild(scoreItem);
        });

        scoresSummary.style.display = 'block';
        
        // Scroll to summary
        scoresSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Handle form submission
     */
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const { scores, isValid } = calculateRoundScores();

        if (!isValid) {
            // Show validation messages - they are already displayed by validation functions
            console.warn('Form has validation errors');
            return;
        }

        // Display the scores summary
        displayScoresSummary(scores);

        // Log scores for debugging
        console.log('Round Scores:', scores);
    });

    /**
     * Handle form reset
     */
    form.addEventListener('reset', function() {
        scoresSummary.style.display = 'none';
        scoresList.innerHTML = '';
        
        // Clear validation messages
        const messages = playersContainer.querySelectorAll('.validation-message');
        messages.forEach(msg => {
            msg.textContent = '';
        });
    });

    /**
     * Initialize form
     */
    function init() {
        setupInputValidation();
        
        // Set initial validation state for all inputs
        const allInputs = playersContainer.querySelectorAll('input[type="number"]');
        allInputs.forEach(input => {
            input.setAttribute('aria-invalid', 'false');
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();