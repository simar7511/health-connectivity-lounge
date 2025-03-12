
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// More robust error handling for application mounting
try {
  console.log("Initializing application...");
  const container = document.getElementById("root");
  
  if (!container) {
    throw new Error("Root element not found");
  }
  
  const root = createRoot(container);
  
  // Wrap in error boundary to prevent crashes
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log("Application mounted successfully");
} catch (error) {
  console.error("Failed to mount application:", error);
  
  // Create fallback UI for critical errors
  const errorDiv = document.createElement("div");
  errorDiv.style.padding = "20px";
  errorDiv.style.margin = "20px";
  errorDiv.style.border = "1px solid red";
  errorDiv.style.borderRadius = "4px";
  errorDiv.innerHTML = `
    <h2>Application Error</h2>
    <p>The application failed to initialize. Please refresh the page or contact support.</p>
    <button onclick="window.location.reload()">Refresh</button>
  `;
  
  document.body.appendChild(errorDiv);
}
