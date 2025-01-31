import { useState } from "react";
import { LoginSelector } from "@/components/LoginSelector";
import { PatientLogin } from "@/components/PatientLogin";
import { ProviderLogin } from "@/components/ProviderLogin";
import { PatientDashboard } from "@/components/PatientDashboard";

type LoginState = "select" | "patient" | "provider" | "dashboard";

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
        onLogin={() => setLoginState("dashboard")}
      />
    );
  }

  if (loginState === "provider") {
    return (
      <ProviderLogin
        language={language}
        onBack={() => setLoginState("select")}
      />
    );
  }

  if (loginState === "dashboard") {
    return (
      <PatientDashboard
        language={language}
      />
    );
  }

  return null;
};

export default Index;