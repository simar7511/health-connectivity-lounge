
/**
 * Simple utility to check environment variables
 */
export const checkEnvVars = () => {
  // Check for essential Firebase configuration
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID'
  ];
  
  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName]
  );
  
  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
    return {
      valid: false,
      missing: missingVars
    };
  }
  
  return {
    valid: true,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
  };
};

export default checkEnvVars;
