/**
 * PhaseManager Unit Tests
 */

const PhaseManager = require('./gamePhases');

describe('PhaseManager', () => {
  let phaseManager;

  beforeEach(() => {
    phaseManager = new PhaseManager();
  });

  describe('Initialization', () => {
    test('initializes with default phase "setup" and round 1', () => {
      expect(phaseManager.getCurrentPhase()).toBe('setup');
      expect(phaseManager.getRound()).toBe(1);
    });

    test('initializes with custom phase and round', () => {
      const pm = new PhaseManager('bidding', 5);
      expect(pm.getCurrentPhase()).toBe('bidding');
      expect(pm.getRound()).toBe(5);
    });

    test('throws error on invalid initial phase', () => {
      expect(() => new PhaseManager('invalid')).toThrow();
    });
  });

  describe('getCurrentPhase()', () => {
    test('returns current phase', () => {
      expect(phaseManager.getCurrentPhase()).toBe('setup');
    });
  });

  describe('setPhase()', () => {
    test('transitions setup -> bidding', () => {
      expect(phaseManager.setPhase('bidding')).toBe(true);
      expect(phaseManager.getCurrentPhase()).toBe('bidding');
    });

    test('transitions bidding -> scoring', () => {
      phaseManager.setPhase('bidding');
      expect(phaseManager.setPhase('scoring')).toBe(true);
      expect(phaseManager.getCurrentPhase()).toBe('scoring');
    });

    test('transitions scoring -> setup for rounds < 10', () => {
      phaseManager.setPhase('bidding');
      phaseManager.setPhase('scoring');
      expect(phaseManager.setPhase('setup')).toBe(true);
      expect(phaseManager.getCurrentPhase()).toBe('setup');
    });

    test('transitions scoring -> complete for round 10', () => {
      phaseManager.setRound(10);
      phaseManager.setPhase('bidding');
      phaseManager.setPhase('scoring');
      expect(phaseManager.setPhase('complete')).toBe(true);
      expect(phaseManager.getCurrentPhase()).toBe('complete');
    });

    test('throws error on invalid phase', () => {
      expect(() => phaseManager.setPhase('invalid')).toThrow();
    });

    test('throws error on invalid transition', () => {
      expect(() => phaseManager.setPhase('scoring')).toThrow();
    });
  });

  describe('canTransitionTo()', () => {
    test('returns true for valid transition setup -> bidding', () => {
      expect(phaseManager.canTransitionTo('bidding')).toBe(true);
    });

    test('returns false for invalid transition setup -> scoring', () => {
      expect(phaseManager.canTransitionTo('scoring')).toBe(false);
    });

    test('returns false for invalid transition setup -> setup', () => {
      expect(phaseManager.canTransitionTo('setup')).toBe(false);
    });

    test('returns false for invalid phase', () => {
      expect(phaseManager.canTransitionTo('invalid')).toBe(false);
    });

    test('returns true for scoring -> complete on final round', () => {
      phaseManager.setRound(10);
      phaseManager.setPhase('bidding');
      phaseManager.setPhase('scoring');
      expect(phaseManager.canTransitionTo('complete')).toBe(true);
    });

    test('returns false for scoring -> complete before final round', () => {
      phaseManager.setPhase('bidding');
      phaseManager.setPhase('scoring');
      expect(phaseManager.canTransitionTo('complete')).toBe(false);
    });
  });

  describe('getValidTransitions()', () => {
    test('returns ["bidding"] from setup', () => {
      expect(phaseManager.getValidTransitions()).toEqual(['bidding']);
    });

    test('returns ["scoring"] from bidding', () => {
      phaseManager.setPhase('bidding');
      expect(phaseManager.getValidTransitions()).toEqual(['scoring']);
    });

    test('returns ["setup"] from scoring on non-final round', () => {
      phaseManager.setPhase('bidding');
      phaseManager.setPhase('scoring');
      expect(phaseManager.getValidTransitions()).toEqual(['setup']);
    });

    test('returns ["complete"] from scoring on final round', () => {
      phaseManager.setRound(10);
      phaseManager.setPhase('bidding');
      phaseManager.setPhase('scoring');
      expect(phaseManager.getValidTransitions()).toEqual(['complete']);
    });

    test('returns [] from complete', () => {
      phaseManager.setRound(10);
      phaseManager.setPhase('bidding');
      phaseManager.setPhase('scoring');
      phaseManager.setPhase('complete');
      expect(phaseManager.getValidTransitions()).toEqual([]);
    });
  });

  describe('Round Management', () => {
    test('setRound() sets the round number', () => {
      phaseManager.setRound(5);
      expect(phaseManager.getRound()).toBe(5);
    });

    test('setRound() throws error for invalid round', () => {
      expect(() => phaseManager.setRound(0)).toThrow();
      expect(() => phaseManager.setRound(-1)).toThrow();
      expect(() => phaseManager.setRound('invalid')).toThrow();
    });

    test('isFinalRound() returns true for round 10', () => {
      phaseManager.setRound(10);
      expect(phaseManager.isFinalRound()).toBe(true);
    });

    test('isFinalRound() returns false for round < 10', () => {
      phaseManager.setRound(5);
      expect(phaseManager.isFinalRound()).toBe(false);
    });
  });

  describe('Game Completion', () => {
    test('isGameComplete() returns false initially', () => {
      expect(phaseManager.isGameComplete()).toBe(false);
    });

    test('isGameComplete() returns true when phase is "complete"', () => {
      phaseManager.setRound(10);
      phaseManager.setPhase('bidding');
      phaseManager.setPhase('scoring');
      phaseManager.setPhase('complete');
      expect(phaseManager.isGameComplete()).toBe(true);
    });
  });

  describe('Full Game Flow', () => {
    test('completes full game for 10 rounds', () => {
      for (let round = 1; round <= 10; round++) {
        phaseManager.setRound(round);
        expect(phaseManager.getCurrentPhase()).toBe('setup');
        
        phaseManager.setPhase('bidding');
        expect(phaseManager.getCurrentPhase()).toBe('bidding');
        
        phaseManager.setPhase('scoring');
        expect(phaseManager.getCurrentPhase()).toBe('scoring');
        
        if (round < 10) {
          phaseManager.setPhase('setup');
          expect(phaseManager.getCurrentPhase()).toBe('setup');
        } else {
          phaseManager.setPhase('complete');
          expect(phaseManager.getCurrentPhase()).toBe('complete');
        }
      }
      expect(phaseManager.isGameComplete()).toBe(true);
    });
  });
});
