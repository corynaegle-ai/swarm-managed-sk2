/**
 * PlayerManager Module
 * Handles player list rendering, add/remove operations, and UI state management.
 * Requires GameState instance via init() before use.
 */

const PlayerManager = (() => {
  // Private state
  let gameState = null;
  let initialized = false;
  let eventListenersAttached = false;

  // DOM element references
  let addPlayerForm = null;
  let playerNameInput = null;
  let playerCountDisplay = null;
  let playerList = null;
  let startGameBtn = null;
  let errorDisplay = null;

  /**
   * Initialize PlayerManager with a GameState instance
   * @param {GameState} gs - The game state instance
   */
  function init(gs) {
    if (!gs) {
      console.error('PlayerManager.init() requires a GameState instance');
      return;
    }

    gameState = gs;

    // Cache DOM elements
    addPlayerForm = document.getElementById('add-player-form');
    playerNameInput = document.getElementById('player-name-input');
    playerCountDisplay = document.getElementById('player-count');
    playerList = document.getElementById('player-list');
    startGameBtn = document.getElementById('start-game-btn');

    // Create error display element if it doesn't exist
    if (!errorDisplay) {
      errorDisplay = document.createElement('div');
      errorDisplay.className = 'player-form-error';
      errorDisplay.setAttribute('aria-live', 'polite');
      errorDisplay.setAttribute('aria-atomic', 'true');
      addPlayerForm.parentNode.insertBefore(errorDisplay, addPlayerForm.nextSibling);
    }

    // Validate all required DOM elements exist
    if (!addPlayerForm || !playerNameInput || !playerCountDisplay || !playerList || !startGameBtn) {
      console.error('PlayerManager: Required DOM elements not found');
      return;
    }

    // Setup event listeners only once
    if (!eventListenersAttached) {
      setupEventListeners();
      eventListenersAttached = true;
    }

    initialized = true;

    // Initial render
    render();
  }

  /**
   * Setup event listeners for player management
   */
  function setupEventListeners() {
    // Add player form submission
    addPlayerForm.addEventListener('submit', handleAddPlayer);

    // Start game button click
    startGameBtn.addEventListener('click', handleStartGame);
  }

  /**
   * Handle add player form submission
   * @param {Event} e - Form submission event
   */
  function handleAddPlayer(e) {
    e.preventDefault();

    if (!gameState) {
      clearErrorMessage();
      showErrorMessage('Game state not initialized');
      return;
    }

    const playerName = playerNameInput.value.trim();

    // Validation: empty name
    if (!playerName) {
      showErrorMessage('Player name cannot be empty');
      playerNameInput.focus();
      return;
    }

    // Validation: name too long
    if (playerName.length > 50) {
      showErrorMessage('Player name must be 50 characters or less');
      playerNameInput.focus();
      return;
    }

    // Validation: duplicate player name
    const existingPlayers = gameState.getPlayers();
    if (existingPlayers.includes(playerName)) {
      showErrorMessage(`Player "${playerName}" already exists`);
      playerNameInput.focus();
      return;
    }

    // Validation: max players reached
    if (gameState.getPlayerCount() >= 8) {
      showErrorMessage('Maximum of 8 players allowed');
      return;
    }

    // Add player via game state
    try {
      gameState.addPlayer(playerName);
      clearErrorMessage();
      playerNameInput.value = '';
      playerNameInput.focus();
      render();
    } catch (error) {
      showErrorMessage(`Failed to add player: ${error.message}`);
    }
  }

  /**
   * Handle remove player action
   * @param {string} playerName - The player name to remove
   */
  function handleRemovePlayer(playerName) {
    if (!gameState) {
      showErrorMessage('Game state not initialized');
      return;
    }

    // Prevent removal if game has started
    if (gameState.isGameStarted && gameState.isGameStarted()) {
      showErrorMessage('Cannot remove players after game has started');
      return;
    }

    try {
      gameState.removePlayer(playerName);
      clearErrorMessage();
      render();
    } catch (error) {
      showErrorMessage(`Failed to remove player: ${error.message}`);
    }
  }

  /**
   * Handle start game button click
   */
  function handleStartGame() {
    if (!gameState) {
      showErrorMessage('Game state not initialized');
      return;
    }

    const playerCount = gameState.getPlayerCount();

    // Validation: check player count before calling game state
    if (playerCount < 2 || playerCount > 8) {
      showErrorMessage(`You need 2-8 players to start. Currently: ${playerCount}`);
      return;
    }

    try {
      gameState.startGame();
      clearErrorMessage();
      render();
      // Disable form and start button after game starts
      updateFormState();
    } catch (error) {
      showErrorMessage(`Failed to start game: ${error.message}`);
    }
  }

  /**
   * Display error message in the error display element
   * @param {string} message - The error message to display
   */
  function showErrorMessage(message) {
    if (errorDisplay) {
      errorDisplay.textContent = message;
      errorDisplay.classList.add('show');
    }
  }

  /**
   * Clear the error message display
   */
  function clearErrorMessage() {
    if (errorDisplay) {
      errorDisplay.textContent = '';
      errorDisplay.classList.remove('show');
    }
  }

  /**
   * Update form and button states based on game status
   */
  function updateFormState() {
    if (!gameState) return;

    const isGameStarted = gameState.isGameStarted && gameState.isGameStarted();
    const playerCount = gameState.getPlayerCount();

    // Disable/enable add player form
    playerNameInput.disabled = isGameStarted;
    addPlayerForm.querySelector('button[type="submit"]').disabled = isGameStarted;

    // Enable start game button only if 2-8 players and game not started
    startGameBtn.disabled = isGameStarted || playerCount < 2 || playerCount > 8;
  }

  /**
   * Render the player list
   */
  function render() {
    if (!gameState) return;

    const players = gameState.getPlayers();
    const playerCount = gameState.getPlayerCount();
    const isGameStarted = gameState.isGameStarted && gameState.isGameStarted();

    // Update player count display
    updatePlayerCountDisplay(playerCount);

    // Render player list
    if (playerCount === 0) {
      playerList.innerHTML = '<p class="player-list-empty">No players added yet. Add players to begin.</p>';
    } else {
      playerList.innerHTML = '';
      const ul = document.createElement('ul');
      ul.className = 'player-list-items';

      players.forEach((player) => {
        const li = document.createElement('li');
        li.className = 'player-card';
        li.setAttribute('data-player-name', player);

        const nameSpan = document.createElement('span');
        nameSpan.className = 'player-name';
        nameSpan.textContent = player;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn-remove-player';
        removeBtn.textContent = 'Remove';
        removeBtn.disabled = isGameStarted;
        removeBtn.setAttribute('aria-label', `Remove player ${player}`);
        removeBtn.addEventListener('click', () => {
          handleRemovePlayer(player);
        });

        li.appendChild(nameSpan);
        li.appendChild(removeBtn);
        ul.appendChild(li);
      });

      playerList.appendChild(ul);
    }

    // Update form and button states
    updateFormState();
  }

  /**
   * Update the player count display element
   * @param {number} count - The current player count
   */
  function updatePlayerCountDisplay(count) {
    if (!playerCountDisplay) return;

    const countSpan = playerCountDisplay.querySelector('.count-invalid, .count-valid');
    const indicator = playerCountDisplay.querySelector('.count-indicator');

    if (countSpan && indicator) {
      // Remove both classes and add appropriate one
      countSpan.className = count >= 2 && count <= 8 ? 'count-valid' : 'count-invalid';
      countSpan.textContent = `Players: ${count}`;
      indicator.textContent = '(2-8)';
    }
  }

  /**
   * Reset player manager state
   */
  function reset() {
    if (!gameState) return;

    try {
      // Clear all players via game state
      const players = gameState.getPlayers();
      players.forEach((player) => {
        gameState.removePlayer(player);
      });

      // Clear form input
      if (playerNameInput) {
        playerNameInput.value = '';
        playerNameInput.disabled = false;
        playerNameInput.focus();
      }

      // Clear error message
      clearErrorMessage();

      // Re-render
      render();
    } catch (error) {
      showErrorMessage(`Failed to reset: ${error.message}`);
    }
  }

  /**
   * Check if PlayerManager is initialized
   * @returns {boolean} True if initialized with valid GameState
   */
  function isInitialized() {
    return initialized && gameState !== null;
  }

  // Public API
  return {
    init,
    render,
    reset,
    isInitialized,
  };
})();
