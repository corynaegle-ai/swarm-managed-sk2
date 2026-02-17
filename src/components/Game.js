import React, { useState, useEffect } from 'react';
import BiddingPhase from './BiddingPhase';
import Score from './Score';
import Hand from './Hand';
import Trick from './Trick';
import GameOver from './GameOver';

const Game = () => {
  const [gameState, setGameState] = useState({
    phase: 'bidding', // 'bidding', 'playing', 'gameOver'
    round: 1,
    players: [
      { id: 1, name: 'Player 1', hand: [], score: 0, bid: null, tricks: 0 },
      { id: 2, name: 'Player 2', hand: [], score: 0, bid: null, tricks: 0 },
      { id: 3, name: 'Player 3', hand: [], score: 0, bid: null, tricks: 0 },
      { id: 4, name: 'Player 4', hand: [], score: 0, bid: null, tricks: 0 }
    ],
    currentPlayer: 1,
    trump: null,
    currentTrick: [],
    completedTricks: [],
    deck: []
  });

  // Initialize deck
  useEffect(() => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['7', '8', '9', 'J', 'Q', 'K', '10', 'A'];
    const newDeck = [];
    
    suits.forEach(suit => {
      ranks.forEach(rank => {
        newDeck.push({ suit, rank, id: `${suit}-${rank}` });
      });
    });
    
    setGameState(prev => ({ ...prev, deck: shuffleDeck(newDeck) }));
  }, []);

  const shuffleDeck = (deck) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const dealCards = () => {
    const cardsPerPlayer = gameState.round;
    const newPlayers = [...gameState.players];
    let deckIndex = 0;
    
    // Deal cards to each player
    newPlayers.forEach(player => {
      player.hand = gameState.deck.slice(deckIndex, deckIndex + cardsPerPlayer);
      deckIndex += cardsPerPlayer;
    });
    
    // Set trump card
    const trumpCard = gameState.deck[deckIndex];
    
    setGameState(prev => ({
      ...prev,
      players: newPlayers,
      trump: trumpCard?.suit || 'spades'
    }));
  };

  const handleBidSubmit = (playerId, bidAmount) => {
    const newPlayers = gameState.players.map(player => 
      player.id === playerId ? { ...player, bid: bidAmount } : player
    );
    
    setGameState(prev => ({ ...prev, players: newPlayers }));
    
    // Check if all players have bid
    const allBidsPlaced = newPlayers.every(player => player.bid !== null);
    if (allBidsPlaced) {
      // Deal cards and transition to playing phase
      setTimeout(() => {
        dealCards();
        setGameState(prev => ({ ...prev, phase: 'playing' }));
      }, 500);
    }
  };

  const startRound = () => {
    // Reset bids and tricks for new round
    const newPlayers = gameState.players.map(player => ({
      ...player,
      bid: null,
      tricks: 0,
      hand: []
    }));
    
    setGameState(prev => ({
      ...prev,
      players: newPlayers,
      phase: 'bidding',
      currentTrick: [],
      completedTricks: []
    }));
  };

  const playCard = (card) => {
    // Implementation for card play logic
    console.log('Card played:', card);
  };

  const nextRound = () => {
    if (gameState.round >= 10) {
      setGameState(prev => ({ ...prev, phase: 'gameOver' }));
    } else {
      setGameState(prev => ({ ...prev, round: prev.round + 1 }));
      startRound();
    }
  };

  const resetGame = () => {
    setGameState({
      phase: 'bidding',
      round: 1,
      players: [
        { id: 1, name: 'Player 1', hand: [], score: 0, bid: null, tricks: 0 },
        { id: 2, name: 'Player 2', hand: [], score: 0, bid: null, tricks: 0 },
        { id: 3, name: 'Player 3', hand: [], score: 0, bid: null, tricks: 0 },
        { id: 4, name: 'Player 4', hand: [], score: 0, bid: null, tricks: 0 }
      ],
      currentPlayer: 1,
      trump: null,
      currentTrick: [],
      completedTricks: [],
      deck: []
    });
  };

  return (
    <div className="game">
      <Score players={gameState.players} round={gameState.round} />
      
      {gameState.phase === 'bidding' && (
        <BiddingPhase
          players={gameState.players}
          round={gameState.round}
          onBidSubmit={handleBidSubmit}
        />
      )}
      
      {gameState.phase === 'playing' && (
        <div className="playing-phase">
          <div className="trump-info">
            Trump: {gameState.trump}
          </div>
          
          <Trick 
            currentTrick={gameState.currentTrick}
            trump={gameState.trump}
          />
          
          <Hand 
            cards={gameState.players.find(p => p.id === 1)?.hand || []}
            onCardPlay={playCard}
            canPlay={gameState.currentPlayer === 1}
          />
          
          <div className="game-controls">
            <button onClick={nextRound}>Next Round</button>
          </div>
        </div>
      )}
      
      {gameState.phase === 'gameOver' && (
        <GameOver 
          players={gameState.players}
          onRestart={resetGame}
        />
      )}
    </div>
  );
};

export default Game;