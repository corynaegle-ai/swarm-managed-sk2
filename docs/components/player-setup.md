# Player Setup Components

## Overview
The Player Setup feature provides a comprehensive set of components for managing player configuration in games. This includes player registration, team assignment, role selection, and validation workflows.

## Component Tree Structure

```
PlayerSetupContainer
├── PlayerSetupForm
│   ├── PlayerInput
│   ├── TeamSelector
│   └── RoleSelector
├── PlayerList
│   ├── PlayerCard
│   │   ├── PlayerAvatar
│   │   ├── PlayerDetails
│   │   └── PlayerActions
│   └── TeamAssignment
└── ValidationSummary
    ├── ErrorList
    └── WarningList
```

## Components

### PlayerSetupContainer

The main container component that manages the overall player setup state and orchestrates child components.

#### Props
```typescript
interface PlayerSetupContainerProps {
  gameId: string;
  maxPlayers?: number;
  minPlayers?: number;
  allowTeams?: boolean;
  onSetupComplete: (players: Player[]) => void;
  onCancel?: () => void;
  initialPlayers?: Player[];
}
```

#### Usage
```jsx
import { PlayerSetupContainer } from '@/components/player-setup';

function GameLobby() {
  const handleSetupComplete = (players) => {
    console.log('Players configured:', players);
  };

  return (
    <PlayerSetupContainer
      gameId="game-123"
      maxPlayers={6}
      minPlayers={2}
      allowTeams={true}
      onSetupComplete={handleSetupComplete}
    />
  );
}
```

### PlayerSetupForm

Form component for adding and configuring individual players.

#### Props
```typescript
interface PlayerSetupFormProps {
  onAddPlayer: (player: Partial<Player>) => void;
  onUpdatePlayer: (id: string, updates: Partial<Player>) => void;
  availableRoles: Role[];
  availableTeams: Team[];
  validationErrors?: ValidationError[];
}
```

#### Usage
```jsx
<PlayerSetupForm
  onAddPlayer={handleAddPlayer}
  onUpdatePlayer={handleUpdatePlayer}
  availableRoles={gameRoles}
  availableTeams={gameTeams}
  validationErrors={errors}
/>
```

### PlayerInput

Input component for player name and basic information.

#### Props
```typescript
interface PlayerInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}
```

#### Usage
```jsx
<PlayerInput
  value={playerName}
  onChange={setPlayerName}
  placeholder="Enter player name"
  maxLength={20}
  required={true}
  error={nameError}
/>
```

### TeamSelector

Component for selecting player teams.

#### Props
```typescript
interface TeamSelectorProps {
  teams: Team[];
  selectedTeam?: string;
  onTeamSelect: (teamId: string) => void;
  disabled?: boolean;
  required?: boolean;
}
```

#### Usage
```jsx
<TeamSelector
  teams={availableTeams}
  selectedTeam={player.teamId}
  onTeamSelect={(teamId) => updatePlayer(player.id, { teamId })}
  required={gameConfig.requireTeams}
/>
```

### RoleSelector

Component for selecting player roles.

#### Props
```typescript
interface RoleSelectorProps {
  roles: Role[];
  selectedRole?: string;
  onRoleSelect: (roleId: string) => void;
  disabled?: boolean;
  multiSelect?: boolean;
}
```

#### Usage
```jsx
<RoleSelector
  roles={gameRoles}
  selectedRole={player.roleId}
  onRoleSelect={(roleId) => updatePlayer(player.id, { roleId })}
  multiSelect={false}
/>
```

### PlayerList

Displays the list of configured players with management actions.

#### Props
```typescript
interface PlayerListProps {
  players: Player[];
  onUpdatePlayer: (id: string, updates: Partial<Player>) => void;
  onRemovePlayer: (id: string) => void;
  showTeams?: boolean;
  showRoles?: boolean;
  editable?: boolean;
}
```

#### Usage
```jsx
<PlayerList
  players={configuredPlayers}
  onUpdatePlayer={handleUpdatePlayer}
  onRemovePlayer={handleRemovePlayer}
  showTeams={true}
  showRoles={true}
  editable={true}
/>
```

### PlayerCard

Individual player card component showing player details and actions.

#### Props
```typescript
interface PlayerCardProps {
  player: Player;
  onUpdate: (updates: Partial<Player>) => void;
  onRemove: () => void;
  showTeam?: boolean;
  showRole?: boolean;
  editable?: boolean;
}
```

### ValidationSummary

Component that displays validation errors and warnings for the current player setup.

#### Props
```typescript
interface ValidationSummaryProps {
  errors: ValidationError[];
  warnings: ValidationWarning[];
  onErrorClick?: (error: ValidationError) => void;
}
```

## State Management Integration

