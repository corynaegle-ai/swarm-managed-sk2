# Scoreboard Display System

## Overview

A comprehensive scoreboard display system for multiplayer games that shows running totals for all players, round-by-round scores, and current standings.

## Features

- **Player Management**: Add and manage players in the game
- **Score Tracking**: Record round-by-round scores for each player
- **Standings Display**: View players ranked by total score (highest first)
- **Round Breakdown**: View detailed round-by-round score progression
- **Game Phase Tracking**: Track current round and game phase
- **Multiple Display Formats**: Different views for standings and detailed breakdowns

## Usage

### Basic Example

```python
from src.scoreboard import Scoreboard, GamePhase

# Create scoreboard
scoreboard = Scoreboard()

# Add players
scoreboard.add_player("Alice")
scoreboard.add_player("Bob")
scoreboard.add_player("Charlie")

# Set game info
scoreboard.set_round(1, 3)  # Round 1 of 3

# Record scores
scoreboard.record_round_score("Alice", 1, 100)
scoreboard.record_round_score("Bob", 1, 150)
scoreboard.record_round_score("Charlie", 1, 120)

# Display standings
print(scoreboard.display_standings())

# Display round breakdown
print(scoreboard.display_round_breakdown())

# Display for specific player
print(scoreboard.display_round_breakdown("Alice"))

# Update round
scoreboard.set_round(2, 3)
scoreboard.set_phase(GamePhase.SCORING)

# Record round 2 scores
scoreboard.record_round_score("Alice", 2, 200)
scoreboard.record_round_score("Bob", 2, 50)
scoreboard.record_round_score("Charlie", 2, 180)

# View full game status
print(scoreboard.display_game_status())
```

## API Reference

### Scoreboard Class

#### Methods

- `add_player(player_name: str) -> None`
  - Add a player to the scoreboard
  - Raises ValueError if player already exists

- `record_round_score(player_name: str, round_num: int, score: int) -> None`
  - Record a score for a player in a specific round
  - Raises ValueError if player doesn't exist

- `set_round(round_num: int, total_rounds: int) -> None`
  - Set the current round and total number of rounds

- `set_phase(phase: GamePhase) -> None`
  - Set the current game phase

- `get_standings() -> List[PlayerScore]`
  - Get all players sorted by score (highest first)
  - Updates rank for each player

- `display_standings() -> str`
  - Display current player standings in formatted string

- `display_round_breakdown(player_name: Optional[str] = None) -> str`
  - Display round-by-round score breakdown
  - If player_name is None, shows all players
  - If player_name is provided, shows only that player

- `display_game_status() -> str`
  - Display comprehensive game status with standings and breakdown

### GamePhase Enum

- `SETUP`: Game setup phase
- `ROUND`: Active round
- `SCORING`: Round scoring phase
- `GAME_OVER`: Game completed

### PlayerScore Dataclass

- `name`: Player name
- `total_score`: Total score across all rounds
- `round_scores`: Dictionary mapping round number to score
- `rank`: Player's current rank (1 = highest)

## Testing

Run tests with pytest:

```bash
pytest tests/test_scoreboard.py -v
```

Test coverage includes:
- Player addition and duplicate prevention
- Score recording across multiple rounds
- Standings sorted in descending order
- Round breakdown display
- Error handling for invalid players
- Game phase and round tracking
- Display formatting
