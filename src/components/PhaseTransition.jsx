import React from 'react';
import { useGameFlowStore } from '../stores/gameFlowStore';

const PhaseTransition = () => {
  const { 
    currentPhase, 
    isTransitioning,
    startGame,
    endGame,
    nextPhase,
    resetGame 
  } = useGameFlowStore();

  const renderTransitionButtons = () => {
    switch (currentPhase) {
      case 'waiting':
        return (
          <button
            onClick={startGame}
            disabled={isTransitioning}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isTransitioning ? 'Starting...' : 'Start Game'}
          </button>
        );
      
      case 'playing':
        return (
          <div className="space-x-2">
            <button
              onClick={nextPhase}
              disabled={isTransitioning}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isTransitioning ? 'Transitioning...' : 'Next Phase'}
            </button>
            <button
              onClick={endGame}
              disabled={isTransitioning}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              {isTransitioning ? 'Ending...' : 'End Game'}
            </button>
          </div>
        );
      
      case 'paused':
        return (
          <div className="space-x-2">
            <button
              onClick={nextPhase}
              disabled={isTransitioning}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isTransitioning ? 'Resuming...' : 'Resume Game'}
            </button>
            <button
              onClick={endGame}
              disabled={isTransitioning}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              {isTransitioning ? 'Ending...' : 'End Game'}
            </button>
          </div>
        );
      
      case 'finished':
        return (
          <button
            onClick={resetGame}
            disabled={isTransitioning}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {isTransitioning ? 'Resetting...' : 'Play Again'}
          </button>
        );
      
      default:
        return null;
    }
  };

  // Only render if we have a valid phase and transitions are available
  if (!currentPhase || currentPhase === 'idle') {
    return null;
  }

  return (
    <div className="phase-transition-container p-4">
      <div className="flex justify-center items-center">
        {renderTransitionButtons()}
      </div>
    </div>
  );
};

export default PhaseTransition;