/**
 * Swarm Managed SK2 - Main Application Entry Point
 * Initializes the application state and exposes public API
 */

(function () {
  'use strict';

  // Application state object - using let to allow reassignment
  let appState = {
    initialized: false,
    version: '1.0.0',
    features: [],
    lastUpdated: null,
  };

  /**
   * Initialize the application
   * Sets up initial state and DOM bindings
   * @returns {boolean} true if initialization was successful
   */
  function initialize() {
    try {
      const appContainer = document.getElementById('app');
      if (!appContainer) {
        console.error('Fatal: #app container not found in DOM');
        return false;
      }

      // Mark as initialized
      updateState({ initialized: true, lastUpdated: new Date().toISOString() });

      console.log('Application initialized successfully', appState);
      return true;
    } catch (error) {
      console.error('Initialization failed:', error);
      return false;
    }
  }

  /**
   * Update application state with new values
   * Merges updates into current state
   * @param {Object} updates - Partial state object to merge
   * @returns {Object|null} Updated state object on success, null on failure
   */
  function updateState(updates) {
    if (!updates || typeof updates !== 'object') {
      console.error('updateState: updates must be a non-null object', updates);
      return null;
    }

    try {
      appState = { ...appState, ...updates };
      return appState;
    } catch (error) {
      console.error('updateState: Failed to update state', error);
      return null;
    }
  }

  /**
   * Get current application state (shallow copy)
   * @returns {Object} Current state object
   */
  function getState() {
    return { ...appState };
  }

  /**
   * Register a feature in the application
   * @param {string} featureName - Name of the feature
   * @returns {boolean} true if feature was registered successfully
   */
  function registerFeature(featureName) {
    if (typeof featureName !== 'string' || featureName.trim() === '') {
      console.error('registerFeature: featureName must be a non-empty string');
      return false;
    }

    if (appState.features.includes(featureName)) {
      console.warn(`registerFeature: Feature "${featureName}" already registered`);
      return false;
    }

    const updatedState = updateState({
      features: [...appState.features, featureName],
      lastUpdated: new Date().toISOString(),
    });

    return updatedState !== null;
  }

  /**
   * Public API exposed on window.app
   */
  window.app = {
    initialize,
    updateState,
    getState,
    registerFeature,
    version: '1.0.0',
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
