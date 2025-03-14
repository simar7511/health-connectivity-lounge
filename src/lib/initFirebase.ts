
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Firebase initialization with hardcoded config
 */
export const initializeFirebase = () => {
  try {
    // Using hardcoded config instead of environment variables
    // since we're having issues with env variables
    const firebaseConfig = {
      apiKey: "AIzaSyCx60XPDz1pEfh2y4ZyARYDU86h9AxNFXw",
      authDomain: "health-connectivity-01.firebaseapp.com",
      projectId: "health-connectivity-01",
      storageBucket: "health-connectivity-01.appspot.com",
      messagingSenderId: "429069343294",
      appId: "1:429069343294:web:943a1998a83e63353c0f6f",
      measurementId: "G-3BVWXWV69Q"
    };
    
    console.log("Initializing Firebase with config:", {
      apiKey: firebaseConfig.apiKey ? "Present" : "Missing",
      authDomain: firebaseConfig.authDomain ? "Present" : "Missing",
      projectId: firebaseConfig.projectId ? "Present" : "Missing",
      storageBucket: firebaseConfig.storageBucket ? "Present" : "Missing"
    });
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);
    
    console.log("Firebase initialized successfully");
    
    return { 
      initialized: true, 
      app, 
      auth, 
      db, 
      storage
    };
  } catch (error) {
    console.error("Firebase initialization error:", error);
    return { 
      initialized: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

export default initializeFirebase;
