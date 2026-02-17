import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ScoringPhase from '../ScoringPhase';

const mockPlayer = {
  name: 'Test Player',
  bid: 2
};

const mockOnSubmit = jest.fn();

describe('ScoringPhase Component', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('displays player bid prominently', () => {
    render(
      <ScoringPhase 
        player={mockPlayer}
        playerIndex={0}
        handsInRound={5}
        onSubmit={mockOnSubmit}
      />
    );
    
    expect(screen.getByText(/Player's Bid: 2/)).toBeInTheDocument();
    expect(screen.getByText(/Must take exactly 2 tricks/)).toBeInTheDocument();
  });

  test('limits tricks input to handsInRound range', () => {
    render(
      <ScoringPhase 
        player={mockPlayer}
        playerIndex={0}
        handsInRound={3}
        onSubmit={mockOnSubmit}
      />
    );
    
    const tricksInput = screen.getByLabelText(/Actual Tricks Taken/);
    expect(tricksInput.getAttribute('max')).toBe('3');
    expect(tricksInput.getAttribute('min')).toBe('0');
  });

  test('disables bonus points when bid is incorrect', async () => {
    render(
      <ScoringPhase 
        player={mockPlayer}
        playerIndex={0}
        handsInRound={5}
        onSubmit={mockOnSubmit}
      />
    );
    
    const tricksInput = screen.getByLabelText(/Actual Tricks Taken/);
    const bonusInput = screen.getByLabelText(/Bonus Points/);
    
    fireEvent.change(tricksInput, { target: { value: '1' } });
    
    await waitFor(() => {
      expect(bonusInput).toBeDisabled();
      expect(screen.getByText(/Bonus points only available when bid is correct/)).toBeInTheDocument();
    });
  });

  test('enables bonus points when bid is correct', async () => {
    render(
      <ScoringPhase 
        player={mockPlayer}
        playerIndex={0}
        handsInRound={5}
        onSubmit={mockOnSubmit}
      />
    );
    
    const tricksInput = screen.getByLabelText(/Actual Tricks Taken/);
    const bonusInput = screen.getByLabelText(/Bonus Points/);
    
    fireEvent.change(tricksInput, { target: { value: '2' } });
    
    await waitFor(() => {
      expect(bonusInput).not.toBeDisabled();
    });
  });

  test('updates score calculation in real-time', async () => {
    render(
      <ScoringPhase 
        player={mockPlayer}
        playerIndex={0}
        handsInRound={5}
        onSubmit={mockOnSubmit}
      />
    );
    
    const tricksInput = screen.getByLabelText(/Actual Tricks Taken/);
    
    // Test correct bid
    fireEvent.change(tricksInput, { target: { value: '2' } });
    await waitFor(() => {
      expect(screen.getByText(/Calculated Score: 40/)).toBeInTheDocument();
    });
    
    // Test incorrect bid
    fireEvent.change(tricksInput, { target: { value: '1' } });
    await waitFor(() => {
      expect(screen.getByText(/Calculated Score: -10/)).toBeInTheDocument();
    });
  });

  test('submits score and advances to next player', async () => {
    render(
      <ScoringPhase 
        player={mockPlayer}
        playerIndex={0}
        handsInRound={5}
        onSubmit={mockOnSubmit}
      />
    );
    
    const tricksInput = screen.getByLabelText(/Actual Tricks Taken/);
    const submitButton = screen.getByText(/Submit Score & Continue/);
    
    fireEvent.change(tricksInput, { target: { value: '2' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(0, {
        tricks: 2,
        bid: 2,
        bonusPoints: 0,
        roundScore: 40,
        bidCorrect: true
      });
    });
  });
});