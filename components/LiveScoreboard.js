import React, { useState, useEffect } from 'react';
import './LiveScoreboard.css';

const LiveScoreboard = () => {
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize WebSocket connection
    const websocket = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:8080');
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setWs(null);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup on unmount
    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, []);

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'SCORE_UPDATE':
        updatePlayerScore(data.playerId, data.round, data.score);
        break;
      case 'PLAYER_UPDATE':
        setPlayers(data.players);
        break;
      case 'ROUND_UPDATE':
        setCurrentRound(data.currentRound);
        setRounds(data.rounds);
        break;
      case 'SCOREBOARD_DATA':
        setPlayers(data.players || []);
        setRounds(data.rounds || []);
        setCurrentRound(data.currentRound || 1);
        break;
      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  };

  const updatePlayerScore = (playerId, round, score) => {
    setPlayers(prevPlayers => 
      prevPlayers.map(player => {
        if (player.id === playerId) {
          const updatedScores = { ...player.scores };
          updatedScores[round] = score;
          const totalScore = Object.values(updatedScores).reduce((sum, s) => sum + (s || 0), 0);
          return {
            ...player,
            scores: updatedScores,
            totalScore
          };
        }
        return player;
      })
    );
  };

  const calculateTotalScore = (scores) => {
    return Object.values(scores || {}).reduce((sum, score) => sum + (score || 0), 0);
  };

  const sortedPlayers = [...players].sort((a, b) => {
    const scoreA = calculateTotalScore(a.scores);
    const scoreB = calculateTotalScore(b.scores);
    return scoreB - scoreA; // Descending order (highest score first)
  });

  if (!isConnected) {
    return (
      <div className="live-scoreboard">
        <div className="scoreboard-header">
          <h2>Live Scoreboard</h2>
          <div className="connection-status disconnected">
            Connecting...
          </div>
        </div>
        <div className="loading-message">Establishing connection...</div>
      </div>
    );
  }

  return (
    <div className="live-scoreboard">
      <div className="scoreboard-header">
        <h2>Live Scoreboard</h2>
        <div className="connection-status connected">
          Live Updates Active
        </div>
      </div>
      
      {players.length === 0 ? (
        <div className="no-players-message">
          No players registered yet
        </div>
      ) : (
        <div className="scoreboard-table-container">
          <table className="scoreboard-table">
            <thead>
              <tr>
                <th className="rank-column">Rank</th>
                <th className="player-column">Player</th>
                {rounds.map(round => (
                  <th 
                    key={round} 
                    className={`round-column ${
                      round === currentRound ? 'current-round' : ''
                    }`}
                  >
                    R{round}
                    {round === currentRound && (
                      <span className="current-indicator">●</span>
                    )}
                  </th>
                ))}
                <th className="total-column">Total</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player, index) => {
                const totalScore = calculateTotalScore(player.scores);
                return (
                  <tr key={player.id} className="player-row">
                    <td className="rank-cell">
                      <span className="rank-badge">{index + 1}</span>
                    </td>
                    <td className="player-cell">
                      <div className="player-info">
                        <span className="player-name">{player.name}</span>
                      </div>
                    </td>
                    {rounds.map(round => {
                      const score = player.scores?.[round];
                      const isCurrentRound = round === currentRound;
                      return (
                        <td 
                          key={round} 
                          className={`score-cell ${
                            isCurrentRound ? 'current-round-score' : ''
                          } ${
                            score !== undefined ? 'has-score' : 'no-score'
                          }`}
                        >
                          {score !== undefined ? score : '-'}
                          {isCurrentRound && score === undefined && (
                            <div className="pending-indicator">⏳</div>
                          )}
                        </td>
                      );
                    })}
                    <td className="total-cell">
                      <span className="total-score">{totalScore}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="scoreboard-footer">
        <div className="round-info">
          Current Round: <span className="current-round-number">{currentRound}</span>
        </div>
        <div className="player-count">
          Players: {players.length}
        </div>
      </div>
    </div>
  );
};

export default LiveScoreboard;