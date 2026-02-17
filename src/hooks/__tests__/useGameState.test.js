import { renderHook, act } from '@testing-library/react';
import useGameState from '../useGameState';

describe('useGameState', () => {
  test('initializes with correct default state', () => {
    const { result } = renderHook(() => useGameState());
    
    expect(result.current.gameState.bids).toEqual([]);
    expect(result.current.gameState.currentPhase).toBe('bidding');
    expect(result.current.gameState.playersSubmittedBids).toEqual([]);
  });

  test('adds bids correctly', () => {
    const { result } = renderHook(() => useGameState());
    
    const testBid = { playerId: 'player1', amount: 100 };
    
    act(() => {
      result.current.addBid(testBid);
    });
    
    expect(result.current.gameState.bids).toContain(testBid);
    expect(result.current.gameState.bids).toHaveLength(1);
  });

  test('marks player bid submission correctly', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.markPlayerBidSubmitted('player1');
    });
    
    expect(result.current.gameState.playersSubmittedBids).toContain('player1');
  });

  test('changes current phase correctly', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.setCurrentPhase('playing');
    });
    
    expect(result.current.gameState.currentPhase).toBe('playing');
  });

  test('resets game state correctly', () => {
    const { result } = renderHook(() => useGameState());
    
    // Make some changes first
    act(() => {
      result.current.addBid({ playerId: 'player1', amount: 100 });
      result.current.setCurrentPhase('playing');
    });
    
    // Then reset
    act(() => {
      result.current.resetGameState();
    });
    
    expect(result.current.gameState.bids).toEqual([]);
    expect(result.current.gameState.currentPhase).toBe('bidding');
    expect(result.current.gameState.playersSubmittedBids).toEqual([]);
  });
});