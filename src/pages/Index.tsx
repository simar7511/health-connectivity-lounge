import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Doctors } from "@/components/Doctors";
import { MissionStatement } from "@/components/MissionStatement";
import { useState } from "react";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");

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