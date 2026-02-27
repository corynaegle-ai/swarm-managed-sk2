# Scorekeeper - Mobile-Responsive Game Score Tracker

A fully responsive web application for tracking game scores on mobile devices, tablets, and desktops.

## Features

✅ **Mobile-Optimized Interface**
- Responsive design that adapts to any screen size
- Touch-friendly buttons with minimum 44px height
- Optimized for portrait and landscape orientations

✅ **Easy Score Management**
- Tap player cards to add points quickly
- Quick-access buttons for common point values (±5)
- Custom point input with numeric keyboard
- Reset all scores with one click

✅ **Flexible Player Management**
- Add/remove players dynamically
- Edit player names
- Configure max players in settings
- Minimum 2 players, maximum 10 players

✅ **Persistent Settings**
- Save preferences to browser storage
- Customize starting score
- Remember max player count

✅ **Accessibility**
- Proper ARIA labels for screen readers
- Semantic HTML structure
- Keyboard navigation support
- Dark mode support

## File Structure

```
.
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # Responsive styles and mobile optimizations
├── js/
│   ├── app.js          # Main application logic
│   └── app.test.js     # Unit tests
└── README.md           # This file
```

## How to Use

### Starting the App

1. Open `index.html` in a web browser
2. The app initializes with 2 default players (Player 1, Player 2)

### Adding Points

- **Tap a player card** to add the specified points
- **Use quick buttons** (−5, +5) to adjust points quickly
- **Edit the input field** to set custom point amounts
- **Swipe to scroll** and see more players on mobile

### Managing Players

- **Add Player**: Click the "+ Add Player" button (up to max setting)
- **Remove Player**: Click the trash icon (🗑️) on a player card
- **Edit Name**: Click on a player's name to edit
- **Reset Scores**: Click "Reset Scores" to set all players to starting value

### Settings

- **Open Settings**: Click the gear icon (⚙️) in the header
- **Max Players**: Set the maximum number of allowed players (2-10)
- **Starting Score**: Set the initial score for new games (default: 0)
- **Save**: Click "Save" to persist settings

## Responsive Design Features

### Mobile (< 600px)
- Single-column layout
- Optimized font sizes
- Compact spacing for small screens
- Full-width buttons and inputs

### Tablet (600px - 1024px)
- Balanced layout
- Readable text and buttons
- Multi-row player display

### Desktop (> 1024px)
- Optimal spacing
- Full features displayed
- Enhanced visual hierarchy

### Landscape Mode (< 600px height)
- Condensed spacing
- Vertical optimization
- Quick access to all controls

## Accessibility

- **Touch Targets**: All interactive elements are at least 44×44px
- **Input Types**: Uses `inputmode="numeric"` for number fields
- **ARIA Labels**: Proper labels for buttons and inputs
- **Color Contrast**: Meets WCAG AA standards
- **Keyboard Navigation**: Fully operable with keyboard
- **Screen Readers**: Semantic HTML and proper ARIA attributes

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## Technical Details

### No Horizontal Scrolling
- All content fits within viewport width
- Flexible layouts prevent overflow
- Media queries optimize for all sizes
- Scalable text and components

### Scrollable Scoreboard
- Scrollable container for player list
- Smooth scrolling with momentum on mobile
- Bottom sticky controls for easy access

### Touch Optimization
- Large tap targets (minimum 44×44px)
- Touch-friendly spacing between elements
- Quick input buttons for common values
- No hover states interfering with touch

## Testing

Run the test suite:

```bash
node js/app.test.js
```

Test coverage includes:
- ✅ Application initialization
- ✅ Player management (add, remove, edit)
- ✅ Score management (update, reset)
- ✅ Input handling
- ✅ Settings management
- ✅ Mobile responsiveness
- ✅ Utility functions

## Performance

- Lightweight: ~50KB total (HTML, CSS, JS)
- No external dependencies
- Fast rendering with vanilla JavaScript
- Efficient DOM updates
- LocalStorage for settings persistence

## Privacy

- All data stored locally in browser
- No server communication
- No tracking or analytics
- No personal data collection

## License

MIT License - Feel free to use and modify

## Contributing

Contributions are welcome! Please ensure:
- Code follows FORGE standards
- All tests pass
- Mobile responsiveness is maintained
- Accessibility requirements are met
