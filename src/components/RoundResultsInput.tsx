import React, { useState } from 'react';
import { Player } from '../types/Player';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface PlayerResult {
  playerId: string;
  playerName: string;
  bid: number;
  tricksWon: number;
  bonusPoints: number;
  roundScore: number;
}

interface RoundResultsInputProps {
  round: number;
  players: Player[];
  bids: Record<string, number>;
  onSubmit: (results: PlayerResult[]) => void;
}

export const RoundResultsInput: React.FC<RoundResultsInputProps> = ({
  round,
  players,
  bids,
  onSubmit,
}) => {
  const [results, setResults] = useState<Record<string, { tricksWon: string; bonusPoints: string }>>(
    players.reduce((acc, player) => {
      acc[player.id] = { tricksWon: '', bonusPoints: '0' };
      return acc;
    }, {} as Record<string, { tricksWon: string; bonusPoints: string }>)
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateRoundScore = (bid: number, tricksWon: number, bonusPoints: number): number => {
    // Base score: 10 points per trick won
    const baseScore = tricksWon * 10;
    
    // Bonus only applies if bid was met exactly
    const bonus = bid === tricksWon ? bonusPoints : 0;
    
    return baseScore + bonus;
  };

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};

    players.forEach((player) => {
      const { tricksWon, bonusPoints } = results[player.id];

      // Validate tricks won
      if (tricksWon === '') {
        newErrors[`${player.id}-tricks`] = 'Tricks won is required';
      } else {
        const tricksNum = parseInt(tricksWon, 10);
        if (isNaN(tricksNum) || tricksNum < 0 || tricksNum > round) {
          newErrors[`${player.id}-tricks`] = `Tricks must be between 0 and ${round}`;
        }
      }

      // Validate bonus points
      if (bonusPoints === '') {
        newErrors[`${player.id}-bonus`] = 'Bonus points is required';
      } else {
        const bonusNum = parseInt(bonusPoints, 10);
        if (isNaN(bonusNum) || bonusNum < 0) {
          newErrors[`${player.id}-bonus`] = 'Bonus points must be a non-negative number';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (playerId: string, field: 'tricksWon' | 'bonusPoints', value: string) => {
    setResults((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: value,
      },
    }));
    // Clear error for this field when user starts typing
    if (errors[`${playerId}-${field === 'tricksWon' ? 'tricks' : 'bonus'}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`${playerId}-${field === 'tricksWon' ? 'tricks' : 'bonus'}`];
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    if (!validateInputs()) {
      return;
    }

    const playerResults: PlayerResult[] = players.map((player) => {
      const bid = bids[player.id];
      const tricksWon = parseInt(results[player.id].tricksWon, 10);
      const bonusPoints = parseInt(results[player.id].bonusPoints, 10);
      const roundScore = calculateRoundScore(bid, tricksWon, bonusPoints);

      return {
        playerId: player.id,
        playerName: player.name,
        bid,
        tricksWon,
        bonusPoints,
        roundScore,
      };
    });

    onSubmit(playerResults);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Round {round} Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Player Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="text-left p-3 font-semibold">Player</th>
                  <th className="text-center p-3 font-semibold">Bid</th>
                  <th className="text-center p-3 font-semibold">Tricks Won</th>
                  <th className="text-center p-3 font-semibold">Bonus Points</th>
                  <th className="text-center p-3 font-semibold">Round Score</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => {
                  const bid = bids[player.id];
                  const tricksWonStr = results[player.id].tricksWon;
                  const bonusPointsStr = results[player.id].bonusPoints;
                  const tricksWon = tricksWonStr ? parseInt(tricksWonStr, 10) : 0;
                  const bonusPoints = bonusPointsStr ? parseInt(bonusPointsStr, 10) : 0;
                  const roundScore = tricksWonStr ? calculateRoundScore(bid, tricksWon, bonusPoints) : 0;

                  return (
                    <tr key={player.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 font-medium">{player.name}</td>
                      <td className="p-3 text-center text-lg font-semibold">{bid}</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          max={round}
                          value={results[player.id].tricksWon}
                          onChange={(e) => handleInputChange(player.id, 'tricksWon', e.target.value)}
                          placeholder="0"
                          className={`text-center ${errors[`${player.id}-tricks`] ? 'border-red-500' : ''}`}
                        />
                        {errors[`${player.id}-tricks`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`${player.id}-tricks`]}</p>
                        )}
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          value={results[player.id].bonusPoints}
                          onChange={(e) => handleInputChange(player.id, 'bonusPoints', e.target.value)}
                          placeholder="0"
                          className={`text-center ${errors[`${player.id}-bonus`] ? 'border-red-500' : ''}`}
                        />
                        {errors[`${player.id}-bonus`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`${player.id}-bonus`]}</p>
                        )}
                      </td>
                      <td className="p-3 text-center text-lg font-bold text-blue-600">
                        {roundScore}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bonus Calculation Note */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Bonus points are only added to the score if the player's bid equals the tricks won exactly.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
              Submit Results
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
