import { renderHook, act } from '@testing-library/react';
import { useGameState, ADVANCE_TO_PLAYING } from '../useGameState';

describe('useGameState', () => {
  test('should initialize with setup phase', () => {
    const { result } = renderHook(() => useGameState());
    
    expect(result.current.currentPhase).toBe('setup');
    expect(result.current.players).toEqual([]);
    expect(result.current.playersSubmittedBids).toEqual([]);
  });

  test('should transition to bidding phase when players are set', () => {
    const { result } = renderHook(() => useGameState());
    const players = ['player1', 'player2'];
    
    act(() => {
      result.current.setPlayers(players);
    });
    
    expect(result.current.currentPhase).toBe('bidding');
    expect(result.current.players).toEqual(players);
  });

  test('ADVANCE_TO_PLAYING should transition to playing when all bids submitted', () => {
    const { result } = renderHook(() => useGameState());
    const players = ['player1', 'player2'];
    
    // Set up game with players
    act(() => {
      result.current.setPlayers(players);
    });
    
    // Submit bids for all players
    act(() => {
      result.current.submitBid('player1', 10);
      result.current.submitBid('player2', 15);
    });
    
    // Advance to playing phase
    act(() => {
      result.current.advanceToPlaying();
    });
    
    expect(result.current.currentPhase).toBe('playing');
  });

  test('ADVANCE_TO_PLAYING should not transition when not all bids submitted', () => {
    const { result } = renderHook(() => useGameState());
    const players = ['player1', 'player2'];
    
    // Set up game with players
    act(() => {
      result.current.setPlayers(players);
    });
    
    // Submit bid for only one player
    act(() => {
      result.current.submitBid('player1', 10);
    });
    
    // Attempt to advance to playing phase
    act(() => {
      result.current.advanceToPlaying();
    });
    
    // Should remain in bidding phase
    expect(result.current.currentPhase).toBe('bidding');
  });

  test('ADVANCE_TO_PLAYING should fail gracefully with no players', () => {
    const { result } = renderHook(() => useGameState());
    
    // Attempt to advance without any players
    act(() => {
      result.current.advanceToPlaying();
    });
    
    // Should remain in setup phase
    expect(result.current.currentPhase).toBe('setup');
  });
});