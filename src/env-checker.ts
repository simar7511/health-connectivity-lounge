
// Simple utility to check for environment variables
const checkEnvVars = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_FIREBASE_MEASUREMENT_ID'
  ];

  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.warn('⚠️ Missing environment variables:', missing.join(', '));
    console.log('Using hardcoded values instead');
    return false;
  }
  
  console.log('✅ All environment variables present');
  return true;
};

// Add this function to help debug the environment variables
export const getEnvVarStatus = () => {
  const firebaseVars = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Present' : 'Missing',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Present' : 'Missing',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Present' : 'Missing',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? 'Present' : 'Missing',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? 'Present' : 'Missing',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ? 'Present' : 'Missing',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ? 'Present' : 'Missing'
  };
  
  return {
    mode: import.meta.env.MODE,
    baseUrl: import.meta.env.BASE_URL,
    firebase: firebaseVars
  };
};

export default checkEnvVars;
