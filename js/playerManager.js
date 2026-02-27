/**
 * Player Manager Module
 * Handles rendering and managing the player list UI component
 */

(function() {
  'use strict';

  // Configuration
  const MIN_PLAYERS = 2;
  const MAX_PLAYERS = 8;

  let gameState = null;
  let isGameStarted = false;

  /**
   * Initialize the player manager with game state
   * @param {Object} state - GameState instance
   */
  function init(state) {
    gameState = state;
    setupEventListeners();
    render();
  }

  /**
   * Set up all event listeners for player management
   */
  function setupEventListeners() {
    const addPlayerForm = document.getElementById('add-player-form');
    const startGameBtn = document.getElementById('start-game-btn');

    if (addPlayerForm) {
      addPlayerForm.addEventListener('submit', handleAddPlayer);
    }

    if (startGameBtn) {
      startGameBtn.addEventListener('click', handleStartGame);
    }
  }

  /**
   * Handle adding a new player
   * @param {Event} event - Form submit event
   */
  function handleAddPlayer(event) {
    event.preventDefault();

    const playerNameInput = document.getElementById('player-name-input');
    const playerName = playerNameInput.value.trim();

    // Validation
    if (!playerName) {
      alert('Please enter a player name');
      return;
    }

    if (!gameState) {
      console.error('GameState not initialized');
      return;
    }

    // Add player to game state
    try {
      gameState.addPlayer(playerName);
      playerNameInput.value = '';
      playerNameInput.focus();
      render();
    } catch (error) {
      alert('Error adding player: ' + error.message);
    }
  }

  /**
   * Handle starting the game
   */
  function handleStartGame() {
    const playerCount = gameState ? gameState.getPlayerCount() : 0;

    if (playerCount < MIN_PLAYERS || playerCount > MAX_PLAYERS) {
      alert(`Game requires ${MIN_PLAYERS}-${MAX_PLAYERS} players. Current: ${playerCount}`);
      return;
    }

    if (!gameState) {
      console.error('GameState not initialized');
      return;
    }

    try {
      gameState.startGame();
      isGameStarted = true;
      render();
    } catch (error) {
      alert('Error starting game: ' + error.message);
    }
  }

  /**
   * Remove a player by name
   * @param {string} playerName - Name of player to remove
   */
  function removePlayer(playerName) {
    if (!gameState) {
      console.error('GameState not initialized');
      return;
    }

    try {
      gameState.removePlayer(playerName);
      render();
    } catch (error) {
      alert('Error removing player: ' + error.message);
    }
  }

  /**
   * Render the entire player management UI
   */
  function render() {
    renderPlayerList();
    renderPlayerCount();
    updateStartGameButton();
  }

  /**
   * Render the player list with remove buttons
   */
  function renderPlayerList() {
    const playerListContainer = document.getElementById('player-list');

    if (!playerListContainer) {
      console.warn('Player list container not found');
      return;
    }

    // Clear existing list
    playerListContainer.innerHTML = '';

    if (!gameState) {
      return;
    }

    const players = gameState.getPlayers();

    if (players.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'player-list-empty';
      emptyMessage.textContent = 'No players added yet. Add players to begin.';
      playerListContainer.appendChild(emptyMessage);
      return;
    }

    const playerListElement = document.createElement('div');
    playerListElement.className = 'player-cards';

    players.forEach((player, index) => {
      const playerCard = document.createElement('div');
      playerCard.className = 'player-card';
      playerCard.setAttribute('data-player-name', player);

      const playerNameElement = document.createElement('span');
      playerNameElement.className = 'player-name';
      playerNameElement.textContent = `${index + 1}. ${player}`;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'remove-player-btn';
      removeBtn.textContent = 'Remove';
      removeBtn.disabled = isGameStarted;
      removeBtn.setAttribute('aria-label', `Remove player ${player}`);
      removeBtn.addEventListener('click', function() {
        removePlayer(player);
      });

      playerCard.appendChild(playerNameElement);
      playerCard.appendChild(removeBtn);
      playerListElement.appendChild(playerCard);
    });

    playerListContainer.appendChild(playerListElement);
  }

  /**
   * Render the player count display with min/max indicators
   */
  function renderPlayerCount() {
    const playerCountElement = document.getElementById('player-count');

    if (!playerCountElement) {
      console.warn('Player count element not found');
      return;
    }

    const playerCount = gameState ? gameState.getPlayerCount() : 0;
    const isValid = playerCount >= MIN_PLAYERS && playerCount <= MAX_PLAYERS;

    playerCountElement.innerHTML = '';

    const countText = document.createElement('span');
    countText.className = isValid ? 'count-valid' : 'count-invalid';
    countText.textContent = `Players: ${playerCount}`;

    const indicator = document.createElement('span');
    indicator.className = 'count-indicator';
    indicator.textContent = `(${MIN_PLAYERS}-${MAX_PLAYERS})`;

    playerCountElement.appendChild(countText);
    playerCountElement.appendChild(indicator);
  }

  /**
   * Update the start game button state
   */
  function updateStartGameButton() {
    const startGameBtn = document.getElementById('start-game-btn');

    if (!startGameBtn) {
      console.warn('Start game button not found');
      return;
    }

    const playerCount = gameState ? gameState.getPlayerCount() : 0;
    const isValid = playerCount >= MIN_PLAYERS && playerCount <= MAX_PLAYERS;

    startGameBtn.disabled = !isValid || isGameStarted;
    startGameBtn.setAttribute('aria-disabled', !isValid || isGameStarted);
  }

  /**
   * Get the game state (for external access if needed)
   * @returns {Object} Current game state
   */
  function getGameState() {
    return gameState;
  }

  /**
   * Check if game has started
   * @returns {boolean} Whether the game has started
   */
  function getIsGameStarted() {
    return isGameStarted;
  }

  /**
   * Reset the player manager state
   */
  function reset() {
    isGameStarted = false;
    if (playerNameInput) {
      playerNameInput.value = '';
    }
    render();
  }

  // Export public API
  window.PlayerManager = {
    init: init,
    render: render,
    removePlayer: removePlayer,
    getGameState: getGameState,
    getIsGameStarted: getIsGameStarted,
    reset: reset
  };

})();
