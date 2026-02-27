import { renderHook, act } from '@testing-library/react';
import { useRoundResults } from './useRoundResults';
import { Player } from '../types/Player';

describe('useRoundResults Hook', () => {
  const mockPlayers: Player[] = [
    { id: '1', name: 'Alice', scores: [30, 50] },
    { id: '2', name: 'Bob', scores: [20, 40] },
  ];

  it('processes round results and updates player scores', () => {
    const { result } = renderHook(() => useRoundResults(mockPlayers));

    const roundResults = [
      {
        playerId: '1',
        playerName: 'Alice',
        bid: 3,
        tricksWon: 3,
        bonusPoints: 50,
        roundScore: 80,
      },
      {
        playerId: '2',
        playerName: 'Bob',
        bid: 2,
        tricksWon: 2,
        bonusPoints: 20,
        roundScore: 40,
      },
    ];

    let updatedPlayers: Player[] = [];

    act(() => {
      updatedPlayers = result.current.processRoundResults(roundResults);
    });

    expect(updatedPlayers[0].scores).toEqual([30, 50, 80]);
    expect(updatedPlayers[1].scores).toEqual([20, 40, 40]);
  });

  it('calculates total scores for all players', () => {
    const { result } = renderHook(() => useRoundResults(mockPlayers));

    const roundResults = [
      {
        playerId: '1',
        playerName: 'Alice',
        bid: 3,
        tricksWon: 3,
        bonusPoints: 50,
        roundScore: 80,
      },
      {
        playerId: '2',
        playerName: 'Bob',
        bid: 2,
        tricksWon: 2,
        bonusPoints: 20,
        roundScore: 40,
      },
    ];

    let updatedPlayers: Player[] = [];

    act(() => {
      updatedPlayers = result.current.processRoundResults(roundResults);
    });

    const totals = result.current.calculateTotalScores(updatedPlayers);

    expect(totals['1']).toBe(160); // 30 + 50 + 80
    expect(totals['2']).toBe(100); // 20 + 40 + 40
  });

  it('throws error if not all players have results', () => {
    const { result } = renderHook(() => useRoundResults(mockPlayers));

    const incompleteResults = [
      {
        playerId: '1',
        playerName: 'Alice',
        bid: 3,
        tricksWon: 3,
        bonusPoints: 50,
        roundScore: 80,
      },
    ];

    expect(() => {
      act(() => {
        result.current.processRoundResults(incompleteResults);
      });
    }).toThrow('All players must have results submitted');
  });

  it('stores round results in state', () => {
    const { result } = renderHook(() => useRoundResults(mockPlayers));

    const roundResults = [
      {
        playerId: '1',
        playerName: 'Alice',
        bid: 3,
        tricksWon: 3,
        bonusPoints: 50,
        roundScore: 80,
      },
      {
        playerId: '2',
        playerName: 'Bob',
        bid: 2,
        tricksWon: 2,
        bonusPoints: 20,
        roundScore: 40,
      },
    ];

    act(() => {
      result.current.processRoundResults(roundResults);
    });

    expect(result.current.roundResults).toEqual(roundResults);
  });
});
