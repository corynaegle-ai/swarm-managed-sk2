export class Player {
  private readonly id: number;
  private readonly name: string;
  private score: number = 0;

  constructor(id: number, name: string) {
    if (id < 0) {
      throw new Error('Player ID must be non-negative');
    }
    if (!name || name.trim().length === 0) {
      throw new Error('Player name cannot be empty');
    }
    this.id = id;
    this.name = name.trim();
  }

  /**
   * Get the player's unique ID
   */
  getId(): number {
    return this.id;
  }

  /**
   * Get the player's name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get the player's current score
   */
  getScore(): number {
    return this.score;
  }

  /**
   * Set the player's score
   */
  setScore(score: number): void {
    if (typeof score !== 'number' || score < 0) {
      throw new Error('Score must be a non-negative number');
    }
    this.score = score;
  }

  /**
   * Add points to the player's score
   */
  addScore(points: number): void {
    if (typeof points !== 'number' || points < 0) {
      throw new Error('Points must be a non-negative number');
    }
    this.score += points;
  }
}
