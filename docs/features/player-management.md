# Player Management Feature

## Overview
The Player Management feature provides comprehensive functionality for handling player data, state management, and workflow orchestration throughout the game lifecycle. It includes player registration, profile management, team assignments, role management, and game state synchronization.

## Architecture

### Data Flow Diagram
```
User Input → Component → Action → Reducer → State → Component → UI Update
     ↓                                ↓
Validation ←                    → Side Effects
     ↓                                ↓
 API Calls ←                    → Local Storage
     ↓                                ↓
Server State →              → State Sync
```

### Core Concepts

#### Player Entity
```typescript
interface Player {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  teamId?: string;
  roleId?: string;
  status: PlayerStatus;
  gameStats: GameStats;
  preferences: PlayerPreferences;
  createdAt: Date;
  updatedAt: Date;
}

enum PlayerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  ELIMINATED = 'eliminated'
}

interface GameStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  score: number;
  achievements: Achievement[];
}

interface PlayerPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  autoJoinTeam: boolean;
  defaultRole?: string;
}
```

#### Team Entity
```typescript
interface Team {
  id: string;
  name: string;
  color: string;
  playerIds: string[];
  maxPlayers: number;
  gameId: string;
  stats: TeamStats;
}

interface TeamStats {
  wins: number;
  losses: number;
  totalScore: number;
}
```

#### Role Entity
```typescript
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  maxCount?: number;
  gameId: string;
}

interface Permission {
  action: string;
  resource: string;
  conditions?: Record<string, any>;
}
```

## State Management

### Redux Store Structure
```typescript
interface PlayerState {
  players: {
    byId: Record<string, Player>;
    allIds: string[];
    loading: boolean;
    error: string | null;
  };
  teams: {
    byId: Record<string, Team>;
    allIds: string[];
    loading: boolean;
    error: string | null;
  };
  roles: {
    byId: Record<string, Role>;
    allIds: string[];
    loading: boolean;
    error: string | null;
  };
  currentPlayer: string | null;
  gameState: {
    phase: GamePhase;
    activePlayer: string | null;
    turnOrder: string[];
  };
  ui: {
    setupStep: SetupStep;
    selectedPlayers: string[];
    filters: PlayerFilters;
    sortBy: SortOptions;
  };
}
```

### Actions and Reducers

#### Player Actions
```typescript
// Action Types
const PLAYER_ACTIONS = {
  ADD_PLAYER_REQUEST: 'players/addPlayerRequest',
  ADD_PLAYER_SUCCESS: 'players/addPlayerSuccess',
  ADD_PLAYER_FAILURE: 'players/addPlayerFailure',
  UPDATE_PLAYER_REQUEST: 'players/updatePlayerRequest',
  UPDATE_PLAYER_SUCCESS: 'players/updatePlayerSuccess',
  UPDATE_PLAYER_FAILURE: 'players/updatePlayerFailure',
  REMOVE_PLAYER_REQUEST: 'players/removePlayerRequest',
  REMOVE_PLAYER_SUCCESS: 'players/removePlayerSuccess',
  REMOVE_PLAYER_FAILURE: 'players/removePlayerFailure',
  FETCH_PLAYERS_REQUEST: 'players/fetchPlayersRequest',
  FETCH_PLAYERS_SUCCESS: 'players/fetchPlayersSuccess',
  FETCH_PLAYERS_FAILURE: 'players/fetchPlayersFailure',
  SET_CURRENT_PLAYER: 'players/setCurrentPlayer',
  ASSIGN_TEAM: 'players/assignTeam',
  ASSIGN_ROLE: 'players/assignRole',
  UPDATE_PLAYER_STATUS: 'players/updatePlayerStatus'
};

// Action Creators
export const playerActions = {
  addPlayer: (playerData: Partial<Player>) => ({
    type: PLAYER_ACTIONS.ADD_PLAYER_REQUEST,
    payload: playerData
  }),
  
  updatePlayer: (id: string, updates: Partial<Player>) => ({
    type: PLAYER_ACTIONS.UPDATE_PLAYER_REQUEST,
    payload: { id, updates }
  }),
  
  removePlayer: (id: string) => ({
    type: PLAYER_ACTIONS.REMOVE_PLAYER_REQUEST,
    payload: id
  }),
  
  assignTeam: (playerId: string, teamId: string) => ({
    type: PLAYER_ACTIONS.ASSIGN_TEAM,
    payload: { playerId, teamId }
  }),
  
  assignRole: (playerId: string, roleId: string) => ({
    type: PLAYER_ACTIONS.ASSIGN_ROLE,
    payload: { playerId, roleId }
  })
};
```

