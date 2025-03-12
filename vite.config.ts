
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Use a simple, minimal configuration to avoid service crashes
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,         // As required in project instructions
    open: false,        // Don't open browser automatically
    hmr: {
      overlay: false    // Disable HMR overlay which can cause issues
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    sourcemap: true,
    minify: "esbuild",
    target: "es2015"
  },
  optimizeDeps: {
    entries: ["src/main.tsx"],
    esbuildOptions: {
      target: "es2015"
    }
  }
});
