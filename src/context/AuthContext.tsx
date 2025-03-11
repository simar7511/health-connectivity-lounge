
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
  const [isProvider, setIsProvider] = useState(false);

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
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
          console.log("Auth state changed:", user ? "User logged in" : "No user");
          setCurrentUser(user);
          
          // Check if user is a provider by email domain
          // This now accepts more common email domains for testing purposes
          if (user && user.email) {
            const isProviderUser = user.email.endsWith('@provider.com') || 
                                 user.email.endsWith('@health.org') || 
                                 user.email.endsWith('@clinic.com') ||
                                 user.email.endsWith('@gmail.com') ||
                                 user.email.endsWith('@yahoo.com') ||
                                 user.email.endsWith('@outlook.com') ||
                                 user.email.endsWith('@hotmail.com') ||
                                 user.email === 'provider@test.com';
            
            setIsProvider(isProviderUser);
            console.log(`User is a provider: ${isProviderUser}`);
            
            if (isProviderUser) {
              localStorage.setItem('isProvider', 'true');
            } else {
              localStorage.removeItem('isProvider');
            }
          } else {
            setIsProvider(false);
            localStorage.removeItem('isProvider');
          }
          
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // For demo purposes, all users can log in as providers
      // In a production app, you would use custom claims or a database check
      setIsProvider(true);
      localStorage.setItem('isProvider', 'true');
      
      toast({
        title: "Login Successful",
        description: "Welcome to the provider dashboard.",
      });
      
      return;
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
      setIsProvider(false);
      localStorage.removeItem('isProvider');
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
