
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Simple and reliable mounting approach
const mount = () => {
  try {
    console.log("Starting app initialization...");
    const container = document.getElementById("root");
    
    if (!container) {
      console.error("Root element not found");
      return;
    }
    
    const root = createRoot(container);
    root.render(
      <App />
    );
    
    console.log("App mounted successfully");
  } catch (error) {
    console.error("Failed to mount application:", error);
    
    // Simple fallback UI for critical errors
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML = `
      <div style="padding: 20px; margin: 20px; border: 1px solid red;">
        <h2>Application Error</h2>
        <p>The application failed to start. Please refresh the page.</p>
        <button onclick="window.location.reload()">Refresh</button>
      </div>
    `;
    
    document.body.appendChild(errorDiv);
  }
};

// Delay startup to ensure environment is ready
setTimeout(mount, 200);
