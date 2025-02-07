import { useState } from "react";
import { LoginSelector } from "@/components/LoginSelector";
import PatientLogin from "@/components/PatientLogin"; // ✅ Ensure default import
import ProviderLogin from "@/components/ProviderLogin"; // ✅ Ensure default import
import PatientDashboard from "@/components/PatientDashboard"; // ✅ Ensure default import
import ProviderDashboard from "@/components/ProviderDashboard"; // ✅ Ensure default import

type LoginState = "select" | "patient" | "provider" | "patient-dashboard" | "provider-dashboard";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [loginState, setLoginState] = useState<LoginState>("select");

  if (loginState === "select") {
    return (
      <LoginSelector
        language={language}
        onSelectRole={(role) => setLoginState(role)}
      />
    );
  }

  if (loginState === "patient") {
    return (
      <PatientLogin
        language={language}
        onBack={() => setLoginState("select")}
        onLogin={() => setLoginState("patient-dashboard")}
      />
    );
  }

  if (loginState === "provider") {
    return (
      <ProviderLogin
        language={language}
        onBack={() => setLoginState("select")}
        onLogin={() => setLoginState("provider-dashboard")}
      />
    );
  }

  if (loginState === "patient-dashboard") {
    return <PatientDashboard language={language} />;
  }

  if (loginState === "provider-dashboard") {
    return <ProviderDashboard language={language} />;
  }

  return null;
};

export default Index;

