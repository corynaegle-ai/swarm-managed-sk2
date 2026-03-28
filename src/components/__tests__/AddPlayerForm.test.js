import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddPlayerForm from '../AddPlayerForm';

describe('AddPlayerForm', () => {
  const mockOnAddPlayer = jest.fn();

  beforeEach(() => {
    mockOnAddPlayer.mockClear();
  });

  test('renders with name input field and submit button', () => {
    render(<AddPlayerForm onAddPlayer={mockOnAddPlayer} />);
    
    expect(screen.getByPlaceholderText('Enter player name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Player' })).toBeInTheDocument();
  });

  test('validates that player name is not empty before submission', () => {
    render(<AddPlayerForm onAddPlayer={mockOnAddPlayer} />);
    
    const submitButton = screen.getByRole('button', { name: 'Add Player' });
    fireEvent.click(submitButton);
    
    expect(mockOnAddPlayer).not.toHaveBeenCalled();
  });

  test('calls onAddPlayer with player name on valid submission', () => {
    render(<AddPlayerForm onAddPlayer={mockOnAddPlayer} />);
    
    const input = screen.getByPlaceholderText('Enter player name');
    const submitButton = screen.getByRole('button', { name: 'Add Player' });
    
    fireEvent.change(input, { target: { value: 'John Doe' } });
    fireEvent.click(submitButton);
    
    expect(mockOnAddPlayer).toHaveBeenCalledWith('John Doe');
  });

  test('clears input field after successful submission', () => {
    render(<AddPlayerForm onAddPlayer={mockOnAddPlayer} />);
    
    const input = screen.getByPlaceholderText('Enter player name');
    const submitButton = screen.getByRole('button', { name: 'Add Player' });
    
    fireEvent.change(input, { target: { value: 'John Doe' } });
    fireEvent.click(submitButton);
    
    expect(input.value).toBe('');
  });
});