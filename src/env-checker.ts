
/**
 * Simple utility to check for Firebase configuration
 */
const checkEnvVars = () => {
  try {
    // Check if basic Firebase config is available
    const firebaseConfigPresent = 
      !!import.meta.env.VITE_FIREBASE_API_KEY && 
      !!import.meta.env.VITE_FIREBASE_PROJECT_ID;
    
    if (!firebaseConfigPresent) {
      console.warn('Firebase configuration may be incomplete. Check environment variables.');
    } else {
      console.log('Firebase environment variables detected');
    }
    return true;
  } catch (error) {
    console.error('Error checking environment variables:', error);
    return false;
  }
};

export default checkEnvVars;

// Helper to get basic Firebase status
export const getFirebaseStatus = () => {
  try {
    const { app } = require('./lib/firebase');
    return {
      initialized: app && typeof app !== 'undefined' && 'options' in app,
      projectId: app?.options?.projectId || 'Unknown'
    };
  } catch (error) {
    return { initialized: false, projectId: 'Error' };
  }
};
