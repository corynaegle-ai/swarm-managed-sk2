import { renderHook, act } from '@testing-library/react';
import useGameFlowStore, { PHASES } from '../src/stores/gameFlowStore.js';

describe('GameFlowStore', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useGameFlowStore.getState().resetGame();
    });
  });
  
  test('initializes with setup phase and round 1', () => {
    const { result } = renderHook(() => useGameFlowStore());
    
    expect(result.current.currentPhase).toBe(PHASES.SETUP);
    expect(result.current.currentRound).toBe(1);
  });
  
  test('progresses through phase sequence correctly', () => {
    const { result } = renderHook(() => useGameFlowStore());
    
    // Setup -> Bidding
    act(() => {
      result.current.nextPhase();
    });
    expect(result.current.currentPhase).toBe(PHASES.BIDDING);
    
    // Bidding -> Scoring
    act(() => {
      result.current.nextPhase();
    });
    expect(result.current.currentPhase).toBe(PHASES.SCORING);
    
    // Scoring -> Setup (next round)
    act(() => {
      result.current.nextPhase();
    });
    expect(result.current.currentPhase).toBe(PHASES.SETUP);
    expect(result.current.currentRound).toBe(2);
  });
  
  test('transitions to results after round 10', () => {
    const { result } = renderHook(() => useGameFlowStore());
    
    // Set to round 10, scoring phase
    act(() => {
      useGameFlowStore.setState({ currentRound: 10, currentPhase: PHASES.SCORING });
    });
    
    // Should go to results
    act(() => {
      result.current.nextPhase();
    });
    expect(result.current.currentPhase).toBe(PHASES.RESULTS);
    expect(result.current.currentRound).toBe(10);
  });
  
  test('resets game state correctly', () => {
    const { result } = renderHook(() => useGameFlowStore());
    
    // Set to some other state
    act(() => {
      useGameFlowStore.setState({ currentRound: 5, currentPhase: PHASES.BIDDING });
    });
    
    // Reset
    act(() => {
      result.current.resetGame();
    });
    
    expect(result.current.currentPhase).toBe(PHASES.SETUP);
    expect(result.current.currentRound).toBe(1);
  });
});