#### Player Reducer
```typescript
const initialState: PlayerState = {
  players: {
    byId: {},
    allIds: [],
    loading: false,
    error: null
  },
  teams: {
    byId: {},
    allIds: [],
    loading: false,
    error: null
  },
  roles: {
    byId: {},
    allIds: [],
    loading: false,
    error: null
  },
  currentPlayer: null,
  gameState: {
    phase: GamePhase.SETUP,
    activePlayer: null,
    turnOrder: []
  },
  ui: {
    setupStep: SetupStep.PLAYER_REGISTRATION,
    selectedPlayers: [],
    filters: {},
    sortBy: SortOptions.NAME
  }
};

export const playerReducer = (
  state = initialState,
  action: AnyAction
): PlayerState => {
  switch (action.type) {
    case PLAYER_ACTIONS.ADD_PLAYER_SUCCESS:
      const newPlayer = action.payload;
      return {
        ...state,
        players: {
          ...state.players,
          byId: {
            ...state.players.byId,
            [newPlayer.id]: newPlayer
          },
          allIds: [...state.players.allIds, newPlayer.id],
          loading: false,
          error: null
        }
      };
      
    case PLAYER_ACTIONS.UPDATE_PLAYER_SUCCESS:
      const { id, updates } = action.payload;
      return {
        ...state,
        players: {
          ...state.players,
          byId: {
            ...state.players.byId,
            [id]: {
              ...state.players.byId[id],
              ...updates,
              updatedAt: new Date()
            }
          },
          loading: false,
          error: null
        }
      };
      
    case PLAYER_ACTIONS.REMOVE_PLAYER_SUCCESS:
      const playerIdToRemove = action.payload;
      const { [playerIdToRemove]: removed, ...remainingPlayers } = state.players.byId;
      return {
        ...state,
        players: {
          ...state.players,
          byId: remainingPlayers,
          allIds: state.players.allIds.filter(id => id !== playerIdToRemove),
          loading: false,
          error: null
        }
      };
      
    case PLAYER_ACTIONS.ASSIGN_TEAM:
      const { playerId, teamId } = action.payload;
      return {
        ...state,
        players: {
          ...state.players,
          byId: {
            ...state.players.byId,
            [playerId]: {
              ...state.players.byId[playerId],
              teamId,
              updatedAt: new Date()
            }
          }
        }
      };
      
    default:
      return state;
  }
};
```

### Selectors
```typescript
// Basic Selectors
export const selectAllPlayers = (state: RootState): Player[] =>
  state.players.players.allIds.map(id => state.players.players.byId[id]);

export const selectPlayerById = (state: RootState, id: string): Player | undefined =>
  state.players.players.byId[id];

export const selectCurrentPlayer = (state: RootState): Player | undefined =>
  state.players.currentPlayer
    ? state.players.players.byId[state.players.currentPlayer]
    : undefined;

// Complex Selectors
export const selectPlayersByTeam = createSelector(
  [selectAllPlayers, (state: RootState, teamId: string) => teamId],
  (players, teamId) => players.filter(player => player.teamId === teamId)
);

export const selectPlayersWithRole = createSelector(
  [selectAllPlayers, (state: RootState, roleId: string) => roleId],
  (players, roleId) => players.filter(player => player.roleId === roleId)
);

export const selectActivePlayers = createSelector(
  [selectAllPlayers],
  (players) => players.filter(player => player.status === PlayerStatus.ACTIVE)
);

export const selectTeamStats = createSelector(
  [selectPlayersByTeam],
  (teamPlayers) => ({
    playerCount: teamPlayers.length,
    totalWins: teamPlayers.reduce((sum, player) => sum + player.gameStats.wins, 0),
    totalScore: teamPlayers.reduce((sum, player) => sum + player.gameStats.score, 0),
    averageScore: teamPlayers.length > 0
      ? teamPlayers.reduce((sum, player) => sum + player.gameStats.score, 0) / teamPlayers.length
      : 0
  })
);
```

