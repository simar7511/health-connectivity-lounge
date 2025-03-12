
/**
 * Utility to help with development server issues
 */

// Simple check for development server connection
export const checkDevServerConnection = () => {
  if (import.meta.env.DEV) {
    console.log('Development server started');
  }
};

// Simple error monitoring
export const setupErrorMonitoring = () => {
  if (import.meta.env.DEV) {
    window.addEventListener('error', (event) => {
      console.error('Application error:', event.message);
    });
  }
};
