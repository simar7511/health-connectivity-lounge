
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
  plugins: [react()], // Remove the fastRefresh option since it's not recognized
  server: {
    port: 8080,
    host: true,
    strictPort: false,
    watch: {
      usePolling: false, // Disable polling for better performance
      ignored: ['**/node_modules/**', '**/dist/**'], // Ignore large directories
    },
    hmr: {
      overlay: true,
      timeout: 10000, // Increase timeout to 10 seconds
    },
    allowedHosts: ["958bb7b1-eb32-49bb-9d2f-ce3e8224ab61.lovableproject.com", "all"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  // Don't redefine environment variables, as this can cause issues
  define: {
    // Empty define block to avoid redefining env vars
  },
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
