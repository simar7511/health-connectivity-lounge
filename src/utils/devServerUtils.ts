
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
    const maxAttempts = 3;
    
    const checkConnection = () => {
      if (connectionAttempts >= maxAttempts) {
        console.error('Failed to reconnect to development server after multiple attempts');
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
          setTimeout(checkConnection, 2000);
        };
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
      }
    };
    
    // Only run this check if we detect an issue with HMR
    window.addEventListener('error', (event) => {
      if (
        event.message.includes('HMR') || 
        event.message.includes('hot') || 
        event.message.includes('refresh')
      ) {
        console.log('HMR error detected, checking connection...');
        checkConnection();
      }
    });
  }
};

// Monitor for errors and reload if necessary
export const setupErrorMonitoring = () => {
  if (import.meta.env.DEV) {
    let consecutiveErrors = 0;
    
    window.addEventListener('error', () => {
      consecutiveErrors++;
      
      if (consecutiveErrors > 5) {
        console.log('Too many consecutive errors, reloading page...');
        window.location.reload();
      }
      
      // Reset error count after 10 seconds without errors
      setTimeout(() => {
        consecutiveErrors = 0;
      }, 10000);
    });
  }
};
