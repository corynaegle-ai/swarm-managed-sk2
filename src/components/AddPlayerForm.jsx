import React, { useState } from 'react';

const AddPlayerForm = ({ onAddPlayer, disabled = false }) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Player name cannot be empty');
      return;
    }

    if (playerName.trim().length > 20) {
      setError('Player name must be 20 characters or less');
      return;
    }

    setError('');
    onAddPlayer(playerName.trim());
    setPlayerName('');
  };

  const handleInputChange = (e) => {
    setPlayerName(e.target.value);
    if (error) setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-player-form">
      <div className="input-group">
        <input
          type="text"
          value={playerName}
          onChange={handleInputChange}
          placeholder="Enter player name"
          disabled={disabled}
          maxLength={20}
          className={error ? 'error' : ''}
        />
        <button 
          type="submit" 
          disabled={disabled || !playerName.trim()}
          className="add-btn"
        >
          {disabled ? 'Max Players' : 'Add Player'}
        </button>
      </div>
      {error && (
        <div className="error-message" style={{ color: '#dc3545', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}
      {disabled && (
        <div className="info-message" style={{ color: '#6c757d', fontSize: '0.875rem' }}>
          Maximum number of players reached
        </div>
      )}
    </form>
  );
};

export default AddPlayerForm;