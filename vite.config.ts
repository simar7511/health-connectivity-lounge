
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    componentTagger()
  ],
  server: {
    host: true, // Ensures the server is accessible from any network
    port: 8080,
    cors: true,
    strictPort: true, // Prevents Vite from changing the port automatically
    headers: {
      "Access-Control-Allow-Origin": "*", // Ensures CORS allows all origins
    },
    hmr: {
      host: "958bb7b1-eb32-49bb-9d2f-ce3e8224ab61.lovableproject.com"
    },
    proxy: {
      // Add proxy configurations if necessary
    },
    fs: {
      allow: [".."]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    outDir: "dist",
    sourcemap: true
  }
});
