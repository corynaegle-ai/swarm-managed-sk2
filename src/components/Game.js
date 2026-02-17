import React, { useState, useEffect } from 'react';
import BiddingPhase from './BiddingPhase';
import './Game.css';

const Game = () => {
  const [gameState, setGameState] = useState({
    phase: 'bidding', // 'bidding', 'playing', 'scoring'
    round: 1,
    players: [
      { id: 1, name: 'Player 1', score: 0, bid: null, tricks: 0 },
      { id: 2, name: 'Player 2', score: 0, bid: null, tricks: 0 },
      { id: 3, name: 'Player 3', score: 0, bid: null, tricks: 0 },
      { id: 4, name: 'Player 4', score: 0, bid: null, tricks: 0 }
    ],
    dealer: 0,
    currentPlayer: 1,
    trump: null,
    cards: [],
    currentTrick: [],
    roundsToPlay: 10
  });

  const [bidsCollected, setBidsCollected] = useState(0);

  // Initialize new round
  const initializeRound = () => {
    setGameState(prevState => ({
      ...prevState,
      phase: 'bidding',
      players: prevState.players.map(player => ({
        ...player,
        bid: null,
        tricks: 0
      })),
      currentTrick: [],
      trump: null
    }));
    setBidsCollected(0);
  };

  // Handle bid submission from BiddingPhase
  const handleBidSubmitted = (playerId, bidAmount) => {
    setGameState(prevState => {
      const updatedPlayers = prevState.players.map(player => 
        player.id === playerId 
          ? { ...player, bid: bidAmount }
          : player
      );
      
      return {
        ...prevState,
        players: updatedPlayers
      };
    });
    
    setBidsCollected(prev => prev + 1);
  };

  // Check if all bids are collected and transition to playing phase
  useEffect(() => {
    if (bidsCollected === gameState.players.length && gameState.phase === 'bidding') {
      // All bids collected, transition to playing phase
      setTimeout(() => {
        setGameState(prevState => ({
          ...prevState,
          phase: 'playing'
        }));
      }, 1000); // Small delay for UX
    }
  }, [bidsCollected, gameState.players.length, gameState.phase]);

  // Start new round
  const startNewRound = () => {
    if (gameState.round < gameState.roundsToPlay) {
      setGameState(prevState => ({
        ...prevState,
        round: prevState.round + 1,
        dealer: (prevState.dealer + 1) % prevState.players.length
      }));
      initializeRound();
    }
  };

  // Mock card dealing (placeholder for actual card logic)
  const dealCards = () => {
    // This would normally deal actual cards based on round number
    const cardsPerPlayer = gameState.round;
    console.log(`Dealing ${cardsPerPlayer} cards to each player for round ${gameState.round}`);
  };

  // Effect to deal cards when entering playing phase
  useEffect(() => {
    if (gameState.phase === 'playing') {
      dealCards();
    }
  }, [gameState.phase]);

  const renderBiddingPhase = () => {
    return (
      <BiddingPhase
        round={gameState.round}
        players={gameState.players}
        dealer={gameState.dealer}
        onBidSubmitted={handleBidSubmitted}
        cardsInHand={gameState.round} // In Skull King, cards dealt equals round number
      />
    );
  };

  const renderPlayingPhase = () => {
    return (
      <div className="playing-phase">
        <h2>Playing Phase - Round {gameState.round}</h2>
        <div className="game-info">
          <p>Trump: {gameState.trump || 'None'}</p>
          <p>Current Player: {gameState.players[gameState.currentPlayer - 1]?.name}</p>
        </div>
        
        <div className="players-info">
          {gameState.players.map(player => (
            <div key={player.id} className="player-info">
              <h3>{player.name}</h3>
              <p>Bid: {player.bid}</p>
              <p>Tricks: {player.tricks}</p>
              <p>Score: {player.score}</p>
            </div>
          ))}
        </div>
        
        <div className="game-controls">
          <button onClick={startNewRound} disabled={gameState.round >= gameState.roundsToPlay}>
            Next Round
          </button>
        </div>
      </div>
    );
  };

  const renderScoringPhase = () => {
    return (
      <div className="scoring-phase">
        <h2>Scoring Phase - Round {gameState.round}</h2>
        <p>Calculating scores...</p>
      </div>
    );
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>Skull King - Round {gameState.round}</h1>
        <div className="game-status">
          <span className={`phase-indicator ${gameState.phase}`}>
            {gameState.phase.toUpperCase()}
          </span>
        </div>
      </header>
      
      <main className="game-content">
        {gameState.phase === 'bidding' && renderBiddingPhase()}
        {gameState.phase === 'playing' && renderPlayingPhase()}
        {gameState.phase === 'scoring' && renderScoringPhase()}
      </main>
      
      <div className="game-debug" style={{ marginTop: '20px', fontSize: '12px', opacity: 0.7 }}>
        <p>Debug: Phase={gameState.phase}, Bids Collected={bidsCollected}/{gameState.players.length}</p>
      </div>
    </div>
  );
};

export default Game;