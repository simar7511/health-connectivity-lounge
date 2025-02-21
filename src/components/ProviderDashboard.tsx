
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppointmentsList } from "./dashboard/AppointmentsList";
import { MessagingInbox } from "./dashboard/MessagingInbox";
import { HealthDataLogs } from "./dashboard/HealthDataLogs";
import { Patient } from "@/types/patient";
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

const mockIntakeForm = {
  patientInfo: {
    name: "Maria Garcia",
    dob: "1995-05-15",
    address: "123 Main St, Anytown, USA",
    phone: "(555) 123-4567",
    emergency_contact: "Juan Garcia - (555) 987-6543"
  },
  medicalHistory: {
    allergies: ["Penicillin"],
    currentMedications: ["Prenatal vitamins", "Iron supplements"],
    previousPregnancies: 1,
    chronicConditions: ["None"],
    familyHistory: ["Diabetes (maternal)", "Hypertension (paternal)"]
  },
  lifestyle: {
    occupation: "Office worker",
    exercise: "30 min walking, 3 times/week",
    diet: "Balanced, following nutritionist recommendations",
    smoking: "Never",
    alcohol: "None during pregnancy"
  },
  currentPregnancy: {
    lastPeriod: "2023-08-15",
    dueDate: "2024-05-22",
    firstPrenatalVisit: "2023-10-01",
    complications: "Mild morning sickness in first trimester"
  }
};

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

            {/* Patient Health Summary Section with Intake Form */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                {currentLanguage === "en" ? "Patient Health Summary" : "Resumen de Salud del Paciente"}
              </h2>
              
              <div className="space-y-4">
                {/* Basic Patient Information */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">
                    {currentLanguage === "en" ? "Patient Information" : "Información del Paciente"}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><span className="font-medium">{currentLanguage === "en" ? "Name:" : "Nombre:"}</span> {mockIntakeForm.patientInfo.name}</p>
                    <p><span className="font-medium">{currentLanguage === "en" ? "DOB:" : "Fecha de Nacimiento:"}</span> {mockIntakeForm.patientInfo.dob}</p>
                    <p><span className="font-medium">{currentLanguage === "en" ? "Phone:" : "Teléfono:"}</span> {mockIntakeForm.patientInfo.phone}</p>
                    <p><span className="font-medium">{currentLanguage === "en" ? "Address:" : "Dirección:"}</span> {mockIntakeForm.patientInfo.address}</p>
                  </div>
                </div>

                {/* Medical History */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">
                    {currentLanguage === "en" ? "Medical History" : "Historia Médica"}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">{currentLanguage === "en" ? "Allergies:" : "Alergias:"}</span> {mockIntakeForm.medicalHistory.allergies.join(", ")}</p>
                    <p><span className="font-medium">{currentLanguage === "en" ? "Current Medications:" : "Medicamentos Actuales:"}</span> {mockIntakeForm.medicalHistory.currentMedications.join(", ")}</p>
                    <p><span className="font-medium">{currentLanguage === "en" ? "Previous Pregnancies:" : "Embarazos Previos:"}</span> {mockIntakeForm.medicalHistory.previousPregnancies}</p>
                    <p><span className="font-medium">{currentLanguage === "en" ? "Family History:" : "Historia Familiar:"}</span> {mockIntakeForm.medicalHistory.familyHistory.join(", ")}</p>
                  </div>
                </div>

                {/* Lifestyle Information */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">
                    {currentLanguage === "en" ? "Lifestyle Information" : "Información de Estilo de Vida"}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">{currentLanguage === "en" ? "Occupation:" : "Ocupación:"}</span> {mockIntakeForm.lifestyle.occupation}</p>
                    <p><span className="font-medium">{currentLanguage === "en" ? "Exercise:" : "Ejercicio:"}</span> {mockIntakeForm.lifestyle.exercise}</p>
                    <p><span className="font-medium">{currentLanguage === "en" ? "Diet:" : "Dieta:"}</span> {mockIntakeForm.lifestyle.diet}</p>
                    <p><span className="font-medium">{currentLanguage === "en" ? "Smoking:" : "Fumar:"}</span> {mockIntakeForm.lifestyle.smoking}</p>
                    <p><span className="font-medium">{currentLanguage === "en" ? "Alcohol:" : "Alcohol:"}</span> {mockIntakeForm.lifestyle.alcohol}</p>
                  </div>
                </div>

                {/* Current Pregnancy Details */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">
                    {currentLanguage === "en" ? "Current Pregnancy" : "Embarazo Actual"}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">{currentLanguage === "en" ? "Due Date:" : "Fecha Probable de Parto:"}</span> {mockIntakeForm.currentPregnancy.dueDate}</p>
                    <p><span className="font-medium">{currentLanguage === "en" ? "First Prenatal Visit:" : "Primera Visita Prenatal:"}</span> {mockIntakeForm.currentPregnancy.firstPrenatalVisit}</p>
                    <p><span className="font-medium">{currentLanguage === "en" ? "Complications:" : "Complicaciones:"}</span> {mockIntakeForm.currentPregnancy.complications}</p>
                  </div>
                </div>
              </div>
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
