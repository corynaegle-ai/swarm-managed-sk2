import React, { useState } from 'react';
import { sanitizePlayerName, validatePlayerName, checkDuplicateName } from '../utils/playerValidation';

const AddPlayerForm = ({ onAddPlayer, players = [] }) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPlayerName(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Sanitize input first
    const sanitizedName = sanitizePlayerName(playerName);
    
    // Validate player name
    const nameError = validatePlayerName(sanitizedName);
    if (nameError) {
      setError(nameError);
      return;
    }
    
    // Check for duplicate names
    const duplicateError = checkDuplicateName(sanitizedName, players);
    if (duplicateError) {
      setError(duplicateError);
      return;
    }
    
    // If all validation passes, add the player
    onAddPlayer(sanitizedName);
    setPlayerName('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-player-form">
      <div className="form-group">
        <input
          type="text"
          value={playerName}
          onChange={handleInputChange}
          placeholder="Enter player name"
          className="player-name-input"
        />
        <button 
          type="submit" 
          disabled={!playerName.trim() || !!error}
          className="add-player-button"
        >
          Add Player
        </button>
      </div>
      {error && (
        <div className="error-message" style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
          {error}
        </div>
      )}
    </form>
  );
};

export default AddPlayerForm;