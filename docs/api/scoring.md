# Automatic Scoring System API

## Overview

The automatic scoring system provides comprehensive APIs for calculating and managing scores in Skull King card games. This system handles all scoring logic, validation, and persistence for game rounds.

## Table of Contents

1. [Scoring Rules](#scoring-rules)
2. [API Endpoints](#api-endpoints)
3. [Data Models](#data-models)
4. [Error Handling](#error-handling)
5. [Integration Examples](#integration-examples)

## Scoring Rules

### Skull King Scoring Overview

Skull King uses a unique scoring system based on bid accuracy and trick-taking mechanics:

### Basic Scoring Rules

1. **Exact Bid Match**: If a player bids exactly the number of tricks they take, they score:
   - `20 × (bid amount) + 10 × (round number)`
   - Example: Round 3, bid 2, took 2 tricks = `20 × 2 + 10 × 3 = 70 points`

2. **Bid Miss (Over/Under)**: If a player takes more or fewer tricks than bid:
   - `-10 × |bid - actual tricks|`
   - Example: Bid 3, took 1 = `-10 × |3 - 1| = -20 points`

3. **Zero Bid Bonus**: Successfully bidding and taking 0 tricks:
   - `10 × round number`
   - Example: Round 5, bid 0, took 0 = `10 × 5 = 50 points`

### Special Card Bonuses

- **Skull King captures Pirates**: +30 points per pirate captured
- **Skull King captures Mermaids**: +20 points per mermaid captured  
- **Pirates capture Number cards**: +10 points per number card captured
- **Kraken bonus**: +50 points when played (if wins the trick)

### Card Hierarchy (Highest to Lowest)

1. **Kraken** (always wins unless another Kraken played)
2. **Skull King** (beats everything except Kraken and Mermaids)
3. **Pirates** (beat number cards, lose to Skull King)
4. **Mermaids** (beat Skull King, lose to Pirates)
5. **Trump suit cards** (beat non-trump, ranked Ace high to 1 low)
6. **Non-trump suit cards** (must follow suit, ranked Ace high to 1 low)

## API Endpoints

### Calculate Round Score

Calculate the score for a single round based on bids and tricks taken.

**Endpoint**: `POST /api/scoring/calculate-round`

**Request Body**:
```json
{
  "roundNumber": 3,
  "players": [
    {
      "playerId": "player1",
      "bid": 2,
      "tricksTaken": 2,
      "specialCards": [
        {
          "card": "skull_king",
          "capturedCards": ["pirate1", "mermaid1"]
        }
      ]
    },
    {
      "playerId": "player2", 
      "bid": 1,
      "tricksTaken": 0,
      "specialCards": []
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "roundScores": [
    {
      "playerId": "player1",
      "baseScore": 70,
      "bonusScore": 50,
      "totalScore": 120,
      "breakdown": {
        "bidBonus": 70,
        "pirateCapture": 30,
        "mermaidCapture": 20
      }
    },
    {
      "playerId": "player2",
      "baseScore": -10,
      "bonusScore": 0, 
      "totalScore": -10,
      "breakdown": {
        "bidPenalty": -10
      }
    }
  ]
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/scoring/calculate-round \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "roundNumber": 3,
    "players": [
      {
        "playerId": "player1",
        "bid": 2,
        "tricksTaken": 2,
        "specialCards": []
      }
    ]
  }'
```

### Get Game Scores

Retrieve current scores for all players in a game.

**Endpoint**: `GET /api/scoring/game/{gameId}`

**Response**:
```json
{
  "success": true,
  "gameId": "game123",
  "currentRound": 3,
  "totalRounds": 10,
  "playerScores": [
    {
      "playerId": "player1",
      "totalScore": 145,
      "roundScores": [25, 50, 70],
      "position": 1
    },
    {
      "playerId": "player2", 
      "totalScore": 30,
      "roundScores": [20, 20, -10],
      "position": 2
    }
  ]
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:3000/api/scoring/game/game123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Validate Bids

Validate that bids for a round are legal according to game rules.

**Endpoint**: `POST /api/scoring/validate-bids`

**Request Body**:
```json
{
  "roundNumber": 3,
  "totalTricks": 3,
  "bids": [
    {"playerId": "player1", "bid": 2},
    {"playerId": "player2", "bid": 1}, 
    {"playerId": "player3", "bid": 1}
  ],
  "dealerPosition": 0
}
```

**Response**:
```json
{
  "success": true,
  "valid": false,
  "errors": [
    {
      "type": "DEALER_RESTRICTION",
      "message": "Dealer cannot bid to make total equal number of tricks available",
      "playerId": "player1"
    }
  ],
  "totalBid": 4,
  "availableTricks": 3
}
```

### Update Player Score

Manually update or correct a player's score.

**Endpoint**: `PUT /api/scoring/player/{playerId}`

**Request Body**:
```json
{
  "gameId": "game123",
  "scoreAdjustment": -20,
  "reason": "Penalty for slow play",
  "roundNumber": 3
}
```

**Response**:
```json
{
  "success": true,
  "playerId": "player1",
  "newTotalScore": 125,
  "adjustment": -20,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Data Models

### Player Score
```typescript
interface PlayerScore {
  playerId: string;
  totalScore: number;
  roundScores: number[];
  position: number;
  adjustments?: ScoreAdjustment[];
}
```

### Score Breakdown
```typescript
interface ScoreBreakdown {
  bidBonus?: number;
  bidPenalty?: number;
  pirateCapture?: number;
  mermaidCapture?: number;
  krakenBonus?: number;
  zeroBidBonus?: number;
}
```

### Special Card
```typescript
interface SpecialCard {
  card: 'skull_king' | 'pirate' | 'mermaid' | 'kraken';
  capturedCards?: string[];
  wonTrick?: boolean;
}
```

### Score Adjustment
```typescript
interface ScoreAdjustment {
  amount: number;
  reason: string;
  timestamp: string;
  roundNumber?: number;
}
```

## Error Handling

### Common Error Codes

| Code | Description | Example |
|------|-------------|---------|
| `INVALID_BID` | Bid is outside valid range | Bid of -1 or > round number |
| `INVALID_TRICKS` | Tricks taken exceeds possible | 5 tricks in 3-card round |
| `DEALER_RESTRICTION` | Dealer bid makes total = available tricks | Total bids equal round number |
| `GAME_NOT_FOUND` | Game ID doesn't exist | Non-existent game ID |
| `PLAYER_NOT_FOUND` | Player not in game | Invalid player ID |
| `ROUND_COMPLETE` | Round already scored | Attempting to re-score |

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "INVALID_BID",
    "message": "Bid must be between 0 and round number",
    "details": {
      "bid": 5,
      "maxAllowed": 3,
      "playerId": "player1"
    }
  }
}
```

### Edge Cases

1. **Tied Scores**: Players with identical scores share position
2. **Negative Scores**: Allowed and properly handled
3. **Maximum Score Limits**: No artificial limits imposed
4. **Simultaneous Requests**: Race conditions handled with database locks
5. **Invalid Special Card Combinations**: Validated before scoring

## Integration Examples

### Basic Game Flow Integration

```javascript
// 1. Start new game and initialize scoring
const gameResponse = await fetch('/api/games', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    playerIds: ['player1', 'player2', 'player3'],
    gameType: 'skull_king'
  })
});

const game = await gameResponse.json();

// 2. Validate bids before accepting them
const validateBids = async (bids, roundNumber, dealerPosition) => {
  const response = await fetch('/api/scoring/validate-bids', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roundNumber,
      totalTricks: roundNumber,
      bids,
      dealerPosition
    })
  });
  
  const result = await response.json();
  if (!result.valid) {
    throw new Error(`Invalid bids: ${result.errors[0].message}`);
  }
  return result;
};

