
// Simple utility to check for Firebase availability
const checkFirebaseAvailability = () => {
  try {
    // Import Firebase modules
    const { db, auth, app } = require('./lib/firebase');
    
    // Check if Firebase app object exists and has basic properties
    const isAppInitialized = app && typeof app !== 'undefined' && 'options' in app;
    
    // Check if auth and db are initialized
    const isAuthInitialized = auth && typeof auth !== 'undefined';
    const isDbInitialized = db && typeof db !== 'undefined';
    
    console.log('Firebase availability check:', {
      app: isAppInitialized ? 'Initialized' : 'Failed',
      auth: isAuthInitialized ? 'Initialized' : 'Failed',
      db: isDbInitialized ? 'Initialized' : 'Failed'
    });
    
    return isAppInitialized && isAuthInitialized && isDbInitialized;
  } catch (error) {
    console.error('Error checking Firebase availability:', error);
    return false;
  }
};

// This function can be called from App.tsx or other places
export default checkFirebaseAvailability;

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
