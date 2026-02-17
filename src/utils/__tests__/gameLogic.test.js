import { validateBid, canAdvanceToPlaying, resetBidsForNewRound } from '../gameLogic';

describe('validateBid', () => {
  test('should return true for valid bid and player ID', () => {
    expect(validateBid(10, 'player1')).toBe(true);
    expect(validateBid('5', 'player2')).toBe(true);
    expect(validateBid(0, 'player3')).toBe(true);
  });

  test('should return false for invalid player ID', () => {
    expect(validateBid(10, '')).toBe(false);
    expect(validateBid(10, null)).toBe(false);
    expect(validateBid(10, undefined)).toBe(false);
    expect(validateBid(10, 123)).toBe(false);
  });

  test('should return false for invalid bid values', () => {
    expect(validateBid('invalid', 'player1')).toBe(false);
    expect(validateBid(NaN, 'player1')).toBe(false);
    expect(validateBid(Infinity, 'player1')).toBe(false);
    expect(validateBid(-5, 'player1')).toBe(false);
    expect(validateBid(null, 'player1')).toBe(false);
    expect(validateBid(undefined, 'player1')).toBe(false);
  });
});

describe('canAdvanceToPlaying', () => {
  test('should return true when all players have submitted valid bids', () => {
    const bids = { player1: 5, player2: 10, player3: 3 };
    expect(canAdvanceToPlaying(bids, 3)).toBe(true);
  });

  test('should return false when not all players have submitted bids', () => {
    const bids = { player1: 5, player2: 10 };
    expect(canAdvanceToPlaying(bids, 3)).toBe(false);
  });

  test('should return false when too many bids are submitted', () => {
    const bids = { player1: 5, player2: 10, player3: 3, player4: 7 };
    expect(canAdvanceToPlaying(bids, 3)).toBe(false);
  });

  test('should return false for invalid bids object', () => {
    expect(canAdvanceToPlaying(null, 3)).toBe(false);
    expect(canAdvanceToPlaying([], 3)).toBe(false);
    expect(canAdvanceToPlaying('invalid', 3)).toBe(false);
  });

  test('should return false for invalid totalPlayers', () => {
    const bids = { player1: 5 };
    expect(canAdvanceToPlaying(bids, 0)).toBe(false);
    expect(canAdvanceToPlaying(bids, -1)).toBe(false);
    expect(canAdvanceToPlaying(bids, 1.5)).toBe(false);
    expect(canAdvanceToPlaying(bids, 'invalid')).toBe(false);
  });

  test('should return false when bids contain invalid values', () => {
    const bids = { player1: -5, player2: 10 };
    expect(canAdvanceToPlaying(bids, 2)).toBe(false);
  });
});

describe('resetBidsForNewRound', () => {
  test('should return object with empty bids and playersSubmittedBids arrays', () => {
    const result = resetBidsForNewRound();
    expect(result).toEqual({
      bids: {},
      playersSubmittedBids: []
    });
  });

  test('should return new objects on each call', () => {
    const result1 = resetBidsForNewRound();
    const result2 = resetBidsForNewRound();
    expect(result1).not.toBe(result2);
    expect(result1.bids).not.toBe(result2.bids);
    expect(result1.playersSubmittedBids).not.toBe(result2.playersSubmittedBids);
  });
});