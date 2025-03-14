
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Simplified configuration for better stability
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 8080,
    host: "::",
    open: false,
    hmr: {
      overlay: false,
      timeout: 60000
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
    // Exclude problematic native dependencies 
    exclude: ['@xenova/transformers', 'sharp'],
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
});
