import { PlayerManager } from '../../src/services/playerManager';
import { GameState } from '../../src/models/gameState';

describe('PlayerManager', () => {
  let playerManager: PlayerManager;
  let gameState: GameState;

  beforeEach(() => {
    gameState = new GameState();
    playerManager = new PlayerManager(gameState);
  });

  test('should add a player', () => {
    const player = playerManager.addPlayer('Alice');
    expect(player.getName()).toBe('Alice');
    expect(playerManager.getPlayerCount()).toBe(1);
  });

  test('should get all players in order', () => {
    playerManager.addPlayer('Charlie');
    playerManager.addPlayer('Alice');
    playerManager.addPlayer('Bob');

    const players = playerManager.getPlayers();
    expect(players[0].getName()).toBe('Alice');
    expect(players[1].getName()).toBe('Bob');
    expect(players[2].getName()).toBe('Charlie');
  });

  test('should report when a player can be added', () => {
    expect(playerManager.canAddPlayer()).toBe(true);
  });

  test('should report when player cannot be added (game started)', () => {
    playerManager.addPlayer('Alice');
    playerManager.addPlayer('Bob');
    gameState.startGame();

    expect(playerManager.canAddPlayer()).toBe(false);
  });

  test('should report when player cannot be added (limit reached)', () => {
    for (let i = 0; i < 8; i++) {
      playerManager.addPlayer(`Player${i + 1}`);
    }
    expect(playerManager.canAddPlayer()).toBe(false);
  });

  test('should return remaining player slots', () => {
    expect(playerManager.getRemainingSlots()).toBe(8);
    playerManager.addPlayer('Alice');
    expect(playerManager.getRemainingSlots()).toBe(7);
  });

  test('should return min and max players', () => {
    expect(playerManager.getMinPlayers()).toBe(2);
    expect(playerManager.getMaxPlayers()).toBe(8);
  });

  test('should report when game can be started', () => {
    expect(playerManager.canStartGame()).toBe(false);

    playerManager.addPlayer('Alice');
    expect(playerManager.canStartGame()).toBe(false);

    playerManager.addPlayer('Bob');
    expect(playerManager.canStartGame()).toBe(true);

    for (let i = 2; i < 8; i++) {
      playerManager.addPlayer(`Player${i + 1}`);
    }
    expect(playerManager.canStartGame()).toBe(true);
  });
});
