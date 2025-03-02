
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
    host: true, 
    port: 8080,
    cors: true,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    hmr: {
      host: "958bb7b1-eb32-49bb-9d2f-ce3e8224ab61.lovableproject.com"
    },
    allowedHosts: ["958bb7b1-eb32-49bb-9d2f-ce3e8224ab61.lovableproject.com"],
    fs: {
      allow: ["..", "./"],
      strict: false
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Disable sourcemaps for faster builds
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    minify: "esbuild",
    cssMinify: "lightningcss",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase']
        }
      }
    }
  },
  define: {
    'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(process.env.VITE_FIREBASE_API_KEY || "AIzaSyCx60XPDz1pEfh2y4ZyARYDU86h9AxNFXw"),
    'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.VITE_FIREBASE_AUTH_DOMAIN || "health-connectivity-01.firebaseapp.com"),
    'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(process.env.VITE_FIREBASE_PROJECT_ID || "health-connectivity-01"),
    'process.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.VITE_FIREBASE_STORAGE_BUCKET || "health-connectivity-01.appspot.com"),
    'process.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "429069343294"),
    'process.env.VITE_FIREBASE_APP_ID': JSON.stringify(process.env.VITE_FIREBASE_APP_ID || "1:429069343294:web:943a1998a83e63353c0f6f"),
    'process.env.VITE_FIREBASE_MEASUREMENT_ID': JSON.stringify(process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3BVWXWV69Q")
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    },
    force: false, // Don't force re-optimization
    exclude: ['firebase', '@firebase/app', '@firebase/firestore', '@firebase/auth'],
  }
});
