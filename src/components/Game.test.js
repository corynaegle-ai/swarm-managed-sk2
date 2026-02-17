import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Game from './Game';

// Mock BiddingPhase component
jest.mock('./BiddingPhase', () => {
  return function MockBiddingPhase({ round, players, onBidSubmitted, cardsInHand }) {
    return (
      <div data-testid="bidding-phase">
        <h2>Bidding Phase - Round {round}</h2>
        <p>Cards in hand: {cardsInHand}</p>
        {players.map(player => (
          <button
            key={player.id}
            data-testid={`bid-button-${player.id}`}
            onClick={() => onBidSubmitted(player.id, 2)}
          >
            Bid for {player.name}
          </button>
        ))}
      </div>
    );
  };
});

describe('Game Component', () => {
  test('renders game with initial bidding phase', () => {
    render(<Game />);
    
    expect(screen.getByText('Skull King - Round 1')).toBeInTheDocument();
    expect(screen.getByText('BIDDING')).toBeInTheDocument();
    expect(screen.getByTestId('bidding-phase')).toBeInTheDocument();
  });

  test('passes correct props to BiddingPhase', () => {
    render(<Game />);
    
    expect(screen.getByText('Bidding Phase - Round 1')).toBeInTheDocument();
    expect(screen.getByText('Cards in hand: 1')).toBeInTheDocument();
  });

  test('transitions from bidding to playing phase after all bids', async () => {
    render(<Game />);
    
    // Initially in bidding phase
    expect(screen.getByTestId('bidding-phase')).toBeInTheDocument();
    
    // Submit bids for all players
    fireEvent.click(screen.getByTestId('bid-button-1'));
    fireEvent.click(screen.getByTestId('bid-button-2'));
    fireEvent.click(screen.getByTestId('bid-button-3'));
    fireEvent.click(screen.getByTestId('bid-button-4'));
    
    // Wait for transition to playing phase
    await waitFor(() => {
      expect(screen.getByText('Playing Phase - Round 1')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    expect(screen.getByText('PLAYING')).toBeInTheDocument();
  });

  test('displays player information in playing phase', async () => {
    render(<Game />);
    
    // Submit all bids to transition to playing phase
    fireEvent.click(screen.getByTestId('bid-button-1'));
    fireEvent.click(screen.getByTestId('bid-button-2'));
    fireEvent.click(screen.getByTestId('bid-button-3'));
    fireEvent.click(screen.getByTestId('bid-button-4'));
    
    await waitFor(() => {
      expect(screen.getByText('Playing Phase - Round 1')).toBeInTheDocument();
    });
    
    // Check that player info is displayed
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Bid: 2')).toBeInTheDocument();
  });

  test('handles round progression', () => {
    render(<Game />);
    
    expect(screen.getByText('Skull King - Round 1')).toBeInTheDocument();
  });
});