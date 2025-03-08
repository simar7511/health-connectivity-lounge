
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

// Create auth context
type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  error: Error | null;
  initialized: boolean;
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  error: null,
  initialized: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);

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

  const value = {
    currentUser,
    loading,
    error,
    initialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
