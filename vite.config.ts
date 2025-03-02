
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "/",
  plugins: [
    react()
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
  css: {
    postcss: {
      plugins: [], // This will use the system's postcss.config.js without modification
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    },
    dedupe: ['react', 'react-dom', 'firebase', 'axios', 'tailwind-merge']
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    minify: "esbuild",
    cssMinify: "lightningcss",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase'],
          utils: ['axios', 'tailwind-merge']
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
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase',
      'recharts',
      'input-otp',
      'vaul',
      'cmdk',
      'sonner',
      'axios',
      'react-resizable-panels',
      'embla-carousel-react',
      'tailwind-merge',
      'react-hook-form',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-context-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-hover-card',
      '@radix-ui/react-label',
      '@radix-ui/react-menubar',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group',
      '@radix-ui/react-tooltip'
    ],
    force: true,
    exclude: []
  }
});
