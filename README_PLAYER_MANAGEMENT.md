# Player Management Feature

## Overview
This feature allows a scorekeeper to manage players before a game starts. Players are stored in GameState with unique IDs and names.

## Components

### Player Model (`src/models/player.ts`)
Represents an individual player with:
- **Unique ID**: Auto-assigned, immutable, and sequential
- **Name**: String value, trimmed on creation
- **Score**: Numeric value, initially 0

### GameState Model (`src/models/gameState.ts`)
Manages the overall game state with:
- **Player List**: Stores players in order added
- **Game Phase**: Tracks setup/playing/finished states
- **Player Limits**: Enforces 2-8 player constraint
- **Validation**: Ensures valid player names and prevents modifications during play

### PlayerManager Service (`src/services/playerManager.ts`)
Facade service providing convenience methods for player operations:
- Adding players
- Retrieving players
- Checking game readiness
- Querying player counts and limits

## Usage

### Adding Players
```typescript
const gameState = new GameState();
const player1 = gameState.addPlayer('Alice');
const player2 = gameState.addPlayer('Bob');
```

### Using PlayerManager
```typescript
const gameState = new GameState();
const playerManager = new PlayerManager(gameState);

// Add players
playerManager.addPlayer('Alice');
playerManager.addPlayer('Bob');

// Check if more can be added
if (playerManager.canAddPlayer()) {
  playerManager.addPlayer('Charlie');
}

// Get player information
const players = playerManager.getPlayers(); // Sorted by ID
const count = playerManager.getPlayerCount();
const remaining = playerManager.getRemainingSlots();

// Check if game can start
if (playerManager.canStartGame()) {
  gameState.startGame();
}
```

## Acceptance Criteria

### 1. Can add players one at a time with names
✅ **SATISFIED** - The `addPlayer(name: string)` method in GameState allows adding individual players with names. The PlayerManager service provides convenient access to this functionality.

### 2. Enforces 2-8 player limit
✅ **SATISFIED** - GameState enforces a minimum of 2 players (required at startGame) and maximum of 8 players (rejected at addPlayer). The `canAddMorePlayers()` and `getRemainingPlayerSlots()` methods help track available slots.

### 3. Cannot modify players after game starts
✅ **SATISFIED** - The `validateGameNotStarted()` private method in GameState checks the game phase before allowing player additions. Once `startGame()` is called, attempting to add players throws an error: "Cannot add players after the game has started".

### 4. Players display in consistent order throughout game
✅ **SATISFIED** - The `getPlayers()` method returns players sorted by their unique ID. This ensures consistent ordering before, during, and after game play. Sorting by ID ensures a deterministic order independent of addition sequence.

## Error Handling

- **Empty/Invalid Names**: "Player name must be a non-empty string"
- **Whitespace Only Names**: "Player name cannot be empty or whitespace only"
- **Name Too Long**: "Player name must be 50 characters or less"
- **Game Already Started**: "Cannot add players after the game has started"
- **Max Players Reached**: "Maximum 8 players allowed"
- **Insufficient Players**: "At least 2 players are required to start the game"

## Testing

Comprehensive test suites are provided:
- `tests/models/gameState.test.ts` - GameState functionality
- `tests/models/player.test.ts` - Player model validation
- `tests/services/playerManager.test.ts` - PlayerManager service

Run tests with:
```bash
npm test
```
