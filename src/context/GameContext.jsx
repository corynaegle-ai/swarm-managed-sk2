import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [gamePhase, setGamePhase] = useState('setup');
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const startGame = (playerData) => {
    setPlayers(playerData);
    setCurrentPlayer(playerData[0] || null);
    setGamePhase('playing');
  };

  const resetGame = () => {
    setGamePhase('setup');
    setPlayers([]);
    setCurrentPlayer(null);
  };

  const value = {
    gamePhase,
    players,
    currentPlayer,
    startGame,
    resetGame,
    setGamePhase,
    setPlayers,
    setCurrentPlayer
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;