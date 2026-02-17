import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FinalResults from '../FinalResults';
import { useGameFlowStore } from '../../stores/gameFlowStore';

// Mock the game flow store
jest.mock('../../stores/gameFlowStore');

const mockUseGameFlowStore = useGameFlowStore as jest.MockedFunction<typeof useGameFlowStore>;

describe('FinalResults', () => {
  const mockRestartGame = jest.fn();
  
  beforeEach(() => {
    mockRestartGame.mockClear();
  });

  it('should not render when game phase is not final or complete', () => {
    mockUseGameFlowStore.mockReturnValue({
      gamePhase: 'playing',
      gameResults: null,
      restartGame: mockRestartGame,
      isLoading: false
    });

    const { container } = render(<FinalResults />);
    expect(container.firstChild).toBeNull();
  });

  it('should render when game phase is final', () => {
    mockUseGameFlowStore.mockReturnValue({
      gamePhase: 'final',
      gameResults: { score: 100, moves: 25 },
      restartGame: mockRestartGame,
      isLoading: false
    });

    render(<FinalResults />);
    expect(screen.getByText('Game Complete!')).toBeInTheDocument();
    expect(screen.getByText('Game Summary')).toBeInTheDocument();
  });

  it('should render when game phase is complete', () => {
    mockUseGameFlowStore.mockReturnValue({
      gamePhase: 'complete',
      gameResults: { score: 150, moves: 30 },
      restartGame: mockRestartGame,
      isLoading: false
    });

    render(<FinalResults />);
    expect(screen.getByText('Game Complete!')).toBeInTheDocument();
  });

  it('should display game summary data from gameFlowStore', () => {
    const gameResults = {
      score: 200,
      duration: '5:30',
      moves: 42,
      winner: 'Player 1',
      performance: 'Excellent'
    };

    mockUseGameFlowStore.mockReturnValue({
      gamePhase: 'final',
      gameResults,
      restartGame: mockRestartGame,
      isLoading: false
    });

    render(<FinalResults />);
    
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('5:30')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  it('should call restartGame when Start New Game button is clicked', async () => {
    mockUseGameFlowStore.mockReturnValue({
      gamePhase: 'final',
      gameResults: { score: 100 },
      restartGame: mockRestartGame,
      isLoading: false
    });

    render(<FinalResults />);
    
    const startButton = screen.getByText('Start New Game');
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(mockRestartGame).toHaveBeenCalledTimes(1);
    });
  });

  it('should show loading state when initializing new game', () => {
    mockUseGameFlowStore.mockReturnValue({
      gamePhase: 'final',
      gameResults: { score: 100 },
      restartGame: mockRestartGame,
      isLoading: true
    });

    render(<FinalResults />);
    
    expect(screen.getByText('Starting New Game...')).toBeInTheDocument();
    expect(screen.getByText('Initializing new game...')).toBeInTheDocument();
  });

  it('should handle no game results gracefully', () => {
    mockUseGameFlowStore.mockReturnValue({
      gamePhase: 'final',
      gameResults: null,
      restartGame: mockRestartGame,
      isLoading: false
    });

    render(<FinalResults />);
    
    expect(screen.getByText('No game results available')).toBeInTheDocument();
  });
});