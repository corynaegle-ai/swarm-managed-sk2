from enum import Enum
from typing import Optional


class GamePhase(Enum):
    """Represents the current phase of the game."""
    SETUP = "setup"
    BIDDING = "bidding"
    SCORING = "scoring"
    COMPLETE = "complete"


class RoundProgression:
    """
    Manages game progression through 10 rounds.
    Each round number determines the number of hands to be played.
    Tracks game phase and ensures proper round completion before advancing.
    """

    MIN_ROUND = 1
    MAX_ROUND = 10
    HANDS_PER_ROUND_MULTIPLIER = 1  # hands = round number

    def __init__(self):
        """Initialize game state at round 1 with setup phase."""
        self._current_round = self.MIN_ROUND
        self._current_phase = GamePhase.SETUP

    @property
    def current_round(self) -> int:
        """Get the current round number (1-10)."""
        return self._current_round

    @property
    def current_phase(self) -> GamePhase:
        """Get the current game phase."""
        return self._current_phase

    @property
    def hands_in_current_round(self) -> int:
        """Get the number of hands to be played in current round."""
        return self._current_round * self.HANDS_PER_ROUND_MULTIPLIER

    @property
    def is_game_complete(self) -> bool:
        """Check if game has been completed (round 10 finished)."""
        return (
            self._current_round == self.MAX_ROUND
            and self._current_phase == GamePhase.COMPLETE
        )

    def advance_phase(self) -> None:
        """
        Advance to the next phase in the round sequence.
        Sequence: SETUP -> BIDDING -> SCORING -> COMPLETE
        If in COMPLETE, advance to next round (if available).
        
        Raises:
            ValueError: If attempting to advance beyond round 10.
        """
        if self._current_phase == GamePhase.SETUP:
            self._current_phase = GamePhase.BIDDING
        elif self._current_phase == GamePhase.BIDDING:
            self._current_phase = GamePhase.SCORING
        elif self._current_phase == GamePhase.SCORING:
            self._current_phase = GamePhase.COMPLETE
        elif self._current_phase == GamePhase.COMPLETE:
            if self._current_round < self.MAX_ROUND:
                self._current_round += 1
                self._current_phase = GamePhase.SETUP
            else:
                raise ValueError(
                    f"Cannot advance beyond round {self.MAX_ROUND}. "
                    "Game is complete."
                )

    def start_round(self) -> None:
        """
        Start a new round (move from SETUP to BIDDING phase).
        This is equivalent to completing setup phase.
        
        Raises:
            ValueError: If current phase is not SETUP.
        """
        if self._current_phase != GamePhase.SETUP:
            raise ValueError(
                f"Cannot start round {self._current_round}. "
                f"Current phase is {self._current_phase.value}, "
                "but must be in SETUP phase to start."
            )
        self.advance_phase()

    def reset(self) -> None:
        """Reset game to initial state (round 1, setup phase)."""
        self._current_round = self.MIN_ROUND
        self._current_phase = GamePhase.SETUP

    def __repr__(self) -> str:
        """Return string representation of current game state."""
        return (
            f"RoundProgression(round={self._current_round}, "
            f"phase={self._current_phase.value}, "
            f"hands={self.hands_in_current_round})"
        )
