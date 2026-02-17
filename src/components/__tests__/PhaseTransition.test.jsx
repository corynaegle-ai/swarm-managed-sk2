import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PhaseTransition from '../PhaseTransition';
import { useGameFlowStore } from '../../stores/gameFlowStore';

// Mock the gameFlowStore hook
vi.mock('../../stores/gameFlowStore');

describe('PhaseTransition', () => {
  const mockStartGame = vi.fn();
  const mockEndGame = vi.fn();
  const mockNextPhase = vi.fn();
  const mockResetGame = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Start Game button in waiting phase', () => {
    useGameFlowStore.mockReturnValue({
      currentPhase: 'waiting',
      isTransitioning: false,
      startGame: mockStartGame,
      endGame: mockEndGame,
      nextPhase: mockNextPhase,
      resetGame: mockResetGame
    });

    render(<PhaseTransition />);
    
    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });

  it('renders Next Phase and End Game buttons in playing phase', () => {
    useGameFlowStore.mockReturnValue({
      currentPhase: 'playing',
      isTransitioning: false,
      startGame: mockStartGame,
      endGame: mockEndGame,
      nextPhase: mockNextPhase,
      resetGame: mockResetGame
    });

    render(<PhaseTransition />);
    
    expect(screen.getByText('Next Phase')).toBeInTheDocument();
    expect(screen.getByText('End Game')).toBeInTheDocument();
  });

  it('shows loading states when transitioning', () => {
    useGameFlowStore.mockReturnValue({
      currentPhase: 'waiting',
      isTransitioning: true,
      startGame: mockStartGame,
      endGame: mockEndGame,
      nextPhase: mockNextPhase,
      resetGame: mockResetGame
    });

    render(<PhaseTransition />);
    
    expect(screen.getByText('Starting...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls correct transition methods when buttons are clicked', () => {
    useGameFlowStore.mockReturnValue({
      currentPhase: 'waiting',
      isTransitioning: false,
      startGame: mockStartGame,
      endGame: mockEndGame,
      nextPhase: mockNextPhase,
      resetGame: mockResetGame
    });

    render(<PhaseTransition />);
    
    fireEvent.click(screen.getByText('Start Game'));
    expect(mockStartGame).toHaveBeenCalledTimes(1);
  });

  it('does not render for idle phase', () => {
    useGameFlowStore.mockReturnValue({
      currentPhase: 'idle',
      isTransitioning: false,
      startGame: mockStartGame,
      endGame: mockEndGame,
      nextPhase: mockNextPhase,
      resetGame: mockResetGame
    });

    const { container } = render(<PhaseTransition />);
    expect(container).toBeEmptyDOMElement();
  });
});