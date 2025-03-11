
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

// Create auth context
type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  error: Error | null;
  initialized: boolean;
  isProvider: boolean;
  loginProvider: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  error: null,
  initialized: false,
  isProvider: false,
  loginProvider: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);
  // Check localStorage first for isProvider status - this ensures we maintain state on refreshes
  const [isProvider, setIsProvider] = useState(() => localStorage.getItem('isProvider') === 'true');

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    console.log("Initial isProvider state:", isProvider);
    let unsubscribe = () => {};
    
    // Check if auth is available first
    if (!auth || typeof auth !== 'object' || !('onAuthStateChanged' in auth)) {
      console.error("Firebase Auth is not properly initialized");
      setError(new Error("Authentication service is currently unavailable"));
      setLoading(false);
      return unsubscribe;
    }
    
    try {
      unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          console.log("Auth state changed:", user ? `User logged in: ${user.email}` : "No user");
          setCurrentUser(user);
          
          // Check localStorage first for provider status, which takes precedence
          const storedIsProvider = localStorage.getItem('isProvider') === 'true';
          
          if (storedIsProvider) {
            console.log("User is a provider (from localStorage)");
            setIsProvider(true);
          } else if (user && user.email) {
            // If not in localStorage, check email domain
            const isProviderUser = user.email.endsWith('@provider.com') || 
                                 user.email.endsWith('@health.org') || 
                                 user.email.endsWith('@clinic.com') ||
                                 user.email.endsWith('@gmail.com') ||
                                 user.email.endsWith('@yahoo.com') ||
                                 user.email.endsWith('@outlook.com') ||
                                 user.email.endsWith('@hotmail.com') ||
                                 user.email === 'provider@test.com';
            
            console.log(`User is a provider based on email: ${isProviderUser}`);
            setIsProvider(isProviderUser);
            
            if (isProviderUser) {
              localStorage.setItem('isProvider', 'true');
            }
          } else {
            // If no user or provider status, make sure we're not showing as provider
            setIsProvider(false);
          }
          
          // Log the current state for debugging
          console.log("Auth state updated:", { 
            user: user?.email || "none", 
            isProvider: storedIsProvider || (user?.email ? "checking email" : false),
            storedProvider: localStorage.getItem('isProvider')
          });
          
          setLoading(false);
          setInitialized(true);
        },
        (err) => {
          console.error("Auth state error:", err);
          setError(err);
          setLoading(false);
          
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "There was a problem with the authentication service.",
          });
        }
      );
    } catch (err) {
      console.error("Failed to set up auth state listener:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      
      toast({
        variant: "destructive",
        title: "Authentication Setup Error",
        description: "Failed to initialize authentication services.",
      });
    }

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Provider login function
  const loginProvider = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Attempting provider login with:", email);
      await signInWithEmailAndPassword(auth, email, password);
      
      // For demo purposes, all users can log in as providers
      // In a production app, you would use custom claims or a database check
      console.log("Setting provider status in localStorage");
      localStorage.setItem('isProvider', 'true');
      setIsProvider(true);
      
      toast({
        title: "Login Successful",
        description: "Welcome to the provider dashboard.",
      });
      
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err instanceof Error ? err.message : String(err),
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('isProvider');
      setIsProvider(false);
      toast({
        title: "Logout Successful",
        description: "You have been logged out.",
      });
    } catch (err) {
      console.error("Logout error:", err);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    initialized,
    isProvider,
    loginProvider,
    logout
  };

  console.log("AuthContext providing value:", { 
    currentUser: currentUser?.email || null, 
    isProvider,
    loading,
    initialized
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
