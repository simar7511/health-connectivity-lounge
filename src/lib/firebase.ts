
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCx60XPDz1pEfh2y4ZyARYDU86h9AxNFXw",
  authDomain: "health-connectivity-01.firebaseapp.com",
  projectId: "health-connectivity-01",
  storageBucket: "health-connectivity-01.appspot.com",
  messagingSenderId: "429069343294",
  appId: "1:429069343294:web:943a1998a83e63353c0f6f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

auth.useDeviceLanguage();

export { auth, db };
