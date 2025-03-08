
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

// Create auth context
type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  error: Error | null;
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initAttempted, setInitAttempted] = useState(false);

  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initAttempted) return;
    setInitAttempted(true);
    
    console.log("AuthProvider: Initializing auth state listener");
    
    if (!auth) {
      console.error("Auth is not available");
      setError(new Error("Firebase authentication is not available"));
      setLoading(false);
      return () => {};
    }
    
    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          console.log("Auth state changed:", user ? "User logged in" : "No user");
          setCurrentUser(user);
          setLoading(false);
        },
        (err) => {
          console.error("Auth state error:", err);
          setError(err);
          setLoading(false);
          
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: err.message,
          });
        }
      );

      // Cleanup subscription on unmount
      return unsubscribe;
    } catch (err) {
      console.error("Failed to set up auth state listener:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      
      toast({
        variant: "destructive",
        title: "Authentication Setup Error",
        description: "Failed to initialize authentication",
      });
      
      return () => {};
    }
  }, [initAttempted]);

  const value = {
    currentUser,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
