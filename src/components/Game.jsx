import React from 'react';
import { useGameFlowStore } from '../stores/gameFlowStore';

// Setup phase component
const SetupPhase = () => {
  return (
    <div className="setup-phase">
      <h2>Game Setup</h2>
      <form>
        <div className="setup-form">
          <label>Number of Players:</label>
          <select>
            <option value="3">3 Players</option>
            <option value="4">4 Players</option>
            <option value="5">5 Players</option>
          </select>
        </div>
        <div className="setup-form">
          <label>Game Variant:</label>
          <select>
            <option value="classic">Classic</option>
            <option value="deluxe">Deluxe</option>
          </select>
        </div>
        <button type="submit">Start Game</button>
      </form>
    </div>
  );
};

// Bidding phase component
const BiddingPhase = () => {
  return (
    <div className="bidding-phase">
      <h2>Bidding Phase</h2>
      <div className="bidding-interface">
        <div className="current-bid">Current Bid: 120</div>
        <div className="bid-controls">
          <button>Pass</button>
          <button>Bid</button>
        </div>
      </div>
    </div>
  );
};

// Scoring phase component
const ScoringPhase = () => {
  return (
    <div className="scoring-phase">
      <h2>Scoring Phase</h2>
      <div className="score-tracker">
        <div className="player-scores">
          <div>Player 1: 150 points</div>
          <div>Player 2: 120 points</div>
          <div>Player 3: 100 points</div>
        </div>
      </div>
    </div>
  );
};

// Results phase component
const ResultsPhase = () => {
  return (
    <div className="results-phase">
      <h2>Game Results</h2>
      <div className="final-scores">
        <div className="winner">Winner: Player 1 (150 points)</div>
        <div className="score-breakdown">
          <div>Player 1: 150 points</div>
          <div>Player 2: 120 points</div>
          <div>Player 3: 100 points</div>
        </div>
        <button>New Game</button>
      </div>
    </div>
  );
};

// Main Game component
const Game = () => {
  const { phase, isSetupComplete } = useGameFlowStore();

  // Prevent game progression if setup is not complete
  if (!isSetupComplete && phase !== 'setup') {
    return (
      <div className="game-blocked">
        <h2>Setup Required</h2>
        <p>Please complete the game setup before continuing.</p>
      </div>
    );
  }

  // Conditional rendering based on current phase
  const renderPhase = () => {
    switch (phase) {
      case 'setup':
        return <SetupPhase />;
      case 'bidding':
        return <BiddingPhase />;
      case 'scoring':
        return <ScoringPhase />;
      case 'results':
        return <ResultsPhase />;
      default:
        return (
          <div className="unknown-phase">
            <h2>Unknown Game Phase</h2>
            <p>Current phase: {phase}</p>
          </div>
        );
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Skat Game</h1>
        <div className="phase-indicator">Phase: {phase}</div>
      </div>
      <div className="game-content">
        {renderPhase()}
      </div>
    </div>
  );
};

export default Game;