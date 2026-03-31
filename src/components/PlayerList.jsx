import React from 'react';

const PlayerList = ({ players, onRemovePlayer }) => {
  if (players.length === 0) {
    return (
      <div className="player-list empty">
        <p>No players added yet. Add players to start the game.</p>
      </div>
    );
  }

  return (
    <div className="player-list">
      <h3>Players ({players.length}/8)</h3>
      <ul className="players">
        {players.map((player) => (
          <li key={player.id} className="player-item">
            <span className="player-name">{player.name}</span>
            <button 
              onClick={() => onRemovePlayer(player.id)}
              className="remove-player-btn"
              aria-label={`Remove ${player.name}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;