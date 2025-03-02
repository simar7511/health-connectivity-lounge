
import { useState, useEffect } from 'react';

/**
 * Hook to detect and track online status
 * @returns Current online status (boolean)
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Update network status
    const handleOnline = () => {
      setIsOnline(true);
      console.log("Network connection restored");
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log("Network connection lost");
    };

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Optional: Check connectivity actively
    const checkConnectivity = async () => {
      try {
        const response = await fetch('https://www.google.com/favicon.ico', { 
          mode: 'no-cors',
          cache: 'no-store',
        });
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    // Check connectivity periodically
    const interval = setInterval(checkConnectivity, 30000);

    // Initial check
    checkConnectivity();

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return isOnline;
}
