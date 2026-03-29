import React, { useState, useEffect } from 'react';
import ScoringPhase from './ScoringPhase';

const GameBoard = ({ gameState, onGameUpdate }) => {
  const [currentPhase, setCurrentPhase] = useState('bidding');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [players, setPlayers] = useState([]);
  const [round, setRound] = useState(1);
  const [handsInRound, setHandsInRound] = useState(1);

  useEffect(() => {
    if (gameState) {
      setPlayers(gameState.players || []);
      setRound(gameState.round || 1);
      setHandsInRound(gameState.handsInRound || 1);
      setCurrentPhase(gameState.phase || 'bidding');
      setCurrentPlayerIndex(gameState.currentPlayerIndex || 0);
    }
  }, [gameState]);

  const handleScoringComplete = (playerIndex, score) => {
    const updatedPlayers = [...players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      scores: [...(updatedPlayers[playerIndex].scores || []), score]
    };
    
    const nextPlayerIndex = (playerIndex + 1) % players.length;
    const isLastPlayer = playerIndex === players.length - 1;
    
    const updatedGameState = {
      ...gameState,
      players: updatedPlayers,
      currentPlayerIndex: isLastPlayer ? 0 : nextPlayerIndex,
      phase: isLastPlayer ? 'round_complete' : 'scoring'
    };
    
    setPlayers(updatedPlayers);
    setCurrentPlayerIndex(updatedGameState.currentPlayerIndex);
    setCurrentPhase(updatedGameState.phase);
    
    if (onGameUpdate) {
      onGameUpdate(updatedGameState);
    }
  };

  if (!players.length) {
    return (
      <div className="game-board">
        <p>Loading game...</p>
      </div>
    );
  }

  return (
    <div className="game-board">
      <div className="game-header">
        <h2>Skull King - Round {round}</h2>
        <p>Hands this round: {handsInRound}</p>
      </div>
      
      {currentPhase === 'scoring' && (
        <ScoringPhase
          player={players[currentPlayerIndex]}
          playerIndex={currentPlayerIndex}
          handsInRound={handsInRound}
          onSubmit={handleScoringComplete}
        />
      )}
      
      <div className="players-status">
        <h3>Player Status</h3>
        {players.map((player, index) => (
          <div key={index} className={`player-status ${index === currentPlayerIndex ? 'current' : ''}`}>
            <span className="player-name">{player.name}</span>
            <span className="player-bid">Bid: {player.bid || 0}</span>
            <span className="player-score">Total: {player.totalScore || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;