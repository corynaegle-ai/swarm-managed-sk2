import { validateBid, canAdvanceToPlaying, resetBidsForNewRound } from '../gameLogic';

describe('validateBid', () => {
  it('should return true for valid bid and playerId', () => {
    expect(validateBid(10, 'player1')).toBe(true);
    expect(validateBid(0, 'player2')).toBe(true);
    expect(validateBid(100.5, 'player3')).toBe(true);
  });

  it('should return false for invalid playerId', () => {
    expect(validateBid(10, '')).toBe(false);
    expect(validateBid(10, null)).toBe(false);
    expect(validateBid(10, undefined)).toBe(false);
    expect(validateBid(10, 123)).toBe(false);
    expect(validateBid(10, '   ')).toBe(false);
  });

  it('should return false for invalid bid', () => {
    expect(validateBid('10', 'player1')).toBe(false);
    expect(validateBid(NaN, 'player1')).toBe(false);
    expect(validateBid(Infinity, 'player1')).toBe(false);
    expect(validateBid(-5, 'player1')).toBe(false);
    expect(validateBid(null, 'player1')).toBe(false);
    expect(validateBid(undefined, 'player1')).toBe(false);
  });
});

describe('canAdvanceToPlaying', () => {
  it('should return true when all players have submitted valid bids', () => {
    const bids = {
      'player1': 10,
      'player2': 5,
      'player3': 15
    };
    expect(canAdvanceToPlaying(bids, 3)).toBe(true);
  });

  it('should return false when not all players have submitted bids', () => {
    const bids = {
      'player1': 10,
      'player2': 5
    };
    expect(canAdvanceToPlaying(bids, 3)).toBe(false);
  });

  it('should return false when too many bids are submitted', () => {
    const bids = {
      'player1': 10,
      'player2': 5,
      'player3': 15,
      'player4': 20
    };
    expect(canAdvanceToPlaying(bids, 3)).toBe(false);
  });

  it('should return false for invalid bids', () => {
    const bids = {
      'player1': 10,
      'player2': -5,
      'player3': 15
    };
    expect(canAdvanceToPlaying(bids, 3)).toBe(false);
  });

  it('should return false for invalid inputs', () => {
    expect(canAdvanceToPlaying(null, 3)).toBe(false);
    expect(canAdvanceToPlaying({}, 0)).toBe(false);
    expect(canAdvanceToPlaying({}, -1)).toBe(false);
    expect(canAdvanceToPlaying({}, 'invalid')).toBe(false);
  });
});

describe('resetBidsForNewRound', () => {
  it('should return object with empty bids and playersSubmittedBids', () => {
    const result = resetBidsForNewRound();
    expect(result).toEqual({
      bids: {},
      playersSubmittedBids: []
    });
  });

  it('should return a new object each time', () => {
    const result1 = resetBidsForNewRound();
    const result2 = resetBidsForNewRound();
    expect(result1).not.toBe(result2);
    expect(result1.bids).not.toBe(result2.bids);
    expect(result1.playersSubmittedBids).not.toBe(result2.playersSubmittedBids);
  });
});