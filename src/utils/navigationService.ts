
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
  
  // Navigate to the home page
  navigate("/");
  
  // Optionally force a page refresh to ensure clean state
  // window.location.href = "/";
};
