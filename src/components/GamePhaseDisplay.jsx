import React from 'react';
import { useGameFlowStore } from '../stores/gameFlowStore';

const GamePhaseDisplay = () => {
  const { currentPhase, currentRound, isLoading } = useGameFlowStore();

  if (isLoading) {
    return (
      <div className="game-phase-display loading">
        <div className="phase-info">
          <span className="loading-text">Loading game phase...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="game-phase-display">
      <div className="phase-info">
        <h2 className="phase-name">{currentPhase}</h2>
        <div className="round-info">
          <span className="round-text">Round {currentRound} of 10</span>
        </div>
      </div>
    </div>
  );
};

export default GamePhaseDisplay;