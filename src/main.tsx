
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Simple mounting logic with debugging information
const rootElement = document.getElementById("root");
  
if (rootElement) {
  console.log("Found root element, mounting React application...");
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("React application mounted successfully");
} else {
  console.error("Could not find root element to mount React application");
}
