
import { useState } from "react";
import { LoginSelector } from "@/components/LoginSelector";
import PatientLogin from "@/components/PatientLogin";
import ProviderLogin from "@/components/ProviderLogin";
import AppointmentPage from "@/pages/AppointmentPage";
import SymptomCheckerPage from "@/pages/SymptomCheckerPage";
import TransportationPage from "@/pages/TransportationPage";
import PatientDashboard from "@/components/PatientDashboard";
import ProviderDashboard from "@/components/ProviderDashboard";
import { NavigationHeader } from "@/components/layout/NavigationHeader";

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
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [loginState, setLoginState] = useState<LoginState>("select");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
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
        return <PatientLogin language={language} onBack={() => setLoginState("select")} onLogin={() => setLoginState("appointment")} />;
      case "provider":
        return <ProviderLogin language={language} onBack={() => setLoginState("select")} onLogin={() => setLoginState("provider-dashboard")} />;
      case "appointment":
        return <AppointmentPage language={language} onProceed={() => setLoginState("symptoms")} />;
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

  // Fix the TypeScript error by using strict equality check with the string value
  const showNavigation = loginState !== "select";

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
