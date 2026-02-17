import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Game from '../Game';
import { useGameFlowStore } from '../../store/gameFlowStore';

// Mock the game flow store
jest.mock('../../store/gameFlowStore');

// Mock child components
jest.mock('../GameSetup', () => {
  return function GameSetup() {
    return <div data-testid="game-setup">Game Setup</div>;
  };
});

jest.mock('../GamePlay', () => {
  return function GamePlay() {
    return <div data-testid="game-play">Game Play</div>;
  };
});

const mockResetGame = jest.fn();

describe('Game Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders setup phase correctly', () => {
    useGameFlowStore.mockReturnValue({
      phase: 'setup',
      scores: {},
      settings: {},
      gameState: {},
      resetGame: mockResetGame
    });

    render(<Game />);
    expect(screen.getByTestId('game-setup')).toBeInTheDocument();
  });

  it('renders playing phase correctly', () => {
    useGameFlowStore.mockReturnValue({
      phase: 'playing',
      scores: {},
      settings: {},
      gameState: {},
      resetGame: mockResetGame
    });

    render(<Game />);
    expect(screen.getByTestId('game-play')).toBeInTheDocument();
  });

  it('renders results phase with final scores', () => {
    useGameFlowStore.mockReturnValue({
      phase: 'results',
      scores: {
        'player1': 100,
        'player2': 85
      },
      settings: {
        gameDuration: '10 minutes',
        gameMode: 'Standard'
      },
      gameState: {
        players: [
          { id: 'player1', name: 'Alice' },
          { id: 'player2', name: 'Bob' }
        ]
      },
      resetGame: mockResetGame
    });

    render(<Game />);
    
    expect(screen.getByText('Game Results')).toBeInTheDocument();
    expect(screen.getByText('Final Scores')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('displays game summary in results phase', () => {
    useGameFlowStore.mockReturnValue({
      phase: 'results',
      scores: { 'player1': 100 },
      settings: {
        gameDuration: '15 minutes',
        gameMode: 'Tournament'
      },
      gameState: {
        players: [{ id: 'player1', name: 'Alice' }]
      },
      resetGame: mockResetGame
    });

    render(<Game />);
    
    expect(screen.getByText('Game Summary')).toBeInTheDocument();
    expect(screen.getByText('Players: 1')).toBeInTheDocument();
    expect(screen.getByText('Duration: 15 minutes')).toBeInTheDocument();
    expect(screen.getByText('Mode: Tournament')).toBeInTheDocument();
  });

  it('shows New Game button in results phase', () => {
    useGameFlowStore.mockReturnValue({
      phase: 'results',
      scores: {},
      settings: {},
      gameState: {},
      resetGame: mockResetGame
    });

    render(<Game />);
    
    const newGameButton = screen.getByText('New Game');
    expect(newGameButton).toBeInTheDocument();
    expect(newGameButton).toHaveClass('new-game-button');
  });

  it('calls resetGame when New Game button is clicked', () => {
    useGameFlowStore.mockReturnValue({
      phase: 'results',
      scores: {},
      settings: {},
      gameState: {},
      resetGame: mockResetGame
    });

    render(<Game />);
    
    const newGameButton = screen.getByText('New Game');
    fireEvent.click(newGameButton);
    
    expect(mockResetGame).toHaveBeenCalledTimes(1);
  });

  it('handles unknown phase gracefully', () => {
    useGameFlowStore.mockReturnValue({
      phase: 'unknown',
      scores: {},
      settings: {},
      gameState: {},
      resetGame: mockResetGame
    });

    render(<Game />);
    
    expect(screen.getByText('Unknown game phase: unknown')).toBeInTheDocument();
    expect(screen.getByText('Reset Game')).toBeInTheDocument();
  });
});