
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";

// Import Authentication Provider
import { AuthProvider } from "./context/AuthContext";

// Import Pages & Components
import Index from "./pages/Index";
import ProviderLogin from "./components/ProviderLogin";
import ProviderDashboard from "./components/ProviderDashboard";
import PatientLogin from "./components/PatientLogin";
import PatientDashboard from "./components/PatientDashboard";
import PediatricIntakeForm from "./components/intake/PediatricIntakeForm";
import AppointmentPage from "./pages/AppointmentPage";
import AppointmentConfirmationPage from "./pages/AppointmentConfirmationPage";
import TransportationPage from "./pages/TransportationPage";
import ClinicLocatorPage from "./pages/ClinicLocatorPage";
import PatientOverviewPage from "./pages/PatientOverviewPage";
import { ChatPage } from "./pages/ChatPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import AIHealthChatPage from "./pages/AIHealthChatPage";

// Import Firebase config
import { auth, db } from "./lib/firebase";

const App: React.FC = () => {
  // ✅ Manage Language Selection
  const [language, setLanguage] = useState<"en" | "es">(() => {
    return (sessionStorage.getItem("preferredLanguage") as "en" | "es") || "en";
  });

  const [initializing, setInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    sessionStorage.setItem("preferredLanguage", language);
    console.log("App initialized, language set to:", language);
    
    // Check if Firebase auth is initialized
    const checkFirebase = async () => {
      try {
        console.log("Checking Firebase auth initialization");
        if (auth) {
          console.log("Firebase auth object exists");
          // Try to access a property to verify the object
          if (typeof auth.app !== 'undefined') {
            console.log("Firebase auth initialized successfully");
          } else {
            console.warn("Firebase auth exists but may not be fully initialized");
          }
        } else {
          console.error("Firebase auth is undefined");
          setInitError("Firebase authentication failed to initialize");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to initialize Firebase authentication",
          });
        }
        
        // Check Firestore
        if (db) {
          console.log("Firebase Firestore initialized");
        } else {
          console.error("Firebase Firestore not initialized");
        }
      } catch (error) {
        console.error("Error checking Firebase:", error);
        setInitError(`Firebase initialization error: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        // Set initializing to false after a short delay to ensure other components have time to initialize
        setTimeout(() => setInitializing(false), 1000);
      }
    };
    
    checkFirebase();
  }, [language]);

  // ✅ Handle Progression (Placeholder for Future Actions)
  const handleProceed = () => {
    console.log("Proceeding to next step");
  };

  // Determine if the user is already logged in as a provider
  const isProviderLoggedIn = () => {
    return localStorage.getItem('isProvider') === 'true' && localStorage.getItem('currentUser') !== null;
  };

  // Show a loading state while initializing
  if (initializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-medium mb-2">Loading Health Connectivity...</h2>
        <p className="text-sm text-gray-500">Initializing services...</p>
      </div>
    );
  }

  // Error state
  if (initError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <div className="w-16 h-16 text-red-500 mb-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h2 className="text-xl font-medium mb-2 text-red-600">Initialization Error</h2>
        <p className="text-sm text-gray-700 mb-4">{initError}</p>
        <Button onClick={() => window.location.reload()}>Reload Application</Button>
      </div>
    );
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        {/* 🌐 Language Toggle Button - Only show on routes other than the home page */}
        <div className="fixed top-4 right-4 z-50">
          {window.location.pathname !== "/" && (
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/80 backdrop-blur-sm" 
              onClick={() => setLanguage((prev) => (prev === "en" ? "es" : "en"))}
            >
              {language === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
            </Button>
          )}
        </div>

        {/* 📌 Application Routes */}
        <Routes>
          {/* 🌍 General Pages */}
          <Route path="/" element={<Index />} />
          <Route path="/index" element={<Navigate to="/" replace />} />
          <Route path="/free-clinic" element={<ClinicLocatorPage />} />

          {/* 🔵 Patient Flow */}
          <Route path="/patient/login" element={<PatientLogin language={language} onBack={() => {}} onLogin={() => {}} />} />
          <Route path="/pediatric-intake" element={<PediatricIntakeForm language={language} />} />
          <Route path="/confirmation" element={<ConfirmationPage language={language} />} />
          <Route path="/patient/dashboard" element={<PatientDashboard language={language} />} />
          <Route path="/appointment" element={<AppointmentPage language={language} onProceed={handleProceed} />} />
          <Route path="/appointment-confirmation" element={<AppointmentConfirmationPage language={language} />} />
          <Route path="/transportation" element={<TransportationPage language={language} onProceed={handleProceed} />} />

          {/* 🏥 Provider Flow */}
          <Route path="/provider/login" element={
            isProviderLoggedIn() ? <Navigate to="/provider/dashboard" replace /> : <ProviderLogin language={language} onLogin={() => {}} />
          } />
          <Route path="/provider/dashboard" element={<ProviderDashboard language={language} />} />

          {/* 📂 Additional Pages */}
          <Route path="/patient/:patientId" element={<PatientOverviewPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:patientName" element={<ChatPage />} />
          <Route path="/ai-chat" element={<AIHealthChatPage />} />
          <Route path="/ai-chat/:patientId" element={<AIHealthChatPage />} />

          {/* 🚨 404 Error Page */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen p-4">
              <h1 className="text-3xl font-bold text-red-500 mb-4">404 - Page Not Found</h1>
              <p className="text-gray-600 mb-6">The page you are looking for doesn't exist.</p>
              <Button onClick={() => window.location.href = "/"}>
                Return to Home
              </Button>
            </div>
          } />
        </Routes>
        
        {/* Global Toast Notifications */}
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
