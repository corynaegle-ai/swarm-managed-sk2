import { Player } from '../../src/models/player';

describe('Player', () => {
  test('should create a player with ID and name', () => {
    const player = new Player(1, 'Alice');
    expect(player.getId()).toBe(1);
    expect(player.getName()).toBe('Alice');
  });

  test('should have initial score of 0', () => {
    const player = new Player(1, 'Alice');
    expect(player.getScore()).toBe(0);
  });

  test('should set score', () => {
    const player = new Player(1, 'Alice');
    player.setScore(10);
    expect(player.getScore()).toBe(10);
  });

  test('should add score', () => {
    const player = new Player(1, 'Alice');
    player.addScore(5);
    player.addScore(3);
    expect(player.getScore()).toBe(8);
  });

  test('should trim whitespace from name', () => {
    const player = new Player(1, '  Alice  ');
    expect(player.getName()).toBe('Alice');
  });

  test('should reject invalid player ID', () => {
    expect(() => new Player(-1, 'Alice')).toThrow('Player ID must be non-negative');
  });

  test('should reject empty name', () => {
    expect(() => new Player(1, '')).toThrow('Player name cannot be empty');
  });

  test('should reject whitespace-only name', () => {
    expect(() => new Player(1, '   ')).toThrow('Player name cannot be empty');
  });

  test('should reject negative score', () => {
    const player = new Player(1, 'Alice');
    expect(() => player.setScore(-1)).toThrow('Score must be a non-negative number');
  });

  test('should reject non-numeric score', () => {
    const player = new Player(1, 'Alice');
    expect(() => player.setScore(NaN)).toThrow('Score must be a non-negative number');
  });

  test('should reject negative score addition', () => {
    const player = new Player(1, 'Alice');
    expect(() => player.addScore(-5)).toThrow('Points must be a non-negative number');
  });
});
