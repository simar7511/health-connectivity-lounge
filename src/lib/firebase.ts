
import { initializeApp } from "firebase/app";
import { getFirestore, setLogLevel } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  // 🔥 Enable Firestore Debug Logging
  setLogLevel("debug");

  console.log("✅ Firebase initialized:", app);
  console.log("✅ Firestore initialized:", db);
  console.log("✅ Authentication initialized:", auth);

  export { db, auth };
} catch (error: any) {
  console.error("❌ Firebase initialization error:", error);
  
  // Show error using toast
  const { toast } = useToast();
  toast({
    variant: "destructive",
    title: "Firebase Configuration Error",
    description: "Please ensure Firebase is properly configured. Error: " + error.message
  });

  // Export empty objects to prevent runtime errors
  export const db = {} as any;
  export const auth = {} as any;
}
