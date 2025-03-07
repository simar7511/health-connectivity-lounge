
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Enhanced error handling with performance optimizations
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error?.message || 'Unknown error');
  // Prevent the error from crashing the application
  event.preventDefault();
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason?.message || 'Unknown rejection');
  // Prevent the rejection from crashing the application
  event.preventDefault();
});

// Clean any potentially conflicting state
if (typeof window !== 'undefined') {
  window.localStorage.removeItem('vite-previous-packages');
}

// Better module recovery for esbuild service crashes
const recoverFromESBuildCrash = () => {
  console.log("Attempting to recover from potential esbuild service crash...");
  
  // Force refresh the page if we detect specific issues
  if (!window.React || !window.ReactDOM) {
    console.warn("React modules not properly loaded, refreshing page...");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    return false;
  }
  
  // If we detect an esbuild service crash in console errors, reload after a delay
  const recentErrors = window.performance
    ?.getEntries()
    ?.filter(entry => 
      entry.entryType === 'resource' && 
      entry.name.includes('esbuild') && 
      (entry as PerformanceResourceTiming).duration < 10
    );
  
  if (recentErrors && recentErrors.length > 0) {
    console.warn("Detected potential esbuild service issues, refreshing page...");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    return false;
  }
  
  return true;
};

// Add a recovery mechanism with multiple attempts
let mountAttempts = 0;
const MAX_MOUNT_ATTEMPTS = 3;

const mountApp = () => {
  try {
    mountAttempts++;
    console.log(`Mount attempt ${mountAttempts}/${MAX_MOUNT_ATTEMPTS}`);
    
    // First check if we can recover from any esbuild issues
    if (!recoverFromESBuildCrash()) {
      if (mountAttempts < MAX_MOUNT_ATTEMPTS) {
        console.log(`Scheduling retry ${mountAttempts + 1}/${MAX_MOUNT_ATTEMPTS}`);
        setTimeout(mountApp, 1000);
      }
      return;
    }
    
    const rootElement = document.getElementById("root");

    if (!rootElement) {
      console.error("Root element not found. Ensure index.html has <div id='root'></div>");
      return;
    }

    try {
      const root = createRoot(rootElement);

      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      
      console.log("App mounted successfully");
      mountAttempts = 0; // Reset counter on success
    } catch (error) {
      console.error("Error mounting app:", error);
      
      // Try one more time after a delay if there was an error
      if (mountAttempts < MAX_MOUNT_ATTEMPTS) {
        console.log(`Mount failed. Scheduling retry ${mountAttempts + 1}/${MAX_MOUNT_ATTEMPTS}`);
        setTimeout(mountApp, 1000);
      } else {
        // Last resort: try mounting without StrictMode
        try {
          console.log("Final attempt: mounting without StrictMode");
          const root = createRoot(rootElement);
          root.render(<App />);
          console.log("App mounted successfully without StrictMode");
        } catch (finalError) {
          console.error("All mounting attempts failed:", finalError);
        }
      }
    }
  } catch (outerError) {
    console.error("Critical error in mount process:", outerError);
  }
};

// Check if document is fully loaded
if (document.readyState === 'complete') {
  console.log("Document already loaded, mounting app");
  setTimeout(mountApp, 100); // Small delay for module initialization
} else {
  console.log("Document not yet loaded, waiting for load event");
  window.addEventListener('load', () => {
    console.log("Document loaded, mounting app");
    setTimeout(mountApp, 100); // Small delay for module initialization
  });
}
