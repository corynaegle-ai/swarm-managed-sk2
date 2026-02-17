import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FinalResults from '../FinalResults';
import { useGameFlowStore } from '../../stores/gameFlowStore';

// Mock the gameFlowStore hook
jest.mock('../../stores/gameFlowStore');

const mockUseGameFlowStore = useGameFlowStore;

describe('FinalResults Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when game phase is not final', () => {
    mockUseGameFlowStore.mockReturnValue({
      gamePhase: 'playing',
      gameResults: null,
      resetGame: jest.fn()
    });

    const { container } = render(<FinalResults />);
    expect(container.firstChild).toBeNull();
  });

  it('renders when game phase is final', () => {
    mockUseGameFlowStore.mockReturnValue({
      gamePhase: 'final',
      gameResults: { score: 100 },
      resetGame: jest.fn()
    });

    render(<FinalResults />);
    expect(screen.getByText('Game Complete!')).toBeInTheDocument();
  });

  it('renders when game phase is complete', () => {
    mockUseGameFlowStore.mockReturnValue({
      gamePhase: 'complete',
      gameResults: { score: 100 },
      resetGame: jest.fn()
    });

    render(<FinalResults />);
    expect(screen.getByText('Game Complete!')).toBeInTheDocument();
  });

  it('displays game summary data from gameResults', () => {
    const gameResults = {
      score: 1500,
      duration: '5:30',
      level: 10,
      achievements: ['Speed Demon', 'Perfect Score']
    };

    mockUseGameFlowStore.mockReturnValue({
      gamePhase: 'final',
      gameResults,
      resetGame: jest.fn()
    });

    render(<FinalResults />);
    
    expect(screen.getByText('1500')).toBeInTheDocument();
    expect(screen.getByText('5:30')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Speed Demon')).toBeInTheDocument();
    expect(screen.getByText('Perfect Score')).toBeInTheDocument();
  });

  it('calls resetGame when Start New Game button is clicked', async () => {
    const mockResetGame = jest.fn().mockResolvedValue();
    
    mockUseGameFlowStore.mockReturnValue({
      gamePhase: 'final',
      gameResults: { score: 100 },
      resetGame: mockResetGame
    });

    render(<FinalResults />);
    
    const button = screen.getByText('Start New Game');
    fireEvent.click(button);
    
    expect(mockResetGame).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when initializing new game', async () => {
    const mockResetGame = jest.fn().mockImplementation(() => {
      return new Promise(resolve => setTimeout(resolve, 100));
    });
    
    mockUseGameFlowStore.mockReturnValue({
      gamePhase: 'final',
      gameResults: { score: 100 },
      resetGame: mockResetGame
    });

    render(<FinalResults />);
    
    const button = screen.getByText('Start New Game');
    fireEvent.click(button);
    
    expect(screen.getByText('Starting New Game...')).toBeInTheDocument();
    expect(button).toBeDisabled();
    
    await waitFor(() => {
      expect(screen.getByText('Start New Game')).toBeInTheDocument();
    });
  });

  it('handles resetGame errors gracefully', async () => {
    const mockResetGame = jest.fn().mockRejectedValue(new Error('Reset failed'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    mockUseGameFlowStore.mockReturnValue({
      gamePhase: 'final',
      gameResults: { score: 100 },
      resetGame: mockResetGame
    });

    render(<FinalResults />);
    
    const button = screen.getByText('Start New Game');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Start New Game')).toBeInTheDocument();
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('Error starting new game:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});