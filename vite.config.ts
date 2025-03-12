
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Basic setup for dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simplified configuration for better stability
export default defineConfig({
  base: "/",
  plugins: [
    react(), // Simplified React plugin without problematic options
  ],
  server: {
    port: 8080,
    host: true,
    watch: {
      usePolling: true, // Enable polling for more reliable file watching
      interval: 1000, // Check for file changes every second
    },
    hmr: {
      overlay: true,
      timeout: 30000, // Increase timeout to 30 seconds
    },
    allowedHosts: ["958bb7b1-eb32-49bb-9d2f-ce3e8224ab61.lovableproject.com", "all"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  // Ensure environment variables are properly handled
  envPrefix: "VITE_",
  // Optimize build
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
  },
  // Optimize dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
    esbuildOptions: {
      target: 'esnext', // Ensure compatibility with modern browsers
    }
  }
});
