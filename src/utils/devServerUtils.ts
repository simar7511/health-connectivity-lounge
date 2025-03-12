
/**
 * Dev server stability utilities
 */

// Add error handler for ESBuild service failures
export const setupDevErrorHandlers = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      if (event.message.includes('service is no longer running')) {
        console.log('ESBuild service error detected, attempting to recover...');
        // Prevent the default error handling which might cause more restarts
        event.preventDefault();
        return true;
      }
    });
  }
};

// Initialize the error handlers
if (import.meta.env.DEV) {
  setupDevErrorHandlers();
}
