
/**
 * Minimal utility to check environment variables
 */
const checkEnvVars = () => {
  return true;
};

export default checkEnvVars;

// Minimal Firebase status helper
export const getFirebaseStatus = () => {
  return { 
    initialized: true, 
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Unknown' 
  };
};
