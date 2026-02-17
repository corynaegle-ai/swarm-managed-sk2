import { useState, useCallback } from 'react';

// Initial game state structure with bidding phase data
const initialGameState = {
  bids: [],
  currentPhase: 'bidding',
  playersSubmittedBids: [],
  // Additional game state properties that might be needed
  players: [],
  currentRound: 1,
  gameStatus: 'active'
};

/**
 * Custom hook for managing game state
 * Provides state and methods for game state management
 */
const useGameState = () => {
  const [gameState, setGameState] = useState(initialGameState);

  // Update game state
  const updateGameState = useCallback((updates) => {
    setGameState(prevState => ({
      ...prevState,
      ...updates
    }));
  }, []);

  // Add a bid to the bids array
  const addBid = useCallback((bid) => {
    setGameState(prevState => ({
      ...prevState,
      bids: [...prevState.bids, bid]
    }));
  }, []);

  // Mark player as having submitted bid
  const markPlayerBidSubmitted = useCallback((playerId) => {
    setGameState(prevState => {
      if (!prevState.playersSubmittedBids.includes(playerId)) {
        return {
          ...prevState,
          playersSubmittedBids: [...prevState.playersSubmittedBids, playerId]
        };
      }
      return prevState;
    });
  }, []);

  // Reset game state to initial state
  const resetGameState = useCallback(() => {
    setGameState(initialGameState);
  }, []);

  // Change game phase
  const setCurrentPhase = useCallback((phase) => {
    setGameState(prevState => ({
      ...prevState,
      currentPhase: phase
    }));
  }, []);

  return {
    gameState,
    updateGameState,
    addBid,
    markPlayerBidSubmitted,
    resetGameState,
    setCurrentPhase
  };
};

export default useGameState;
export { initialGameState };