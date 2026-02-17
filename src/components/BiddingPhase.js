import React, { useState, useEffect } from 'react';
import './BiddingPhase.css';

const BiddingPhase = ({ players = [], round = 1, onBidsSubmit }) => {
  const [bids, setBids] = useState({});

  // Initialize bids state when players change
  useEffect(() => {
    const initialBids = {};
    players.forEach(player => {
      initialBids[player.id] = '';
    });
    setBids(initialBids);
  }, [players]);

  const handleBidChange = (playerId, value) => {
    setBids(prevBids => ({
      ...prevBids,
      [playerId]: value
    }));
  };

  const handleSubmit = () => {
    if (onBidsSubmit) {
      onBidsSubmit(bids);
    }
  };

  return (
    <div className="bidding-phase">
      <h2>Bidding Phase - Round {round}</h2>
      
      <div className="bid-inputs">
        {players.map(player => (
          <div key={player.id} className="player-bid-input">
            <label htmlFor={`bid-${player.id}`} className="player-name">
              {player.name}
            </label>
            <input
              id={`bid-${player.id}`}
              type="number"
              placeholder="Enter bid"
              value={bids[player.id] || ''}
              onChange={(e) => handleBidChange(player.id, e.target.value)}
              min="0"
              className="bid-input"
            />
          </div>
        ))}
      </div>
      
      {players.length > 0 && (
        <button 
          onClick={handleSubmit} 
          className="submit-bids-btn"
          disabled={Object.values(bids).some(bid => bid === '')}
        >
          Submit Bids
        </button>
      )}
    </div>
  );
};

export default BiddingPhase;