### Middleware and Side Effects

#### Redux-Saga Effects
```typescript
function* addPlayerSaga(action: PayloadAction<Partial<Player>>) {
  try {
    yield put({ type: PLAYER_ACTIONS.ADD_PLAYER_REQUEST });
    
    // Validate player data
    const validationResult = yield call(validatePlayerData, action.payload);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errors.join(', '));
    }
    
    // Call API to create player
    const newPlayer: Player = yield call(apiClient.players.create, action.payload);
    
    // Update local storage
    yield call(updateLocalPlayerData, newPlayer);
    
    // Dispatch success action
    yield put({
      type: PLAYER_ACTIONS.ADD_PLAYER_SUCCESS,
      payload: newPlayer
    });
    
    // Log analytics event
    yield call(analytics.track, 'player_added', {
      playerId: newPlayer.id,
      gameId: newPlayer.gameId
    });
    
  } catch (error) {
    yield put({
      type: PLAYER_ACTIONS.ADD_PLAYER_FAILURE,
      payload: error.message
    });
  }
}

function* assignTeamSaga(action: PayloadAction<{ playerId: string; teamId: string }>) {
  try {
    const { playerId, teamId } = action.payload;
    
    // Get current state
    const state: RootState = yield select();
    const player = selectPlayerById(state, playerId);
    const team = state.players.teams.byId[teamId];
    
    // Validate team assignment
    if (!team) {
      throw new Error('Team not found');
    }
    
    if (team.playerIds.length >= team.maxPlayers) {
      throw new Error('Team is full');
    }
    
    // Update player
    yield call(apiClient.players.update, playerId, { teamId });
    
    // Update team
    yield call(apiClient.teams.addPlayer, teamId, playerId);
    
    // Update local state
    yield put({
      type: PLAYER_ACTIONS.ASSIGN_TEAM,
      payload: { playerId, teamId }
    });
    
  } catch (error) {
    yield put({
      type: 'TEAM_ASSIGNMENT_ERROR',
      payload: error.message
    });
  }
}

// Root saga
export function* playerSagas() {
  yield takeEvery(PLAYER_ACTIONS.ADD_PLAYER_REQUEST, addPlayerSaga);
  yield takeEvery(PLAYER_ACTIONS.UPDATE_PLAYER_REQUEST, updatePlayerSaga);
  yield takeEvery(PLAYER_ACTIONS.REMOVE_PLAYER_REQUEST, removePlayerSaga);
  yield takeEvery(PLAYER_ACTIONS.ASSIGN_TEAM, assignTeamSaga);
  yield takeEvery(PLAYER_ACTIONS.ASSIGN_ROLE, assignRoleSaga);
}
```

## Validation Rules

### Player Validation
```typescript
interface ValidationRule {
  field: string;
  validator: (value: any, context?: any) => boolean;
  message: string;
  level: 'error' | 'warning';
}

const playerValidationRules: ValidationRule[] = [
  {
    field: 'name',
    validator: (name: string) => name && name.trim().length >= 2,
    message: 'Player name must be at least 2 characters long',
    level: 'error'
  },
  {
    field: 'name',
    validator: (name: string) => name && name.length <= 20,
    message: 'Player name must not exceed 20 characters',
    level: 'error'
  },
  {
    field: 'email',
    validator: (email: string) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    message: 'Please enter a valid email address',
    level: 'error'
  },
  {
    field: 'teamId',
    validator: (teamId: string, context: ValidationContext) => {
      if (!teamId) return true; // Optional field
      const team = context.teams.find(t => t.id === teamId);
      return team && team.playerIds.length < team.maxPlayers;
    },
    message: 'Selected team is full',
    level: 'error'
  }
];

const gameSetupValidationRules: ValidationRule[] = [
  {
    field: 'players',
    validator: (players: Player[], context: GameConfig) => 
      players.length >= context.minPlayers,
    message: 'Not enough players to start the game',
    level: 'error'
  },
  {
    field: 'players',
    validator: (players: Player[], context: GameConfig) => 
      players.length <= context.maxPlayers,
    message: 'Too many players for this game',
    level: 'error'
  },
  {
    field: 'teams',
    validator: (teams: Team[], context: GameConfig) => {
      if (!context.requireTeams) return true;
      return teams.every(team => team.playerIds.length > 0);
    },
    message: 'All teams must have at least one player',
    level: 'warning'
  },
  {
    field: 'roles',
    validator: (players: Player[], context: GameConfig) => {
      if (!context.requireRoles) return true;
      return players.every(player => player.roleId);
    },
    message: 'All players must have assigned roles',
    level: 'error'
  }
];
```

