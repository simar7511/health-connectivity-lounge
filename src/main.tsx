
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Enhanced mounting logic with better error handling
const rootElement = document.getElementById("root");
  
if (rootElement) {
  console.log("Found root element, mounting React application...");
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("React application mounted successfully");
  } catch (error) {
    console.error("Failed to mount React application:", error);
    // Display fallback error UI
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Application Error</h2>
        <p>There was a problem loading the application. Please refresh the page.</p>
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
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      console.log("React application mounted successfully on created root");
    } catch (error) {
      console.error("Failed to mount React application on created root:", error);
    }
  }
}
