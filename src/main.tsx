
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import checkEnvVars from "./env-checker.ts";

// Simple environment check
checkEnvVars();

// Basic mount without extra complexity
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