### Validation Implementation
```typescript
interface ValidationContext {
  players: Player[];
  teams: Team[];
  roles: Role[];
  gameConfig: GameConfig;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  message: string;
  playerId?: string;
}

export const validatePlayer = (
  player: Partial<Player>,
  context: ValidationContext
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  playerValidationRules.forEach(rule => {
    const fieldValue = player[rule.field as keyof Player];
    if (!rule.validator(fieldValue, context)) {
      const error = {
        field: rule.field,
        message: rule.message,
        playerId: player.id
      };
      
      if (rule.level === 'error') {
        errors.push(error);
      } else {
        warnings.push(error);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateGameSetup = (
  players: Player[],
  teams: Team[],
  gameConfig: GameConfig
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Validate individual players
  players.forEach(player => {
    const playerValidation = validatePlayer(player, { players, teams, roles: [], gameConfig });
    errors.push(...playerValidation.errors);
    warnings.push(...playerValidation.warnings);
  });
  
  // Validate game setup rules
  gameSetupValidationRules.forEach(rule => {
    let fieldValue;
    switch (rule.field) {
      case 'players':
        fieldValue = players;
        break;
      case 'teams':
        fieldValue = teams;
        break;
      default:
        return;
    }
    
    if (!rule.validator(fieldValue, gameConfig)) {
      const error = {
        field: rule.field,
        message: rule.message
      };
      
      if (rule.level === 'error') {
        errors.push(error);
      } else {
        warnings.push(error);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
```

## Game State Flow

### State Machine
```typescript
enum GamePhase {
  SETUP = 'setup',
  PLAYER_REGISTRATION = 'player_registration',
  TEAM_ASSIGNMENT = 'team_assignment',
  ROLE_ASSIGNMENT = 'role_assignment',
  GAME_START = 'game_start',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  FINISHED = 'finished'
}

interface GameStateMachine {
  currentPhase: GamePhase;
  transitions: Record<GamePhase, GamePhase[]>;
  handlers: Record<string, (context: GameContext) => void>;
}

const gameStateMachine: GameStateMachine = {
  currentPhase: GamePhase.SETUP,
  transitions: {
    [GamePhase.SETUP]: [GamePhase.PLAYER_REGISTRATION],
    [GamePhase.PLAYER_REGISTRATION]: [GamePhase.TEAM_ASSIGNMENT, GamePhase.GAME_START],
    [GamePhase.TEAM_ASSIGNMENT]: [GamePhase.ROLE_ASSIGNMENT, GamePhase.GAME_START],
    [GamePhase.ROLE_ASSIGNMENT]: [GamePhase.GAME_START],
    [GamePhase.GAME_START]: [GamePhase.IN_PROGRESS],
    [GamePhase.IN_PROGRESS]: [GamePhase.PAUSED, GamePhase.FINISHED],
    [GamePhase.PAUSED]: [GamePhase.IN_PROGRESS, GamePhase.FINISHED],
    [GamePhase.FINISHED]: [GamePhase.SETUP]
  },
  handlers: {
    onEnterPlayerRegistration: (context) => {
      // Initialize player registration UI
      context.dispatch(setSetupStep(SetupStep.PLAYER_REGISTRATION));
    },
    onEnterTeamAssignment: (context) => {
      // Setup team assignment if required
      if (context.gameConfig.requireTeams) {
        context.dispatch(setSetupStep(SetupStep.TEAM_ASSIGNMENT));
      } else {
        context.stateMachine.transition(GamePhase.ROLE_ASSIGNMENT);
      }
    },
    onEnterRoleAssignment: (context) => {
      // Setup role assignment if required
      if (context.gameConfig.requireRoles) {
        context.dispatch(setSetupStep(SetupStep.ROLE_ASSIGNMENT));
      } else {
        context.stateMachine.transition(GamePhase.GAME_START);
      }
    },
    onEnterGameStart: (context) => {
      // Validate setup and start game
      const validation = validateGameSetup(
        context.players,
        context.teams,
        context.gameConfig
      );
      
      if (validation.isValid) {
        context.dispatch(startGame());
      } else {
        // Handle validation errors
        context.dispatch(showValidationErrors(validation.errors));
      }
    }
  }
};
```

