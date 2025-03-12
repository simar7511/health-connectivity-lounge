
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Simplified configuration for better stability
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
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
    minify: false,  // Disable minification for more stable builds
    target: "es2018"  // Use a more compatible target
  },
  optimizeDeps: {
    force: true,  // Force dependency pre-bundling
    esbuildOptions: {
      target: "es2018",
      supported: { 
        'top-level-await': true 
      },
      loglevel: 'error'
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});
