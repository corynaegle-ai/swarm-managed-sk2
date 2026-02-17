import React, { useState } from 'react';
import './BiddingPhase.css';

const BiddingPhase = ({ gameState, onBidsSubmit }) => {
  const { players, currentRound, handsInRound } = gameState;
  const [bids, setBids] = useState({});
  const [errors, setErrors] = useState({});

  const validateBid = (playerId, bidValue) => {
    const bid = parseFloat(bidValue);
    
    if (isNaN(bid)) {
      return 'Bid must be a number';
    }
    
    if (bid < 0 || bid > handsInRound) {
      return `Bid must be between 0 and ${handsInRound}`;
    }
    
    return null;
  };

  const handleBidChange = (playerId, value) => {
    setBids(prev => ({ ...prev, [playerId]: value }));
    
    const error = validateBid(playerId, value);
    setErrors(prev => {
      if (error) {
        return { ...prev, [playerId]: error };
      } else {
        const newErrors = { ...prev };
        delete newErrors[playerId];
        return newErrors;
      }
    });
  };

  const handleSubmit = () => {
    const hasErrors = Object.keys(errors).length > 0;
    const allBidsEntered = players.every(player => bids[player.id] !== undefined && bids[player.id] !== '');
    
    if (!hasErrors && allBidsEntered) {
      onBidsSubmit(bids);
    }
  };

  return (
    <div className="bidding-phase">
      <h2>Round {currentRound} - Bidding Phase</h2>
      <p>Hands in this round: {handsInRound}</p>
      
      <div className="bid-inputs">
        {players.map(player => (
          <div key={player.id} className="bid-input-group">
            <label htmlFor={`bid-${player.id}`}>
              {player.name}:
            </label>
            <input
              id={`bid-${player.id}`}
              type="number"
              min="0"
              max={handsInRound}
              value={bids[player.id] || ''}
              onChange={(e) => handleBidChange(player.id, e.target.value)}
              placeholder="Enter bid"
            />
            {errors[player.id] && (
              <div className="error-message">
                {errors[player.id]}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleSubmit}
        disabled={Object.keys(errors).length > 0 || !players.every(player => bids[player.id])}
        className="submit-bids-btn"
      >
        Submit Bids
      </button>
    </div>
  );
};

export default BiddingPhase;