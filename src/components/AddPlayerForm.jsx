import React, { useState } from 'react';
import { validatePlayer } from '../utils/playerValidation';

const AddPlayerForm = ({ players = [], onAddPlayer }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setError('');
    setIsLoading(true);

    try {
      // Simulate async operation and validate player
      await new Promise(resolve => setTimeout(resolve, 100));
      
      let validation;
      try {
        validation = validatePlayer(name, players);
      } catch (validationError) {
        console.error('Validation function failed:', validationError);
        validation = {
          isValid: false,
          error: 'Unable to validate player. Please try again.'
        };
      }

      if (!validation.isValid) {
        setError(validation.error);
        return;
      }

      // Attempt to add player
      if (onAddPlayer) {
        try {
          await onAddPlayer(name.trim());
          setName('');
          setError('');
        } catch (addError) {
          console.error('Failed to add player:', addError);
          setError(addError.message || 'Failed to add player. Please try again.');
        }
      }
    } catch (error) {
      console.error('Unexpected error in handleSubmit:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="add-player-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="player-name">Player Name:</label>
          <input
            id="player-name"
            type="text"
            value={name}
            onChange={handleNameChange}
            disabled={isLoading}
            placeholder="Enter player name"
            maxLength={50}
            aria-describedby={error ? 'player-error' : undefined}
            aria-invalid={error ? 'true' : 'false'}
          />
        </div>
        
        {error && (
          <div 
            id="player-error"
            className="error-message"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || !name.trim()}
          className={`add-button ${isLoading ? 'loading' : ''}`}
          aria-describedby={isLoading ? 'loading-status' : undefined}
        >
          {isLoading ? (
            <>
              <span className="spinner" aria-hidden="true"></span>
              Adding Player...
            </>
          ) : (
            'Add Player'
          )}
        </button>
        
        {isLoading && (
          <span 
            id="loading-status"
            className="sr-only"
            aria-live="polite"
          >
            Adding player, please wait...
          </span>
        )}
      </form>
      
      <style jsx>{`
        .add-player-form {
          max-width: 400px;
          margin: 1rem 0;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
        
        input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }
        
        input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
        
        input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
          opacity: 0.7;
        }
        
        input[aria-invalid="true"] {
          border-color: #dc3545;
        }
        
        .error-message {
          color: #dc3545;
          font-size: 0.875rem;
          margin: 0.5rem 0;
          padding: 0.5rem;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
        }
        
        .add-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          min-height: 2.5rem;
        }
        
        .add-button:hover:not(:disabled) {
          background-color: #0056b3;
          transform: translateY(-1px);
        }
        
        .add-button:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
          transform: none;
        }
        
        .add-button.loading {
          cursor: not-allowed;
        }
        
        .spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
};

export default AddPlayerForm;