### Player Data Structure Evolution
```typescript
// Initial player creation
const initialPlayerData: Partial<Player> = {
  name: 'John Doe',
  email: 'john@example.com'
};

// After validation and creation
const createdPlayer: Player = {
  id: 'player-123',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: null,
  teamId: null,
  roleId: null,
  status: PlayerStatus.PENDING,
  gameStats: {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    score: 0,
    achievements: []
  },
  preferences: {
    theme: 'auto',
    notifications: true,
    autoJoinTeam: false
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

// After team assignment
const playerWithTeam: Player = {
  ...createdPlayer,
  teamId: 'team-red',
  status: PlayerStatus.ACTIVE,
  updatedAt: new Date()
};

// After role assignment
const playerWithRole: Player = {
  ...playerWithTeam,
  roleId: 'role-captain',
  updatedAt: new Date()
};

// During game
const activePlayer: Player = {
  ...playerWithRole,
  gameStats: {
    ...playerWithRole.gameStats,
    gamesPlayed: 1,
    score: 150
  },
  updatedAt: new Date()
};
```

## Integration Examples

### Basic Setup Integration
```tsx
import { useDispatch, useSelector } from 'react-redux';
import { PlayerSetupContainer } from '@/components/player-setup';
import { playerActions } from '@/store/players';

function GameLobby() {
  const dispatch = useDispatch();
  const players = useSelector(selectAllPlayers);
  const gameConfig = useSelector(selectGameConfig);
  
  const handleAddPlayer = (playerData: Partial<Player>) => {
    dispatch(playerActions.addPlayer(playerData));
  };
  
  const handleUpdatePlayer = (id: string, updates: Partial<Player>) => {
    dispatch(playerActions.updatePlayer(id, updates));
  };
  
  const handleRemovePlayer = (id: string) => {
    dispatch(playerActions.removePlayer(id));
  };
  
  const handleSetupComplete = (players: Player[]) => {
    // Validate setup
    const validation = validateGameSetup(players, [], gameConfig);
    
    if (validation.isValid) {
      dispatch(startGame(players));
    } else {
      // Show errors
      console.error('Setup validation failed:', validation.errors);
    }
  };
  
  return (
    <PlayerSetupContainer
      gameId={gameConfig.id}
      maxPlayers={gameConfig.maxPlayers}
      minPlayers={gameConfig.minPlayers}
      allowTeams={gameConfig.requireTeams}
      players={players}
      onAddPlayer={handleAddPlayer}
      onUpdatePlayer={handleUpdatePlayer}
      onRemovePlayer={handleRemovePlayer}
      onSetupComplete={handleSetupComplete}
    />
  );
}
```

### Advanced Integration with Real-time Updates
```tsx
import { useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { usePlayerSync } from '@/hooks/usePlayerSync';

function MultiplayerGameLobby() {
  const dispatch = useDispatch();
  const gameId = useSelector(selectCurrentGameId);
  const players = useSelector(selectAllPlayers);
  
  // WebSocket connection for real-time updates
  const { socket, isConnected } = useWebSocket(`/games/${gameId}`);
  
  // Sync player data across clients
  const { syncPlayers, handleRemoteUpdate } = usePlayerSync(socket);
  
  useEffect(() => {
    if (socket && isConnected) {
      // Listen for remote player updates
      socket.on('player:added', handleRemoteUpdate);
      socket.on('player:updated', handleRemoteUpdate);
      socket.on('player:removed', handleRemoteUpdate);
      socket.on('team:assigned', handleRemoteUpdate);
      
      // Sync current state
      syncPlayers(players);
      
      return () => {
        socket.off('player:added');
        socket.off('player:updated');
        socket.off('player:removed');
        socket.off('team:assigned');
      };
    }
  }, [socket, isConnected, players]);
  
  const handleAddPlayer = async (playerData: Partial<Player>) => {
    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    dispatch(playerActions.addPlayerOptimistic({ ...playerData, id: tempId }));
    
    try {
      // Add player via API
      const newPlayer = await dispatch(playerActions.addPlayer(playerData)).unwrap();
      
      // Broadcast to other clients
      socket?.emit('player:added', newPlayer);
      
    } catch (error) {
      // Rollback optimistic update
      dispatch(playerActions.rollbackPlayer(tempId));
      throw error;
    }
  };
  
  return (
    <div>
      <ConnectionStatus connected={isConnected} />
      <PlayerSetupContainer
        gameId={gameId}
        players={players}
        onAddPlayer={handleAddPlayer}
        realTimeMode={isConnected}
      />
    </div>
  );
}
```

