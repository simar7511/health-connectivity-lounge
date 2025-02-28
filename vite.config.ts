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
    host: "0.0.0.0",
    port: 8080,
    cors: true,
    allowedHosts: ["958bb7b1-eb32-49bb-9d2f-ce3e8224ab61.lovableproject.com"], // ✅ Allow specific host
    proxy: {
      // You can add proxy configuration here if needed
    },
    fs: {
      allow: ['..']
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
