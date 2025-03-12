
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,         // Using a different port to avoid conflicts
    strictPort: true,   // Prevent port conflicts
    hmr: {
      timeout: 5000     // Increase HMR timeout
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
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    force: true     // Force dependency pre-bundling
  },
  // Using a simple, stable cache directory
  cacheDir: "node_modules/.vite"
});
