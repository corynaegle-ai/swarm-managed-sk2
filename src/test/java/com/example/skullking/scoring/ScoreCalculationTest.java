package com.example.skullking.scoring;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for the ScoreCalculation class.
 * Tests verify all Skull King scoring rules are correctly implemented.
 */
public class ScoreCalculationTest {

    /**
     * Test criterion 1: Bid 3 take 3 = +60 points (20×3)
     */
    @Test
    public void testBid3Take3Equals60Points() {
        ScoreCalculation result = ScoreCalculation.calculate(3, 3, 1);
        assertEquals(60, result.getScore(), "Bid 3 take 3 should equal +60 points");
        assertTrue(result.isBidMet(), "Bid should be marked as met");
    }

    /**
     * Test criterion 2: Bid 2 take 4 = -20 points (-10×2 difference)
     */
    @Test
    public void testBid2Take4Equals20PointsPenalty() {
        ScoreCalculation result = ScoreCalculation.calculate(2, 4, 1);
        assertEquals(-20, result.getScore(), "Bid 2 take 4 should equal -20 points");
        assertFalse(result.isBidMet(), "Bid should not be marked as met");
    }

    /**
     * Test criterion 3: Bid 0 take 0 in round 7 = +70 points (10×7)
     */
    @Test
    public void testBid0Take0Round7Equals70Points() {
        ScoreCalculation result = ScoreCalculation.calculate(0, 0, 7);
        assertEquals(70, result.getScore(), "Bid 0 take 0 in round 7 should equal +70 points");
        assertTrue(result.isBidMet(), "Bid should be marked as met");
    }

    /**
     * Test criterion 4: Bid 0 take 2 in round 9 = -90 points (-10×9)
     */
    @Test
    public void testBid0Take2Round9Equals90PointsPenalty() {
        ScoreCalculation result = ScoreCalculation.calculate(0, 2, 9);
        assertEquals(-90, result.getScore(), "Bid 0 take 2 in round 9 should equal -90 points");
        assertFalse(result.isBidMet(), "Bid should not be marked as met");
    }

    /**
     * Test criterion 5: Correctly identifies when bid was met for bonus eligibility
     */
    @Test
    public void testBidMetIdentification() {
        // Test bid 1+ exact match
        ScoreCalculation exactBid1 = ScoreCalculation.calculate(2, 2, 1);
        assertTrue(exactBid1.isBidMet(), "Bid 2 take 2 should be marked as met");

        // Test bid 1+ miss
        ScoreCalculation missBid1 = ScoreCalculation.calculate(3, 1, 1);
        assertFalse(missBid1.isBidMet(), "Bid 3 take 1 should not be marked as met");

        // Test bid 0 exact (zero tricks)
        ScoreCalculation exactBid0 = ScoreCalculation.calculate(0, 0, 5);
        assertTrue(exactBid0.isBidMet(), "Bid 0 take 0 should be marked as met");

        // Test bid 0 miss (took tricks)
        ScoreCalculation missBid0 = ScoreCalculation.calculate(0, 1, 5);
        assertFalse(missBid0.isBidMet(), "Bid 0 take 1 should not be marked as met");
    }

    // Additional comprehensive tests

    /**
     * Test various bid 1+ exact scenarios
     */
    @Test
    public void testBid1Plus_ExactMatch() {
        assertEquals(20, ScoreCalculation.calculate(1, 1, 1).getScore());
        assertEquals(40, ScoreCalculation.calculate(2, 2, 5).getScore());
        assertEquals(100, ScoreCalculation.calculate(5, 5, 10).getScore());
    }

    /**
     * Test various bid 1+ off scenarios
     */
    @Test
    public void testBid1Plus_OffBid() {
        assertEquals(-10, ScoreCalculation.calculate(1, 0, 1).getScore());
        assertEquals(-10, ScoreCalculation.calculate(1, 2, 1).getScore());
        assertEquals(-30, ScoreCalculation.calculate(3, 0, 1).getScore());
        assertEquals(-50, ScoreCalculation.calculate(4, 6, 1).getScore());
    }

    /**
     * Test bid 0 with zero tricks (success)
     */
    @Test
    public void testBid0_ZeroTricks() {
        assertEquals(10, ScoreCalculation.calculate(0, 0, 1).getScore());
        assertEquals(50, ScoreCalculation.calculate(0, 0, 5).getScore());
        assertEquals(100, ScoreCalculation.calculate(0, 0, 10).getScore());
    }

    /**
     * Test bid 0 with tricks taken (failure)
     */
    @Test
    public void testBid0_TricksTaken() {
        assertEquals(-10, ScoreCalculation.calculate(0, 1, 1).getScore());
        assertEquals(-50, ScoreCalculation.calculate(0, 3, 5).getScore());
        assertEquals(-100, ScoreCalculation.calculate(0, 7, 10).getScore());
    }

    /**
     * Test that all fields are correctly stored
     */
    @Test
    public void testScoreCalculationFields() {
        ScoreCalculation result = ScoreCalculation.calculate(3, 2, 5);
        assertEquals(3, result.getBid());
        assertEquals(2, result.getTricksTaken());
        assertEquals(5, result.getRoundNumber());
        assertEquals(-10, result.getScore());
        assertFalse(result.isBidMet());
    }
}
