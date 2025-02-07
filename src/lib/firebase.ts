
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

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

// Setup reCAPTCHA only once
const setUpRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: (response: any) => {
        console.log("✅ reCAPTCHA solved, proceeding with OTP", response);
      },
      "expired-callback": () => {
        console.warn("⚠️ reCAPTCHA expired, reloading...");
        window.recaptchaVerifier?.clear();
        setUpRecaptcha();
      },
    });

    window.recaptchaVerifier.render().catch((error: Error) => {
      console.error("❌ Error rendering reCAPTCHA:", error);
    });
  }
};

export { auth, setUpRecaptcha };
