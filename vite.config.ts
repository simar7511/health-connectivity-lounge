
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { fileURLToPath } from "url";

// Fix for Windows path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/" : "/",
  server: {
    host: "0.0.0.0",
    port: 8080,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    },
  },
  optimizeDeps: {
    exclude: [],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
    }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  }
}));
