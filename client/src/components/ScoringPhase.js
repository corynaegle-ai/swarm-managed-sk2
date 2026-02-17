import React, { useState, useEffect } from 'react';

const ScoringPhase = ({ player, playerIndex, handsInRound, onSubmit }) => {
  const [tricksInput, setTricksInput] = useState('');
  const [bonusPointsInput, setBonusPointsInput] = useState('');
  const [calculatedScore, setCalculatedScore] = useState(0);
  const [errors, setErrors] = useState({});

  const playerBid = player?.bid || 0;
  const bidWasCorrect = tricksInput !== '' && parseInt(tricksInput) === playerBid;

  // Calculate score in real-time
  useEffect(() => {
    if (tricksInput === '') {
      setCalculatedScore(0);
      return;
    }

    const tricks = parseInt(tricksInput);
    const bonusPoints = parseInt(bonusPointsInput) || 0;
    let score = 0;

    if (tricks === playerBid) {
      // Bid was correct
      if (playerBid === 0) {
        // Zero bid
        score = handsInRound * 10;
      } else {
        // Non-zero bid
        score = 20 + (playerBid * 10);
      }
      // Add bonus points only if bid was correct
      score += bonusPoints;
    } else {
      // Bid was incorrect - lose 10 points per trick difference
      score = -10 * Math.abs(tricks - playerBid);
    }

    setCalculatedScore(score);
  }, [tricksInput, bonusPointsInput, playerBid, handsInRound]);

  const validateInputs = () => {
    const newErrors = {};
    
    if (tricksInput === '') {
      newErrors.tricks = 'Tricks taken is required';
    } else {
      const tricks = parseInt(tricksInput);
      if (isNaN(tricks) || tricks < 0 || tricks > handsInRound) {
        newErrors.tricks = `Tricks must be between 0 and ${handsInRound}`;
      }
    }

    if (bonusPointsInput !== '' && !bidWasCorrect) {
      newErrors.bonusPoints = 'Bonus points only allowed when bid is correct';
    }

    if (bonusPointsInput !== '' && isNaN(parseInt(bonusPointsInput))) {
      newErrors.bonusPoints = 'Bonus points must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    const scoreData = {
      tricks: parseInt(tricksInput),
      bid: playerBid,
      bonusPoints: bidWasCorrect ? (parseInt(bonusPointsInput) || 0) : 0,
      roundScore: calculatedScore,
      bidCorrect: bidWasCorrect
    };

    onSubmit(playerIndex, scoreData);
  };

  const handleTricksChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= handsInRound)) {
      setTricksInput(value);
    }
  };

  const handleBonusPointsChange = (e) => {
    const value = e.target.value;
    if (value === '' || !isNaN(parseInt(value))) {
      setBonusPointsInput(value);
    }
  };

  return (
    <div className="scoring-phase">
      <h3>Scoring for {player?.name}</h3>
      
      <div className="bid-reference">
        <h4>Player's Bid: <strong>{playerBid}</strong></h4>
        <p>Must take exactly {playerBid} tricks to score points</p>
      </div>

      <form onSubmit={handleSubmit} className="scoring-form">
        <div className="input-group">
          <label htmlFor="tricks">Actual Tricks Taken:</label>
          <input
            type="number"
            id="tricks"
            min="0"
            max={handsInRound}
            value={tricksInput}
            onChange={handleTricksChange}
            className={errors.tricks ? 'error' : ''}
            placeholder="0"
          />
          {errors.tricks && <span className="error-message">{errors.tricks}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="bonusPoints">Bonus Points:</label>
          <input
            type="number"
            id="bonusPoints"
            value={bonusPointsInput}
            onChange={handleBonusPointsChange}
            disabled={!bidWasCorrect}
            className={errors.bonusPoints ? 'error' : ''}
            placeholder="0"
          />
          {errors.bonusPoints && <span className="error-message">{errors.bonusPoints}</span>}
          {!bidWasCorrect && tricksInput !== '' && (
            <span className="info-message">Bonus points only available when bid is correct</span>
          )}
        </div>

        <div className="score-preview">
          <h4>Calculated Score: <span className={calculatedScore >= 0 ? 'positive' : 'negative'}>{calculatedScore}</span></h4>
          {tricksInput !== '' && (
            <div className="score-breakdown">
              {bidWasCorrect ? (
                <div>
                  <p>✓ Bid correct! Base score: {playerBid === 0 ? handsInRound * 10 : 20 + (playerBid * 10)}</p>
                  {bonusPointsInput && parseInt(bonusPointsInput) > 0 && (
                    <p>+ Bonus points: {bonusPointsInput}</p>
                  )}
                </div>
              ) : (
                <p>✗ Bid incorrect. Penalty: -{10 * Math.abs(parseInt(tricksInput) - playerBid)} points</p>
              )}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-score-btn"
          disabled={Object.keys(errors).length > 0 || tricksInput === ''}
        >
          Submit Score & Continue
        </button>
      </form>
    </div>
  );
};

export default ScoringPhase;