import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerSetup from './PlayerSetup';

describe('PlayerSetup', () => {
  const mockOnStartGame = jest.fn();

  beforeEach(() => {
    mockOnStartGame.mockClear();
  });

  it('should disable start button with less than 2 players', () => {
    render(<PlayerSetup onStartGame={mockOnStartGame} />);
    const startButton = screen.getByText('Start Game');
    expect(startButton).toBeDisabled();
  });

  it('should show error message with less than 2 players', () => {
    render(<PlayerSetup onStartGame={mockOnStartGame} />);
    expect(screen.getByText(/Need at least 2 players/)).toBeInTheDocument();
  });

  it('should enable start button with valid player count', () => {
    render(<PlayerSetup onStartGame={mockOnStartGame} />);
    
    // Add two players
    const input = screen.getByPlaceholderText('Enter player name');
    const addButton = screen.getByText('Add Player');
    
    fireEvent.change(input, { target: { value: 'Player 1' } });
    fireEvent.click(addButton);
    
    fireEvent.change(input, { target: { value: 'Player 2' } });
    fireEvent.click(addButton);
    
    const startButton = screen.getByText('Start Game');
    expect(startButton).not.toBeDisabled();
  });

  it('should show warning message when approaching max players', () => {
    render(<PlayerSetup onStartGame={mockOnStartGame} />);
    
    // Add 7 players to trigger warning
    const input = screen.getByPlaceholderText('Enter player name');
    const addButton = screen.getByText('Add Player');
    
    for (let i = 1; i <= 7; i++) {
      fireEvent.change(input, { target: { value: `Player ${i}` } });
      fireEvent.click(addButton);
    }
    
    expect(screen.getByText(/Approaching maximum capacity/)).toBeInTheDocument();
  });

  it('should update player count display', () => {
    render(<PlayerSetup onStartGame={mockOnStartGame} />);
    expect(screen.getByText('Players (0/8):')).toBeInTheDocument();
    
    // Add a player
    const input = screen.getByPlaceholderText('Enter player name');
    const addButton = screen.getByText('Add Player');
    
    fireEvent.change(input, { target: { value: 'Player 1' } });
    fireEvent.click(addButton);
    
    expect(screen.getByText('Players (1/8):')).toBeInTheDocument();
  });

  it('should remove players when remove button clicked', () => {
    render(<PlayerSetup onStartGame={mockOnStartGame} />);
    
    // Add a player
    const input = screen.getByPlaceholderText('Enter player name');
    const addButton = screen.getByText('Add Player');
    
    fireEvent.change(input, { target: { value: 'Player 1' } });
    fireEvent.click(addButton);
    
    // Remove the player
    const removeButton = screen.getByLabelText('Remove Player 1');
    fireEvent.click(removeButton);
    
    expect(screen.getByText('Players (0/8):')).toBeInTheDocument();
  });
});