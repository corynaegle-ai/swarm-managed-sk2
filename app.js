/**
 * Main application entry point
 * Initializes the game and sets up scoreboard functionality
 */

// Initialize the scoreboard when the page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('Application initialized');

  // Initialize scoreboard event listeners if the module is available
  if (typeof window.scoreboardModule !== 'undefined') {
    window.scoreboardModule.initializeEventListeners();
  }
});
