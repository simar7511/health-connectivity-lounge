
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
        console.log('Reloading page to attempt recovery...');
        window.location.reload();
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
          // Simple retry with delay
          setTimeout(checkConnection, 2000);
        };
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        // If we can't even create the WebSocket, reload the page
        if (connectionAttempts >= 2) {
          window.location.reload();
        } else {
          setTimeout(checkConnection, 2000);
        }
      }
    };
    
    // Check for HMR connection issues
    window.addEventListener('error', (event) => {
      // Check if the error is related to HMR or the development server
      if (
        (typeof event.message === 'string' && (
          event.message.includes('service is no longer running') || 
          event.message.includes('Failed to load') ||
          event.message.includes('HMR') || 
          event.message.includes('WebSocket')
        ))
      ) {
        console.log('Development server error detected, attempting recovery...');
        checkConnection();
      }
    });
  }
};

// Monitor for errors and reload if necessary
export const setupErrorMonitoring = () => {
  if (import.meta.env.DEV) {
    let consecutiveErrors = 0;
    let lastErrorTime = 0;
    
    window.addEventListener('error', (event) => {
      const now = Date.now();
      
      // Reset counter if errors are more than 10 seconds apart
      if (now - lastErrorTime > 10000) {
        consecutiveErrors = 0;
      }
      
      lastErrorTime = now;
      consecutiveErrors++;
      
      // If we get multiple errors in a short time, reload the page
      if (consecutiveErrors > 5) {
        console.log('Too many errors detected, reloading page...');
        window.location.reload();
      }
    });
  }
};
