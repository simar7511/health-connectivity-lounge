import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppointmentsList } from "./dashboard/AppointmentsList";
import { MessagingInbox } from "./dashboard/MessagingInbox";
import { HealthDataLogs } from "./dashboard/HealthDataLogs";
import { Patient } from "@/types/patient";
import { ProviderHeader } from "./layout/ProviderHeader";
import { ProviderFooter } from "./layout/ProviderFooter";
import { jsPDF } from "jspdf";
import { Button } from "./ui/button";
import { FileText } from "lucide-react";

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

const generateIntakeFormPDF = (patientData: any, language: string) => {
  const pdf = new jsPDF();
  const lineHeight = 7;
  let yPosition = 20;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text(language === "es" ? "FORMULARIO DE ADMISIÓN" : "PATIENT INTAKE FORM", 105, yPosition, { align: "center" });
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  yPosition += lineHeight * 2;

  // Patient Information
  pdf.setFont("helvetica", "bold");
  pdf.text(language === "es" ? "Información del Paciente" : "Patient Information", 20, yPosition);
  pdf.setFont("helvetica", "normal");
  yPosition += lineHeight;
  pdf.text(`${language === "es" ? "Nombre" : "Name"}: ${patientData.patientInfo.name}`, 20, yPosition);
  yPosition += lineHeight;
  pdf.text(`${language === "es" ? "Fecha de Nacimiento" : "Date of Birth"}: ${patientData.patientInfo.dob}`, 20, yPosition);
  yPosition += lineHeight;
  pdf.text(`${language === "es" ? "Teléfono" : "Phone"}: ${patientData.patientInfo.phone}`, 20, yPosition);
  yPosition += lineHeight * 2;

  // Medical History
  pdf.setFont("helvetica", "bold");
  pdf.text(language === "es" ? "Historia Médica" : "Medical History", 20, yPosition);
  pdf.setFont("helvetica", "normal");
  yPosition += lineHeight;
  pdf.text(`${language === "es" ? "Alergias" : "Allergies"}: ${patientData.medicalHistory.allergies.join(", ")}`, 20, yPosition);
  yPosition += lineHeight;
  pdf.text(`${language === "es" ? "Medicamentos Actuales" : "Current Medications"}: ${patientData.medicalHistory.currentMedications.join(", ")}`, 20, yPosition);
  yPosition += lineHeight * 2;

  // Current Pregnancy
  pdf.setFont("helvetica", "bold");
  pdf.text(language === "es" ? "Embarazo Actual" : "Current Pregnancy", 20, yPosition);
  pdf.setFont("helvetica", "normal");
  yPosition += lineHeight;
  pdf.text(`${language === "es" ? "Fecha Probable de Parto" : "Due Date"}: ${patientData.currentPregnancy.dueDate}`, 20, yPosition);
  yPosition += lineHeight;
  pdf.text(`${language === "es" ? "Complicaciones" : "Complications"}: ${patientData.currentPregnancy.complications}`, 20, yPosition);

  pdf.setFontSize(10);
  pdf.text(`${language === "es" ? "Generado el" : "Generated on"}: ${new Date().toLocaleDateString()}`, 20, pdf.internal.pageSize.height - 10);

  return pdf;
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

  const handleGenerateIntakeForm = (language: string) => {
    const pdf = generateIntakeFormPDF(mockIntakeForm, language);
    pdf.save(`intake_form_${mockIntakeForm.patientInfo.name.replace(/\s+/g, '_')}_${language}.pdf`);
    
    toast({
      title: language === "es" ? "Formulario Generado" : "Form Generated",
      description: language === "es" 
        ? "El formulario de admisión ha sido descargado."
        : "The intake form has been downloaded.",
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

            {/* Reported Symptoms Section */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {currentLanguage === "en" ? "Reported Symptoms" : "Síntomas Reportados"}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateIntakeForm('en')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Intake Form (EN)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateIntakeForm('es')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Formulario (ES)
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {mockPatients[0].recentSymptoms.map((symptom, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    {symptom}
                  </div>
                ))}
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
