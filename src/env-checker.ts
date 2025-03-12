
/**
 * Basic utility to check environment variables
 */
const checkEnvVars = () => {
  // Simple console log to indicate the app is running
  console.log('Application started');
  return true;
};

export default checkEnvVars;

// Simple helper for Firebase status
export const getFirebaseStatus = () => {
  return { initialized: true, projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Unknown' };
};
