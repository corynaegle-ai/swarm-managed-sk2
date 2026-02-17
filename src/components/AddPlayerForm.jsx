import React, { useState } from 'react';

const AddPlayerForm = ({ onAddPlayer }) => {
  const [playerName, setPlayerName] = useState('');

  const handleInputChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate non-empty name
    const trimmedName = playerName.trim();
    if (!trimmedName) {
      return;
    }
    
    // Call parent callback with player name
    onAddPlayer(trimmedName);
    
    // Clear input field after successful submission
    setPlayerName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={playerName}
        onChange={handleInputChange}
        placeholder="Enter player name"
      />
      <button type="submit">Add Player</button>
    </form>
  );
};

export default AddPlayerForm;