// Demo Score Engine Module
// Handles score calculation for the SK2 card game

/**
 * Calculate the score based on bid, tricks, and round number
 * @param {number} bid - Number of tricks bid
 * @param {number} tricks - Number of tricks actually won
 * @param {number} round - Current round number
 * @returns {object} Score result with breakdown
 */
function calculateScore(bid, tricks, round) {
    if (bid < 0 || tricks < 0 || round < 1) {
        throw new Error('Bid, tricks, and round must be non-negative (round >= 1)');
    }

    const made = bid === tricks;
    const baseScore = made ? bid * 10 + 10 : -Math.abs(bid - tricks) * 5;
    const roundBonus = round * 2;
    const totalScore = baseScore + roundBonus;

    return {
        made,
        baseScore,
        roundBonus,
        totalScore,
        bid,
        tricks
    };
}

// Initialize demo form handler when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDemoForm);
} else {
    initializeDemoForm();
}

function initializeDemoForm() {
    const demoForm = document.getElementById('demo-form');
    const errorDiv = document.getElementById('demo-error');
    const resultDiv = document.getElementById('demo-result');

    if (!demoForm) return; // Exit if form doesn't exist

    demoForm.addEventListener('submit', function (e) {
        e.preventDefault();
        errorDiv.textContent = '';
        resultDiv.textContent = '';

        const bid = parseInt(document.getElementById('demo-bid').value);
        const tricks = parseInt(document.getElementById('demo-tricks').value);
        const round = parseInt(document.getElementById('demo-round').value);

        try {
            const result = calculateScore(bid, tricks, round);
            const status = result.made ? '✓ Made' : '✗ Missed';
            resultDiv.innerHTML = `
                <strong>Result: ${status}</strong><br>
                Base Score: ${result.baseScore}<br>
                Round Bonus: ${result.roundBonus}<br>
                Total Score: ${result.totalScore}
            `;
        } catch (err) {
            errorDiv.textContent = 'Error: ' + err.message;
        }
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateScore };
}