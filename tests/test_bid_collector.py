"""Tests for the bid collector module."""

import pytest
from src.bid_collector import BidCollector


class TestBidCollectorInitialization:
    """Test bid collector initialization."""

    def test_initialization(self):
        """Test creating a bid collector."""
        collector = BidCollector(4)
        assert collector.num_players == 4
        assert collector.current_round == 0
        assert len(collector.bids) == 0


class TestRoundStart:
    """Test round start functionality."""

    def test_start_round_displays_info(self):
        """Test that starting a round displays round and hand information."""
        collector = BidCollector(4)
        result = collector.start_round(1)
        
        assert "Round 1" in result
        assert "Hands available: 1" in result

    def test_start_round_sets_current_round(self):
        """Test that starting a round updates current_round."""
        collector = BidCollector(4)
        collector.start_round(3)
        
        assert collector.current_round == 3

    def test_start_round_resets_bids(self):
        """Test that starting a new round clears previous bids."""
        collector = BidCollector(2)
        collector.start_round(1)
        collector.collect_bid(0, 1)
        
        assert len(collector.bids) == 1
        
        collector.start_round(2)
        
        assert len(collector.bids) == 0

    def test_start_round_invalid_round_number(self):
        """Test that invalid round numbers raise an error."""
        collector = BidCollector(4)
        
        with pytest.raises(ValueError, match="Round number must be at least 1"):
            collector.start_round(0)
        
        with pytest.raises(ValueError, match="Round number must be at least 1"):
            collector.start_round(-1)


class TestBidCollection:
    """Test bid collection functionality."""

    def test_collect_bid_valid(self):
        """Test collecting a valid bid."""
        collector = BidCollector(4)
        collector.start_round(3)
        
        collector.collect_bid(0, 2)
        
        assert collector.bids[0] == 2

    def test_collect_bid_zero_is_valid(self):
        """Test that zero bids are allowed."""
        collector = BidCollector(4)
        collector.start_round(3)
        
        collector.collect_bid(0, 0)
        
        assert collector.bids[0] == 0

    def test_collect_bid_exceeds_round_limit(self):
        """Test that bids cannot exceed the round number."""
        collector = BidCollector(4)
        collector.start_round(2)
        
        with pytest.raises(ValueError, match="Bid 3 exceeds maximum for round 2"):
            collector.collect_bid(0, 3)

    def test_collect_bid_negative(self):
        """Test that negative bids are rejected."""
        collector = BidCollector(4)
        collector.start_round(2)
        
        with pytest.raises(ValueError, match="Bid cannot be negative"):
            collector.collect_bid(0, -1)

    def test_collect_bid_before_round_start(self):
        """Test that bids cannot be collected before starting a round."""
        collector = BidCollector(4)
        
        with pytest.raises(RuntimeError, match="No round has been started yet"):
            collector.collect_bid(0, 1)

    def test_collect_bid_invalid_player_id(self):
        """Test that invalid player IDs are rejected."""
        collector = BidCollector(4)
        collector.start_round(2)
        
        with pytest.raises(ValueError, match="Invalid player_id"):
            collector.collect_bid(-1, 1)
        
        with pytest.raises(ValueError, match="Invalid player_id"):
            collector.collect_bid(4, 1)

    def test_collect_bids_from_multiple_players(self):
        """Test collecting bids from multiple players."""
        collector = BidCollector(4)
        collector.start_round(2)
        
        collector.collect_bid(0, 1)
        collector.collect_bid(1, 2)
        collector.collect_bid(2, 0)
        
        assert collector.bids == {0: 1, 1: 2, 2: 0}

    def test_collect_bid_overwrite_previous_bid(self):
        """Test that a player's bid can be overwritten."""
        collector = BidCollector(4)
        collector.start_round(3)
        
        collector.collect_bid(0, 1)
        assert collector.bids[0] == 1
        
        collector.collect_bid(0, 2)
        assert collector.bids[0] == 2


