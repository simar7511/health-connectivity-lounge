
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Use a simple mounting approach with minimal error handling
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
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log("App mounted successfully");
  } catch (error) {
    console.error("Failed to mount application:", error);
    
    // Simple fallback UI for critical errors
    const errorDiv = document.createElement("div");
    errorDiv.style.padding = "20px";
    errorDiv.style.margin = "20px";
    errorDiv.style.border = "1px solid red";
    errorDiv.innerHTML = `
      <h2>Application Error</h2>
      <p>The application failed to start. Please refresh the page.</p>
      <button onclick="window.location.reload()">Refresh</button>
    `;
    
    document.body.appendChild(errorDiv);
  }
};

// Add a small delay before mounting to allow environment to stabilize
setTimeout(mount, 100);
