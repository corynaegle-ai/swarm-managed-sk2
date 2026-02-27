import PlayerManager from './PlayerManager.js';
import GameState from './GameState.js';
import MobileOptimizer from './mobile.js';
import RoundManager from './rounds.js';
import PhaseManager from './gamePhases.js';
import { initializeScoreboard, updateScoreboard, addPlayerToScoreboard, removePlayerFromScoreboard } from './scoreboard.js';

/**
 * Main Application Controller
 * Handles game initialization, phase transitions, and event management
 */
class Application {
  constructor() {
    this.playerManager = PlayerManager.getInstance();
    this.gameState = new GameState();
    this.roundManager = null;
    this.phaseManager = null;
    this.currentPhase = 'setup'; // 'setup' or 'game'
    this.gameStarted = false; // Flag to prevent return to setup
    
    this.initializeElements();
    this.setupEventListeners();
    this.showPhase('setup');
  }

  /**
   * Cache DOM elements for quick access
   */
  initializeElements() {
    // Setup phase elements
    this.setupPhase = document.getElementById('setup-phase');
    this.playerForm = document.getElementById('player-form');
    this.playerNameInput = document.getElementById('player-name');
    this.playerColorSelect = document.getElementById('player-color');
    this.addPlayerBtn = document.getElementById('add-player-btn');
    this.playerListContainer = document.getElementById('player-list');
    this.startGameBtn = document.getElementById('start-game-btn');
    this.setupErrorMessage = document.getElementById('setup-error-message');
    
    // Game phase elements
    this.gamePhase = document.getElementById('game-phase');
    this.gameBoard = document.getElementById('game-board');
    this.gameErrorMessage = document.getElementById('game-error-message');
    this.playerStatsContainer = document.getElementById('player-stats');
    
    // Round progression elements
    this.nextRoundBtn = document.getElementById('next-round-btn');
    this.currentRoundDisplay = document.getElementById('current-round');
    this.currentHandsDisplay = document.getElementById('current-hands');
    this.currentPhaseDisplay = document.getElementById('current-phase');
    this.completionMessage = document.getElementById('completion-message');
  }

