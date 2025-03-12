
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Ultra minimal configuration to prevent restart issues
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Changed from 8080 to avoid potential conflicts
    host: true,
    hmr: false // Disable HMR completely to prevent WebSocket connection issues
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  // Use direct cache strategy for better stability
  cacheDir: ".vite_stable_cache",
  // Disable watch for improved stability
  clearScreen: false,
  build: {
    // Simplify source maps
    sourcemap: true,
    minify: false
  }
});
