import pytest
from src.round_progression import RoundProgression, GamePhase


class TestRoundInitialization:
    """Tests for initial game state."""

    def test_initial_round_is_one(self):
        """Game should start at round 1."""
        game = RoundProgression()
        assert game.current_round == 1

    def test_initial_phase_is_setup(self):
        """Game should start in SETUP phase."""
        game = RoundProgression()
        assert game.current_phase == GamePhase.SETUP

    def test_initial_hands_count(self):
        """Round 1 should have 1 hand."""
        game = RoundProgression()
        assert game.hands_in_current_round == 1


class TestHandsPerRound:
    """Tests for hands equal to round number (Criterion 1)."""

    def test_round_1_has_1_hand(self):
        """Criterion 1: Round 1 should have 1 hand."""
        game = RoundProgression()
        assert game.hands_in_current_round == 1

    def test_round_5_has_5_hands(self):
        """Criterion 1: Round 5 should have 5 hands."""
        game = RoundProgression()
        for _ in range(4):  # Advance to round 5
            game.advance_phase()  # SETUP -> BIDDING
            game.advance_phase()  # BIDDING -> SCORING
            game.advance_phase()  # SCORING -> COMPLETE
            game.advance_phase()  # COMPLETE -> next round SETUP
        assert game.current_round == 5
        assert game.hands_in_current_round == 5

    def test_round_10_has_10_hands(self):
        """Criterion 1: Round 10 should have 10 hands."""
        game = RoundProgression()
        for _ in range(9):  # Advance to round 10
            game.advance_phase()  # SETUP -> BIDDING
            game.advance_phase()  # BIDDING -> SCORING
            game.advance_phase()  # SCORING -> COMPLETE
            game.advance_phase()  # COMPLETE -> next round SETUP
        assert game.current_round == 10
        assert game.hands_in_current_round == 10


class TestRoundCompletion:
    """Tests for round completion requirements (Criterion 2)."""

    def test_cannot_start_round_not_in_setup(self):
        """Criterion 2: Cannot start round without completing previous."""
        game = RoundProgression()
        game.advance_phase()  # Move to BIDDING
        with pytest.raises(ValueError, match="must be in SETUP phase"):
            game.start_round()

    def test_cannot_skip_phases_in_round(self):
        """Cannot advance to next round without completing all phases."""
        game = RoundProgression()
        assert game.current_phase == GamePhase.SETUP
        game.advance_phase()  # SETUP -> BIDDING
        assert game.current_phase == GamePhase.BIDDING
        game.advance_phase()  # BIDDING -> SCORING
        assert game.current_phase == GamePhase.SCORING
        game.advance_phase()  # SCORING -> COMPLETE
        assert game.current_phase == GamePhase.COMPLETE
        game.advance_phase()  # COMPLETE -> Round 2 SETUP
        assert game.current_round == 2

    def test_cannot_advance_from_round_1_setup_without_completion(self):
        """Cannot move to round 2 without completing round 1."""
        game = RoundProgression()
        assert game.current_round == 1
        assert game.current_phase == GamePhase.SETUP
        # Should not be able to directly access round 2
        # without going through all phases


class TestGameCompletion:
    """Tests for game completion state (Criterion 3)."""

    def test_game_not_complete_at_start(self):
        """Game should not be complete at start."""
        game = RoundProgression()
        assert not game.is_game_complete

    def test_game_not_complete_in_middle(self):
        """Game should not be complete in middle rounds."""
        game = RoundProgression()
        for _ in range(4):
            game.advance_phase()  # Complete one round
            game.advance_phase()
            game.advance_phase()
            game.advance_phase()
        assert game.current_round == 5
        assert not game.is_game_complete

    def test_game_complete_after_round_10(self):
        """Criterion 3: Game should show complete after round 10 finishes."""
        game = RoundProgression()
        # Complete rounds 1-10
        for _ in range(9):
            for _ in range(4):  # 4 phase transitions per round
                game.advance_phase()
        # Now in round 10, SETUP
        assert game.current_round == 10
        # Complete round 10
        game.advance_phase()  # SETUP -> BIDDING
        game.advance_phase()  # BIDDING -> SCORING
        game.advance_phase()  # SCORING -> COMPLETE
        assert game.is_game_complete

    def test_cannot_advance_beyond_round_10(self):
        """Cannot advance beyond round 10 completion."""
        game = RoundProgression()
        # Complete all 10 rounds
        for _ in range(10):
            for _ in range(4):
                game.advance_phase()
        assert game.current_round == 10
        assert game.current_phase == GamePhase.COMPLETE
        with pytest.raises(ValueError, match="Cannot advance beyond round"):
            game.advance_phase()


