import React from 'react';
import { render, screen } from '@testing-library/react';
import Game from '../src/components/Game';
import { useGameFlowStore } from '../src/stores/gameFlowStore';

// Mock the game flow store
jest.mock('../src/stores/gameFlowStore');

describe('Game Component', () => {
  const mockUseGameFlowStore = useGameFlowStore;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders setup phase when phase is setup', () => {
    mockUseGameFlowStore.mockReturnValue({
      phase: 'setup',
      isSetupComplete: false
    });

    render(<Game />);
    expect(screen.getByText('Game Setup')).toBeInTheDocument();
    expect(screen.getByText('Number of Players:')).toBeInTheDocument();
  });

  test('renders bidding phase when phase is bidding and setup is complete', () => {
    mockUseGameFlowStore.mockReturnValue({
      phase: 'bidding',
      isSetupComplete: true
    });

    render(<Game />);
    expect(screen.getByText('Bidding Phase')).toBeInTheDocument();
    expect(screen.getByText('Current Bid: 120')).toBeInTheDocument();
  });

  test('renders scoring phase when phase is scoring and setup is complete', () => {
    mockUseGameFlowStore.mockReturnValue({
      phase: 'scoring',
      isSetupComplete: true
    });

    render(<Game />);
    expect(screen.getByText('Scoring Phase')).toBeInTheDocument();
    expect(screen.getByText('Player 1: 150 points')).toBeInTheDocument();
  });

  test('renders results phase when phase is results and setup is complete', () => {
    mockUseGameFlowStore.mockReturnValue({
      phase: 'results',
      isSetupComplete: true
    });

    render(<Game />);
    expect(screen.getByText('Game Results')).toBeInTheDocument();
    expect(screen.getByText('Winner: Player 1 (150 points)')).toBeInTheDocument();
  });

  test('blocks game content when setup is incomplete and phase is not setup', () => {
    mockUseGameFlowStore.mockReturnValue({
      phase: 'bidding',
      isSetupComplete: false
    });

    render(<Game />);
    expect(screen.getByText('Setup Required')).toBeInTheDocument();
    expect(screen.getByText('Please complete the game setup before continuing.')).toBeInTheDocument();
    expect(screen.queryByText('Bidding Phase')).not.toBeInTheDocument();
  });

  test('shows phase indicator in header', () => {
    mockUseGameFlowStore.mockReturnValue({
      phase: 'setup',
      isSetupComplete: false
    });

    render(<Game />);
    expect(screen.getByText('Phase: setup')).toBeInTheDocument();
  });
});