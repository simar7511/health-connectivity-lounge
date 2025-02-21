
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, CheckCircle, FileText, Search, Send, XCircle } from "lucide-react";
import { Patient } from "@/types/patient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateBloodPressureReport } from "@/utils/bloodPressureReport";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import jsPDF from 'jspdf';

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

const commonExams = [
  { 
    id: "bp", 
    name: "Blood Pressure Check", 
    purpose: "Monitor for preeclampsia risk", 
    results: "High BP (Critical: 150/95)",
    date: "2024-03-15",
    values: { systolic: 150, diastolic: 95 }
  },
  { 
    id: "ultrasound", 
    name: "Ultrasound", 
    purpose: "Check baby's growth, placenta health", 
    results: "Normal growth",
    date: "2024-03-14",
    values: {
      fetalHeartRate: 150,
      fetalWeight: "1.2kg",
      placentaPosition: "anterior"
    }
  },
  { 
    id: "gtt", 
    name: "Glucose Tolerance Test (GTT)", 
    purpose: "Screen for gestational diabetes", 
    results: "Normal",
    date: "2024-03-13",
    values: {
      fasting: 82,
      oneHour: 125,
      twoHour: 110
    }
  }
];

const displayedExams = commonExams.slice(0, 3);

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

const generateIntakeFormPDF = (patientData: any, language: string) => {
  const pdf = new jsPDF();
  const lineHeight = 7;
  let yPosition = 20;

  // Set font styles
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text(language === "es" ? "FORMULARIO DE ADMISIÓN" : "PATIENT INTAKE FORM", 105, yPosition, { align: "center" });
  
  // Reset font for content
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
  yPosition += lineHeight;
  pdf.text(`${language === "es" ? "Embarazos Previos" : "Previous Pregnancies"}: ${patientData.medicalHistory.previousPregnancies}`, 20, yPosition);
  yPosition += lineHeight * 2;

  // Lifestyle Information
  pdf.setFont("helvetica", "bold");
  pdf.text(language === "es" ? "Estilo de Vida" : "Lifestyle", 20, yPosition);
  pdf.setFont("helvetica", "normal");
  yPosition += lineHeight;
  pdf.text(`${language === "es" ? "Ocupación" : "Occupation"}: ${patientData.lifestyle.occupation}`, 20, yPosition);
  yPosition += lineHeight;
  pdf.text(`${language === "es" ? "Ejercicio" : "Exercise"}: ${patientData.lifestyle.exercise}`, 20, yPosition);
  yPosition += lineHeight;
  pdf.text(`${language === "es" ? "Fumar" : "Smoking"}: ${patientData.lifestyle.smoking}`, 20, yPosition);
  yPosition += lineHeight * 2;

  // Current Pregnancy
  pdf.setFont("helvetica", "bold");
  pdf.text(language === "es" ? "Embarazo Actual" : "Current Pregnancy", 20, yPosition);
  pdf.setFont("helvetica", "normal");
  yPosition += lineHeight;
  pdf.text(`${language === "es" ? "Fecha Probable de Parto" : "Due Date"}: ${patientData.currentPregnancy.dueDate}`, 20, yPosition);
  yPosition += lineHeight;
  pdf.text(`${language === "es" ? "Primera Visita Prenatal" : "First Prenatal Visit"}: ${patientData.currentPregnancy.firstPrenatalVisit}`, 20, yPosition);
  yPosition += lineHeight;
  pdf.text(`${language === "es" ? "Complicaciones" : "Complications"}: ${patientData.currentPregnancy.complications}`, 20, yPosition);

  // Add footer with date
  pdf.setFontSize(10);
  pdf.text(`${language === "es" ? "Generado el" : "Generated on"}: ${new Date().toLocaleDateString()}`, 20, pdf.internal.pageSize.height - 10);

  return pdf;
};

const PatientOverviewPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const patient = mockPatients.find(p => p.id === patientId);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState("");

  if (!patient) {
    return <div>Patient not found</div>;
  }

  const handleGenerateIntakeForm = (language: string) => {
    const pdf = generateIntakeFormPDF(mockIntakeForm, language);
    pdf.save(`intake_form_${patient.name.replace(/\s+/g, '_')}_${language}.pdf`);
    
    toast({
      title: language === "es" ? "Formulario Generado" : "Form Generated",
      description: language === "es" 
        ? "El formulario de admisión ha sido descargado."
        : "The intake form has been downloaded.",
    });
  };

  const handleGenerateReport = () => {
    const report = generateBloodPressureReport(patient.vitals.bp);
    setCurrentReport(report);
    setReportDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{patient.name}</h1>
        
        <div className="grid gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Clinical Notes</h2>
            <div className="space-y-2">
              <p><strong>Risks:</strong></p>
              <ul className="list-disc pl-5">
                {patient.risks.map((risk, index) => (
                  <li key={index} className="text-red-600">{risk}</li>
                ))}
              </ul>
              <p><strong>Recent Symptoms:</strong></p>
              <ul className="list-disc pl-5">
                {patient.recentSymptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
              <div className="mt-4">
                <Select onValueChange={handleGenerateIntakeForm}>
                  <SelectTrigger className="w-[180px]">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Intake Form
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Exam Results</h2>
            <div className="space-y-4">
              {commonExams.map((exam) => (
                <div key={exam.id} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{exam.name}</h3>
                      <p className="text-sm text-muted-foreground">{exam.purpose}</p>
                      <p className="mt-1">{exam.results}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(exam.date).toLocaleDateString()}
                    </div>
                  </div>
                  {exam.id === "bp" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleGenerateReport}
                      className="mt-2"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Generate BP Report
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Blood Pressure Report</DialogTitle>
          </DialogHeader>
          <div className="whitespace-pre-wrap font-mono">{currentReport}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientOverviewPage;
