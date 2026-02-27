import { useState } from 'react';
import { Player } from '../types/Player';

export interface RoundResult {
  playerId: string;
  playerName: string;
  bid: number;
  tricksWon: number;
  bonusPoints: number;
  roundScore: number;
}

export const useRoundResults = (players: Player[]) => {
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);

  const processRoundResults = (results: RoundResult[]) => {
    // Validate that all players have results
    if (results.length !== players.length) {
      throw new Error('All players must have results submitted');
    }

    // Update player scores
    const updatedPlayers = players.map((player) => {
      const playerResult = results.find((r) => r.playerId === player.id);
      if (!playerResult) {
        throw new Error(`No result found for player ${player.name}`);
      }

      return {
        ...player,
        scores: [...player.scores, playerResult.roundScore],
      };
    });

    setRoundResults(results);
    return updatedPlayers;
  };

  const calculateTotalScores = (players: Player[]): Record<string, number> => {
    const totals: Record<string, number> = {};
    players.forEach((player) => {
      totals[player.id] = player.scores.reduce((sum, score) => sum + score, 0);
    });
    return totals;
  };

  return {
    roundResults,
    processRoundResults,
    calculateTotalScores,
  };
};