### Context Provider
```jsx
import { PlayerSetupProvider, usePlayerSetup } from '@/contexts/PlayerSetupContext';

function App() {
  return (
    <PlayerSetupProvider gameId="game-123">
      <GameLobby />
    </PlayerSetupProvider>
  );
}

function GameLobby() {
  const {
    players,
    addPlayer,
    updatePlayer,
    removePlayer,
    validateSetup,
    isValid
  } = usePlayerSetup();

  return (
    <div>
      <PlayerSetupContainer
        players={players}
        onAddPlayer={addPlayer}
        onUpdatePlayer={updatePlayer}
        onRemovePlayer={removePlayer}
      />
    </div>
  );
}
```

### Custom Hooks

#### usePlayerSetup
Main hook for player setup state management.

```typescript
const {
  players,           // Player[] - Current players
  addPlayer,         // (player: Partial<Player>) => void
  updatePlayer,      // (id: string, updates: Partial<Player>) => void
  removePlayer,      // (id: string) => void
  validateSetup,     // () => ValidationResult
  isValid,          // boolean - Current setup validity
  errors,           // ValidationError[] - Current errors
  warnings          // ValidationWarning[] - Current warnings
} = usePlayerSetup();
```

#### usePlayerValidation
Hook for player validation logic.

```typescript
const {
  validatePlayer,    // (player: Player) => ValidationResult
  validateTeams,     // (players: Player[]) => ValidationResult
  validateRoles,     // (players: Player[]) => ValidationResult
  validationRules    // ValidationRule[] - Current rules
} = usePlayerValidation(gameConfig);
```

## Event Handlers

### Player Events
```typescript
// Add new player
const handleAddPlayer = async (playerData: Partial<Player>) => {
  const newPlayer = await createPlayer(playerData);
  addPlayer(newPlayer);
};

// Update existing player
const handleUpdatePlayer = async (id: string, updates: Partial<Player>) => {
  await updatePlayerData(id, updates);
  updatePlayer(id, updates);
};

// Remove player
const handleRemovePlayer = async (id: string) => {
  await deletePlayer(id);
  removePlayer(id);
};

// Setup completion
const handleSetupComplete = async (players: Player[]) => {
  const validation = validateSetup();
  if (validation.isValid) {
    await savePlayerSetup(players);
    navigateToGame();
  }
};
```

## Styling and Themes

### CSS Classes
```css
/* Container styles */
.player-setup-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.player-setup-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  align-items: end;
}

/* Player list styles */
.player-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.player-card {
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1rem;
  background: var(--card-background);
}

.player-card--selected {
  border-color: var(--primary-color);
  background: var(--primary-background);
}
```

### Theme Variables
```css
:root {
  --player-setup-primary: #007bff;
  --player-setup-secondary: #6c757d;
  --player-setup-success: #28a745;
  --player-setup-warning: #ffc107;
  --player-setup-error: #dc3545;
  --player-card-background: #ffffff;
  --player-card-border: #dee2e6;
}
```

## Accessibility

### ARIA Labels and Roles
```jsx
<div role="region" aria-label="Player Setup">
  <h2 id="setup-title">Configure Players</h2>
  <div role="form" aria-labelledby="setup-title">
    <PlayerInput
      aria-label="Player name"
      aria-describedby="name-error"
      aria-required="true"
    />
    <div id="name-error" role="alert" aria-live="polite">
      {nameError}
    </div>
  </div>
</div>
```

### Keyboard Navigation
- Tab navigation through all interactive elements
- Enter/Space for button activation
- Arrow keys for list navigation
- Escape to cancel operations

## Testing Examples

### Unit Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayerSetupContainer } from './PlayerSetupContainer';

describe('PlayerSetupContainer', () => {
  it('should add player when form is submitted', () => {
    const handleSetupComplete = jest.fn();
    
    render(
      <PlayerSetupContainer
        gameId="test-game"
        onSetupComplete={handleSetupComplete}
      />
    );
    
    const nameInput = screen.getByLabelText('Player name');
    const addButton = screen.getByText('Add Player');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.click(addButton);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
describe('Player Setup Integration', () => {
  it('should complete full player setup workflow', async () => {
    const { user } = setup(<PlayerSetupContainer gameId="test" />);
    
    // Add multiple players
    await user.type(screen.getByLabelText('Player name'), 'Player 1');
    await user.click(screen.getByText('Add Player'));
    
    await user.type(screen.getByLabelText('Player name'), 'Player 2');
    await user.click(screen.getByText('Add Player'));
    
    // Assign teams
    await user.selectOptions(
      screen.getByLabelText('Team for Player 1'),
      'team-red'
    );
    
    // Complete setup
    await user.click(screen.getByText('Start Game'));
    
    expect(mockOnSetupComplete).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'Player 1', teamId: 'team-red' }),
      expect.objectContaining({ name: 'Player 2' })
    ]);
  });
});
```