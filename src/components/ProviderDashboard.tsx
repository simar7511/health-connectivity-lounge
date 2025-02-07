import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AppointmentsList } from "./dashboard/AppointmentsList";
import { MessagingInbox } from "./dashboard/MessagingInbox";
import { PatientTrends } from "./dashboard/PatientTrends";
import { QuickDocumentation } from "./dashboard/QuickDocumentation";
import { Button } from "@/components/ui/button";
import { Globe, MessageCircle } from "lucide-react";
import { Patient } from "@/types/patient";

interface ProviderDashboardProps {
  language: "en" | "es";
}

// ✅ Mock Patient Data
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

const ProviderDashboard = ({ language }: ProviderDashboardProps) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { toast } = useToast();

  // ✅ Handle chat session
  const handleStartChat = () => {
    toast({
      title: language === "en" ? "Starting chat" : "Iniciando chat",
      description:
        language === "en"
          ? "Preparing secure chat..."
          : "Preparando chat seguro...",
    });
  };

  // ✅ Handle language toggle
  const handleTranslate = () => {
    toast({
      title: language === "en" ? "Translated to Spanish" : "Traducido al inglés",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 🔹 Dashboard Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {language === "en" ? "Provider Dashboard" : "Panel del Proveedor"}
        </h1>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleTranslate}
        >
          <Globe className="h-5 w-5" />
          {language === "en" ? "Translate" : "Traducir"}
        </Button>
      </div>

      {/* 🔹 Dashboard Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 🔹 Appointment List */}
        <AppointmentsList
          language={language}
          patients={mockPatients}
          onSelectPatient={setSelectedPatient}
        />

        {/* 🔹 Messaging Inbox */}
        <MessagingInbox
          language={language}
          onStartChat={handleStartChat}
        />

        {/* 🔹 Patient Trends (if selected) */}
        {selectedPatient ? (
          <PatientTrends
            language={language}
            patient={selectedPatient}
          />
        ) : (
          <div className="p-6 bg-gray-100 text-center rounded-lg">
            <p className="text-gray-600">
              {language === "en"
                ? "Select a patient to view trends."
                : "Seleccione un paciente para ver tendencias."}
            </p>
          </div>
        )}

        {/* 🔹 Quick Documentation (✅ Fixed `onTranslate` prop) */}
        <QuickDocumentation
          language={language}
          onTranslate={handleTranslate} // ✅ Pass `handleTranslate` function
        />
      </div>

      {/* 🔹 Start Chat Button */}
      <div className="flex justify-center mt-6">
        <Button
          variant="secondary"
          className="flex items-center gap-2"
          onClick={handleStartChat}
        >
          <MessageCircle className="h-5 w-5" />
          {language === "en" ? "Start Chat" : "Iniciar Chat"}
        </Button>
      </div>
    </div>
  );
};

export default ProviderDashboard; // ✅ Ensured default export is used!


