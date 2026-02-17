import React, { useState, useEffect } from 'react';
import './BiddingPhase.css';

const BiddingPhase = ({ round, players, onBidsSubmit }) => {
  const [bids, setBids] = useState({});
  const [errors, setErrors] = useState({});

  // Initialize bids state when players change
  useEffect(() => {
    if (players) {
      const initialBids = {};
      players.forEach(player => {
        initialBids[player.id] = '';
      });
      setBids(initialBids);
    }
  }, [players]);

  const handleBidChange = (playerId, value) => {
    setBids(prev => ({
      ...prev,
      [playerId]: value
    }));

    // Clear error when user starts typing
    if (errors[playerId]) {
      setErrors(prev => ({
        ...prev,
        [playerId]: ''
      }));
    }
  };

  const isValidBid = (bid) => {
    const numBid = parseInt(bid);
    return bid !== '' && !isNaN(numBid) && numBid >= 0;
  };

  const isFormValid = () => {
    if (!players || players.length === 0) return false;
    
    return players.every(player => {
      const bid = bids[player.id];
      return isValidBid(bid);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all bids before submission
    const newErrors = {};
    let hasErrors = false;

    players.forEach(player => {
      const bid = bids[player.id];
      if (!isValidBid(bid)) {
        newErrors[player.id] = 'Please enter a valid bid (0 or greater)';
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors && isFormValid()) {
      // Convert bids to numbers and call callback
      const numericBids = {};
      Object.keys(bids).forEach(playerId => {
        numericBids[playerId] = parseInt(bids[playerId]);
      });
      onBidsSubmit(numericBids);
    }
  };

  if (!players || players.length === 0) {
    return (
      <div className="bidding-phase-container">
        <p>No players available for bidding.</p>
      </div>
    );
  }

  return (
    <div className="bidding-phase-container">
      <h2 className="round-title">Round {round} - Place Your Bids</h2>
      
      <form onSubmit={handleSubmit} className="bidding-form">
        {players.map(player => (
          <div key={player.id} className="bid-input-group">
            <label htmlFor={`bid-${player.id}`} className="bid-label">
              {player.name}:
            </label>
            <input
              id={`bid-${player.id}`}
              type="number"
              min="0"
              value={bids[player.id] || ''}
              onChange={(e) => handleBidChange(player.id, e.target.value)}
              className={`bid-input ${errors[player.id] ? 'bid-input-error' : ''}`}
              placeholder="Enter bid"
            />
            {errors[player.id] && (
              <span className="error-message">{errors[player.id]}</span>
            )}
          </div>
        ))}
        
        <button
          type="submit"
          disabled={!isFormValid()}
          className={`submit-button ${!isFormValid() ? 'submit-button-disabled' : ''}`}
        >
          Submit Bids
        </button>
      </form>
    </div>
  );
};

export default BiddingPhase;