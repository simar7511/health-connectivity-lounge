
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

    // Optional: Check connectivity actively but with a more reliable endpoint
    const checkConnectivity = async () => {
      try {
        // Use a more reliable endpoint that's less likely to be blocked
        const timestamp = new Date().getTime();
        const response = await fetch(`https://httpbin.org/get?nocache=${timestamp}`, { 
          mode: 'cors',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          // Set a timeout to prevent hanging
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          setIsOnline(true);
        } else {
          console.warn("Connectivity check failed with status:", response.status);
          // Don't immediately set offline on a single failed check
        }
      } catch (error) {
        console.warn("Connectivity check error:", error);
        // Check if navigator.onLine still says we're online before setting to offline
        // This helps prevent false negatives from a single failed request
        if (navigator.onLine) {
          console.log("Browser reports online but connectivity check failed");
        } else {
          setIsOnline(false);
        }
      }
    };

    // Check connectivity less frequently to avoid unnecessary requests
    const interval = setInterval(checkConnectivity, 60000); // Check every minute instead of 30 seconds

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
