
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Improved configuration for better stability
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Remove the lovable-tagger usage that causes conflicts
  ],
  server: {
    port: 8080,
    host: "::",
    open: false,
    hmr: {
      overlay: false,
      timeout: 60000  // Increased timeout for slower environments
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    sourcemap: true,
    minify: false,
    target: "es2018"
  },
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      target: "es2018",
      supported: { 
        'top-level-await': true 
      },
      logLevel: 'error'
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
}));
