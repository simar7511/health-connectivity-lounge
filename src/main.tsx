
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Basic error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error?.message || 'Unknown error');
  event.preventDefault();
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason?.message || 'Unknown rejection');
  event.preventDefault();
});

// Clean any potentially conflicting state
if (typeof window !== 'undefined') {
  window.localStorage.removeItem('vite-previous-packages');
}

// Simple mounting function with minimal complexity
const mountApp = () => {
  try {
    const rootElement = document.getElementById("root");
    
    if (!rootElement) {
      console.error("Root element not found");
      return;
    }

    const root = createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log("App mounted successfully");
  } catch (error) {
    console.error("Error mounting app:", error);
    // Basic retry mechanism
    setTimeout(() => {
      console.log("Retrying app mount...");
      try {
        const rootElement = document.getElementById("root");
        if (rootElement) {
          const root = createRoot(rootElement);
          root.render(<App />);
        }
      } catch (retryError) {
        console.error("Retry mount failed:", retryError);
      }
    }, 2000);
  }
};

// Mount the app when the document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