// 3. Calculate scores after round completion
const calculateRoundScore = async (roundData) => {
  const response = await fetch('/api/scoring/calculate-round', {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roundData)
  });
  
  const scores = await response.json();
  if (!scores.success) {
    throw new Error(`Scoring failed: ${scores.error.message}`);
  }
  
  return scores.roundScores;
};

// 4. Get updated game state
const getGameScores = async (gameId) => {
  const response = await fetch(`/api/scoring/game/${gameId}`);
  const gameState = await response.json();
  return gameState.playerScores;
};
```

### Advanced Scoring with Special Cards

```javascript
const roundWithSpecialCards = {
  roundNumber: 5,
  players: [
    {
      playerId: 'player1',
      bid: 3,
      tricksTaken: 3,
      specialCards: [
        {
          card: 'skull_king',
          capturedCards: ['pirate1', 'pirate2', 'mermaid1'],
          wonTrick: true
        }
      ]
    },
    {
      playerId: 'player2',
      bid: 2, 
      tricksTaken: 1,
      specialCards: [
        {
          card: 'kraken',
          wonTrick: true
        }
      ]
    }
  ]
};

// This will calculate:
// Player 1: 20*3 + 10*5 + 30*2 + 20*1 = 60 + 50 + 60 + 20 = 190 points
// Player 2: -10*1 + 50 = -10 + 50 = 40 points
const scores = await calculateRoundScore(roundWithSpecialCards);
```

### Error Recovery Pattern

```javascript
const scoreRoundSafely = async (roundData) => {
  try {
    // First validate the data
    const validation = await fetch('/api/scoring/validate-round', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roundData)
    });
    
    const validationResult = await validation.json();
    if (!validationResult.valid) {
      return { success: false, errors: validationResult.errors };
    }
    
    // Then calculate scores
    const scores = await calculateRoundScore(roundData);
    return { success: true, scores };
    
  } catch (error) {
    console.error('Scoring error:', error);
    return { 
      success: false, 
      errors: [{ type: 'SYSTEM_ERROR', message: error.message }]
    };
  }
};
```

### Real-time Score Updates

```javascript
// WebSocket integration for live score updates
const connectScoreUpdates = (gameId) => {
  const ws = new WebSocket(`ws://localhost:3000/scoring/${gameId}`);
  
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data);
    switch (update.type) {
      case 'ROUND_SCORED':
        updateUI(update.playerScores);
        break;
      case 'SCORE_ADJUSTED':
        showScoreAdjustment(update.adjustment);
        break;
      case 'GAME_ENDED':
        showFinalScores(update.finalScores);
        break;
    }
  };
  
  return ws;
};
```

## Rate Limits

- **Scoring calculations**: 100 requests per minute per API key
- **Score retrievals**: 500 requests per minute per API key
- **Score updates**: 50 requests per minute per API key

## Authentication

All endpoints require Bearer token authentication:

```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
     https://api.example.com/scoring/game/123
```

## Changelog

- **v1.2.0**: Added special card bonus calculations
- **v1.1.0**: Added bid validation endpoint
- **v1.0.0**: Initial scoring system release