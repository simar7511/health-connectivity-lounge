import { useState } from "react";
import { LoginSelector } from "@/components/LoginSelector";
import PatientLogin from "@/components/PatientLogin";
import ProviderLogin from "@/components/ProviderLogin";
import PatientDashboard from "@/components/PatientDashboard";
import ProviderDashboard from "@/components/ProviderDashboard";

// Define possible login states
type LoginState = "select" | "patient" | "provider" | "patient-dashboard" | "provider-dashboard";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [loginState, setLoginState] = useState<LoginState>("select");

  // Function to handle role selection
  const handleRoleSelection = (role: "patient" | "provider") => {
    setLoginState(role);
  };

  // Function to render components based on login state
  const renderComponent = () => {
    switch (loginState) {
      case "select":
        return (
          <LoginSelector
            language={language}
            onSelectRole={handleRoleSelection} // ✅ Cleaner function call
            onLanguageChange={setLanguage} // ✅ Allow language switching
          />
        );
      case "patient":
        return (
          <PatientLogin
            language={language}
            onBack={() => setLoginState("select")}
            onLogin={() => setLoginState("patient-dashboard")}
          />
        );
      case "provider":
        return (
          <ProviderLogin
            language={language}
            onBack={() => setLoginState("select")}
            onLogin={() => setLoginState("provider-dashboard")}
          />
        );
      case "patient-dashboard":
        return <PatientDashboard language={language} />;
      case "provider-dashboard":
        return <ProviderDashboard language={language} />;
      default:
        console.warn("Invalid login state:", loginState);
        setLoginState("select"); // ✅ Reset to default state if invalid
        return null;
    }
  };

  return <>{renderComponent()}</>;
};

export default Index;
