
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { componentTagger } from "lovable-tagger";

// Basic setup for dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Minimal configuration with hard-coded values instead of env variables
export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
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
  }
});
