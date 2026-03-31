import React, { useState } from 'react';
import AddPlayerForm from './AddPlayerForm';
import PlayerList from './PlayerList';

const PlayerSetup = () => {
  const [players, setPlayers] = useState([]);

  const addPlayer = (playerName) => {
    // Validate maximum 8 players
    if (players.length >= 8) {
      alert('Maximum 8 players allowed');
      return;
    }

    // Create player object with unique ID
    const newPlayer = {
      id: crypto.randomUUID(),
      name: playerName
    };

    setPlayers([...players, newPlayer]);
  };

  const removePlayer = (playerId) => {
    setPlayers(players.filter(player => player.id !== playerId));
  };

  const handleStartGame = () => {
    // Game start logic would go here
    console.log('Starting game with players:', players);
  };

  return (
    <div className="player-setup">
      <h2>Player Setup</h2>
      
      <AddPlayerForm onAddPlayer={addPlayer} />
      
      <PlayerList 
        players={players} 
        onRemovePlayer={removePlayer} 
      />
      
      <button 
        onClick={handleStartGame}
        disabled={players.length < 2}
        className="start-game-btn"
      >
        Start Game
      </button>
    </div>
  );
};

export default PlayerSetup;