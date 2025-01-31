import { useState } from "react";
import { LoginSelector } from "@/components/LoginSelector";
import { PatientLogin } from "@/components/PatientLogin";
import { ProviderLogin } from "@/components/ProviderLogin";
import { Hero } from "@/components/Hero";
import { MissionStatement } from "@/components/MissionStatement";
import { Services } from "@/components/Services";
import { Doctors } from "@/components/Doctors";

type LoginState = "select" | "patient" | "provider" | "main";

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

  return (
    <div className="min-h-screen">
      <Hero language={language} onLanguageChange={setLanguage} />
      <MissionStatement language={language} />
      <Services language={language} />
      <Doctors />
    </div>
  );
};

export default Index;