
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
    hmr: {
      clientPort: 443
    },
    proxy: {
      // You can add proxy configuration here if needed
    },
    fs: {
      allow: ['..']
    },
    // Explicitly allow all hosts to connect
    strictPort: false,
    origin: 'http://0.0.0.0:8080',
  },
  preview: {
    host: "0.0.0.0",
    port: 8080
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
