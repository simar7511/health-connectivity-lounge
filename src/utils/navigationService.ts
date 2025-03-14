
import { toast } from "@/hooks/use-toast";

export const logNavigationAttempt = (
  fromPage: string, 
  toPage: string, 
  params: Record<string, any> = {}
) => {
  console.log(`Navigation: ${fromPage} → ${toPage}`, params);
};

export const handleNavigationError = (error: any, fallbackPath: string) => {
  console.error("Navigation error:", error);
  toast({
    variant: "destructive",
    title: "Navigation Error",
    description: "There was a problem navigating to the requested page. Redirecting to a safe location."
  });
  
  // Use window.location as a fallback when React Router fails
  window.location.href = fallbackPath;
};

export const clearNavigationState = () => {
  // Clear any navigation-related state that might be causing issues
  const navigationStateKeys = [
    "navigationAttempt",
    "lastVisitedPage"
  ];
  
  navigationStateKeys.forEach(key => sessionStorage.removeItem(key));
};

export const navigateAfterLogout = (navigate: any) => {
  // Clear any session/local storage items that should be removed on logout
  clearNavigationState();
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isProvider');
  localStorage.removeItem('restoreSession');
  
  // Navigate to the home page
  navigate("/");
};

// Ensure the application always starts at the homepage
export const ensureHomepageStart = () => {
  // Check if this is the first page load of the session
  const isFirstPageLoad = !sessionStorage.getItem('appInitialized');
  
  if (isFirstPageLoad) {
    // Mark that the app has been initialized this session
    sessionStorage.setItem('appInitialized', 'true');
    
    // Clear session restoration flag to ensure we start at welcome page
    localStorage.removeItem('restoreSession');
    
    // If we're not already on the homepage, redirect there
    if (window.location.pathname !== '/' && window.location.pathname !== '/index') {
      console.log('First page load detected, redirecting to homepage');
      window.location.href = '/';
      return true;
    }
  }
  
  return false;
};
