import React, { useState, useEffect } from 'react';
import AddPlayerForm from './AddPlayerForm';
import { validatePlayerCount } from '../utils/playerValidation';

const PlayerSetup = ({ onStartGame }) => {
  const [players, setPlayers] = useState([]);
  const [validationMessage, setValidationMessage] = useState('');
  const [isValidCount, setIsValidCount] = useState(false);

  // Validate player count whenever players array changes
  useEffect(() => {
    const validation = validatePlayerCount(players.length);
    setValidationMessage(validation.message);
    setIsValidCount(validation.isValid);
  }, [players]);

  const handleAddPlayer = (playerName) => {
    if (playerName.trim() && !players.includes(playerName.trim())) {
      setPlayers(prev => [...prev, playerName.trim()]);
    }
  };

  const handleRemovePlayer = (playerToRemove) => {
    setPlayers(prev => prev.filter(player => player !== playerToRemove));
  };

  const handleStartGame = () => {
    if (isValidCount && onStartGame) {
      onStartGame(players);
    }
  };

  const getValidationMessageStyle = () => {
    if (!validationMessage) return {};
    
    if (players.length < 2) {
      return { color: '#dc3545', fontWeight: 'bold' }; // Red for errors
    } else if (players.length >= 7) {
      return { color: '#ffc107', fontWeight: 'bold' }; // Yellow for warnings
    }
    return { color: '#28a745' }; // Green for valid
  };

  return (
    <div className="player-setup">
      <h2>Player Setup</h2>
      
      <AddPlayerForm 
        onAddPlayer={handleAddPlayer}
        disabled={players.length >= 8}
      />
      
      <div className="players-list">
        <h3>Players ({players.length}/8):</h3>
        {players.length === 0 ? (
          <p>No players added yet</p>
        ) : (
          <ul>
            {players.map((player, index) => (
              <li key={index}>
                {player}
                <button 
                  onClick={() => handleRemovePlayer(player)}
                  className="remove-btn"
                  aria-label={`Remove ${player}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {validationMessage && (
        <div 
          className="validation-message"
          style={getValidationMessageStyle()}
          role="alert"
        >
          {validationMessage}
        </div>
      )}
      
      <button 
        onClick={handleStartGame}
        disabled={!isValidCount}
        className={`start-game-btn ${!isValidCount ? 'disabled' : ''}`}
      >
        Start Game
      </button>
    </div>
  );
};

export default PlayerSetup;