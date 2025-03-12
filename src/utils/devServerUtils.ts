
/**
 * Advanced dev server stability utilities
 */

let restartAttempts = 0;
const MAX_RESTART_ATTEMPTS = 3;

// Advanced error handler for ESBuild service failures
export const setupDevErrorHandlers = () => {
  if (typeof window !== 'undefined') {
    // Handle ESBuild service errors
    window.addEventListener('error', (event) => {
      if (event.message.includes('service is no longer running')) {
        console.log('ESBuild service error detected, attempting recovery...');
        
        // Prevent default error handling to avoid cascading failures
        event.preventDefault();
        
        // Track restart attempts
        restartAttempts++;
        
        if (restartAttempts <= MAX_RESTART_ATTEMPTS) {
          console.log(`Recovery attempt ${restartAttempts}/${MAX_RESTART_ATTEMPTS}`);
          
          // Attempt to recover by delaying page reload
          setTimeout(() => {
            console.log('Attempting page reload...');
            window.location.reload();
          }, 2000 * restartAttempts); // Progressive backoff
          
          return true;
        } else {
          console.log('Maximum restart attempts reached. Please restart the dev server manually.');
        }
      }
    });
    
    // Reset counter when page successfully loads
    window.addEventListener('load', () => {
      restartAttempts = 0;
      console.log('Page loaded successfully, reset restart counter.');
    });
  }
};

// Initialize the error handlers in dev mode only
if (import.meta.env.DEV) {
  setupDevErrorHandlers();
  console.log('Dev server error handlers initialized');
}

// Check if the server is responsive
export const checkServerHealth = () => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(false);
    }, 3000);
    
    fetch('/')
      .then(() => {
        clearTimeout(timeout);
        resolve(true);
      })
      .catch(() => {
        clearTimeout(timeout);
        resolve(false);
      });
  });
};
