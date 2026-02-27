import { GameState } from '../../src/models/gameState';
import { Player } from '../../src/models/player';

describe('GameState', () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  describe('Adding Players', () => {
    test('should add a single player with a name', () => {
      const player = gameState.addPlayer('Alice');
      expect(player).toBeInstanceOf(Player);
      expect(player.getName()).toBe('Alice');
      expect(gameState.getPlayerCount()).toBe(1);
    });

    test('should add multiple players', () => {
      gameState.addPlayer('Alice');
      gameState.addPlayer('Bob');
      gameState.addPlayer('Charlie');
      expect(gameState.getPlayerCount()).toBe(3);
    });

    test('should assign unique IDs to players', () => {
      const player1 = gameState.addPlayer('Alice');
      const player2 = gameState.addPlayer('Bob');
      const player3 = gameState.addPlayer('Charlie');

      expect(player1.getId()).not.toBe(player2.getId());
      expect(player2.getId()).not.toBe(player3.getId());
      expect(player1.getId()).not.toBe(player3.getId());
    });

    test('should trim player names', () => {
      const player = gameState.addPlayer('  Alice  ');
      expect(player.getName()).toBe('Alice');
    });
  });

  describe('Player Limit Enforcement', () => {
    test('should enforce minimum 2 players', () => {
      expect(() => gameState.startGame()).toThrow('At least 2 players are required');
    });

    test('should allow exactly 2 players', () => {
      gameState.addPlayer('Alice');
      gameState.addPlayer('Bob');
      expect(() => gameState.startGame()).not.toThrow();
    });

    test('should allow up to 8 players', () => {
      for (let i = 0; i < 8; i++) {
        gameState.addPlayer(`Player${i + 1}`);
      }
      expect(gameState.getPlayerCount()).toBe(8);
      expect(() => gameState.startGame()).not.toThrow();
    });

    test('should reject more than 8 players', () => {
      for (let i = 0; i < 8; i++) {
        gameState.addPlayer(`Player${i + 1}`);
      }
      expect(() => gameState.addPlayer('Player9')).toThrow('Maximum 8 players allowed');
    });

    test('should indicate when more players can be added', () => {
      gameState.addPlayer('Alice');
      expect(gameState.canAddMorePlayers()).toBe(true);

      for (let i = 1; i < 8; i++) {
        gameState.addPlayer(`Player${i + 1}`);
      }
      expect(gameState.canAddMorePlayers()).toBe(false);
    });

    test('should return correct remaining player slots', () => {
      expect(gameState.getRemainingPlayerSlots()).toBe(8);
      gameState.addPlayer('Alice');
      expect(gameState.getRemainingPlayerSlots()).toBe(7);
      gameState.addPlayer('Bob');
      expect(gameState.getRemainingPlayerSlots()).toBe(6);
    });
  });

  describe('Game State Checks', () => {
    test('should prevent adding players after game starts', () => {
      gameState.addPlayer('Alice');
      gameState.addPlayer('Bob');
      gameState.startGame();

      expect(() => gameState.addPlayer('Charlie')).toThrow('Cannot add players after the game has started');
    });

    test('should track game phase correctly', () => {
      expect(gameState.isGameStarted()).toBe(false);
      gameState.addPlayer('Alice');
      gameState.addPlayer('Bob');
      gameState.startGame();
      expect(gameState.isGameStarted()).toBe(true);
      expect(gameState.getPhase()).toBe('playing');
    });

    test('should support ending the game', () => {
      gameState.addPlayer('Alice');
      gameState.addPlayer('Bob');
      gameState.startGame();
      gameState.endGame();
      expect(gameState.getPhase()).toBe('finished');
    });
  });

  describe('Player Display Order', () => {
    test('should return players in consistent order by ID', () => {
      const player3 = gameState.addPlayer('Charlie');
      const player1 = gameState.addPlayer('Alice');
      const player2 = gameState.addPlayer('Bob');

      const players = gameState.getPlayers();
      expect(players[0].getName()).toBe('Alice');
      expect(players[1].getName()).toBe('Bob');
      expect(players[2].getName()).toBe('Charlie');
    });

    test('should maintain order throughout game', () => {
      gameState.addPlayer('Charlie');
      gameState.addPlayer('Alice');
      gameState.addPlayer('Bob');

      const playersBefore = gameState.getPlayers().map(p => p.getName());
      gameState.startGame();
      const playersAfter = gameState.getPlayers().map(p => p.getName());

      expect(playersAfter).toEqual(playersBefore);
    });
  });

  describe('Player Retrieval', () => {
    test('should retrieve player by ID', () => {
      const player1 = gameState.addPlayer('Alice');
      const player2 = gameState.addPlayer('Bob');

      const retrieved = gameState.getPlayerById(player1.getId());
      expect(retrieved).toEqual(player1);
    });

    test('should return undefined for non-existent player ID', () => {
      gameState.addPlayer('Alice');
      const retrieved = gameState.getPlayerById(999);
      expect(retrieved).toBeUndefined();
    });
  });

  describe('Validation', () => {
    test('should reject empty player names', () => {
      expect(() => gameState.addPlayer('')).toThrow('Player name must be a non-empty string');
    });

    test('should reject whitespace-only player names', () => {
      expect(() => gameState.addPlayer('   ')).toThrow('Player name cannot be empty or whitespace only');
    });

    test('should reject names exceeding 50 characters', () => {
      const longName = 'a'.repeat(51);
      expect(() => gameState.addPlayer(longName)).toThrow('Player name must be 50 characters or less');
    });

    test('should allow names up to 50 characters', () => {
      const maxName = 'a'.repeat(50);
      expect(() => gameState.addPlayer(maxName)).not.toThrow();
    });
  });

  describe('Reset', () => {
    test('should reset game state for new game', () => {
      gameState.addPlayer('Alice');
      gameState.addPlayer('Bob');
      gameState.startGame();

      gameState.reset();

      expect(gameState.getPlayerCount()).toBe(0);
      expect(gameState.isGameStarted()).toBe(false);
      expect(gameState.getPhase()).toBe('setup');
    });
  });
});
