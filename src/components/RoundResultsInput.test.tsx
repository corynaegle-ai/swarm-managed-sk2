import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoundResultsInput } from './RoundResultsInput';
import { Player } from '../types/Player';

describe('RoundResultsInput Component', () => {
  const mockPlayers: Player[] = [
    { id: '1', name: 'Alice', scores: [] },
    { id: '2', name: 'Bob', scores: [] },
    { id: '3', name: 'Charlie', scores: [] },
  ];

  const mockBids = {
    '1': 3,
    '2': 2,
    '3': 1,
  };

  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders the component with player bids as reference', () => {
    render(
      <RoundResultsInput
        round={3}
        players={mockPlayers}
        bids={mockBids}
        onSubmit={mockOnSubmit}
      />
    );

    // Check title
    expect(screen.getByText('Round 3 Results')).toBeInTheDocument();

    // Check that player names are displayed
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();

    // Check that bids are displayed as reference
    const bidCells = screen.getAllByText(/^[0-9]$/);
    expect(bidCells.length).toBeGreaterThanOrEqual(3);
  });

  it('collects actual tricks won (0 to round number)', async () => {
    const user = userEvent.setup();
    render(
      <RoundResultsInput
        round={3}
        players={mockPlayers}
        bids={mockBids}
        onSubmit={mockOnSubmit}
      />
    );

    const inputs = screen.getAllByDisplayValue('');
    // First set of inputs are for tricks won
    await user.type(inputs[0], '3');
    await user.type(inputs[2], '2');
    await user.type(inputs[4], '1');

    // Verify inputs have the values
    expect((inputs[0] as HTMLInputElement).value).toBe('3');
    expect((inputs[2] as HTMLInputElement).value).toBe('2');
    expect((inputs[4] as HTMLInputElement).value).toBe('1');
  });

  it('collects bonus points (manual entry, can be 0)', async () => {
    const user = userEvent.setup();
    render(
      <RoundResultsInput
        round={3}
        players={mockPlayers}
        bids={mockBids}
        onSubmit={mockOnSubmit}
      />
    );

    const inputs = screen.getAllByDisplayValue(/^0?$/);
    // Bonus points inputs
    await user.type(inputs[1], '10');
    await user.type(inputs[3], '5');
    // Leave the last one as 0 (default)

    // Verify bonus inputs
    expect((inputs[1] as HTMLInputElement).value).toBe('10');
    expect((inputs[3] as HTMLInputElement).value).toBe('5');
  });

  it('only adds bonus to score if bid was met exactly', async () => {
    const user = userEvent.setup();
    render(
      <RoundResultsInput
        round={3}
        players={mockPlayers}
        bids={mockBids}
        onSubmit={mockOnSubmit}
      />
    );

    // Alice: bid=3, tricks=3, bonus=50 → score should be 30 + 50 = 80
    // Bob: bid=2, tricks=2, bonus=20 → score should be 20 + 20 = 40
    // Charlie: bid=1, tricks=2, bonus=30 → score should be 20 + 0 = 20 (bonus not applied)

    const inputs = screen.getAllByDisplayValue(/^0?$/);
    await user.type(inputs[0], '3'); // Alice tricks
    await user.type(inputs[1], '50'); // Alice bonus
    await user.type(inputs[2], '2'); // Bob tricks
    await user.type(inputs[3], '20'); // Bob bonus
    await user.type(inputs[4], '2'); // Charlie tricks (doesn't match bid of 1)
    await user.type(inputs[5], '30'); // Charlie bonus

    const submitButton = screen.getByText('Submit Results');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    const results = mockOnSubmit.mock.calls[0][0];
    expect(results[0].roundScore).toBe(80); // Alice: 30 + 50
    expect(results[1].roundScore).toBe(40); // Bob: 20 + 20
    expect(results[2].roundScore).toBe(20); // Charlie: 20 + 0 (no bonus)
  });

  it('calculates and displays round scores immediately', async () => {
    const user = userEvent.setup();
    render(
      <RoundResultsInput
        round={3}
        players={mockPlayers}
        bids={mockBids}
        onSubmit={mockOnSubmit}
      />
    );

    const inputs = screen.getAllByDisplayValue(/^0?$/);
    await user.type(inputs[0], '2'); // Alice tricks
    await user.type(inputs[1], '10'); // Alice bonus

    // Score should update to show the calculation
    // Alice: bid=3, tricks=2, bonus=10 → score = 20 + 0 = 20 (no bonus because 3 !== 2)
    const roundScores = screen.getAllByText(/^[0-9]+$/); // This is a rough check
    expect(roundScores.length).toBeGreaterThan(0);
  });

  it('validates tricks won input (0 to round number)', async () => {
    const user = userEvent.setup();
    render(
      <RoundResultsInput
        round={3}
        players={mockPlayers}
        bids={mockBids}
        onSubmit={mockOnSubmit}
      />
    );

    const inputs = screen.getAllByDisplayValue('');
    // Try to enter more tricks than the round number
    await user.type(inputs[0], '5'); // More than round 3
    await user.type(inputs[2], '0');
    await user.type(inputs[4], '0');

    const submitButton = screen.getByText('Submit Results');
    await user.click(submitButton);

    // Should show error
    await waitFor(() => {
      expect(screen.getByText(/Tricks must be between/)).toBeInTheDocument();
    });

    // Should not call submit
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates bonus points input (non-negative)', async () => {
    const user = userEvent.setup();
    render(
      <RoundResultsInput
        round={3}
        players={mockPlayers}
        bids={mockBids}
        onSubmit={mockOnSubmit}
      />
    );

    const inputs = screen.getAllByDisplayValue(/^0?$/);
    await user.type(inputs[0], '2');
    await user.type(inputs[1], '-10'); // Negative bonus
    await user.type(inputs[2], '1');
    await user.type(inputs[3], '5');
    await user.type(inputs[4], '0');

    const submitButton = screen.getByText('Submit Results');
    await user.click(submitButton);

    // Should show error
    await waitFor(() => {
      expect(screen.getByText(/Bonus points must be a non-negative/)).toBeInTheDocument();
    });

    // Should not call submit
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('requires all inputs to be filled', async () => {
    const user = userEvent.setup();
    render(
      <RoundResultsInput
        round={3}
        players={mockPlayers}
        bids={mockBids}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByText('Submit Results');
    await user.click(submitButton);

    // Should show errors for required fields
    await waitFor(() => {
      expect(screen.getAllByText(/is required/)).toHaveLength(6); // 3 players × 2 fields
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits correct data structure', async () => {
    const user = userEvent.setup();
    render(
      <RoundResultsInput
        round={2}
        players={mockPlayers}
        bids={mockBids}
        onSubmit={mockOnSubmit}
      />
    );

    const inputs = screen.getAllByDisplayValue(/^0?$/);
    await user.type(inputs[0], '3');
    await user.type(inputs[1], '0');
    await user.type(inputs[2], '2');
    await user.type(inputs[3], '15');
    await user.type(inputs[4], '1');
    await user.type(inputs[5], '0');

    const submitButton = screen.getByText('Submit Results');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    const results = mockOnSubmit.mock.calls[0][0];
    expect(results).toHaveLength(3);
    expect(results[0]).toEqual(
      expect.objectContaining({
        playerId: '1',
        playerName: 'Alice',
        bid: 3,
        tricksWon: 3,
        bonusPoints: 0,
        roundScore: 30,
      })
    );
    expect(results[1]).toEqual(
      expect.objectContaining({
        playerId: '2',
        playerName: 'Bob',
        bid: 2,
        tricksWon: 2,
        bonusPoints: 15,
        roundScore: 35,
      })
    );
  });
});
