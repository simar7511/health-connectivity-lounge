
/**
 * Enhanced utility to check environment variables
 */
const checkEnvVars = () => {
  // Check for essential Firebase configuration
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID'
  ];
  
  const missingVars = requiredEnvVars.filter(
    varName => !import.meta.env[varName]
  );
  
  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
};

export default checkEnvVars;

// Enhanced Firebase status helper with error handling
export const getFirebaseStatus = () => {
  try {
    return { 
      initialized: true, 
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Unknown',
      environment: import.meta.env.DEV ? 'development' : 'production'
    };
  } catch (error) {
    console.error('Error checking Firebase status:', error);
    return { 
      initialized: false, 
      projectId: 'Unknown',
      environment: 'unknown',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
