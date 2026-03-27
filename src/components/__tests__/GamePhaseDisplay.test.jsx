import React from 'react';
import { render, screen } from '@testing-library/react';
import GamePhaseDisplay from '../GamePhaseDisplay';
import { useGameFlowStore } from '../../stores/gameFlowStore';

// Mock the gameFlowStore hook
jest.mock('../../stores/gameFlowStore');

describe('GamePhaseDisplay', () => {
  beforeEach(() => {
    useGameFlowStore.mockClear();
  });

  test('displays current phase and round information', () => {
    useGameFlowStore.mockReturnValue({
      currentPhase: 'Planning',
      currentRound: 3,
      isLoading: false
    });

    render(<GamePhaseDisplay />);

    expect(screen.getByText('Planning')).toBeInTheDocument();
    expect(screen.getByText('Round 3 of 10')).toBeInTheDocument();
  });

  test('displays loading state when gameFlowStore is loading', () => {
    useGameFlowStore.mockReturnValue({
      currentPhase: null,
      currentRound: null,
      isLoading: true
    });

    render(<GamePhaseDisplay />);

    expect(screen.getByText('Loading game phase...')).toBeInTheDocument();
    expect(screen.queryByText('Round')).not.toBeInTheDocument();
  });

  test('handles different phases correctly', () => {
    useGameFlowStore.mockReturnValue({
      currentPhase: 'Execution',
      currentRound: 7,
      isLoading: false
    });

    render(<GamePhaseDisplay />);

    expect(screen.getByText('Execution')).toBeInTheDocument();
    expect(screen.getByText('Round 7 of 10')).toBeInTheDocument();
  });

  test('displays round 1 correctly', () => {
    useGameFlowStore.mockReturnValue({
      currentPhase: 'Setup',
      currentRound: 1,
      isLoading: false
    });

    render(<GamePhaseDisplay />);

    expect(screen.getByText('Round 1 of 10')).toBeInTheDocument();
  });

  test('displays round 10 correctly', () => {
    useGameFlowStore.mockReturnValue({
      currentPhase: 'Final',
      currentRound: 10,
      isLoading: false
    });

    render(<GamePhaseDisplay />);

    expect(screen.getByText('Round 10 of 10')).toBeInTheDocument();
  });
});