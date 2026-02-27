/**
 * Test suite for RoundManager
 * Tests all acceptance criteria and functionality
 */

// Mock for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  var RoundManager = require('./rounds.js');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error('Assertion failed: ' + message);
  }
}

function testGetCurrentRound() {
  const manager = new RoundManager();
  assert(manager.getCurrentRound() === 1, 'getCurrentRound() should return 1 initially');
  manager.currentRound = 5;
  assert(manager.getCurrentRound() === 5, 'getCurrentRound() should return 5 after setting currentRound');
  console.log('✓ testGetCurrentRound passed');
}

function testGetHandsForRound() {
  const manager = new RoundManager();
  assert(manager.getHandsForRound(1) === 1, 'Round 1 should have 1 hand');
  assert(manager.getHandsForRound(5) === 5, 'Round 5 should have 5 hands');
  assert(manager.getHandsForRound(10) === 10, 'Round 10 should have 10 hands');
  assert(manager.getHandsForRound() === 1, 'getHandsForRound() with no args should default to current round (1)');
  manager.currentRound = 7;
  assert(manager.getHandsForRound() === 7, 'getHandsForRound() should default to current round (7)');
  console.log('✓ testGetHandsForRound passed');
}

function testCanStartRound() {
  const manager = new RoundManager();
  assert(manager.canStartRound() === true, 'Round 1 should always be able to start');
  
  manager.currentRound = 2;
  assert(manager.canStartRound() === false, 'Round 2 should not start before round 1 is completed');
  
  manager.roundsCompleted.push(1);
  assert(manager.canStartRound() === true, 'Round 2 should start after round 1 is completed');
  
  manager.currentRound = 3;
  assert(manager.canStartRound() === false, 'Round 3 should not start before round 2 is completed');
  
  manager.roundsCompleted.push(2);
  assert(manager.canStartRound() === true, 'Round 3 should start after round 2 is completed');
  console.log('✓ testCanStartRound passed');
}

function testStartNextRound() {
  const manager = new RoundManager();
  
  // Round 1 to 2
  assert(manager.startNextRound() === true, 'startNextRound() should return true when advancing from round 1');
  assert(manager.currentRound === 2, 'currentRound should be 2 after advancing');
  assert(manager.roundsCompleted.includes(1), 'roundsCompleted should include 1');
  
  // Advance through to round 10
  for (let i = 2; i < 10; i++) {
    assert(manager.startNextRound() === true, `startNextRound() should return true when advancing from round ${i}`);
    assert(manager.currentRound === i + 1, `currentRound should be ${i + 1}`);
  }
  
  // Round 10 to complete
  assert(manager.currentRound === 10, 'currentRound should be 10');
  assert(manager.startNextRound() === false, 'startNextRound() should return false when at round 10');
  assert(manager.roundsCompleted.includes(10), 'roundsCompleted should include 10');
  console.log('✓ testStartNextRound passed');
}

function testIsGameComplete() {
  const manager = new RoundManager();
  assert(manager.isGameComplete() === false, 'Game should not be complete at start');
  
  manager.currentRound = 10;
  assert(manager.isGameComplete() === false, 'Game should not be complete at round 10 without completion');
  
  manager.roundsCompleted.push(10);
  assert(manager.isGameComplete() === true, 'Game should be complete after round 10 is completed');
  
  manager.currentRound = 11;
  assert(manager.isGameComplete() === true, 'Game should be complete when currentRound exceeds 10');
  console.log('✓ testIsGameComplete passed');
}

function runAllTests() {
  console.log('Running RoundManager tests...\n');
  try {
    testGetCurrentRound();
    testGetHandsForRound();
    testCanStartRound();
    testStartNextRound();
    testIsGameComplete();
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  runAllTests();
}
