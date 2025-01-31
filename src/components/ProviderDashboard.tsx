import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AppointmentsList } from "./dashboard/AppointmentsList";
import { MessagingInbox } from "./dashboard/MessagingInbox";
import { PatientTrends } from "./dashboard/PatientTrends";
import { QuickDocumentation } from "./dashboard/QuickDocumentation";
import { Patient } from "@/types/patient";

interface ProviderDashboardProps {
  language: "en" | "es";
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Maria Garcia",
    language: "es",
    nextAppointment: "2024-03-20T10:00:00",
    demographics: {
      age: 28,
      preferredLanguage: "es",
      insuranceStatus: "uninsured"
    },
    vitals: {
      bp: [120, 122, 118, 121],
      glucose: [95, 98, 92, 96],
      weight: [65, 65.5, 66, 66.2],
      fetalMovements: [10, 12, 8, 15],
    },
    risks: ["High blood pressure", "Gestational diabetes risk"],
    recentSymptoms: ["Mild headache", "Swollen ankles"]
  },
];

export const ProviderDashboard = ({ language }: ProviderDashboardProps) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { toast } = useToast();

  const handleStartChat = () => {
    toast({
      title: language === "en" ? "Starting chat" : "Iniciando chat",
      description:
        language === "en"
          ? "Preparing secure chat..."
          : "Preparando chat seguro...",
    });
  };

  const handleTranslate = () => {
    toast({
      title: language === "en" ? "Translating" : "Traduciendo",
      description:
        language === "en"
          ? "Translating content..."
          : "Traduciendo contenido...",
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-8">
        {language === "en" ? "Provider Dashboard" : "Panel del Proveedor"}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AppointmentsList
          language={language}
          patients={mockPatients}
          onSelectPatient={setSelectedPatient}
        />
        <MessagingInbox
          language={language}
          onStartChat={handleStartChat}
        />
        <PatientTrends
          language={language}
          patient={selectedPatient}
        />
        <QuickDocumentation
          language={language}
          onTranslate={handleTranslate}
        />
      </div>
    </div>
  );
};