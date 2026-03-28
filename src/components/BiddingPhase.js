import React, { useState } from 'react';
import './BiddingPhase.css';

const BiddingPhase = ({ players, onBidsSubmit, currentRound = 1 }) => {
  const [bids, setBids] = useState({});
  const [errors, setErrors] = useState({});

  const handleBidChange = (playerId, value) => {
    const numericValue = value === '' ? '' : Number(value);
    setBids(prev => ({ ...prev, [playerId]: numericValue }));
    
    // Clear error when user starts typing
    if (errors[playerId]) {
      setErrors(prev => ({ ...prev, [playerId]: null }));
    }
  };

  const isFormValid = () => {
    if (!players || players.length === 0) return false;
    
    for (const player of players) {
      const bid = bids[player.id];
      if (bid === undefined || bid === null || bid === '' || isNaN(bid) || bid < 0) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid() && onBidsSubmit) {
      onBidsSubmit(bids);
    }
  };

  if (!players || players.length === 0) {
    return <div className="bidding-phase-container">No players available</div>;
  }

  return (
    <div className="bidding-phase-container">
      <h2 className="round-display">Round {currentRound} - Place Your Bids</h2>
      <form onSubmit={handleSubmit} className="bidding-form">
        {players.map(player => (
          <div key={player.id} className="bid-input-group">
            <label className="bid-label" htmlFor={`bid-${player.id}`}>
              {player.name}:
            </label>
            <input
              id={`bid-${player.id}`}
              type="number"
              min="0"
              step="1"
              value={bids[player.id] || ''}
              onChange={(e) => handleBidChange(player.id, e.target.value)}
              className={`bid-input ${errors[player.id] ? 'error' : ''}`}
              placeholder="Enter bid"
            />
            {errors[player.id] && (
              <span className="error-message">{errors[player.id]}</span>
            )}
          </div>
        ))}
        <button 
          type="submit" 
          className="submit-button"
          disabled={!isFormValid()}
        >
          Submit Bids
        </button>
      </form>
    </div>
  );
};

export default BiddingPhase;