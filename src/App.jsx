import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import PlayerSetup from './components/PlayerSetup';
import GameBoard from './components/GameBoard';
import './App.css';

const AppContent = () => {
  const { gamePhase, players } = useGame();

  if (gamePhase === 'setup') {
    return <PlayerSetup />;
  }

  if (gamePhase === 'playing') {
    return (
      <div className="game-container">
        <GameBoard players={players} />
      </div>
    );
  }

  return null;
};

function App() {
  return (
    <GameProvider>
      <div className="App">
        <header className="App-header">
          <h1>Skull King Card Game</h1>
        </header>
        <main>
          <AppContent />
        </main>
      </div>
    </GameProvider>
  );
}

export default App;