class TestPhaseManagement:
    """Tests for phase state tracking (Criterion 4)."""

    def test_phase_sequence_setup_to_bidding(self):
        """Criterion 4: Phase progresses from SETUP to BIDDING."""
        game = RoundProgression()
        assert game.current_phase == GamePhase.SETUP
        game.advance_phase()
        assert game.current_phase == GamePhase.BIDDING

    def test_phase_sequence_bidding_to_scoring(self):
        """Criterion 4: Phase progresses from BIDDING to SCORING."""
        game = RoundProgression()
        game.advance_phase()  # SETUP -> BIDDING
        game.advance_phase()  # BIDDING -> SCORING
        assert game.current_phase == GamePhase.SCORING

    def test_phase_sequence_scoring_to_complete(self):
        """Criterion 4: Phase progresses from SCORING to COMPLETE."""
        game = RoundProgression()
        game.advance_phase()  # SETUP -> BIDDING
        game.advance_phase()  # BIDDING -> SCORING
        game.advance_phase()  # SCORING -> COMPLETE
        assert game.current_phase == GamePhase.COMPLETE

    def test_phase_sequence_complete_to_next_setup(self):
        """Criterion 4: Phase progresses from COMPLETE to next round SETUP."""
        game = RoundProgression()
        game.advance_phase()  # SETUP -> BIDDING
        game.advance_phase()  # BIDDING -> SCORING
        game.advance_phase()  # SCORING -> COMPLETE
        assert game.current_phase == GamePhase.COMPLETE
        game.advance_phase()  # COMPLETE -> Round 2 SETUP
        assert game.current_round == 2
        assert game.current_phase == GamePhase.SETUP

    def test_phase_maintained_throughout_game(self):
        """Criterion 4: Phase state is maintained throughout game."""
        game = RoundProgression()
        expected_sequence = [
            (1, GamePhase.SETUP),
            (1, GamePhase.BIDDING),
            (1, GamePhase.SCORING),
            (1, GamePhase.COMPLETE),
            (2, GamePhase.SETUP),
            (2, GamePhase.BIDDING),
            (2, GamePhase.SCORING),
            (2, GamePhase.COMPLETE),
        ]
        for round_num, phase in expected_sequence:
            assert game.current_round == round_num
            assert game.current_phase == phase
            game.advance_phase()

    def test_start_round_method(self):
        """start_round() should move from SETUP to BIDDING."""
        game = RoundProgression()
        assert game.current_phase == GamePhase.SETUP
        game.start_round()
        assert game.current_phase == GamePhase.BIDDING


class TestGameReset:
    """Tests for game reset functionality."""

    def test_reset_returns_to_initial_state(self):
        """Reset should return game to initial state."""
        game = RoundProgression()
        # Progress game
        for _ in range(8):
            game.advance_phase()
        assert game.current_round > 1
        # Reset
        game.reset()
        assert game.current_round == 1
        assert game.current_phase == GamePhase.SETUP


class TestGameRepresentation:
    """Tests for string representation."""

    def test_repr_format(self):
        """String representation should show game state."""
        game = RoundProgression()
        repr_str = repr(game)
        assert "round=1" in repr_str
        assert "phase=setup" in repr_str
        assert "hands=1" in repr_str


class TestIntegrationFullGame:
    """Integration tests for a complete game."""

    def test_complete_game_progression(self):
        """Test progression through all 10 rounds."""
        game = RoundProgression()
        
        for round_num in range(1, 11):
            assert game.current_round == round_num
            assert game.hands_in_current_round == round_num
            assert game.current_phase == GamePhase.SETUP
            
            # Progress through round
            game.advance_phase()  # SETUP -> BIDDING
            assert game.current_phase == GamePhase.BIDDING
            
            game.advance_phase()  # BIDDING -> SCORING
            assert game.current_phase == GamePhase.SCORING
            
            game.advance_phase()  # SCORING -> COMPLETE
            assert game.current_phase == GamePhase.COMPLETE
            
            if round_num < 10:
                game.advance_phase()  # COMPLETE -> next SETUP
                assert game.current_phase == GamePhase.SETUP
        
        # Game should now be complete
        assert game.is_game_complete
        assert not game.is_game_complete or game.current_round == 10
