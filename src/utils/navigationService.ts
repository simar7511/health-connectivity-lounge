
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

// Force the application to start at the homepage
export const ensureHomepageStart = () => {
  // For Lovable compatibility, always ensure we start at homepage
  console.log('Ensuring app starts at homepage');
  
  // Clear any stored authentication state
  localStorage.removeItem('restoreSession');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isProvider');
  
  // If we're not already on the homepage, redirect there
  if (window.location.pathname !== '/' && window.location.pathname !== '/index') {
    console.log('Redirecting to homepage');
    window.location.href = '/';
    return true;
  }
  
  return false;
};

// Helper function to detect first-time visits
export const isFirstVisit = () => {
  const hasVisited = localStorage.getItem('hasVisitedBefore');
  if (!hasVisited) {
    localStorage.setItem('hasVisitedBefore', 'true');
    return true;
  }
  return false;
};
