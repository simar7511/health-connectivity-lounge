// ✅ Extend the Window interface once, ensuring proper optional properties
interface CustomWindow extends Window {
  recaptchaVerifier?: RecaptchaVerifier | null;
  confirmationResult?: any;
}

// ✅ Explicitly cast the global window object to CustomWindow
const customWindow = window as CustomWindow;
