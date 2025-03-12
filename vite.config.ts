
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Absolute minimal configuration to prevent restart issues
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    hmr: {
      // Disable WebSocket connection attempts that might be causing issues
      protocol: 'ws',
      host: 'localhost',
      port: 8080
    }
  },
  // Disable watching for changes in node_modules
  optimizeDeps: {
    exclude: ['node_modules/**']
  },
  // Use simpler source maps in development
  build: {
    sourcemap: 'inline',
    // Disable watching for file changes during build
    watch: null
  }
});
