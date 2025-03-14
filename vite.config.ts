
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Improved configuration for better stability
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Only use the tagger in development mode if it's available
    mode === 'development' && (() => {
      try {
        // Dynamic import to prevent build errors if the package is missing
        const { componentTagger } = require('lovable-tagger');
        return componentTagger();
      } catch (e) {
        console.warn('Lovable tagger not available or incompatible, skipping');
        return null;
      }
    })()
  ].filter(Boolean),
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
