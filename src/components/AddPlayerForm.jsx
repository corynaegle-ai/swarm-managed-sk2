import React, { useState } from 'react';

const AddPlayerForm = ({ onAddPlayer }) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      alert('Please enter a player name');
      return;
    }

    onAddPlayer(playerName.trim());
    setPlayerName('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-player-form">
      <div className="form-group">
        <label htmlFor="playerName">Player Name:</label>
        <input
          type="text"
          id="playerName"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter player name"
          maxLength={50}
        />
      </div>
      <button type="submit" className="add-player-btn">
        Add Player
      </button>
    </form>
  );
};

export default AddPlayerForm;