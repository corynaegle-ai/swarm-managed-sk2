/**
 * Unit tests for ScoreCalculation class
 */

describe('ScoreCalculation', () => {
  it('should create a ScoreCalculation instance with all parameters', () => {
    const breakdown = {
      bid: 7,
      tricks: 7,
      round: 1,
      formula: '7 * 20 = 140'
    };
    const scoreCalc = new ScoreCalculation(140, true, breakdown);

    expect(scoreCalc.points).toBe(140);
    expect(scoreCalc.bidMet).toBe(true);
    expect(scoreCalc.breakdown).toEqual(breakdown);
  });

  it('should have a getter for points', () => {
    const breakdown = {
      bid: 3,
      tricks: 4,
      round: 2,
      formula: '3 * 20 + 10 = 70'
    };
    const scoreCalc = new ScoreCalculation(70, false, breakdown);

    expect(scoreCalc.points).toBe(70);
  });

  it('should have a getter for bidMet', () => {
    const breakdown = {
      bid: 5,
      tricks: 5,
      round: 1,
      formula: '5 * 20 = 100'
    };
    const scoreCalc = new ScoreCalculation(100, true, breakdown);

    expect(scoreCalc.bidMet).toBe(true);
  });

  it('should have a getter for breakdown', () => {
    const breakdown = {
      bid: 2,
      tricks: 3,
      round: 3,
      formula: '2 * 20 + 10 = 50'
    };
    const scoreCalc = new ScoreCalculation(50, false, breakdown);

    expect(scoreCalc.breakdown).toEqual(breakdown);
    expect(scoreCalc.breakdown.bid).toBe(2);
    expect(scoreCalc.breakdown.tricks).toBe(3);
    expect(scoreCalc.breakdown.round).toBe(3);
    expect(scoreCalc.breakdown.formula).toBe('2 * 20 + 10 = 50');
  });

  it('should handle zero points', () => {
    const breakdown = {
      bid: 0,
      tricks: 0,
      round: 1,
      formula: '0'
    };
    const scoreCalc = new ScoreCalculation(0, false, breakdown);

    expect(scoreCalc.points).toBe(0);
  });

  it('should handle negative points', () => {
    const breakdown = {
      bid: 7,
      tricks: 5,
      round: 1,
      formula: '-100 (penalty)'
    };
    const scoreCalc = new ScoreCalculation(-100, false, breakdown);

    expect(scoreCalc.points).toBe(-100);
  });
});
