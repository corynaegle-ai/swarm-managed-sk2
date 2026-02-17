import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Game phases enum
export const GAME_PHASES = {
  SETUP: 'setup',
  BIDDING: 'bidding',
  SCORING: 'scoring',
  RESULTS: 'results'
};

// Valid phase transitions
const PHASE_TRANSITIONS = {
  [GAME_PHASES.SETUP]: [GAME_PHASES.BIDDING],
  [GAME_PHASES.BIDDING]: [GAME_PHASES.SCORING],
  [GAME_PHASES.SCORING]: [GAME_PHASES.SETUP, GAME_PHASES.RESULTS],
  [GAME_PHASES.RESULTS]: [GAME_PHASES.SETUP]
};

const MAX_ROUNDS = 10;

export const useGameFlowStore = create(
  subscribeWithSelector((set, get) => ({
    // Game state
    currentPhase: GAME_PHASES.SETUP,
    currentRound: 1,
    isGameComplete: false,

    // Actions
    nextPhase: () => {
      const state = get();
      const { currentPhase, currentRound } = state;

      // Validate transition is allowed
      const allowedTransitions = PHASE_TRANSITIONS[currentPhase];
      if (!allowedTransitions || allowedTransitions.length === 0) {
        console.warn(`No valid transitions from phase: ${currentPhase}`);
        return;
      }

      let nextPhase;
      let nextRound = currentRound;
      let isGameComplete = false;

      switch (currentPhase) {
        case GAME_PHASES.SETUP:
          nextPhase = GAME_PHASES.BIDDING;
          break;

        case GAME_PHASES.BIDDING:
          nextPhase = GAME_PHASES.SCORING;
          break;

        case GAME_PHASES.SCORING:
          if (currentRound >= MAX_ROUNDS) {
            // Game is complete, go to results
            nextPhase = GAME_PHASES.RESULTS;
            isGameComplete = true;
          } else {
            // Continue to next round
            nextPhase = GAME_PHASES.SETUP;
            nextRound = currentRound + 1;
          }
          break;

        case GAME_PHASES.RESULTS:
          // From results, can only reset game
          nextPhase = GAME_PHASES.SETUP;
          nextRound = 1;
          isGameComplete = false;
          break;

        default:
          console.error(`Unknown phase: ${currentPhase}`);
          return;
      }

      // Validate the calculated next phase is allowed
      if (!allowedTransitions.includes(nextPhase)) {
        console.error(`Invalid phase transition from ${currentPhase} to ${nextPhase}`);
        return;
      }

      set({
        currentPhase: nextPhase,
        currentRound: nextRound,
        isGameComplete: isGameComplete
      });
    },

    // Direct phase setter with validation
    setPhase: (targetPhase) => {
      const state = get();
      const { currentPhase } = state;

      // Check if transition is valid
      const allowedTransitions = PHASE_TRANSITIONS[currentPhase];
      if (!allowedTransitions || !allowedTransitions.includes(targetPhase)) {
        console.error(`Invalid phase transition from ${currentPhase} to ${targetPhase}`);
        return false;
      }

      set({ currentPhase: targetPhase });
      return true;
    },

    // Reset game to initial state
    resetGame: () => {
      set({
        currentPhase: GAME_PHASES.SETUP,
        currentRound: 1,
        isGameComplete: false
      });
    },

    // Utility getters
    canTransitionTo: (targetPhase) => {
      const state = get();
      const allowedTransitions = PHASE_TRANSITIONS[state.currentPhase];
      return allowedTransitions && allowedTransitions.includes(targetPhase);
    },

    getRoundProgress: () => {
      const state = get();
      return {
        current: state.currentRound,
        max: MAX_ROUNDS,
        percentage: Math.round((state.currentRound / MAX_ROUNDS) * 100)
      };
    },

    getGameStatus: () => {
      const state = get();
      return {
        phase: state.currentPhase,
        round: state.currentRound,
        isComplete: state.isGameComplete,
        roundsRemaining: MAX_ROUNDS - state.currentRound + 1
      };
    }
  }))
);

// Export constants for use in components
export { MAX_ROUNDS };