  /**
   * Set up all event listeners for the application
   */
  setupEventListeners() {
    // Player setup events
    if (this.addPlayerBtn) {
      this.addPlayerBtn.addEventListener('click', () => this.handleAddPlayer());
    }
    
    if (this.playerForm) {
      this.playerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddPlayer();
      });
    }
    
    if (this.startGameBtn) {
      this.startGameBtn.addEventListener('click', () => this.handleStartGame());
    }
    
    // Round progression event
    if (this.nextRoundBtn) {
      this.nextRoundBtn.addEventListener('click', () => this.handleNextRound());
    }
  }

  /**
   * Handle adding a new player
   */
  handleAddPlayer() {
    const playerName = this.playerNameInput?.value?.trim();
    const playerColor = this.playerColorSelect?.value;

    // Clear previous error message
    if (this.setupErrorMessage) {
      this.setupErrorMessage.textContent = '';
      this.setupErrorMessage.classList.add('hidden');
    }

    // Validation
    if (!playerName) {
      this.displayError('Player name is required.', 'setup');
      return;
    }

    if (playerName.length < 2) {
      this.displayError('Player name must be at least 2 characters long.', 'setup');
      return;
    }

    if (playerName.length > 20) {
      this.displayError('Player name must not exceed 20 characters.', 'setup');
      return;
    }

    if (!playerColor) {
      this.displayError('Please select a player color.', 'setup');
      return;
    }

    // Check for duplicate player names
    try {
      const existingPlayers = this.playerManager.getAllPlayers();
      const isDuplicate = existingPlayers.some(
        (p) => p.name.toLowerCase() === playerName.toLowerCase()
      );

      if (isDuplicate) {
        this.displayError('A player with this name already exists.', 'setup');
        return;
      }
    } catch (error) {
      this.displayError('Error checking existing players: ' + error.message, 'setup');
      return;
    }

    // Add player via PlayerManager
    try {
      const playerId = this.playerManager.addPlayer(playerName, playerColor);
      console.log(`Player added: ${playerName} (${playerId})`);

      // Clear form
      if (this.playerNameInput) {
        this.playerNameInput.value = '';
      }
      if (this.playerColorSelect) {
        this.playerColorSelect.value = '';
      }

      // Update player list display
      this.updatePlayerList();
    } catch (error) {
      this.displayError('Error adding player: ' + error.message, 'setup');
    }
  }

  /**
   * Update the displayed player list
   */
  updatePlayerList() {
    if (!this.playerListContainer) return;

    try {
      const players = this.playerManager.getAllPlayers();

      if (players.length === 0) {
        this.playerListContainer.innerHTML = '<p class="empty-list">No players added yet.</p>';
        return;
      }

      this.playerListContainer.innerHTML = '<ul class="players-list">' +
        players.map((player) => `
          <li class="player-item" style="border-left: 4px solid ${player.color}">
            <span class="player-name">${player.name}</span>
            <span class="player-color" style="background-color: ${player.color}"></span>
          </li>
        `).join('') +
        '</ul>';
    } catch (error) {
      this.displayError('Error updating player list: ' + error.message, 'setup');
    }
  }

  /**
   * Handle starting the game
   */
  handleStartGame() {
    // Clear error message
    if (this.setupErrorMessage) {
      this.setupErrorMessage.textContent = '';
      this.setupErrorMessage.classList.add('hidden');
    }

    try {
      const players = this.playerManager.getAllPlayers();

      // Validation: Need at least 2 players
      if (players.length < 2) {
        this.displayError('You need at least 2 players to start the game.', 'setup');
        return;
      }

      // Mark game as started to prevent return to setup
      this.gameStarted = true;

      // Initialize game state with players
      this.gameState.setPlayers(players);
      this.gameState.startGame();

      // Transition to game phase
      this.transitionToGamePhase();
    } catch (error) {
      this.displayError('Error starting game: ' + error.message, 'setup');
    }
  }

  /**
   * Transition from setup phase to game phase
   */
  transitionToGamePhase() {
    this.currentPhase = 'game';
    this.showPhase('game');
    this.initializeGameUI();
    this.initializeRoundAndPhaseManagers();
    this.initializeScoreboardIntegration();
    console.log('Game started with', this.playerManager.getAllPlayers().length, 'players');
  }

  /**
   * Initialize scoreboard with current game state
   */
  initializeScoreboardIntegration() {
    try {
      const players = this.playerManager.getAllPlayers();
      
      // Initialize scoreboard with players and current round
      initializeScoreboard(players);
      
      console.log('Scoreboard initialized with ' + players.length + ' players');
    } catch (error) {
      this.displayError('Error initializing scoreboard: ' + error.message, 'game');
    }
  }

  /**
   * Initialize RoundManager and PhaseManager after game starts
   */
  initializeRoundAndPhaseManagers() {
    try {
      const players = this.playerManager.getAllPlayers();
      
      // Initialize RoundManager with 10 rounds and players
      this.roundManager = new RoundManager(10, players);
      
      // Initialize PhaseManager with game phases
      this.phaseManager = new PhaseManager();
      
      // Set up event listeners for state changes
      this.roundManager.on('roundChanged', (roundData) => this.onRoundChanged(roundData));
      this.phaseManager.on('phaseChanged', (phaseData) => this.onPhaseChanged(phaseData));
      
      // Update initial display
      this.updateRoundAndPhaseDisplay();
      
      console.log('Round and Phase managers initialized');
    } catch (error) {
      this.displayError('Error initializing round/phase managers: ' + error.message, 'game');
    }
  }

  /**
   * Handle next round button click
   */
  handleNextRound() {
    try {
      if (!this.roundManager) {
        this.displayError('Round manager not initialized', 'game');
        return;
      }
      
      // Check if we can advance to next round
      if (this.roundManager.hasNextRound()) {
        this.roundManager.nextRound();
        this.updateRoundAndPhaseDisplay();
      } else {
        // Game is complete
        this.handleGameCompletion();
      }
    } catch (error) {
      this.displayError('Error advancing to next round: ' + error.message, 'game');
    }
  }

  /**
   * Called when round changes
   */
  onRoundChanged(roundData) {
    try {
      console.log('Round changed:', roundData);
      this.updateRoundAndPhaseDisplay();
      
      // Update scoreboard with new round information
      this.updateScoreboardDisplay();
      
      // Advance phase manager to next phase if available
      if (this.phaseManager && this.phaseManager.hasNextPhase()) {
        this.phaseManager.nextPhase();
      }
    } catch (error) {
      console.error('Error handling round change:', error);
    }
  }

  /**
   * Called when phase changes
   */
  onPhaseChanged(phaseData) {
    try {
      console.log('Phase changed:', phaseData);
      this.updateRoundAndPhaseDisplay();
    } catch (error) {
      console.error('Error handling phase change:', error);
    }
  }

  /**
   * Update scoreboard display with current game state
   */
  updateScoreboardDisplay() {
    try {
      const players = this.playerManager.getAllPlayers();
      const currentRound = this.roundManager?.getCurrentRound()?.roundNumber || 1;
      
      // Update scoreboard with current game state
      updateScoreboard(players, currentRound);
    } catch (error) {
      console.error('Error updating scoreboard display:', error);
    }
  }

  /**
   * Update round and phase display on UI
   */
  updateRoundAndPhaseDisplay() {
    try {
      if (!this.roundManager || !this.phaseManager) {
        return;
      }
      
      const currentRound = this.roundManager.getCurrentRound();
      const currentPhase = this.phaseManager.getCurrentPhase();
      
      // Update round display
      if (this.currentRoundDisplay) {
        this.currentRoundDisplay.textContent = currentRound.roundNumber;
      }
      
      // Update hands available display
      if (this.currentHandsDisplay) {
        this.currentHandsDisplay.textContent = currentRound.handsAvailable;
      }
      
      // Update phase display
      if (this.currentPhaseDisplay) {
        this.currentPhaseDisplay.textContent = currentPhase.name || 'Unknown';
        this.currentPhaseDisplay.className = `phase-status ${(currentPhase.name || 'unknown').toLowerCase()}`;
      }
    } catch (error) {
      console.error('Error updating round/phase display:', error);
    }
  }

  /**
   * Handle game completion when all rounds are finished
   */
  handleGameCompletion() {
    try {
      console.log('Game completed!');
      
      // Hide next round button
      if (this.nextRoundBtn) {
        this.nextRoundBtn.style.display = 'none';
      }
      
      // Show completion message
      if (this.completionMessage) {
        this.completionMessage.style.display = 'block';
      }
    } catch (error) {
      this.displayError('Error handling game completion: ' + error.message, 'game');
    }
  }

  /**
   * Initialize game UI elements
   */
  initializeGameUI() {
    try {
      const players = this.playerManager.getAllPlayers();
      
      // Display player stats
      if (this.playerStatsContainer) {
        this.playerStatsContainer.innerHTML = '<div class="player-stats-list">' +
          players.map((player) => `
            <div class="player-stat" style="border-color: ${player.color}">
              <h3>${player.name}</h3>
              <p style="color: ${player.color}">Color: ${player.color}</p>
              <p>ID: ${player.id}</p>
            </div>
          `).join('') +
          '</div>';
      }

      // Initialize game board (placeholder)
      if (this.gameBoard) {
        this.gameBoard.innerHTML = '<div class="game-board-content"><p>Game board initialized with ' + players.length + ' players.</p></div>';
      }
    } catch (error) {
      this.displayError('Error initializing game UI: ' + error.message, 'game');
    }
  }

  /**
   * Display error message to user
   * @param {string} message - Error message to display
   * @param {string} phase - Which phase to display error in ('setup' or 'game')
   */
  displayError(message, phase = this.currentPhase) {
    const errorElement = phase === 'setup' ? this.setupErrorMessage : this.gameErrorMessage;
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
      console.error(`[${phase.toUpperCase()}] ${message}`);
    }
  }

  /**
   * Show/hide phases based on current game state
   * @param {string} phase - Phase to show ('setup' or 'game')
   */
  showPhase(phase) {
    // Prevent returning to setup after game starts
    if (this.gameStarted && phase === 'setup') {
      console.warn('Cannot return to setup phase after game has started.');
      return;
    }

    if (phase === 'setup') {
      if (this.setupPhase) this.setupPhase.classList.remove('hidden');
      if (this.gamePhase) this.gamePhase.classList.add('hidden');
      this.currentPhase = 'setup';
    } else if (phase === 'game') {
      if (this.setupPhase) this.setupPhase.classList.add('hidden');
      if (this.gamePhase) this.gamePhase.classList.remove('hidden');
      this.currentPhase = 'game';
    }
  }

  /**
   * Get the current game state
   */
  getGameState() {
    return this.gameState;
  }

  /**
   * Check if game has started
   */
  isGameStarted() {
    return this.gameStarted;
  }

  /**
   * Get round manager instance
   */
  getRoundManager() {
    return this.roundManager;
  }

  /**
   * Get phase manager instance
   */
  getPhaseManager() {
    return this.phaseManager;
  }
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new Application();
    console.log('Application initialized');
  });
} else {
  window.app = new Application();
  console.log('Application initialized');
}

export default Application;
