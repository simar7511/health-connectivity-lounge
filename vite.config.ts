
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Basic setup for dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimized configuration for faster development updates
export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    port: 8080,
    host: true,
    strictPort: false,
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
    hmr: {
      overlay: true,
      timeout: 10000,
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
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage', 'firebase/messaging'],
        }
      }
    }
  },
  // Optimize dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
    exclude: []
  }
});
