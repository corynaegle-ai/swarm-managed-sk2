"""Unit tests for scoreboard module."""

import pytest
from src.scoreboard import Scoreboard, GamePhase, PlayerScore


class TestScoreboard:
    """Test cases for Scoreboard class."""

    @pytest.fixture
    def scoreboard(self):
        """Provide a fresh scoreboard instance."""
        return Scoreboard()

    def test_add_player(self, scoreboard):
        """Test adding players to the scoreboard."""
        scoreboard.add_player("Alice")
        assert "Alice" in scoreboard.players
        assert scoreboard.players["Alice"].total_score == 0

    def test_add_duplicate_player_raises_error(self, scoreboard):
        """Test that adding duplicate player raises ValueError."""
        scoreboard.add_player("Alice")
        with pytest.raises(ValueError, match="already exists"):
            scoreboard.add_player("Alice")

    def test_record_round_score(self, scoreboard):
        """Test recording round scores."""
        scoreboard.add_player("Alice")
        scoreboard.record_round_score("Alice", 1, 100)
        
        player = scoreboard.players["Alice"]
        assert player.round_scores[1] == 100
        assert player.total_score == 100

    def test_record_multiple_rounds(self, scoreboard):
        """Test recording scores across multiple rounds."""
        scoreboard.add_player("Alice")
        scoreboard.record_round_score("Alice", 1, 100)
        scoreboard.record_round_score("Alice", 2, 150)
        scoreboard.record_round_score("Alice", 3, 75)
        
        player = scoreboard.players["Alice"]
        assert player.total_score == 325
        assert len(player.round_scores) == 3

    def test_record_score_nonexistent_player(self, scoreboard):
        """Test recording score for nonexistent player raises error."""
        with pytest.raises(ValueError, match="not found"):
            scoreboard.record_round_score("NonExistent", 1, 100)

    def test_get_standings_ascending_order(self, scoreboard):
        """Test standings are sorted in descending order by score."""
        players_data = [("Alice", 300), ("Bob", 500), ("Charlie", 200)]
        
        for name, score in players_data:
            scoreboard.add_player(name)
            scoreboard.record_round_score(name, 1, score)
        
        standings = scoreboard.get_standings()
        
        # Check order: Bob (500), Alice (300), Charlie (200)
        assert standings[0].name == "Bob"
        assert standings[1].name == "Alice"
        assert standings[2].name == "Charlie"
        
        # Check ranks
        assert standings[0].rank == 1
        assert standings[1].rank == 2
        assert standings[2].rank == 3

    def test_set_round_and_phase(self, scoreboard):
        """Test setting current round and game phase."""
        scoreboard.set_round(3, 5)
        assert scoreboard.current_round == 3
        assert scoreboard.total_rounds == 5
        assert scoreboard.current_phase == GamePhase.ROUND
        
        scoreboard.set_phase(GamePhase.SCORING)
        assert scoreboard.current_phase == GamePhase.SCORING

    def test_display_standings(self, scoreboard):
        """Test standings display format."""
        scoreboard.add_player("Alice")
        scoreboard.add_player("Bob")
        scoreboard.record_round_score("Alice", 1, 300)
        scoreboard.record_round_score("Bob", 1, 200)
        scoreboard.set_round(1, 5)
        
        display = scoreboard.display_standings()
        
        assert "CURRENT STANDINGS" in display
        assert "Alice" in display
        assert "Bob" in display
        assert "300" in display
        assert "200" in display
        assert "Round 1/5" in display

    def test_display_empty_scoreboard(self, scoreboard):
        """Test displaying empty scoreboard."""
        display = scoreboard.display_standings()
        assert "No players" in display

    def test_display_round_breakdown_all_players(self, scoreboard):
        """Test round breakdown display for all players."""
        scoreboard.add_player("Alice")
        scoreboard.add_player("Bob")
        scoreboard.record_round_score("Alice", 1, 100)
        scoreboard.record_round_score("Alice", 2, 150)
        scoreboard.record_round_score("Bob", 1, 120)
        scoreboard.record_round_score("Bob", 2, 130)
        
        display = scoreboard.display_round_breakdown()
        
        assert "ROUND-BY-ROUND BREAKDOWN" in display
        assert "Alice" in display
        assert "Bob" in display
        assert "100" in display
        assert "250" in display  # Alice's running total after round 2

    def test_display_round_breakdown_single_player(self, scoreboard):
        """Test round breakdown for specific player."""
        scoreboard.add_player("Alice")
        scoreboard.add_player("Bob")
        scoreboard.record_round_score("Alice", 1, 100)
        scoreboard.record_round_score("Alice", 2, 150)
        scoreboard.record_round_score("Bob", 1, 120)
        
        display = scoreboard.display_round_breakdown("Alice")
        
        assert "Alice" in display
        assert "Bob" not in display
        assert "250" in display  # Alice's total

    def test_display_round_breakdown_nonexistent_player(self, scoreboard):
        """Test breakdown for nonexistent player raises error."""
        with pytest.raises(ValueError, match="not found"):
            scoreboard.display_round_breakdown("NonExistent")

    def test_display_round_breakdown_no_rounds(self, scoreboard):
        """Test breakdown when no rounds have been played."""
        scoreboard.add_player("Alice")
        display = scoreboard.display_round_breakdown()
        assert "No rounds played" in display

    def test_game_status_display(self, scoreboard):
        """Test comprehensive game status display."""
        scoreboard.add_player("Alice")
        scoreboard.add_player("Bob")
        scoreboard.record_round_score("Alice", 1, 300)
        scoreboard.record_round_score("Bob", 1, 200)
        scoreboard.set_round(1, 3)
        
        display = scoreboard.display_game_status()
        
        assert "CURRENT STANDINGS" in display
        assert "ROUND-BY-ROUND BREAKDOWN" in display
        assert "Alice" in display
        assert "Bob" in display
        assert "Round 1/3" in display

    def test_multiple_rounds_standings(self, scoreboard):
        """Test standings after multiple rounds with changing order."""
        scoreboard.add_player("Alice")
        scoreboard.add_player("Bob")
        scoreboard.add_player("Charlie")
        
        # Round 1
        scoreboard.record_round_score("Alice", 1, 100)
        scoreboard.record_round_score("Bob", 1, 150)
        scoreboard.record_round_score("Charlie", 1, 120)
        
        # Round 2
        scoreboard.record_round_score("Alice", 2, 200)
        scoreboard.record_round_score("Bob", 2, 50)
        scoreboard.record_round_score("Charlie", 2, 180)
        
        standings = scoreboard.get_standings()
        
        # Alice: 300, Charlie: 300, Bob: 200
        # After sorting, need to check top player has highest score
        assert standings[0].total_score >= standings[1].total_score
        assert standings[1].total_score >= standings[2].total_score
