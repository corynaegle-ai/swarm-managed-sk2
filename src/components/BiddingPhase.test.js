import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BiddingPhase from './BiddingPhase';

const mockPlayers = [
  { id: 'player1', name: 'Alice' },
  { id: 'player2', name: 'Bob' },
  { id: 'player3', name: 'Charlie' }
];

describe('BiddingPhase', () => {
  test('renders input field for each player with their name', () => {
    render(<BiddingPhase players={mockPlayers} round={1} />);
    
    mockPlayers.forEach(player => {
      expect(screen.getByText(player.name)).toBeInTheDocument();
      expect(screen.getByLabelText(player.name)).toBeInTheDocument();
      expect(screen.getByLabelText(player.name)).toHaveAttribute('type', 'number');
      expect(screen.getByLabelText(player.name)).toHaveAttribute('placeholder', 'Enter bid');
    });
  });

  test('input fields are properly controlled by component state', () => {
    render(<BiddingPhase players={mockPlayers} round={1} />);
    
    const aliceInput = screen.getByLabelText('Alice');
    const bobInput = screen.getByLabelText('Bob');
    
    // Initially empty
    expect(aliceInput.value).toBe('');
    expect(bobInput.value).toBe('');
    
    // Change Alice's bid
    fireEvent.change(aliceInput, { target: { value: '10' } });
    expect(aliceInput.value).toBe('10');
    expect(bobInput.value).toBe(''); // Bob's input should remain unchanged
  });

  test('each player bid can be entered and stored independently', () => {
    const mockOnBidsSubmit = jest.fn();
    render(<BiddingPhase players={mockPlayers} round={1} onBidsSubmit={mockOnBidsSubmit} />);
    
    const aliceInput = screen.getByLabelText('Alice');
    const bobInput = screen.getByLabelText('Bob');
    const charlieInput = screen.getByLabelText('Charlie');
    
    // Enter different bids for each player
    fireEvent.change(aliceInput, { target: { value: '15' } });
    fireEvent.change(bobInput, { target: { value: '8' } });
    fireEvent.change(charlieInput, { target: { value: '12' } });
    
    // Verify each input maintains its own value
    expect(aliceInput.value).toBe('15');
    expect(bobInput.value).toBe('8');
    expect(charlieInput.value).toBe('12');
    
    // Submit and verify the bids are passed correctly
    const submitButton = screen.getByText('Submit Bids');
    fireEvent.click(submitButton);
    
    expect(mockOnBidsSubmit).toHaveBeenCalledWith({
      'player1': '15',
      'player2': '8',
      'player3': '12'
    });
  });

  test('displays round number correctly', () => {
    render(<BiddingPhase players={mockPlayers} round={3} />);
    expect(screen.getByText('Bidding Phase - Round 3')).toBeInTheDocument();
  });
});