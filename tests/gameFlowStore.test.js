import { renderHook, act } from '@testing-library/react';
import { useGameFlowStore, GAME_PHASES, MAX_ROUNDS } from '../src/stores/gameFlowStore';

describe('GameFlowStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useGameFlowStore());
    act(() => {
      result.current.resetGame();
    });
  });

  test('initializes with correct default state', () => {
    const { result } = renderHook(() => useGameFlowStore());
    
    expect(result.current.currentPhase).toBe(GAME_PHASES.SETUP);
    expect(result.current.currentRound).toBe(1);
    expect(result.current.isGameComplete).toBe(false);
  });

  test('enforces proper phase sequence: setup -> bidding -> scoring', () => {
    const { result } = renderHook(() => useGameFlowStore());
    
    // Start in setup
    expect(result.current.currentPhase).toBe(GAME_PHASES.SETUP);
    
    // Transition to bidding
    act(() => {
      result.current.nextPhase();
    });
    expect(result.current.currentPhase).toBe(GAME_PHASES.BIDDING);
    
    // Transition to scoring
    act(() => {
      result.current.nextPhase();
    });
    expect(result.current.currentPhase).toBe(GAME_PHASES.SCORING);
    
    // Should cycle back to setup and increment round
    act(() => {
      result.current.nextPhase();
    });
    expect(result.current.currentPhase).toBe(GAME_PHASES.SETUP);
    expect(result.current.currentRound).toBe(2);
  });

  test('tracks round progression from 1 to 10', () => {
    const { result } = renderHook(() => useGameFlowStore());
    
    // Simulate 9 complete rounds (setup -> bidding -> scoring)
    for (let round = 1; round < MAX_ROUNDS; round++) {
      expect(result.current.currentRound).toBe(round);
      
      // Complete one full cycle
      act(() => {
        result.current.nextPhase(); // setup -> bidding
        result.current.nextPhase(); // bidding -> scoring
        result.current.nextPhase(); // scoring -> setup (next round)
      });
    }
    
    // Should be at round 10
    expect(result.current.currentRound).toBe(MAX_ROUNDS);
    expect(result.current.currentPhase).toBe(GAME_PHASES.SETUP);
  });

  test('automatically progresses to results after round 10', () => {
    const { result } = renderHook(() => useGameFlowStore());
    
    // Set up round 10
    act(() => {
      // Manually set to round 10 for testing
      const store = useGameFlowStore.getState();
      useGameFlowStore.setState({
        ...store,
        currentRound: MAX_ROUNDS,
        currentPhase: GAME_PHASES.SCORING
      });
    });
    
    expect(result.current.currentRound).toBe(MAX_ROUNDS);
    expect(result.current.currentPhase).toBe(GAME_PHASES.SCORING);
    
    // Next phase should go to results
    act(() => {
      result.current.nextPhase();
    });
    
    expect(result.current.currentPhase).toBe(GAME_PHASES.RESULTS);
    expect(result.current.isGameComplete).toBe(true);
  });

  test('provides game reset functionality', () => {
    const { result } = renderHook(() => useGameFlowStore());
    
    // Advance game state
    act(() => {
      const store = useGameFlowStore.getState();
      useGameFlowStore.setState({
        ...store,
        currentRound: 5,
        currentPhase: GAME_PHASES.BIDDING,
        isGameComplete: false
      });
    });
    
    // Reset game
    act(() => {
      result.current.resetGame();
    });
    
    expect(result.current.currentPhase).toBe(GAME_PHASES.SETUP);
    expect(result.current.currentRound).toBe(1);
    expect(result.current.isGameComplete).toBe(false);
  });

  test('validates phase transitions', () => {
    const { result } = renderHook(() => useGameFlowStore());
    
    // Test invalid direct transition
    const success = result.current.setPhase(GAME_PHASES.SCORING);
    expect(success).toBe(false);
    expect(result.current.currentPhase).toBe(GAME_PHASES.SETUP);
    
    // Test valid direct transition
    const validSuccess = result.current.setPhase(GAME_PHASES.BIDDING);
    expect(validSuccess).toBe(true);
    expect(result.current.currentPhase).toBe(GAME_PHASES.BIDDING);
  });

  test('provides utility methods for game status', () => {
    const { result } = renderHook(() => useGameFlowStore());
    
    // Test round progress
    const progress = result.current.getRoundProgress();
    expect(progress.current).toBe(1);
    expect(progress.max).toBe(MAX_ROUNDS);
    expect(progress.percentage).toBe(10);
    
    // Test game status
    const status = result.current.getGameStatus();
    expect(status.phase).toBe(GAME_PHASES.SETUP);
    expect(status.round).toBe(1);
    expect(status.isComplete).toBe(false);
    expect(status.roundsRemaining).toBe(MAX_ROUNDS);
  });
});