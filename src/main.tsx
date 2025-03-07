
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
    window.location.reload();
    return false;
  }
  
  return true;
};

// Add a small delay before mounting to ensure all modules are properly loaded
const mountApp = () => {
  // First check if we can recover from any esbuild issues
  if (!recoverFromESBuildCrash()) {
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
  } catch (error) {
    console.error("Error mounting app:", error);
    // Try one more time after a delay if there was an error
    setTimeout(() => {
      try {
        const root = createRoot(rootElement);
        root.render(<App />);
        console.log("App mounted successfully on second attempt");
      } catch (retryError) {
        console.error("Failed to mount app even after retry:", retryError);
      }
    }, 1000);
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
