import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import checkEnvVars from "./env-checker.ts";
import { checkDevServerConnection, setupErrorMonitoring } from "./utils/devServerUtils.ts";

// Check environment variables
checkEnvVars();

// Setup development server monitoring in dev mode with slight delay to avoid concurrency issues
if (import.meta.env.DEV) {
  setTimeout(() => {
    checkDevServerConnection();
    setupErrorMonitoring();
  }, 100);
}

// Defer non-essential logging to not block rendering
setTimeout(() => {
  console.log("Environment mode:", import.meta.env.MODE);
  console.log("Base URL:", import.meta.env.BASE_URL);
}, 100);

// Enhanced mounting logic with better error handling
const rootElement = document.getElementById("root");
  
if (rootElement) {
  console.time('App Mount');
  try {
    const root = createRoot(rootElement);
    
    // Remove the non-blocking render that was causing issues
    root.render(
      // Simplified rendering to improve stability
      <App />
    );
    
    console.timeEnd('App Mount');
    console.log("React application mounted successfully");
    
  } catch (error) {
    console.error("Failed to mount React application:", error);
    // Display fallback error UI
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Application Error</h2>
        <p>There was a problem loading the application. Please refresh the page.</p>
        <pre style="text-align: left; background: #f5f5f5; padding: 10px; max-width: 500px; margin: 10px auto; overflow: auto;">${error instanceof Error ? error.message : String(error)}</pre>
        <button onclick="window.location.reload()">Refresh</button>
      </div>
    `;
  }
} else {
  console.error("Could not find root element to mount React application");
  // If running in a browser context, try to create a root element
  if (typeof document !== 'undefined') {
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    document.body.appendChild(newRoot);
    console.log("Created new root element, attempting to mount React application...");
    try {
      const root = createRoot(newRoot);
      root.render(
        <App />
      );
      console.log("React application mounted successfully on created root");
    } catch (error) {
      console.error("Failed to mount React application on created root:", error);
      document.body.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2>Application Error</h2>
          <p>There was a problem loading the application. Please refresh the page.</p>
          <pre style="text-align: left; background: #f5f5f5; padding: 10px; max-width: 500px; margin: 10px auto; overflow: auto;">${error instanceof Error ? error.message : String(error)}</pre>
          <button onclick="window.location.reload()">Refresh</button>
        </div>
      `;
    }
  }
}
