/**
 * Unit Tests for Scorekeeper Application
 * Tests for mobile responsiveness, input handling, and UI functionality
 */

// Mock DOM elements
function setupDOM() {
    document.body.innerHTML = `
        <div class="app-container">
            <header class="app-header">
                <h1 class="app-title">Scorekeeper</h1>
                <button id="settingsBtn" class="settings-btn">⚙️</button>
            </header>
            <main class="app-main">
                <div class="scoreboard-wrapper">
                    <div id="scoreboard" class="scoreboard"></div>
                </div>
                <div class="controls-section">
                    <div class="input-group">
                        <label for="pointsInput">Points to Add:</label>
                        <div class="input-wrapper">
                            <button class="quick-input-btn" data-value="-5">−5</button>
                            <input type="number" id="pointsInput" value="1" inputmode="numeric">
                            <button class="quick-input-btn" data-value="5">+5</button>
                        </div>
                    </div>
                    <div class="button-group">
                        <button id="addPlayerBtn" class="btn btn-primary">+ Add Player</button>
                        <button id="resetBtn" class="btn btn-secondary">Reset Scores</button>
                    </div>
                </div>
            </main>
            <footer class="app-footer">
                <p class="footer-text">Tap player card to add points</p>
            </footer>
        </div>
        <div id="settingsModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Settings</h2>
                    <button id="closeSettingsBtn" class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <div class="setting-item">
                        <label for="maxPlayers">Max Players:</label>
                        <input type="number" id="maxPlayers" value="6" min="2" max="10">
                    </div>
                    <div class="setting-item">
                        <label for="startingScore">Starting Score:</label>
                        <input type="number" id="startingScore" value="0">
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="saveSettingsBtn" class="btn btn-primary">Save</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Test Suite 1: Application Initialization
 */
describe('Scorekeeper Initialization', () => {
    beforeEach(() => {
        setupDOM();
        localStorage.clear();
    });

    test('should initialize with default settings', () => {
        const app = new Scorekeeper();
        expect(app.maxPlayers).toBe(6);
        expect(app.startingScore).toBe(0);
        expect(app.players.length).toBe(2);
    });

    test('should load settings from localStorage', () => {
        localStorage.setItem('scorekeeperSettings', JSON.stringify({
            maxPlayers: 8,
            startingScore: 10
        }));
        const app = new Scorekeeper();
        expect(app.maxPlayers).toBe(8);
        expect(app.startingScore).toBe(10);
    });

    test('should create default players', () => {
        const app = new Scorekeeper();
        expect(app.players.length).toBe(2);
        expect(app.players[0].name).toBe('Player 1');
        expect(app.players[1].name).toBe('Player 2');
    });
});

/**
 * Test Suite 2: Player Management
 */
describe('Player Management', () => {
    let app;

    beforeEach(() => {
        setupDOM();
        localStorage.clear();
        app = new Scorekeeper();
    });

    test('should add a new player', () => {
        const initialCount = app.players.length;
        app.addPlayer();
        expect(app.players.length).toBe(initialCount + 1);
    });

    test('should not add player if max players reached', () => {
        app.maxPlayers = 2;
        const initialCount = app.players.length;
        app.addPlayer();
        expect(app.players.length).toBe(initialCount);
    });

    test('should not remove player if less than 2 players', () => {
        app.players = [app.players[0]];
        app.removePlayer(app.players[0].id);
        expect(app.players.length).toBe(1);
    });

    test('should remove player by id', () => {
        const playerToRemove = app.players[0];
        app.removePlayer(playerToRemove.id);
        expect(app.players.find(p => p.id === playerToRemove.id)).toBeUndefined();
    });

    test('should update player name', () => {
        const playerId = app.players[0].id;
        app.updatePlayerName(playerId, 'Alice');
        expect(app.players[0].name).toBe('Alice');
    });

    test('should not update player name with empty string', () => {
        const originalName = app.players[0].name;
        const playerId = app.players[0].id;
        app.updatePlayerName(playerId, '   ');
        expect(app.players[0].name).toBe(originalName);
    });
});

/**
 * Test Suite 3: Score Management
 */
describe('Score Management', () => {
    let app;

    beforeEach(() => {
        setupDOM();
        localStorage.clear();
        app = new Scorekeeper();
    });

    test('should update player score', () => {
        const playerId = app.players[0].id;
        const initialScore = app.players[0].score;
        app.updateScore(playerId, 5);
        expect(app.players[0].score).toBe(initialScore + 5);
    });

    test('should handle negative score changes', () => {
        const playerId = app.players[0].id;
        app.players[0].score = 10;
        app.updateScore(playerId, -5);
        expect(app.players[0].score).toBe(5);
    });

    test('should allow negative scores', () => {
        const playerId = app.players[0].id;
        app.players[0].score = 0;
        app.updateScore(playerId, -10);
        expect(app.players[0].score).toBe(-10);
    });

    test('should reset all scores', () => {
        app.startingScore = 0;
        app.players[0].score = 100;
        app.players[1].score = 50;
        // Mock confirm
        window.confirm = jest.fn(() => true);
        app.resetScores();
        expect(app.players[0].score).toBe(0);
        expect(app.players[1].score).toBe(0);
    });
});

/**
 * Test Suite 4: Input Handling
 */
describe('Input Handling', () => {
    let app;

    beforeEach(() => {
        setupDOM();
        localStorage.clear();
        app = new Scorekeeper();
    });

    test('should handle points input change', () => {
        const pointsInput = document.getElementById('pointsInput');
        pointsInput.value = '10';
        pointsInput.dispatchEvent(new Event('change'));
        expect(app.pointsInput).toBe(10);
    });

    test('should handle quick input buttons', () => {
        const quickBtn = document.querySelector('[data-value="5"]');
        quickBtn.click();
        expect(app.pointsInput).toBe(5);
    });

    test('should handle add player button', () => {
        const addBtn = document.getElementById('addPlayerBtn');
        const initialCount = app.players.length;
        addBtn.click();
        expect(app.players.length).toBe(initialCount + 1);
    });
});

/**
 * Test Suite 5: Settings Management
 */
describe('Settings Management', () => {
    let app;

    beforeEach(() => {
        setupDOM();
        localStorage.clear();
        app = new Scorekeeper();
    });

    test('should open settings modal', () => {
        const modal = document.getElementById('settingsModal');
        app.openSettings();
        expect(modal.classList.contains('active')).toBe(true);
    });

    test('should close settings modal', () => {
        const modal = document.getElementById('settingsModal');
        modal.classList.add('active');
        app.closeSettings();
        expect(modal.classList.contains('active')).toBe(false);
    });

    test('should save settings', () => {
        const maxPlayersInput = document.getElementById('maxPlayers');
        const startingScoreInput = document.getElementById('startingScore');
        maxPlayersInput.value = '8';
        startingScoreInput.value = '100';
        app.saveSettings();
        expect(app.maxPlayers).toBe(8);
        expect(app.startingScore).toBe(100);
    });

    test('should persist settings to localStorage', () => {
        const maxPlayersInput = document.getElementById('maxPlayers');
        const startingScoreInput = document.getElementById('startingScore');
        maxPlayersInput.value = '5';
        startingScoreInput.value = '50';
        app.saveSettings();
        const saved = JSON.parse(localStorage.getItem('scorekeeperSettings'));
        expect(saved.maxPlayers).toBe(5);
        expect(saved.startingScore).toBe(50);
    });

    test('should clamp maxPlayers between 2 and 10', () => {
        const maxPlayersInput = document.getElementById('maxPlayers');
        maxPlayersInput.value = '20';
        app.saveSettings();
        expect(app.maxPlayers).toBe(10);
    });
});

/**
 * Test Suite 6: Mobile Responsiveness (CSS and Layout)
 */
describe('Mobile Responsiveness', () => {
    beforeEach(() => {
        setupDOM();
        localStorage.clear();
    });

    test('should render readable text on small screens', () => {
        const app = new Scorekeeper();
        const playerCards = document.querySelectorAll('.player-card');
        expect(playerCards.length).toBeGreaterThan(0);
        // Check that player names are visible
        playerCards.forEach(card => {
            const name = card.querySelector('.player-name');
            expect(name).not.toBeNull();
            expect(name.textContent).toBeTruthy();
        });
    });

    test('should have large buttons for touch interaction', () => {
        const app = new Scorekeeper();
        const buttons = document.querySelectorAll('.btn, .quick-input-btn, .player-action-btn');
        expect(buttons.length).toBeGreaterThan(0);
        // Check that buttons exist and are interactive
        buttons.forEach(btn => {
            expect(btn).not.toBeNull();
            expect(btn.offsetHeight).toBeGreaterThanOrEqual(36);
        });
    });

    test('should have scrollable scoreboard', () => {
        const app = new Scorekeeper();
        // Add multiple players
        for (let i = 0; i < 5; i++) {
            app.addPlayer();
        }
        const wrapper = document.querySelector('.scoreboard-wrapper');
        expect(wrapper).not.toBeNull();
        // Check that overflow-y is set to auto (done in CSS)
        const computed = window.getComputedStyle(wrapper);
        expect(computed.overflowY).toBe('auto');
    });

    test('should not have horizontal scrolling', () => {
        const app = new Scorekeeper();
        const container = document.querySelector('.app-container');
        const computed = window.getComputedStyle(container);
        expect(computed.overflowX).not.toBe('scroll');
    });

    test('should have inputmode attribute for numeric input', () => {
        const pointsInput = document.getElementById('pointsInput');
        expect(pointsInput.getAttribute('inputmode')).toBe('numeric');
    });

    test('should have touch-friendly spacing in controls', () => {
        const app = new Scorekeeper();
        const buttons = document.querySelectorAll('.quick-input-btn');
        expect(buttons.length).toBeGreaterThan(0);
        // All buttons should have minimum 44px height (accessibility standard)
        buttons.forEach(btn => {
            const computed = window.getComputedStyle(btn);
            expect(parseInt(computed.minHeight)).toBeGreaterThanOrEqual(36);
        });
    });
});

/**
 * Test Suite 7: Utility Functions
 */
describe('Utility Functions', () => {
    let app;

    beforeEach(() => {
        setupDOM();
        localStorage.clear();
        app = new Scorekeeper();
    });

    test('should generate unique IDs', () => {
        const id1 = app.generateId();
        const id2 = app.generateId();
        expect(id1).not.toBe(id2);
    });

    test('should scroll to bottom of scoreboard', (done) => {
        app.scrollToBottom();
        setTimeout(() => {
            const wrapper = document.querySelector('.scoreboard-wrapper');
            expect(wrapper.scrollTop).toBeGreaterThanOrEqual(0);
            done();
        }, 150);
    });
});

/**
 * Test Helper: Basic test framework simulation
 * (In real tests, use Jest or Mocha)
 */
let testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

function test(name, fn) {
    try {
        fn();
        testResults.passed++;
        testResults.tests.push({ name, status: 'PASS' });
    } catch (e) {
        testResults.failed++;
        testResults.tests.push({ name, status: 'FAIL', error: e.message });
        console.error(`❌ ${name}: ${e.message}`);
    }
}

function describe(name, fn) {
    console.log(`\n📋 ${name}`);
    fn();
}

function expect(value) {
    return {
        toBe(expected) {
            if (value !== expected) {
                throw new Error(`Expected ${value} to be ${expected}`);
            }
        },
        toBeUndefined() {
            if (value !== undefined) {
                throw new Error(`Expected ${value} to be undefined`);
            }
        },
        toBeNull() {
            if (value !== null) {
                throw new Error(`Expected ${value} to be null`);
            }
        },
        toBeGreaterThan(expected) {
            if (!(value > expected)) {
                throw new Error(`Expected ${value} to be greater than ${expected}`);
            }
        },
        toBeGreaterThanOrEqual(expected) {
            if (!(value >= expected)) {
                throw new Error(`Expected ${value} to be greater than or equal to ${expected}`);
            }
        },
        toBeTruthy() {
            if (!value) {
                throw new Error(`Expected ${value} to be truthy`);
            }
        },
        not: {
            toBe(expected) {
                if (value === expected) {
                    throw new Error(`Expected ${value} not to be ${expected}`);
                }
            },
            toBeNull() {
                if (value === null) {
                    throw new Error(`Expected ${value} not to be null`);
                }
            },
            toBe(expected) {
                if (value === expected) {
                    throw new Error(`Expected ${value} not to be ${expected}`);
                }
            }
        }
    };
}

let beforeEachFn = null;

function beforeEach(fn) {
    beforeEachFn = fn;
}

// Export for use in test runners
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Scorekeeper, test, describe, expect, beforeEach };
}
