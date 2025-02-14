import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppointmentsList } from "./dashboard/AppointmentsList";
import { MessagingInbox } from "./dashboard/MessagingInbox";
import { Button } from "@/components/ui/button";
import { Globe, Phone } from "lucide-react";
import { Patient } from "@/types/patient";
import { makeCall } from "@/utils/twilioService";
import { ProviderHeader } from "./layout/ProviderHeader";
import { ProviderFooter } from "./layout/ProviderFooter";

interface ProviderDashboardProps {
  language: "en" | "es";
}

// Mock Patient Data
const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Maria Garcia",
    language: "es",
    nextAppointment: "2025-02-10T10:00:00",
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
    translatedTo: "Translated to Spanish",
  },
  es: {
    dashboard: "Panel del Proveedor",
    translate: "Traducir",
    translatedTo: "Traducido al inglés",
  }
};

const ProviderDashboard = ({ language }: ProviderDashboardProps) => {
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [isCallInProgress, setIsCallInProgress] = useState(false);

  const handleTranslate = () => {
    setCurrentLanguage((prev) => (prev === "en" ? "es" : "en"));
    toast({
      title: translations[currentLanguage].translatedTo,
    });
  };

  const handleCall = async (patientNumber: string) => {
    if (isCallInProgress) return;

    setIsCallInProgress(true);
    try {
      await makeCall(patientNumber);
      toast({
        title: currentLanguage === "en" ? "Call Initiated" : "Llamada Iniciada",
        description: currentLanguage === "en" 
          ? "Connecting your call..." 
          : "Conectando su llamada...",
      });
    } catch (error) {
      toast({
        title: currentLanguage === "en" ? "Call Failed" : "Error de Llamada",
        description: currentLanguage === "en"
          ? "Could not initiate call. Please try again."
          : "No se pudo iniciar la llamada. Por favor intente de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsCallInProgress(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ProviderHeader 
        language={currentLanguage}
        onLanguageChange={handleTranslate}
      />

      <main className="flex-1 container mx-auto p-6 space-y-6">
        <div className="flex justify-end mb-8">
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={() => handleCall("+12066705864")}
            disabled={isCallInProgress}
          >
            <Phone className="h-5 w-5" />
            {currentLanguage === "en" ? "Start Call" : "Iniciar Llamada"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AppointmentsList
            language={currentLanguage}
            patients={mockPatients}
          />

          <MessagingInbox
            language={currentLanguage}
            onStartChat={() => {}}
          />
        </div>
      </main>

      <ProviderFooter language={currentLanguage} />
    </div>
  );
};

export default ProviderDashboard;
