import React, { useEffect } from 'react';
import { useGameFlowStore } from '../store/gameFlowStore';
import GameSetup from './GameSetup';
import GamePlay from './GamePlay';
import './Game.css';

const Game = () => {
  const { 
    phase, 
    scores, 
    settings, 
    gameState,
    resetGame 
  } = useGameFlowStore();

  // Cleanup function for component unmounting
  useEffect(() => {
    return () => {
      // Clean up any subscriptions or timers if needed
      // This ensures proper component cleanup
    };
  }, []);

  const handleNewGame = () => {
    resetGame();
  };

  const renderPhase = () => {
    switch (phase) {
      case 'setup':
        return <GameSetup />;
      
      case 'playing':
        return <GamePlay />;
      
      case 'results':
        return (
          <div className="results-container">
            <div className="results-header">
              <h2>Game Results</h2>
            </div>
            
            <div className="final-scores">
              <h3>Final Scores</h3>
              {Object.entries(scores).map(([playerId, score]) => (
                <div key={playerId} className="score-item">
                  <span className="player-name">
                    {gameState.players?.find(p => p.id === playerId)?.name || `Player ${playerId}`}
                  </span>
                  <span className="player-score">{score}</span>
                </div>
              ))}
            </div>
            
            <div className="game-summary">
              <h3>Game Summary</h3>
              <div className="summary-stats">
                <p>Players: {Object.keys(scores).length}</p>
                <p>Duration: {settings.gameDuration || 'N/A'}</p>
                <p>Mode: {settings.gameMode || 'Standard'}</p>
              </div>
            </div>
            
            <div className="results-actions">
              <button 
                className="new-game-button primary-button"
                onClick={handleNewGame}
                type="button"
              >
                New Game
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="error-state">
            <p>Unknown game phase: {phase}</p>
            <button onClick={handleNewGame} className="reset-button">
              Reset Game
            </button>
          </div>
        );
    }
  };

  return (
    <div className="game-container">
      <div className="game-content">
        {renderPhase()}
      </div>
    </div>
  );
};

export default Game;