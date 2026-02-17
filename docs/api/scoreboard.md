# Scoreboard API

## Overview
The Scoreboard API provides endpoints for retrieving real-time scoreboard data and managing live updates through WebSocket connections.

## Endpoints

### GET /api/scoreboard

Retrieves the current scoreboard state with all active games and scores.

#### Request
```http
GET /api/scoreboard
Content-Type: application/json
```

#### Response
```json
{
  "success": true,
  "data": {
    "scoreboard": {
      "id": "scoreboard_001",
      "lastUpdated": "2024-01-15T10:30:00Z",
      "games": [
        {
          "gameId": "game_123",
          "homeTeam": {
            "id": "team_456",
            "name": "Lakers",
            "abbreviation": "LAL",
            "score": 95,
            "logo": "https://example.com/logos/lal.png"
          },
          "awayTeam": {
            "id": "team_789",
            "name": "Warriors",
            "abbreviation": "GSW",
            "score": 87,
            "logo": "https://example.com/logos/gsw.png"
          },
          "status": "live",
          "period": 3,
          "timeRemaining": "08:45",
          "startTime": "2024-01-15T09:00:00Z"
        }
      ],
      "metadata": {
        "totalGames": 12,
        "liveGames": 3,
        "completedGames": 5,
        "upcomingGames": 4
      }
    }
  },
  "timestamp": "2024-01-15T10:30:15Z"
}
```

#### Status Codes
- `200 OK` - Success
- `404 Not Found` - Scoreboard not found
- `500 Internal Server Error` - Server error

### GET /api/scoreboard/{gameId}

Retrieves detailed information for a specific game.

#### Request
```http
GET /api/scoreboard/game_123
Content-Type: application/json
```

#### Response
```json
{
  "success": true,
  "data": {
    "game": {
      "gameId": "game_123",
      "homeTeam": {
        "id": "team_456",
        "name": "Lakers",
        "abbreviation": "LAL",
        "score": 95,
        "logo": "https://example.com/logos/lal.png",
        "players": [
          {
            "id": "player_001",
            "name": "LeBron James",
            "position": "SF",
            "points": 28,
            "assists": 7,
            "rebounds": 9
          }
        ]
      },
      "awayTeam": {
        "id": "team_789",
        "name": "Warriors",
        "abbreviation": "GSW",
        "score": 87,
        "logo": "https://example.com/logos/gsw.png",
        "players": [
          {
            "id": "player_002",
            "name": "Stephen Curry",
            "position": "PG",
            "points": 31,
            "assists": 5,
            "rebounds": 4
          }
        ]
      },
      "status": "live",
      "period": 3,
      "timeRemaining": "08:45",
      "startTime": "2024-01-15T09:00:00Z",
      "lastPlay": "3-pointer made by Stephen Curry"
    }
  },
  "timestamp": "2024-01-15T10:30:15Z"
}
```

## Data Structures

### Game Object
```typescript
interface Game {
  gameId: string;
  homeTeam: Team;
  awayTeam: Team;
  status: 'scheduled' | 'live' | 'halftime' | 'final' | 'postponed';
  period: number;
  timeRemaining: string;
  startTime: string;
  lastPlay?: string;
}
```

### Team Object
```typescript
interface Team {
  id: string;
  name: string;
  abbreviation: string;
  score: number;
  logo: string;
  players?: Player[];
}
```

### Player Object
```typescript
interface Player {
  id: string;
  name: string;
  position: string;
  points: number;
  assists: number;
  rebounds: number;
}
```

## WebSocket Events

The scoreboard uses WebSocket connections for real-time updates. Connect to `/ws/scoreboard` to receive live events.

### Connection
```javascript
const ws = new WebSocket('ws://localhost:3000/ws/scoreboard');
```

### Event Types

#### 1. score_update
Fired when a team's score changes.

```json
{
  "type": "score_update",
  "data": {
    "gameId": "game_123",
    "teamId": "team_456",
    "newScore": 97,
    "previousScore": 95,
    "play": "2-pointer made by LeBron James"
  },
  "timestamp": "2024-01-15T10:31:00Z"
}
```

#### 2. game_status_change
Fired when a game's status changes (e.g., halftime, final).

```json
{
  "type": "game_status_change",
  "data": {
    "gameId": "game_123",
    "newStatus": "halftime",
    "previousStatus": "live"
  },
  "timestamp": "2024-01-15T10:31:00Z"
}
```

#### 3. time_update
Fired when game time changes (every minute).

```json
{
  "type": "time_update",
  "data": {
    "gameId": "game_123",
    "timeRemaining": "07:45",
    "period": 3
  },
  "timestamp": "2024-01-15T10:31:00Z"
}
```

#### 4. play_by_play
Fired for significant game events.

```json
{
  "type": "play_by_play",
  "data": {
    "gameId": "game_123",
    "play": "3-pointer made by Stephen Curry",
    "playerId": "player_002",
    "teamId": "team_789",
    "points": 3
  },
  "timestamp": "2024-01-15T10:31:00Z"
}
```

#### 5. scoreboard_refresh
Fired when the entire scoreboard should be refreshed.

```json
{
  "type": "scoreboard_refresh",
  "data": {
    "reason": "multiple_updates",
    "affectedGames": ["game_123", "game_456"]
  },
  "timestamp": "2024-01-15T10:31:00Z"
}
```

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "GAME_NOT_FOUND",
    "message": "Game with ID 'game_123' not found",
    "details": {}
  },
  "timestamp": "2024-01-15T10:30:15Z"
}
```

### Common Error Codes
- `SCOREBOARD_UNAVAILABLE` - Scoreboard service is down
- `GAME_NOT_FOUND` - Requested game does not exist
- `INVALID_GAME_ID` - Game ID format is invalid
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `WEBSOCKET_CONNECTION_FAILED` - WebSocket connection could not be established

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **REST API**: 100 requests per minute per IP
- **WebSocket**: 1 connection per client, automatic reconnection after 5 seconds if disconnected

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```