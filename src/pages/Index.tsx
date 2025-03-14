import { useState, useEffect } from "react";
import { LoginSelector } from "@/components/LoginSelector";
import PatientLogin from "@/components/PatientLogin";
import ProviderLogin from "@/components/ProviderLogin";
import AppointmentPage from "@/pages/AppointmentPage";
import SymptomCheckerPage from "@/pages/SymptomCheckerPage";
import TransportationPage from "@/pages/TransportationPage";
import PatientDashboard from "@/components/PatientDashboard";
import ProviderDashboard from "@/components/ProviderDashboard";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { ensureHomepageStart } from "@/utils/navigationService";

// Define possible states
type LoginState =
  | "select"
  | "patient"
  | "provider"
  | "appointment"
  | "symptoms"
  | "transportation"
  | "patient-dashboard"
  | "provider-dashboard";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "es">(() => {
    return sessionStorage.getItem("preferredLanguage") as "en" | "es" || "en";
  });
  
  const [loginState, setLoginState] = useState<LoginState>("select");
  const navigate = useNavigate();
  const location = useLocation();
  const { isProvider, currentUser, logout } = useAuth();

  // Check for query parameters and sessionStorage on initial render
  useEffect(() => {
    // Check for query parameters to set initial state
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    
    if (mode === 'provider-login') {
      console.log("Mode detected as provider-login, setting provider login state");
      setLoginState("provider");
      return;
    }
    
    // Check for showProviderLogin in sessionStorage
    const showProviderLogin = sessionStorage.getItem("showProviderLogin");
    if (showProviderLogin === "true") {
      console.log("ShowProviderLogin flag detected, setting provider login state");
      setLoginState("provider");
      sessionStorage.removeItem("showProviderLogin");
      return;
    }
    
    // If no special conditions, show selector by default when on homepage
    if (location.pathname === "/" || location.pathname === "") {
      setLoginState("select");
    }
  }, [location.search, location.pathname]);

  // On first page load for homepage, ensure welcome page shown
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "") {
      // Don't reset if we're trying to show the provider login
      const params = new URLSearchParams(location.search);
      const mode = params.get('mode');
      
      if (mode === 'provider-login') {
        return;
      }
    }
  }, [location.pathname, location.search, logout, language]);

  // Set language preference from storage
  useEffect(() => {
    const savedLanguage = sessionStorage.getItem("preferredLanguage") as "en" | "es" | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "es" : "en";
    setLanguage(newLanguage);
    sessionStorage.setItem("preferredLanguage", newLanguage);
  };

  // Navigation handlers
  const handlePatientLoginSubmit = () => {
    navigate("/pediatric-intake");
  };

  const handleProviderLoginSubmit = () => {
    // Navigate directly to provider dashboard using the React Router navigate function
    console.log("Provider login successful, navigating to dashboard");
    navigate("/provider/dashboard", { replace: true });
  };

  // Get the title based on current state
  const getTitle = () => {
    switch (loginState) {
      case "select":
        return language === "en" ? "Health Connectivity" : "Conectividad de Salud";
      case "patient":
        return language === "en" ? "Patient Login" : "Inicio de Sesión del Paciente";
      case "provider":
        return language === "en" ? "Provider Login" : "Inicio de Sesión del Proveedor";
      case "appointment":
        return language === "en" ? "Schedule Appointment" : "Programar Cita";
      case "symptoms":
        return language === "en" ? "Symptom Checker" : "Verificador de Síntomas";
      case "transportation":
        return language === "en" ? "Transportation" : "Transporte";
      case "patient-dashboard":
        return language === "en" ? "Patient Dashboard" : "Panel del Paciente";
      case "provider-dashboard":
        return language === "en" ? "Provider Dashboard" : "Panel del Proveedor";
      default:
        return language === "en" ? "Health Connectivity" : "Conectividad de Salud";
    }
  };

  // Function to render components based on login state
  const renderComponent = () => {
    switch (loginState) {
      case "select":
        return <LoginSelector language={language} onLanguageChange={toggleLanguage} />;
      case "patient":
        return <PatientLogin language={language} onBack={() => setLoginState("select")} onLogin={handlePatientLoginSubmit} />;
      case "provider":
        return <ProviderLogin language={language} onBack={() => setLoginState("select")} onLogin={handleProviderLoginSubmit} />;
      case "appointment":
        return <AppointmentPage language={language} />; // Removed onProceed
      case "symptoms":
        return (
          <SymptomCheckerPage 
            language={language} 
            onProceed={() => setLoginState("transportation")} 
            appointmentDetails={{
              type: "Initial Visit",
              date: new Date(),
              time: "09:00",
              provider: {
                id: "1",
                name: "Dr. Smith",
                specialty: "General Practice",
                availability: ["09:00", "10:00", "11:00"]
              }
            }}
          />
        );
      case "transportation":
        return <TransportationPage language={language} onProceed={() => setLoginState("patient-dashboard")} />;
      case "patient-dashboard":
        return <PatientDashboard language={language} />;
      case "provider-dashboard":
        return <ProviderDashboard language={language} />;
      default:
        console.warn("⚠️ Invalid state:", loginState);
        setLoginState("select");
        return null;
    }
  };

  // Fix the TypeScript error by using a type-safe comparison
  const showNavigation = loginState !== "select" as LoginState;

  return (
    <div className="flex flex-col min-h-screen">
      {showNavigation && (
        <NavigationHeader 
          title={getTitle()} 
          showBackButton={loginState !== "select"}
          showBreadcrumbs={false}
          language={language}
        />
      )}
      <main className="flex-1">
        {renderComponent()}
      </main>
    </div>
  );
};

export default Index;
