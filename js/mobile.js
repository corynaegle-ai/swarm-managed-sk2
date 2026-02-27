/**
 * Mobile Optimization Module
 * Enhances mobile user experience with touch event handlers,
 * auto-focus management, zoom prevention, and virtual keyboard optimization
 */

class MobileOptimizer {
  constructor() {
    this.touchTimeout = null;
    this.isTouch = false;
    this.init();
  }

  /**
   * Initialize mobile optimizations
   */
  init() {
    // Only initialize on touch-capable devices
    if (!this.isTouchDevice()) {
      console.log('Touch device not detected, mobile optimizations skipped');
      return;
    }

    console.log('Initializing mobile optimizations');
    this.setupTouchEventHandlers();
    this.optimizeInputBehavior();
    this.optimizeVirtualKeyboard();
    this.setupSwipeGestures();
  }

  /**
   * Detect if device supports touch events
   */
  isTouchDevice() {
    return (
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0)
    );
  }

  /**
   * Setup touch event handlers for faster responsiveness
   * Touch events respond faster than click events on mobile devices
   */
  setupTouchEventHandlers() {
    document.addEventListener('touchstart', (e) => {
      this.isTouch = true;
      clearTimeout(this.touchTimeout);

      // Add visual feedback for touch interaction
      const target = e.target.closest('button, [role="button"], input[type="button"], input[type="submit"]');
      if (target) {
        target.classList.add('is-touching');
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      // Remove visual feedback after touch ends
      const target = e.target.closest('button, [role="button"], input[type="button"], input[type="submit"]');
      if (target) {
        target.classList.remove('is-touching');
      }

      // Debounce touch state
      this.touchTimeout = setTimeout(() => {
        this.isTouch = false;
      }, 100);
    }, { passive: true });

    // Hide focus styles during touch to avoid visual clutter
    document.addEventListener('touchstart', () => {
      document.body.classList.add('is-touch-active');
    }, { passive: true });

    document.addEventListener('touchend', () => {
      document.body.classList.remove('is-touch-active');
    }, { passive: true });
  }

  /**
   * Optimize input field behavior for mobile
   * Implements auto-focus management and prevents unwanted zoom
   */
  optimizeInputBehavior() {
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach((input) => {
      // Auto-focus on form fields with autofocus attribute
      if (input.hasAttribute('autofocus')) {
        // Delay focus to ensure DOM is fully ready
        setTimeout(() => {
          try {
            input.focus();
          } catch (e) {
            console.warn('Could not focus input:', e);
          }
        }, 100);
      }

      // Add focus event listener for better UX
      input.addEventListener('focus', (e) => {
        e.target.classList.add('is-focused');
        // Prevent automatic zoom on focus by not triggering viewport changes
        // Font size should be >= 16px to prevent zoom (handled by CSS)
      });

      input.addEventListener('blur', (e) => {
        e.target.classList.remove('is-focused');
      });

      // Prevent zoom on input focus by ensuring font size is at least 16px
      // This is enforced through CSS, but we can add a marker class
      if (input.getAttribute('type') === 'text' || 
          input.getAttribute('type') === 'number' ||
          input.getAttribute('type') === 'email' ||
          input.getAttribute('type') === 'tel') {
        input.classList.add('prevent-zoom-input');
      }
    });
  }

  /**
   * Optimize virtual keyboard behavior
   * Sets inputmode='numeric' for number fields to show numeric keyboard
   */
  optimizeVirtualKeyboard() {
    // Optimize number inputs to show numeric keyboard
    const numberInputs = document.querySelectorAll('input[type="number"], [data-numeric="true"]');
    numberInputs.forEach((input) => {
      input.setAttribute('inputmode', 'numeric');
      input.classList.add('numeric-input');
    });

    // Setup mutation observer to handle dynamically added inputs
    this.observeNewInputs();
  }

  /**
   * Observe DOM for dynamically added input fields and optimize them
   */
  observeNewInputs() {
    // Use a simple approach: re-optimize inputs on common events
    document.addEventListener('DOMContentLoaded', () => this.optimizeVirtualKeyboard());
    
    // Also handle common dynamic input scenarios
    const observer = new MutationObserver((mutations) => {
      let hasNewInputs = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              if (node.matches('input[type="number"], [data-numeric="true"]') ||
                  node.querySelector('input[type="number"], [data-numeric="true"]')) {
                hasNewInputs = true;
              }
            }
          });
        }
      });

      if (hasNewInputs) {
        // Re-run keyboard optimization on new inputs
        const numberInputs = document.querySelectorAll('input[type="number"], [data-numeric="true"]');
        numberInputs.forEach((input) => {
          if (!input.hasAttribute('inputmode')) {
            input.setAttribute('inputmode', 'numeric');
            input.classList.add('numeric-input');
          }
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Setup swipe gestures for navigation if applicable
   * Detects left/right swipes for navigation purposes
   */
  setupSwipeGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50; // Minimum distance for swipe

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX, swipeThreshold);
    }, { passive: true });
  }

  /**
   * Handle swipe gestures
   * @param {number} startX - Starting X coordinate
   * @param {number} endX - Ending X coordinate
   * @param {number} threshold - Minimum distance to register as swipe
   */
  handleSwipe(startX, endX, threshold) {
    const diff = startX - endX;
    const absDiff = Math.abs(diff);

    if (absDiff < threshold) {
      return; // Not a significant swipe
    }

    if (diff > 0) {
      // Swiped left - could trigger next page/section
      this.dispatchSwipeEvent('swipe-left');
    } else {
      // Swiped right - could trigger previous page/section
      this.dispatchSwipeEvent('swipe-right');
    }
  }

  /**
   * Dispatch custom swipe event
   * @param {string} direction - Direction of swipe ('swipe-left' or 'swipe-right')
   */
  dispatchSwipeEvent(direction) {
    const event = new CustomEvent('mobileswipe', {
      detail: { direction }
    });
    document.dispatchEvent(event);
    console.log(`Swipe detected: ${direction}`);
  }
}

// Initialize mobile optimizer when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.mobileOptimizer = new MobileOptimizer();
  });
} else {
  window.mobileOptimizer = new MobileOptimizer();
}

export default MobileOptimizer;
