/**
 * ScoreCalculation class represents scoring results for a bridge hand.
 * Stores the total score, whether the bid was met, and breakdown details.
 */
class ScoreCalculation {
  /**
   * Creates a new ScoreCalculation instance.
   * @param {number} points - The total score points
   * @param {boolean} bidMet - Whether the bid was exactly met
   * @param {object} breakdown - Calculation details containing bid, tricks, round, and formula
   */
  constructor(points, bidMet, breakdown) {
    this._points = points;
    this._bidMet = bidMet;
    this._breakdown = breakdown;
  }

  /**
   * Gets the total score points.
   * @returns {number} The points value
   */
  get points() {
    return this._points;
  }

  /**
   * Gets whether the bid was met.
   * @returns {boolean} True if bid was exactly met
   */
  get bidMet() {
    return this._bidMet;
  }

  /**
   * Gets the breakdown object with calculation details.
   * @returns {object} Breakdown containing bid, tricks, round, and formula
   */
  get breakdown() {
    return this._breakdown;
  }
}
