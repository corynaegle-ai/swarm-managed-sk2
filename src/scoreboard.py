"""Scoreboard display module for multiplayer game.

Provides functionality to display running totals for all players,
round-by-round scores, and current standings.
"""

from dataclasses import dataclass
from typing import List, Dict, Optional
from enum import Enum


class GamePhase(Enum):
    """Enumeration of game phases."""
    SETUP = "Setup"
    ROUND = "Round"
    SCORING = "Scoring"
    GAME_OVER = "Game Over"


@dataclass
class PlayerScore:
    """Represents a player's score information."""
    name: str
    total_score: int
    round_scores: Dict[int, int]  # round_number -> score
    rank: int = 0


class Scoreboard:
    """Display and manage game scoreboard."""

    def __init__(self):
        """Initialize the scoreboard."""
        self.players: Dict[str, PlayerScore] = {}
        self.current_round: int = 0
        self.current_phase: GamePhase = GamePhase.SETUP
        self.total_rounds: int = 0

    def add_player(self, player_name: str) -> None:
        """Add a player to the scoreboard.

        Args:
            player_name: Name of the player to add.

        Raises:
            ValueError: If player already exists.
        """
        if player_name in self.players:
            raise ValueError(f"Player '{player_name}' already exists")
        self.players[player_name] = PlayerScore(
            name=player_name,
            total_score=0,
            round_scores={}
        )

    def record_round_score(self, player_name: str, round_num: int, score: int) -> None:
        """Record a player's score for a round.

        Args:
            player_name: Name of the player.
            round_num: Round number.
            score: Score earned in the round.

        Raises:
            ValueError: If player doesn't exist.
        """
        if player_name not in self.players:
            raise ValueError(f"Player '{player_name}' not found")
        
        player = self.players[player_name]
        player.round_scores[round_num] = score
        player.total_score = sum(player.round_scores.values())

    def set_round(self, round_num: int, total_rounds: int) -> None:
        """Set current round information.

        Args:
            round_num: Current round number.
            total_rounds: Total rounds in the game.
        """
        self.current_round = round_num
        self.total_rounds = total_rounds
        self.current_phase = GamePhase.ROUND

    def set_phase(self, phase: GamePhase) -> None:
        """Set the current game phase.

        Args:
            phase: The current game phase.
        """
        self.current_phase = phase

    def get_standings(self) -> List[PlayerScore]:
        """Get player standings sorted by score (descending).

        Returns:
            List of PlayerScore objects sorted by total score descending.
        """
        standings = list(self.players.values())
        standings.sort(key=lambda p: p.total_score, reverse=True)
        
        # Update ranks
        for rank, player in enumerate(standings, 1):
            player.rank = rank
        
        return standings

    def display_standings(self) -> str:
        """Display current player standings.

        Returns:
            Formatted string with player rankings and scores.
        """
        if not self.players:
            return "No players in the game."
        
        standings = self.get_standings()
        lines = ["="*50]
        lines.append(f"CURRENT STANDINGS")
        lines.append(f"Round {self.current_round}/{self.total_rounds} | Phase: {self.current_phase.value}")
        lines.append("="*50)
        lines.append(f"{'Rank':<6}{'Player':<25}{'Score':<10}")
        lines.append("-"*50)
        
        for player in standings:
            lines.append(f"{player.rank:<6}{player.name:<25}{player.total_score:<10}")
        
        lines.append("="*50)
        return "\n".join(lines)

    def display_round_breakdown(self, player_name: Optional[str] = None) -> str:
        """Display round-by-round score breakdown.

        Args:
            player_name: Optional player name for single player breakdown.
                        If None, shows breakdown for all players.

        Returns:
            Formatted string with round-by-round scores.
        """
        if not self.players:
            return "No players in the game."
        
        if player_name:
            if player_name not in self.players:
                raise ValueError(f"Player '{player_name}' not found")
            players_to_display = [self.players[player_name]]
        else:
            players_to_display = self.get_standings()
        
        lines = ["="*70]
        lines.append("ROUND-BY-ROUND BREAKDOWN")
        lines.append("="*70)
        
        # Get all rounds that have been played
        all_rounds = set()
        for player in self.players.values():
            all_rounds.update(player.round_scores.keys())
        
        if not all_rounds:
            return "No rounds played yet."
        
        sorted_rounds = sorted(all_rounds)
        
        for player in players_to_display:
            lines.append(f"\n{player.name} (Total: {player.total_score})")
            lines.append("-"*70)
            lines.append(f"{'Round':<10}{'Score':<10}{'Running Total':<15}")
            lines.append("-"*70)
            
            running_total = 0
            for round_num in sorted_rounds:
                score = player.round_scores.get(round_num, 0)
                running_total += score
                lines.append(f"{round_num:<10}{score:<10}{running_total:<15}")
        
        lines.append("="*70)
        return "\n".join(lines)

    def display_game_status(self) -> str:
        """Display comprehensive game status including standings and phase info.

        Returns:
            Formatted string with complete game status.
        """
        status_lines = []
        status_lines.append("\n" + self.display_standings())
        status_lines.append("\n")
        status_lines.append(self.display_round_breakdown())
        return "\n".join(status_lines)
