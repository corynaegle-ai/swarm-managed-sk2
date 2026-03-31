import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BiddingPhase from '../BiddingPhase';

const mockGameState = {
  players: [
    { id: 1, name: 'Player 1' },
    { id: 2, name: 'Player 2' }
  ],
  currentRound: 1,
  handsInRound: 5
};

const mockOnBidsSubmit = jest.fn();

describe('BiddingPhase', () => {
  beforeEach(() => {
    mockOnBidsSubmit.mockClear();
  });

  test('validates numeric input', () => {
    render(<BiddingPhase gameState={mockGameState} onBidsSubmit={mockOnBidsSubmit} />);
    
    const input = screen.getByLabelText('Player 1:');
    fireEvent.change(input, { target: { value: 'abc' } });
    
    expect(screen.getByText('Bid must be a number')).toBeInTheDocument();
  });

  test('validates bid range', () => {
    render(<BiddingPhase gameState={mockGameState} onBidsSubmit={mockOnBidsSubmit} />);
    
    const input = screen.getByLabelText('Player 1:');
    fireEvent.change(input, { target: { value: '10' } });
    
    expect(screen.getByText('Bid must be between 0 and 5')).toBeInTheDocument();
  });

  test('clears error on valid input', () => {
    render(<BiddingPhase gameState={mockGameState} onBidsSubmit={mockOnBidsSubmit} />);
    
    const input = screen.getByLabelText('Player 1:');
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(screen.getByText('Bid must be a number')).toBeInTheDocument();
    
    fireEvent.change(input, { target: { value: '3' } });
    expect(screen.queryByText('Bid must be a number')).not.toBeInTheDocument();
  });

  test('displays round information', () => {
    render(<BiddingPhase gameState={mockGameState} onBidsSubmit={mockOnBidsSubmit} />);
    
    expect(screen.getByText('Round 1 - Bidding Phase')).toBeInTheDocument();
    expect(screen.getByText('Hands in this round: 5')).toBeInTheDocument();
  });
});