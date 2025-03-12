
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import checkEnvVars from "./env-checker.ts";

// Check environment variables
checkEnvVars();

// Simple, stable mount pattern
const rootElement = document.getElementById("root");
  
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("Application mounted successfully");
} else {
  console.error("Could not find root element to mount React application");
}
