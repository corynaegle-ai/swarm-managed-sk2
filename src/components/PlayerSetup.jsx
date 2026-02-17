import React, { useState, useEffect } from 'react';
import AddPlayerForm from './AddPlayerForm';
import { MAX_PLAYERS } from '../utils/playerValidation';

const PlayerSetup = ({ onPlayersChange, initialPlayers = [] }) => {
  const [players, setPlayers] = useState(initialPlayers);
  const [loadingStates, setLoadingStates] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (onPlayersChange) {
      onPlayersChange(players);
    }
  }, [players, onPlayersChange]);

  const handleAddPlayer = async (name) => {
    setError('');
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const newPlayer = {
        id: Date.now() + Math.random(),
        name: name.trim(),
        score: 0
      };
      
      setPlayers(prev => [...prev, newPlayer]);
    } catch (error) {
      console.error('Failed to add player:', error);
      throw new Error('Failed to add player. Please try again.');
    }
  };

  const handleRemovePlayer = async (playerId) => {
    if (loadingStates[playerId]) return;
    
    setError('');
    setLoadingStates(prev => ({ ...prev, [playerId]: true }));
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setPlayers(prev => prev.filter(player => player.id !== playerId));
    } catch (error) {
      console.error('Failed to remove player:', error);
      setError('Failed to remove player. Please try again.');
    } finally {
      setLoadingStates(prev => {
        const newState = { ...prev };
        delete newState[playerId];
        return newState;
      });
    }
  };

  const clearAllPlayers = async () => {
    if (players.length === 0) return;
    
    setError('');
    setLoadingStates(prev => ({ ...prev, clearAll: true }));
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setPlayers([]);
    } catch (error) {
      console.error('Failed to clear players:', error);
      setError('Failed to clear players. Please try again.');
    } finally {
      setLoadingStates(prev => {
        const newState = { ...prev };
        delete newState.clearAll;
        return newState;
      });
    }
  };

  const isAtMaxCapacity = players.length >= MAX_PLAYERS;
  const hasPlayers = players.length > 0;
  const isClearingAll = loadingStates.clearAll;

  return (
    <div className="player-setup">
      <div className="header">
        <h2>Player Setup</h2>
        <div className="player-count">
          {players.length} / {MAX_PLAYERS} players
        </div>
      </div>

      {error && (
        <div 
          className="error-message"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      {!isAtMaxCapacity && (
        <AddPlayerForm 
          players={players} 
          onAddPlayer={handleAddPlayer}
        />
      )}

      {isAtMaxCapacity && (
        <div 
          className="max-players-notice"
          role="status"
          aria-live="polite"
        >
          Maximum number of players reached ({MAX_PLAYERS})
        </div>
      )}

      {hasPlayers ? (
        <div className="players-section">
          <div className="section-header">
            <h3>Current Players</h3>
            <button
              onClick={clearAllPlayers}
              disabled={isClearingAll}
              className="clear-all-button"
              aria-describedby={isClearingAll ? 'clear-all-status' : undefined}
            >
              {isClearingAll ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  Clearing...
                </>
              ) : (
                'Clear All'
              )}
            </button>
            
            {isClearingAll && (
              <span 
                id="clear-all-status"
                className="sr-only"
                aria-live="polite"
              >
                Removing all players, please wait...
              </span>
            )}
          </div>

          <ul className="players-list" role="list">
            {players.map((player, index) => {
              const isRemoving = loadingStates[player.id];
              return (
                <li 
                  key={player.id} 
                  className={`player-item ${isRemoving ? 'removing' : ''}`}
                  role="listitem"
                >
                  <div className="player-info">
                    <span className="player-number">#{index + 1}</span>
                    <span className="player-name">{player.name}</span>
                  </div>
                  
                  <button
                    onClick={() => handleRemovePlayer(player.id)}
                    disabled={isRemoving}
                    className="remove-button"
                    aria-label={`Remove ${player.name}`}
                    aria-describedby={isRemoving ? `removing-${player.id}` : undefined}
                  >
                    {isRemoving ? (
                      <>
                        <span className="spinner" aria-hidden="true"></span>
                        <span className="sr-only">Removing...</span>
                      </>
                    ) : (
                      '×'
                    )}
                  </button>
                  
                  {isRemoving && (
                    <span 
                      id={`removing-${player.id}`}
                      className="sr-only"
                      aria-live="polite"
                    >
                      Removing {player.name}, please wait...
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div 
          className="empty-state"
          role="status"
          aria-live="polite"
        >
          <p>No players added yet.</p>
          <p>Add players above to get started!</p>
        </div>
      )}

      <style jsx>{`
        .player-setup {
          max-width: 600px;
          margin: 0 auto;
          padding: 1rem;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #eee;
        }
        
        .header h2 {
          margin: 0;
          color: #333;
        }
        
        .player-count {
          background-color: #f8f9fa;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: bold;
          color: #495057;
        }
        
        .error-message {
          color: #dc3545;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          padding: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .max-players-notice {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: bold;
        }
        
        .players-section {
          margin-top: 2rem;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .section-header h3 {
          margin: 0;
          color: #333;
        }
        
        .clear-all-button {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          min-height: 2rem;
        }
        
        .clear-all-button:hover:not(:disabled) {
          background-color: #c82333;
        }
        
        .clear-all-button:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }
        
        .players-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .player-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
          background-color: #f8f9fa;
          border: 2px solid #dee2e6;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .player-item:hover {
          background-color: #e9ecef;
          transform: translateY(-1px);
        }
        
        .player-item.removing {
          opacity: 0.7;
          background-color: #f8d7da;
          border-color: #f5c6cb;
        }
        
        .player-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .player-number {
          background-color: #007bff;
          color: white;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.875rem;
        }
        
        .player-name {
          font-weight: 500;
          font-size: 1.1rem;
        }
        
        .remove-button {
          background-color: #dc3545;
          color: white;
          border: none;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .remove-button:hover:not(:disabled) {
          background-color: #c82333;
          transform: scale(1.1);
        }
        
        .remove-button:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
          transform: none;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #6c757d;
        }
        
        .empty-state p {
          margin: 0.5rem 0;
        }
        
        .spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .player-item {
            padding: 0.5rem;
          }
          
          .player-info {
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PlayerSetup;