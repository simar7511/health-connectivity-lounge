
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Error boundary for catching runtime errors
const ErrorFallback = () => {
  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      border: '1px solid red',
      borderRadius: '4px' 
    }}>
      <h2>Something went wrong</h2>
      <p>Please refresh the page to try again.</p>
    </div>
  );
};

// More resilient mount with error handling
try {
  const container = document.getElementById("root");
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.error("Root element not found");
    document.body.innerHTML = "<div>Failed to mount app: root element not found</div>";
  }
} catch (error) {
  console.error("Failed to mount application:", error);
  document.body.innerHTML = "<div>Failed to mount application</div>";
}
