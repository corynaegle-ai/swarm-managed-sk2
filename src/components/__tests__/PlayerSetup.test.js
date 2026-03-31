import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerSetup from '../PlayerSetup';

// Mock crypto.randomUUID for testing
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'test-uuid-123')
  }
});

describe('PlayerSetup', () => {
  test('renders player setup component', () => {
    render(<PlayerSetup />);
    expect(screen.getByText('Player Setup')).toBeInTheDocument();
  });

  test('start game button is disabled with less than 2 players', () => {
    render(<PlayerSetup />);
    const startButton = screen.getByText('Start Game');
    expect(startButton).toBeDisabled();
  });

  test('can add and remove players', () => {
    render(<PlayerSetup />);
    
    // Add a player
    const nameInput = screen.getByPlaceholderText('Enter player name');
    const addButton = screen.getByText('Add Player');
    
    fireEvent.change(nameInput, { target: { value: 'Test Player' } });
    fireEvent.click(addButton);
    
    expect(screen.getByText('Test Player')).toBeInTheDocument();
    
    // Remove the player
    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);
    
    expect(screen.queryByText('Test Player')).not.toBeInTheDocument();
  });

  test('prevents adding more than 8 players', () => {
    // Mock alert
    window.alert = jest.fn();
    
    render(<PlayerSetup />);
    
    const nameInput = screen.getByPlaceholderText('Enter player name');
    const addButton = screen.getByText('Add Player');
    
    // Add 8 players
    for (let i = 1; i <= 8; i++) {
      fireEvent.change(nameInput, { target: { value: `Player ${i}` } });
      fireEvent.click(addButton);
    }
    
    // Try to add 9th player
    fireEvent.change(nameInput, { target: { value: 'Player 9' } });
    fireEvent.click(addButton);
    
    expect(window.alert).toHaveBeenCalledWith('Maximum 8 players allowed');
  });
});