### Custom Hook Integration
```tsx
import { usePlayerManagement } from '@/hooks/usePlayerManagement';

function CustomPlayerSetup() {
  const {
    players,
    teams,
    roles,
    addPlayer,
    updatePlayer,
    removePlayer,
    assignTeam,
    assignRole,
    validateSetup,
    isSetupValid,
    validationErrors,
    canStartGame
  } = usePlayerManagement('game-123');
  
  const handleCompleteSetup = async () => {
    if (!isSetupValid) {
      console.error('Setup validation failed:', validationErrors);
      return;
    }
    
    try {
      await validateSetup();
      // Start game logic here
    } catch (error) {
      console.error('Setup completion failed:', error);
    }
  };
  
  return (
    <div>
      <PlayerRegistration
        onAddPlayer={addPlayer}
        onUpdatePlayer={updatePlayer}
        onRemovePlayer={removePlayer}
        players={players}
        errors={validationErrors.filter(e => e.field === 'players')}
      />
      
      {teams.length > 0 && (
        <TeamAssignment
          players={players}
          teams={teams}
          onAssignTeam={assignTeam}
        />
      )}
      
      {roles.length > 0 && (
        <RoleAssignment
          players={players}
          roles={roles}
          onAssignRole={assignRole}
        />
      )}
      
      <SetupSummary
        players={players}
        teams={teams}
        validationErrors={validationErrors}
        canStart={canStartGame}
        onStart={handleCompleteSetup}
      />
    </div>
  );
}
```

## API Integration

### Player Management API
```typescript
interface PlayerAPI {
  // CRUD Operations
  create(playerData: Partial<Player>): Promise<Player>;
  update(id: string, updates: Partial<Player>): Promise<Player>;
  delete(id: string): Promise<void>;
  get(id: string): Promise<Player>;
  list(gameId: string): Promise<Player[]>;
  
  // Team Operations
  assignTeam(playerId: string, teamId: string): Promise<void>;
  removeFromTeam(playerId: string): Promise<void>;
  
  // Role Operations
  assignRole(playerId: string, roleId: string): Promise<void>;
  removeRole(playerId: string): Promise<void>;
  
  // Batch Operations
  createBatch(players: Partial<Player>[]): Promise<Player[]>;
  updateBatch(updates: Array<{ id: string; data: Partial<Player> }>): Promise<Player[]>;
  
  // Validation
  validate(playerData: Partial<Player>): Promise<ValidationResult>;
  validateSetup(gameId: string): Promise<ValidationResult>;
}

// Implementation
export const playerAPI: PlayerAPI = {
  async create(playerData) {
    const response = await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create player: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async assignTeam(playerId, teamId) {
    const response = await fetch(`/api/players/${playerId}/team`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to assign team: ${response.statusText}`);
    }
  },
  
  async validateSetup(gameId) {
    const response = await fetch(`/api/games/${gameId}/validate-setup`);
    
    if (!response.ok) {
      throw new Error(`Validation failed: ${response.statusText}`);
    }
    
    return response.json();
  }
};
```

This comprehensive documentation covers all the acceptance criteria:

1. **Component props and usage documented** - Detailed component API documentation with props, usage examples, and integration patterns
2. **State management flow explained** - Complete Redux store structure, actions, reducers, selectors, and side effects
3. **Integration examples provided** - Multiple integration examples from basic to advanced real-time scenarios
4. **Validation rules documented** - Comprehensive validation system with rules, implementation, and error handling

The documentation provides developers with everything needed to understand, implement, and maintain the player management feature effectively.