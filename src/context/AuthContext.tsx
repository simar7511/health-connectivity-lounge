
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(true);
  // Check localStorage for isProvider status - this ensures we maintain state on refreshes
  const [isProvider, setIsProvider] = useState(() => localStorage.getItem('isProvider') === 'true');

  useEffect(() => {
    console.log("AuthProvider: Initial provider state:", isProvider);
    
    // Check if we have a stored user in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser) as User);
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Provider login function - simplified to work without Firebase
  const loginProvider = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Logging in provider with:", email);
      
      // Create a mock user object
      const mockUser = {
        uid: 'provider-' + Date.now(),
        email: email,
        displayName: email.split('@')[0],
        emailVerified: true,
      };
      
      // Store the user in state and localStorage
      setCurrentUser(mockUser as unknown as User);
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      
      // Set provider status
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
      // Clear local storage and state
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isProvider');
      setCurrentUser(null);
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
