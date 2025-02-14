import { useState } from "react";
import { LoginSelector } from "@/components/LoginSelector";
import PatientLogin from "@/components/PatientLogin";
import ProviderLogin from "@/components/ProviderLogin";
import AppointmentPage from "@/pages/AppointmentPage";
import SymptomCheckerPage from "@/pages/SymptomCheckerPage";
import TransportationPage from "@/pages/TransportationPage";
import PatientDashboard from "@/components/PatientDashboard";
import ProviderDashboard from "@/components/ProviderDashboard";

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
  const [loginState, setLoginState] = useState<LoginState>("select"); // Start with Login Page

  // Function to toggle language
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
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
        return <SymptomCheckerPage language={language} onProceed={() => setLoginState("transportation")} />;
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

  return <div>{renderComponent()}</div>;
};

export default Index;
