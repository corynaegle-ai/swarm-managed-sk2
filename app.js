/**
 * app.js - Main application entry point
 * Initializes the game and coordinates between modules
 */

(function() {
  'use strict';

  /**
   * Initialize the application
   */
  function initApp() {
    // Ensure GameState and PlayerManager singletons exist
    if (typeof gameState === 'undefined') {
      console.error('App: GameState not loaded. Check js/scoreboard.js');
      return false;
    }

    if (typeof playerManager === 'undefined') {
      console.error('App: PlayerManager not loaded. Check js/playerManager.js');
      return false;
    }

    // Initialize PlayerManager with GameState
    const success = playerManager.init(gameState);
    if (!success) {
      console.error('App: PlayerManager initialization failed');
      return false;
    }

    console.log('App: Initialization complete');

    // Listen for game start event
    window.addEventListener('gameStarted', (event) => {
      console.log('App: Game started with players:', event.detail.players);
      // Additional game initialization can go here
    });

    return true;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
