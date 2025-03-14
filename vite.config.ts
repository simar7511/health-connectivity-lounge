
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Improved configuration for better stability and compatibility
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
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
    target: "es2018",
    // Exclude problematic dependencies from processing
    commonjsOptions: {
      exclude: [
        /node_modules\/@xenova\/transformers/,
        /node_modules\/sharp/
      ]
    }
  },
  optimizeDeps: {
    exclude: ['@xenova/transformers', 'sharp'],
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
