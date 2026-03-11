import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LiveScoreboard from '../LiveScoreboard';

// Mock WebSocket
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = WebSocket.CONNECTING;
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      this.onopen && this.onopen();
    }, 100);
  }

  close() {
    this.readyState = WebSocket.CLOSED;
    this.onclose && this.onclose();
  }

  send(data) {
    // Mock send method
  }
}

global.WebSocket = MockWebSocket;

describe('LiveScoreboard', () => {
  beforeEach(() => {
    // Reset WebSocket mock
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<LiveScoreboard />);
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
    expect(screen.getByText('Establishing connection...')).toBeInTheDocument();
  });

  test('shows connected state after WebSocket connection', async () => {
    render(<LiveScoreboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Live Updates Active')).toBeInTheDocument();
    });
  });

  test('displays no players message when no players are registered', async () => {
    render(<LiveScoreboard />);
    
    await waitFor(() => {
      expect(screen.getByText('No players registered yet')).toBeInTheDocument();
    });
  });

  test('renders scoreboard table with players data', async () => {
    const component = render(<LiveScoreboard />);
    
    // Wait for connection
    await waitFor(() => {
      expect(screen.getByText('Live Updates Active')).toBeInTheDocument();
    });

    // Mock receiving scoreboard data
    const mockData = {
      type: 'SCOREBOARD_DATA',
      players: [
        {
          id: '1',
          name: 'Player 1',
          scores: { 1: 10, 2: 15 }
        },
        {
          id: '2', 
          name: 'Player 2',
          scores: { 1: 12 }
        }
      ],
      rounds: [1, 2, 3],
      currentRound: 2
    };

    // Simulate WebSocket message
    const ws = global.WebSocket.mock.instances[0];
    ws.onmessage({ data: JSON.stringify(mockData) });

    await waitFor(() => {
      expect(screen.getByText('Player 1')).toBeInTheDocument();
      expect(screen.getByText('Player 2')).toBeInTheDocument();
    });
  });

  test('displays round headers with current round highlighted', async () => {
    render(<LiveScoreboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Live Updates Active')).toBeInTheDocument();
    });

    const mockData = {
      type: 'SCOREBOARD_DATA',
      players: [],
      rounds: [1, 2, 3],
      currentRound: 2
    };

    const ws = global.WebSocket.mock.instances[0];
    ws.onmessage({ data: JSON.stringify(mockData) });

    await waitFor(() => {
      expect(screen.getByText('R1')).toBeInTheDocument();
      expect(screen.getByText('R2')).toBeInTheDocument();
      expect(screen.getByText('R3')).toBeInTheDocument();
    });
  });

  test('handles score updates correctly', async () => {
    render(<LiveScoreboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Live Updates Active')).toBeInTheDocument();
    });

    // Set initial data
    const initialData = {
      type: 'SCOREBOARD_DATA',
      players: [{
        id: '1',
        name: 'Player 1',
        scores: { 1: 10 }
      }],
      rounds: [1, 2],
      currentRound: 2
    };

    const ws = global.WebSocket.mock.instances[0];
    ws.onmessage({ data: JSON.stringify(initialData) });

    // Send score update
    const scoreUpdate = {
      type: 'SCORE_UPDATE',
      playerId: '1',
      round: 2,
      score: 15
    };

    ws.onmessage({ data: JSON.stringify(scoreUpdate) });

    await waitFor(() => {
      expect(screen.getByText('Player 1')).toBeInTheDocument();
    });
  });
});