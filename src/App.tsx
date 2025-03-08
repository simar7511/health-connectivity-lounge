
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
import { auth } from "./lib/firebase";

const App: React.FC = () => {
  // ✅ Manage Language Selection
  const [language, setLanguage] = useState<"en" | "es">(() => {
    return (sessionStorage.getItem("preferredLanguage") as "en" | "es") || "en";
  });

  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    sessionStorage.setItem("preferredLanguage", language);
    console.log("App initialized, language set to:", language);
    
    // Check if Firebase auth is initialized
    const checkFirebase = async () => {
      try {
        if (auth) {
          console.log("Firebase auth initialized successfully");
        } else {
          console.error("Firebase auth initialization failed");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to initialize Firebase authentication",
          });
        }
      } catch (error) {
        console.error("Error checking Firebase:", error);
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

  // Show a loading state while initializing
  if (initializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-medium">Loading Health Connectivity...</h2>
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
          <Route path="/provider/login" element={<ProviderLogin language={language} onLogin={() => {}} />} />
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
