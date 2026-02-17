import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider, useGame } from '../context/GameContext';

const TestComponent = () => {
  const { gamePhase, players, startGame, resetGame } = useGame();
  
  return (
    <div>
      <div data-testid="game-phase">{gamePhase}</div>
      <div data-testid="players-count">{players.length}</div>
      <button onClick={() => startGame([{ name: 'Player 1' }, { name: 'Player 2' }])}>
        Start Game
      </button>
      <button onClick={resetGame}>Reset Game</button>
    </div>
  );
};

describe('GameContext', () => {
  it('provides initial game state', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    expect(screen.getByTestId('game-phase')).toHaveTextContent('setup');
    expect(screen.getByTestId('players-count')).toHaveTextContent('0');
  });

  it('transitions to playing phase when game starts', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    fireEvent.click(screen.getByText('Start Game'));
    
    expect(screen.getByTestId('game-phase')).toHaveTextContent('playing');
    expect(screen.getByTestId('players-count')).toHaveTextContent('2');
  });

  it('resets to setup phase when game is reset', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    fireEvent.click(screen.getByText('Start Game'));
    fireEvent.click(screen.getByText('Reset Game'));
    
    expect(screen.getByTestId('game-phase')).toHaveTextContent('setup');
    expect(screen.getByTestId('players-count')).toHaveTextContent('0');
  });
});