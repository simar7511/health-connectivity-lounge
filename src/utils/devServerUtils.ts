
/**
 * Utility to help with development server issues
 */

// Check for development server connection issues and attempt to recover
export const checkDevServerConnection = () => {
  if (import.meta.env.DEV) {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${wsProtocol}://${window.location.host}`;

    console.log('Checking development server connection to:', wsUrl);
    
    let connectionAttempts = 0;
    const maxAttempts = 5; // Increased from 3 to 5
    
    const checkConnection = () => {
      if (connectionAttempts >= maxAttempts) {
        console.error('Failed to reconnect to development server after multiple attempts');
        console.log('You may need to manually reload the page or restart the server');
        return;
      }
      
      connectionAttempts++;
      
      try {
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('Successfully connected to development server');
          ws.close();
        };
        
        ws.onerror = () => {
          console.log(`Connection attempt ${connectionAttempts} failed, retrying...`);
          // Exponential backoff for retry attempts
          setTimeout(checkConnection, 1000 * Math.pow(2, connectionAttempts - 1));
        };
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        setTimeout(checkConnection, 2000);
      }
    };
    
    // Only run this check if we detect an issue with HMR
    window.addEventListener('error', (event) => {
      // Check if the error is related to HMR or the development server
      if (
        event.message.includes('HMR') || 
        event.message.includes('hot') || 
        event.message.includes('refresh') ||
        event.message.includes('service is no longer running')
      ) {
        console.log('Development server error detected, checking connection...');
        checkConnection();
      }
    });
  }
};

// Monitor for errors and reload if necessary
export const setupErrorMonitoring = () => {
  if (import.meta.env.DEV) {
    let consecutiveErrors = 0;
    let serverErrors = 0;
    
    window.addEventListener('error', (event) => {
      // Check for specific server-related errors
      if (event.message.includes('service is no longer running') || 
          event.message.includes('Failed to load module script') ||
          event.message.includes('Failed to fetch')) {
        serverErrors++;
        
        if (serverErrors > 2) {
          console.log('Multiple server-related errors detected, attempting page reload...');
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      }
      
      consecutiveErrors++;
      
      if (consecutiveErrors > 8) { // Increased from 5 to 8
        console.log('Too many consecutive errors, reloading page...');
        window.location.reload();
      }
      
      // Reset error count after 15 seconds without errors (increased from 10)
      setTimeout(() => {
        consecutiveErrors = 0;
        serverErrors = 0;
      }, 15000);
    });
  }
};
