
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Enhanced error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Prevent the error from crashing the application
  event.preventDefault();
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent the rejection from crashing the application
  event.preventDefault();
});

// Clean any potentially conflicting state
if (typeof window !== 'undefined') {
  window.localStorage.removeItem('vite-previous-packages');
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Ensure index.html has <div id='root'></div>");
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
