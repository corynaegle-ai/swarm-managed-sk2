import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Define game phases
const PHASES = {
  SETUP: 'setup',
  BIDDING: 'bidding', 
  SCORING: 'scoring',
  RESULTS: 'results'
};

// Define phase transitions
const PHASE_TRANSITIONS = {
  [PHASES.SETUP]: PHASES.BIDDING,
  [PHASES.BIDDING]: PHASES.SCORING,
  [PHASES.SCORING]: PHASES.SETUP // or RESULTS if round 10
};

const MAX_ROUNDS = 10;

const useGameFlowStore = create()(devtools(
  (set, get) => ({
    // State
    currentPhase: PHASES.SETUP,
    currentRound: 1,
    
    // Actions
    nextPhase: () => {
      const { currentPhase, currentRound } = get();
      
      // Validate current phase exists in transitions
      if (!PHASE_TRANSITIONS[currentPhase]) {
        console.error(`Invalid phase transition from ${currentPhase}`);
        return;
      }
      
      // Special handling for scoring phase
      if (currentPhase === PHASES.SCORING) {
        if (currentRound >= MAX_ROUNDS) {
          // Game complete - go to results
          set({ currentPhase: PHASES.RESULTS });
        } else {
          // Next round - go to setup and increment round
          set({ 
            currentPhase: PHASES.SETUP,
            currentRound: currentRound + 1
          });
        }
      } else {
        // Normal phase transition
        const nextPhase = PHASE_TRANSITIONS[currentPhase];
        set({ currentPhase: nextPhase });
      }
    },
    
    goToPhase: (phase) => {
      // Validate phase
      if (!Object.values(PHASES).includes(phase)) {
        console.error(`Invalid phase: ${phase}`);
        return;
      }
      
      const { currentPhase } = get();
      
      // Enforce proper sequence - only allow going to next valid phase
      const allowedNextPhase = PHASE_TRANSITIONS[currentPhase];
      
      if (currentPhase === PHASES.SCORING && get().currentRound >= MAX_ROUNDS) {
        // From scoring on final round, only allow results
        if (phase !== PHASES.RESULTS) {
          console.error(`Can only go to results phase after round ${MAX_ROUNDS}`);
          return;
        }
      } else if (phase !== allowedNextPhase) {
        console.error(`Invalid phase transition from ${currentPhase} to ${phase}`);
        return;
      }
      
      set({ currentPhase: phase });
    },
    
    resetGame: () => {
      set({ 
        currentPhase: PHASES.SETUP,
        currentRound: 1
      });
    },
    
    // Getters
    isGameComplete: () => {
      const { currentPhase, currentRound } = get();
      return currentPhase === PHASES.RESULTS || currentRound > MAX_ROUNDS;
    },
    
    canTransitionToNext: () => {
      const { currentPhase, currentRound } = get();
      
      if (currentPhase === PHASES.RESULTS) {
        return false; // Game is complete
      }
      
      return true;
    },
    
    getRoundProgress: () => {
      const { currentRound } = get();
      return {
        current: currentRound,
        total: MAX_ROUNDS,
        percentage: (currentRound / MAX_ROUNDS) * 100
      };
    }
  }),
  {
    name: 'game-flow-store'
  }
));

// Export phases constant for use in components
export { PHASES };
export default useGameFlowStore;