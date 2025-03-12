
/**
 * Simple dev server utilities
 */

// Basic check if the server is responsive
export const checkServerHealth = () => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(false);
    }, 3000);
    
    fetch('/')
      .then(() => {
        clearTimeout(timeout);
        resolve(true);
      })
      .catch(() => {
        clearTimeout(timeout);
        resolve(false);
      });
  });
};
