package com.example.skullking.scoring;

/**
 * Represents the result of a score calculation for a single round in Skull King.
 * Encapsulates the bid, tricks taken, round number, calculated score, and bid success status.
 */
public class ScoreCalculation {
    private final int bid;
    private final int tricksTaken;
    private final int roundNumber;
    private final int score;
    private final boolean bidMet;

    /**
     * Constructs a ScoreCalculation with all required information.
     *
     * @param bid the number of tricks bid (0 or greater)
     * @param tricksTaken the number of tricks actually taken
     * @param roundNumber the current round number (1-based)
     * @param score the calculated score for this round
     * @param bidMet whether the bid was exactly met
     */
    public ScoreCalculation(int bid, int tricksTaken, int roundNumber, int score, boolean bidMet) {
        this.bid = bid;
        this.tricksTaken = tricksTaken;
        this.roundNumber = roundNumber;
        this.score = score;
        this.bidMet = bidMet;
    }

    /**
     * Calculates the score based on Skull King rules.
     *
     * Scoring rules:
     * - Bid 1+: If bid == tricksTaken, score = +20 * bid
     *           If bid != tricksTaken, score = -10 * |bid - tricksTaken|
     * - Bid 0: If tricksTaken == 0, score = +10 * roundNumber
     *          If tricksTaken > 0, score = -10 * roundNumber
     *
     * @param bid the number of tricks bid
     * @param tricksTaken the number of tricks actually taken
     * @param roundNumber the current round number (1-based, typically 1-10)
     * @return a ScoreCalculation object with the calculated score and bid status
     */
    public static ScoreCalculation calculate(int bid, int tricksTaken, int roundNumber) {
        boolean bidMet = (bid == tricksTaken);
        int score;

        if (bid == 0) {
            // Bid 0 rules
            if (tricksTaken == 0) {
                score = 10 * roundNumber;
            } else {
                score = -10 * roundNumber;
            }
        } else {
            // Bid 1+ rules
            if (bidMet) {
                score = 20 * bid;
            } else {
                score = -10 * Math.abs(bid - tricksTaken);
            }
        }

        return new ScoreCalculation(bid, tricksTaken, roundNumber, score, bidMet);
    }

    // Getters
    public int getBid() {
        return bid;
    }

    public int getTricksTaken() {
        return tricksTaken;
    }

    public int getRoundNumber() {
        return roundNumber;
    }

    public int getScore() {
        return score;
    }

    public boolean isBidMet() {
        return bidMet;
    }

    @Override
    public String toString() {
        return "ScoreCalculation{" +
                "bid=" + bid +
                ", tricksTaken=" + tricksTaken +
                ", roundNumber=" + roundNumber +
                ", score=" + score +
                ", bidMet=" + bidMet +
                '}';
    }
}
