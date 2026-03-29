import { useReducer } from 'react';

// Action types
export const ADVANCE_TO_PLAYING = 'ADVANCE_TO_PLAYING';
export const SET_PLAYERS = 'SET_PLAYERS';
export const SUBMIT_BID = 'SUBMIT_BID';
export const RESET_GAME = 'RESET_GAME';

// Initial state
const initialState = {
  currentPhase: 'setup',
  players: [],
  playersSubmittedBids: [],
  bids: {},
  gameSettings: {
    maxPlayers: 4,
    bidTimeLimit: 30
  }
};

// Reducer function
function gameStateReducer(state, action) {
  switch (action.type) {
    case SET_PLAYERS:
      return {
        ...state,
        players: action.payload,
        currentPhase: action.payload.length > 0 ? 'bidding' : 'setup'
      };

    case SUBMIT_BID:
      const { playerId, bid } = action.payload;
      const updatedPlayersSubmittedBids = state.playersSubmittedBids.includes(playerId)
        ? state.playersSubmittedBids
        : [...state.playersSubmittedBids, playerId];
      
      return {
        ...state,
        bids: {
          ...state.bids,
          [playerId]: bid
        },
        playersSubmittedBids: updatedPlayersSubmittedBids
      };

    case ADVANCE_TO_PLAYING:
      // Validate all players have submitted bids
      const allPlayersSubmitted = state.players.length > 0 && 
        state.playersSubmittedBids.length === state.players.length;
      
      if (!allPlayersSubmitted) {
        // Return current state unchanged if validation fails
        return state;
      }
      
      // Transition to playing phase if validation passes
      return {
        ...state,
        currentPhase: 'playing'
      };

    case RESET_GAME:
      return initialState;

    default:
      return state;
  }
}

// Custom hook
export function useGameState() {
  const [state, dispatch] = useReducer(gameStateReducer, initialState);

  const actions = {
    setPlayers: (players) => {
      dispatch({ type: SET_PLAYERS, payload: players });
    },
    
    submitBid: (playerId, bid) => {
      dispatch({ type: SUBMIT_BID, payload: { playerId, bid } });
    },
    
    advanceToPlaying: () => {
      dispatch({ type: ADVANCE_TO_PLAYING });
    },
    
    resetGame: () => {
      dispatch({ type: RESET_GAME });
    }
  };

  return {
    ...state,
    ...actions
  };
}

export default useGameState;