class TestBidValidation:
    """Test bid validation and completion checks."""

    def test_all_bids_collected_false(self):
        """Test all_bids_collected when not all players have bid."""
        collector = BidCollector(4)
        collector.start_round(1)
        collector.collect_bid(0, 1)
        
        assert not collector.all_bids_collected()

    def test_all_bids_collected_true(self):
        """Test all_bids_collected when all players have bid."""
        collector = BidCollector(2)
        collector.start_round(2)
        collector.collect_bid(0, 1)
        collector.collect_bid(1, 2)
        
        assert collector.all_bids_collected()

    def test_get_bids_success(self):
        """Test getting bids when all players have bid."""
        collector = BidCollector(2)
        collector.start_round(2)
        collector.collect_bid(0, 1)
        collector.collect_bid(1, 2)
        
        bids = collector.get_bids()
        
        assert bids == {0: 1, 1: 2}

    def test_get_bids_before_all_collected(self):
        """Test that get_bids raises error when not all bids collected."""
        collector = BidCollector(4)
        collector.start_round(2)
        collector.collect_bid(0, 1)
        
        with pytest.raises(RuntimeError, match="Not all players have bid yet"):
            collector.get_bids()

    def test_get_missing_players(self):
        """Test getting list of players who haven't bid."""
        collector = BidCollector(4)
        collector.start_round(2)
        collector.collect_bid(0, 1)
        collector.collect_bid(2, 0)
        
        missing = collector.get_missing_players()
        
        assert missing == [1, 3]

    def test_get_missing_players_none(self):
        """Test get_missing_players when all have bid."""
        collector = BidCollector(2)
        collector.start_round(2)
        collector.collect_bid(0, 1)
        collector.collect_bid(1, 2)
        
        missing = collector.get_missing_players()
        
        assert missing == []


class TestProceedToScoring:
    """Test proceeding to scoring."""

    def test_proceed_to_scoring_success(self):
        """Test proceeding to scoring when all bids collected."""
        collector = BidCollector(2)
        collector.start_round(2)
        collector.collect_bid(0, 1)
        collector.collect_bid(1, 2)
        
        bids = collector.proceed_to_scoring()
        
        assert bids == {0: 1, 1: 2}

    def test_proceed_to_scoring_missing_bids(self):
        """Test that proceeding to scoring fails without all bids."""
        collector = BidCollector(4)
        collector.start_round(2)
        collector.collect_bid(0, 1)
        collector.collect_bid(1, 1)
        
        with pytest.raises(RuntimeError, match="Cannot proceed to scoring"):
            collector.proceed_to_scoring()

    def test_proceed_to_scoring_error_lists_missing_players(self):
        """Test that scoring error includes missing player list."""
        collector = BidCollector(4)
        collector.start_round(2)
        collector.collect_bid(0, 1)
        
        with pytest.raises(RuntimeError) as exc_info:
            collector.proceed_to_scoring()
        
        assert "[1, 2, 3]" in str(exc_info.value)


class TestMultipleRounds:
    """Test behavior across multiple rounds."""

    def test_round_progression(self):
        """Test progressing through multiple rounds."""
        collector = BidCollector(2)
        
        # Round 1
        info1 = collector.start_round(1)
        assert "Round 1" in info1
        assert "Hands available: 1" in info1
        collector.collect_bid(0, 0)
        collector.collect_bid(1, 1)
        bids1 = collector.proceed_to_scoring()
        assert bids1 == {0: 0, 1: 1}
        
        # Round 2
        info2 = collector.start_round(2)
        assert "Round 2" in info2
        assert "Hands available: 2" in info2
        collector.collect_bid(0, 1)
        collector.collect_bid(1, 2)
        bids2 = collector.proceed_to_scoring()
        assert bids2 == {0: 1, 1: 2}

    def test_bid_limits_increase_with_rounds(self):
        """Test that max bid limit increases with round number."""
        collector = BidCollector(2)
        
        # Round 1: max bid is 1
        collector.start_round(1)
        with pytest.raises(ValueError):
            collector.collect_bid(0, 2)
        
        # Round 5: max bid is 5
        collector.start_round(5)
        collector.collect_bid(0, 5)  # Should not raise
        assert collector.bids[0] == 5
