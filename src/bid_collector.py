"""Bid collection module for card game rounds."""

from typing import List, Dict


class BidCollector:
    """Manages bid collection from all players in a round."""

    def __init__(self, num_players: int):
        """Initialize bid collector.
        
        Args:
            num_players: Total number of players in the game.
        """
        self.num_players = num_players
        self.bids: Dict[int, int] = {}  # player_id -> bid amount
        self.current_round = 0

    def start_round(self, round_number: int) -> str:
        """Start a new round and display round information.
        
        Args:
            round_number: The current round number (1-indexed).
            
        Returns:
            A formatted string showing round information.
        """
        if round_number < 1:
            raise ValueError("Round number must be at least 1")
        
        self.current_round = round_number
        self.bids = {}  # Reset bids for new round
        
        return f"\n--- Round {round_number} ---\nHands available: {round_number}"

    def collect_bid(self, player_id: int, bid: int) -> None:
        """Collect a bid from a player.
        
        Args:
            player_id: The player's ID.
            bid: The bid amount.
            
        Raises:
            ValueError: If bid exceeds round number or is negative.
            RuntimeError: If no round has been started.
        """
        if self.current_round == 0:
            raise RuntimeError("No round has been started yet")
        
        if bid < 0:
            raise ValueError(f"Bid cannot be negative, got {bid}")
        
        if bid > self.current_round:
            raise ValueError(
                f"Bid {bid} exceeds maximum for round {self.current_round} "
                f"(max: {self.current_round})"
            )
        
        if player_id < 0 or player_id >= self.num_players:
            raise ValueError(
                f"Invalid player_id {player_id}. Must be between 0 and {self.num_players - 1}"
            )
        
        self.bids[player_id] = bid

    def all_bids_collected(self) -> bool:
        """Check if all players have submitted bids.
        
        Returns:
            True if all players have bid, False otherwise.
        """
        return len(self.bids) == self.num_players

    def get_bids(self) -> Dict[int, int]:
        """Get all collected bids.
        
        Returns:
            Dictionary mapping player_id to bid amount.
            
        Raises:
            RuntimeError: If not all players have bid yet.
        """
        if not self.all_bids_collected():
            raise RuntimeError(
                f"Not all players have bid yet. "
                f"Collected: {len(self.bids)}/{self.num_players}"
            )
        
        return self.bids.copy()

    def get_missing_players(self) -> List[int]:
        """Get list of players who haven't bid yet.
        
        Returns:
            List of player IDs that haven't submitted a bid.
        """
        return [i for i in range(self.num_players) if i not in self.bids]

    def proceed_to_scoring(self) -> Dict[int, int]:
        """Validate all bids collected and proceed to scoring.
        
        Returns:
            Dictionary of collected bids.
            
        Raises:
            RuntimeError: If not all players have bid yet.
        """
        if not self.all_bids_collected():
            missing = self.get_missing_players()
            raise RuntimeError(
                f"Cannot proceed to scoring. Missing bids from players: {missing}"
            )
        
        return self.get_bids()
