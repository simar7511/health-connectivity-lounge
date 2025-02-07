
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AppointmentsList } from "./dashboard/AppointmentsList";
import { MessagingInbox } from "./dashboard/MessagingInbox";
import { QuickDocumentation } from "./dashboard/QuickDocumentation";
import { Button } from "@/components/ui/button";
import { Globe, MessageCircle } from "lucide-react";
import { Patient } from "@/types/patient";

interface ProviderDashboardProps {
  language: "en" | "es";
}

// Mock Patient Data
const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Maria Garcia",
    language: "es",
    nextAppointment: "2024-03-20T10:00:00",
    reasonForVisit: "Prenatal checkup - 28 weeks",
    demographics: {
      age: 28,
      preferredLanguage: "es",
      insuranceStatus: "uninsured",
    },
    vitals: {
      bp: [120, 122, 118, 121],
      glucose: [95, 98, 92, 96],
      weight: [65, 65.5, 66, 66.2],
      fetalMovements: [10, 12, 8, 15],
    },
    risks: ["High blood pressure", "Gestational diabetes risk"],
    recentSymptoms: ["Mild headache", "Swollen ankles"],
  },
];

const translations = {
  en: {
    dashboard: "Provider Dashboard",
    translate: "Translate",
    startChat: "Start Chat",
    preparingChat: "Preparing secure chat...",
    translatedTo: "Translated to Spanish",
  },
  es: {
    dashboard: "Panel del Proveedor",
    translate: "Traducir",
    startChat: "Iniciar Chat",
    preparingChat: "Preparando chat seguro...",
    translatedTo: "Traducido al inglés",
  }
};

const ProviderDashboard = ({ language }: ProviderDashboardProps) => {
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const handleStartChat = () => {
    toast({
      title: translations[currentLanguage].startChat,
      description: translations[currentLanguage].preparingChat,
    });
  };

  const handleTranslate = () => {
    setCurrentLanguage((prev) => (prev === "en" ? "es" : "en"));
    toast({
      title: translations[currentLanguage].translatedTo,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {translations[currentLanguage].dashboard}
        </h1>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleTranslate}
        >
          <Globe className="h-5 w-5" />
          {translations[currentLanguage].translate}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AppointmentsList
          language={currentLanguage}
          patients={mockPatients}
        />

        <MessagingInbox
          language={currentLanguage}
          onStartChat={handleStartChat}
        />

        <QuickDocumentation
          language={currentLanguage}
          onTranslate={handleTranslate}
        />
      </div>

      <div className="flex justify-center mt-6">
        <Button
          variant="secondary"
          className="flex items-center gap-2"
          onClick={handleStartChat}
        >
          <MessageCircle className="h-5 w-5" />
          {translations[currentLanguage].startChat}
        </Button>
      </div>
    </div>
  );
};

export default ProviderDashboard;

