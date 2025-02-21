
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppointmentsList } from "./dashboard/AppointmentsList";
import { MessagingInbox } from "./dashboard/MessagingInbox";
import { HealthDataLogs } from "./dashboard/HealthDataLogs";
import { Patient } from "@/types/patient";
import { ProviderHeader } from "./layout/ProviderHeader";
import { ProviderFooter } from "./layout/ProviderFooter";
import { Link } from "react-router-dom";

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
    viewHealth: "View Health Summary",
  },
  es: {
    dashboard: "Panel del Proveedor",
    translate: "Traducir",
    translatedTo: "Traducido al inglés",
    viewHealth: "Ver Resumen de Salud",
  }
};

const ProviderDashboard = ({ language }: ProviderDashboardProps) => {
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const handleTranslate = () => {
    setCurrentLanguage((prev) => (prev === "en" ? "es" : "en"));
    toast({
      title: translations[currentLanguage].translatedTo,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ProviderHeader 
        language={currentLanguage}
        onLanguageChange={handleTranslate}
      />

      <main className="flex-1 container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <AppointmentsList
              language={currentLanguage}
              patients={mockPatients}
            />
            <div className="flex justify-center">
              <Link 
                to={`/patient/${mockPatients[0].id}/health`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {translations[currentLanguage].viewHealth}
              </Link>
            </div>
            <HealthDataLogs patient={mockPatients[0]} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4">
            <MessagingInbox
              language={currentLanguage}
              onStartChat={() => {}}
            />
          </div>
        </div>
      </main>

      <ProviderFooter language={currentLanguage} />
    </div>
  );
};

export default ProviderDashboard;
