
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to safely get environment variables with fallbacks
const getEnvVar = (key: string, defaultValue: string): string => {
  try {
    return process.env[key] || defaultValue;
  } catch (e) {
    console.warn(`Error accessing env var ${key}, using default value`, e);
    return defaultValue;
  }
};

// Simplified configuration that won't crash esbuild
export default defineConfig({
  base: "/",
  plugins: [
    react({
      babel: {
        // Less intensive babel configuration
        plugins: [],
        compact: false
      }
    }), 
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
    sourcemap: true,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    minify: "esbuild",
    cssMinify: "lightningcss",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  },
  define: {
    'process.env.VITE_FIREBASE_API_KEY': JSON.stringify("AIzaSyCx60XPDz1pEfh2y4ZyARYDU86h9AxNFXw"),
    'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify("health-connectivity-01.firebaseapp.com"),
    'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify("health-connectivity-01"),
    'process.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify("health-connectivity-01.appspot.com"),
    'process.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify("429069343294"),
    'process.env.VITE_FIREBASE_APP_ID': JSON.stringify("1:429069343294:web:943a1998a83e63353c0f6f"),
    'process.env.VITE_FIREBASE_MEASUREMENT_ID': JSON.stringify("G-3BVWXWV69Q"),
    'process.env.FAKE_AI_KEY': JSON.stringify("health-ai-fake-key-12345")
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      supported: { bigint: true },
      keepNames: true,
      legalComments: 'none',
      logLevel: 'error',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
    },
    force: true,
    exclude: ['firebase']
  },
  esbuild: {
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'unsupported-jsx-comment': 'silent',
      'duplicate-case': 'silent',
    },
    keepNames: true,
    treeShaking: true,
    legalComments: 'none',
    target: 'es2020',
    supported: { bigint: true }
  }
});
