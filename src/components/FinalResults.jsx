import React, { useState } from 'react';
import { useGameFlowStore } from '../stores/gameFlowStore';

const FinalResults = () => {
  const { 
    gamePhase, 
    gameResults, 
    restartGame,
    isLoading 
  } = useGameFlowStore();
  
  const [isRestarting, setIsRestarting] = useState(false);

  // Only render when game is in final phase
  if (gamePhase !== 'final' && gamePhase !== 'complete') {
    return null;
  }

  const handleStartNewGame = async () => {
    try {
      setIsRestarting(true);
      await restartGame();
    } catch (error) {
      console.error('Error restarting game:', error);
    } finally {
      setIsRestarting(false);
    }
  };

  const showLoading = isLoading || isRestarting;

  return (
    <div className="final-results">
      <div className="final-results__header">
        <h2>Game Complete!</h2>
      </div>
      
      <div className="final-results__summary">
        <h3>Game Summary</h3>
        {gameResults ? (
          <div className="game-summary">
            <div className="summary-item">
              <span className="label">Final Score:</span>
              <span className="value">{gameResults.score || 0}</span>
            </div>
            {gameResults.duration && (
              <div className="summary-item">
                <span className="label">Duration:</span>
                <span className="value">{gameResults.duration}</span>
              </div>
            )}
            {gameResults.moves && (
              <div className="summary-item">
                <span className="label">Total Moves:</span>
                <span className="value">{gameResults.moves}</span>
              </div>
            )}
            {gameResults.winner && (
              <div className="summary-item">
                <span className="label">Winner:</span>
                <span className="value">{gameResults.winner}</span>
              </div>
            )}
            {gameResults.performance && (
              <div className="summary-item">
                <span className="label">Performance:</span>
                <span className="value">{gameResults.performance}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="no-results">
            <p>No game results available</p>
          </div>
        )}
      </div>

      <div className="final-results__actions">
        <button 
          className="btn btn-primary start-new-game-btn"
          onClick={handleStartNewGame}
          disabled={showLoading}
        >
          {showLoading ? (
            <>
              <span className="loading-spinner"></span>
              Starting New Game...
            </>
          ) : (
            'Start New Game'
          )}
        </button>
      </div>

      {showLoading && (
        <div className="loading-overlay">
          <div className="loading-message">
            Initializing new game...
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalResults;