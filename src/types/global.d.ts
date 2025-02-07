
// Define the custom window interface
interface CustomWindow extends Window {
  recaptchaVerifier?: RecaptchaVerifier | null;
  confirmationResult?: any;
  grecaptcha?: any;
}

// Export the type definition
declare global {
  interface Window extends CustomWindow {}
}

export {};
