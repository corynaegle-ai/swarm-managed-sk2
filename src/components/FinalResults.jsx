import React, { useState } from 'react';
import { useGameFlowStore } from '../stores/gameFlowStore';

const FinalResults = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { gamePhase, gameResults, resetGame } = useGameFlowStore();

  // Only render when game is in final phase
  if (gamePhase !== 'final' && gamePhase !== 'complete') {
    return null;
  }

  const handleStartNewGame = async () => {
    setIsLoading(true);
    try {
      await resetGame();
    } catch (error) {
      console.error('Error starting new game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="final-results">
      <div className="final-results__header">
        <h2>Game Complete!</h2>
      </div>
      
      <div className="final-results__summary">
        {gameResults ? (
          <div className="game-summary">
            <h3>Game Summary</h3>
            <div className="summary-stats">
              {gameResults.score && (
                <div className="stat-item">
                  <span className="label">Final Score:</span>
                  <span className="value">{gameResults.score}</span>
                </div>
              )}
              {gameResults.duration && (
                <div className="stat-item">
                  <span className="label">Duration:</span>
                  <span className="value">{gameResults.duration}</span>
                </div>
              )}
              {gameResults.level && (
                <div className="stat-item">
                  <span className="label">Level Reached:</span>
                  <span className="value">{gameResults.level}</span>
                </div>
              )}
              {gameResults.achievements && gameResults.achievements.length > 0 && (
                <div className="stat-item">
                  <span className="label">Achievements:</span>
                  <ul className="achievements-list">
                    {gameResults.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="no-results">
            <p>No game results available</p>
          </div>
        )}
      </div>

      <div className="final-results__actions">
        <button 
          onClick={handleStartNewGame}
          disabled={isLoading}
          className="start-new-game-btn"
          type="button"
        >
          {isLoading ? 'Starting New Game...' : 'Start New Game'}
        </button>
      </div>
    </div>
  );
};

export default FinalResults;