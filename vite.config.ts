
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Basic setup for dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimized configuration for faster development updates and better stability
export default defineConfig({
  base: "/",
  plugins: [
    react({
      // Remove the fastRefresh property as it's not supported
    }),
  ],
  server: {
    port: 8080,
    host: true,
    strictPort: false,
    watch: {
      usePolling: true, // Enable polling for more reliable file watching
      interval: 1000, // Check for file changes every second
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
    },
    hmr: {
      overlay: true,
      timeout: 30000, // Increase timeout to 30 seconds
      clientPort: 8080, // Ensure client port matches server port
      protocol: 'ws', // Use websocket protocol
    },
    middlewareMode: false, // Disable middleware mode for better stability
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
    exclude: [],
    esbuildOptions: {
      target: 'esnext', // Ensure compatibility with modern browsers
    }
  }
});
