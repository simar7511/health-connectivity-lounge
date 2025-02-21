import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle, XCircle, Send, FileText, Pencil, Save, Trash2 } from "lucide-react";
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

const defaultTreatmentPlan = {
  diagnosis: [
    {
      condition: "Gestational Hypertension",
      severity: "Moderate",
      details: "Blood pressure consistently elevated above normal range",
    },
    {
      condition: "Gestational Diabetes Risk",
      severity: "Low",
      details: "Blood glucose levels at upper limit of normal range",
    }
  ],
  medications: [
    {
      name: "Methyldopa",
      dosage: "250mg",
      frequency: "Twice daily",
      duration: "Until next appointment",
      purpose: "Blood pressure management"
    },
    {
      name: "Prenatal Vitamins",
      dosage: "1 tablet",
      frequency: "Once daily",
      duration: "Throughout pregnancy",
      purpose: "Nutritional support"
    }
  ],
  lifestyleChanges: [
    {
      category: "Diet",
      recommendations: [
        "Reduce sodium intake to less than 2,300mg per day",
        "Increase protein intake to 75-100g per day",
        "Stay hydrated with 8-10 glasses of water daily"
      ]
    },
    {
      category: "Exercise",
      recommendations: [
        "30 minutes of moderate walking daily",
        "Prenatal yoga twice weekly",
        "Avoid strenuous activities"
      ]
    }
  ],
  doctorNotes: [
    "Monitor blood pressure twice daily and maintain a log",
    "Report any severe headaches or visual changes immediately",
    "Schedule follow-up appointment in 2 weeks",
    "Rest with left side positioning when possible"
  ]
};

const getStatusBadge = (results: string) => {
  if (results.toLowerCase().includes('normal')) {
    return <Badge className="bg-green-500"><CheckCircle className="w-4 h-4 mr-1" /> Normal</Badge>;
  }
  if (results.toLowerCase().includes('high')) {
    return <Badge className="bg-red-500"><XCircle className="w-4 h-4 mr-1" /> High Risk</Badge>;
  }
  return <Badge className="bg-yellow-500"><AlertCircle className="w-4 h-4 mr-1" /> Attention Needed</Badge>;
};

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

const PatientOverviewPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const patient = mockPatients.find(p => p.id === patientId);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState(defaultTreatmentPlan);
  const [editMode, setEditMode] = useState({
    diagnosis: false,
    medications: false,
    lifestyleChanges: false,
    doctorNotes: false
  });

  if (!patient) {
    return <div>Patient not found</div>;
  }

  const handleSendResult = (examId: string) => {
    const exam = commonExams.find(e => e.id === examId);
    if (exam) {
      let resultMessage = "";
      
      if (exam.id === "bp") {
        resultMessage = `Blood Pressure Results:\nDate: ${exam.date}\nReading: ${exam.values.systolic}/${exam.values.diastolic} mmHg\nStatus: ${exam.results}`;
      } 
      else if (exam.id === "ultrasound") {
        resultMessage = `Ultrasound Results:\nDate: ${exam.date}\nFetal Heart Rate: ${exam.values.fetalHeartRate} bpm\nEstimated Fetal Weight: ${exam.values.fetalWeight}\nPlacental Position: ${exam.values.placentaPosition}\nStatus: ${exam.results}`;
      }
      else if (exam.id === "gtt") {
        resultMessage = `Glucose Tolerance Test Results:\nDate: ${exam.date}\nFasting: ${exam.values.fasting} mg/dL\n1 Hour: ${exam.values.oneHour} mg/dL\n2 Hour: ${exam.values.twoHour} mg/dL\nStatus: ${exam.results}`;
      }
      else {
        resultMessage = `${exam.name} Results:\nDate: ${exam.date}\nResults: ${exam.results}`;
      }

      navigate(`/chat/Maria Garcia`, { state: { initialMessage: resultMessage } });
      
      toast({
        title: "Result Sent",
        description: `${exam.name} results have been sent to ${patient.name}'s chat.`,
      });
    }
  };

  const handleGeneratePDF = (examId: string, language: string) => {
    const exam = commonExams.find(e => e.id === examId);
    if (!exam) return;

    const pdf = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(language === 'es' ? 'INFORME MÉDICO' : 'MEDICAL REPORT', 105, 10, { align: 'center' });
    pdf.setFontSize(12);
    
    if (exam.id === "bp") {
      const reportData = {
        patientName: patient.name,
        examDate: exam.date,
        systolic: exam.values.systolic,
        diastolic: exam.values.diastolic
      };
      
      const report = generateBloodPressureReport(reportData, language as 'en' | 'es');
      setCurrentReport(report);
      setReportDialogOpen(true);
      
      const splitReport = report.split('\n');
      let yOffset = 20;
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(language === 'es' ? 'INFORME MÉDICO' : 'MEDICAL REPORT', 105, 10, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      splitReport.forEach((line) => {
        if (line.trim()) {
          if (line.includes('----------------------------------------')) {
            pdf.line(10, yOffset - 2, 200, yOffset - 2);
            yOffset += 5;
          } else if (line === (language === 'es' ? 'INFORME DE PRESIÓN ARTERIAL' : 'BLOOD PRESSURE REPORT')) {
            pdf.setFont('helvetica', 'bold');
            pdf.text(line, 10, yOffset);
            pdf.setFont('helvetica', 'normal');
            yOffset += 10;
          } else {
            pdf.text(line, 10, yOffset);
            yOffset += 7;
          }
        }
      });
    } 
    else if (exam.id === "ultrasound") {
      const title = language === 'es' ? 'INFORME DE ULTRASONIDO' : 'ULTRASOUND REPORT';
      const report = [
        title,
        '----------------------------------------',
        `${language === 'es' ? 'Paciente' : 'Patient'}: ${patient?.name}`,
        `${language === 'es' ? 'Fecha' : 'Date'}: ${exam.date}`,
        `${language === 'es' ? 'Ritmo Cardíaco Fetal' : 'Fetal Heart Rate'}: ${exam.values.fetalHeartRate} bpm`,
        `${language === 'es' ? 'Peso Fetal Estimado' : 'Estimated Fetal Weight'}: ${exam.values.fetalWeight}`,
        `${language === 'es' ? 'Posición de la Placenta' : 'Placental Position'}: ${exam.values.placentaPosition}`,
        '----------------------------------------',
        `${language === 'es' ? 'Resultado' : 'Result'}: ${exam.results}`
      ].join('\n');

      let yOffset = 20;
      report.split('\n').forEach(line => {
        if (line.includes('----------------------------------------')) {
          pdf.line(10, yOffset - 2, 200, yOffset - 2);
          yOffset += 5;
        } else if (line === title) {
          pdf.setFont('helvetica', 'bold');
          pdf.text(line, 10, yOffset);
          pdf.setFont('helvetica', 'normal');
          yOffset += 10;
        } else {
          pdf.text(line, 10, yOffset);
          yOffset += 7;
        }
      });
    }
    else if (exam.id === "gtt") {
      const title = language === 'es' ? 'INFORME DE PRUEBA DE TOLERANCIA A LA GLUCOSA' : 'GLUCOSE TOLERANCE TEST REPORT';
      const report = [
        title,
        '----------------------------------------',
        `${language === 'es' ? 'Paciente' : 'Patient'}: ${patient?.name}`,
        `${language === 'es' ? 'Fecha' : 'Date'}: ${exam.date}`,
        `${language === 'es' ? 'Glucosa en Ayunas' : 'Fasting Glucose'}: ${exam.values.fasting} mg/dL`,
        `${language === 'es' ? 'Glucosa 1 Hora' : '1-Hour Glucose'}: ${exam.values.oneHour} mg/dL`,
        `${language === 'es' ? 'Glucosa 2 Horas' : '2-Hour Glucose'}: ${exam.values.twoHour} mg/dL`,
        '----------------------------------------',
        `${language === 'es' ? 'Resultado' : 'Result'}: ${exam.results}`
      ].join('\n');

      let yOffset = 20;
      report.split('\n').forEach(line => {
        if (line.includes('----------------------------------------')) {
          pdf.line(10, yOffset - 2, 200, yOffset - 2);
          yOffset += 5;
        } else if (line === title) {
          pdf.setFont('helvetica', 'bold');
          pdf.text(line, 10, yOffset);
          pdf.setFont('helvetica', 'normal');
          yOffset += 10;
        } else {
          pdf.text(line, 10, yOffset);
          yOffset += 7;
        }
      });
    }

    pdf.setFontSize(8);
    pdf.text(`Generated on: ${currentDate}`, 10, pdf.internal.pageSize.height - 10);
    
    pdf.save(`${exam.id}_report_${patient?.name.replace(/\s+/g, '_')}_${language}.pdf`);
    
    toast({
      title: "Report Generated",
      description: `${exam.name} report has been generated in ${language === 'es' ? 'Spanish' : 'English'} and downloaded.`,
    });
  };

  const handleSendTreatmentPlan = () => {
    const treatmentMessage = `Treatment Plan Summary:\n\nDiagnosis:\n${treatmentPlan.diagnosis.map(d => 
      `- ${d.condition} (${d.severity}): ${d.details}`
    ).join('\n')}\n\nMedications:\n${treatmentPlan.medications.map(m =>
      `- ${m.name} ${m.dosage} ${m.frequency} - ${m.purpose}`
    ).join('\n')}\n\nLifestyle Recommendations:\n${treatmentPlan.lifestyleChanges.map(l =>
      `${l.category}:\n${l.recommendations.map(r => `- ${r}`).join('\n')}`
    ).join('\n\n')}\n\nSpecial Instructions:\n${treatmentPlan.doctorNotes.map(n => `- ${n}`).join('\n')}`;

    navigate(`/chat/Maria Garcia`, { state: { initialMessage: treatmentMessage } });
    
    toast({
      title: "Treatment Plan Sent",
      description: "Treatment plan has been sent to patient's chat.",
    });
  };

  const handleGenerateTreatmentPDF = (language: string) => {
    const pdf = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(language === 'es' ? 'PLAN DE TRATAMIENTO' : 'TREATMENT PLAN', 105, 10, { align: 'center' });
    
    let yOffset = 30;
    
    pdf.setFontSize(14);
    pdf.text(language === 'es' ? 'Diagnóstico:' : 'Diagnosis:', 10, yOffset);
    yOffset += 10;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    treatmentPlan.diagnosis.forEach(d => {
      pdf.text(`• ${d.condition} (${d.severity})`, 15, yOffset);
      yOffset += 7;
      pdf.text(`  ${d.details}`, 20, yOffset);
      yOffset += 10;
    });
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(language === 'es' ? 'Medicamentos:' : 'Medications:', 10, yOffset);
    yOffset += 10;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    treatmentPlan.medications.forEach(m => {
      pdf.text(`• ${m.name} - ${m.dosage}`, 15, yOffset);
      yOffset += 7;
      pdf.text(`  ${m.frequency} - ${m.purpose}`, 20, yOffset);
      yOffset += 10;
    });
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(language === 'es' ? 'Cambios en el Estilo de Vida:' : 'Lifestyle Changes:', 10, yOffset);
    yOffset += 10;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    treatmentPlan.lifestyleChanges.forEach(l => {
      pdf.text(`• ${l.category}:`, 15, yOffset);
      yOffset += 7;
      l.recommendations.forEach(r => {
        pdf.text(`  - ${r}`, 20, yOffset);
        yOffset += 7;
      });
      yOffset += 3;
    });
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(language === 'es' ? 'Notas del Doctor:' : "Doctor's Notes:", 10, yOffset);
    yOffset += 10;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    treatmentPlan.doctorNotes.forEach(note => {
      pdf.text(`• ${note}`, 15, yOffset);
      yOffset += 7;
    });
    
    pdf.setFontSize(8);
    pdf.text(`Generated on: ${currentDate}`, 10, pdf.internal.pageSize.height - 10);
    
    pdf.save(`treatment_plan_${patient?.name.replace(/\s+/g, '_')}_${language}.pdf`);
    
    toast({
      title: "Treatment Plan PDF Generated",
      description: `Treatment plan has been generated in ${language === 'es' ? 'Spanish' : 'English'} and downloaded.`,
    });
  };

  const handleEditToggle = (section: keyof typeof editMode) => {
    setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSaveSection = (section: keyof typeof editMode) => {
    setEditMode(prev => ({ ...prev, [section]: false }));
    toast({
      title: "Changes Saved",
      description: `${section.charAt(0).toUpperCase() + section.slice(1)} has been updated.`,
    });
  };

  const updateDiagnosis = (index: number, field: string, value: string) => {
    setTreatmentPlan(prev => ({
      ...prev,
      diagnosis: prev.diagnosis.map((d, i) => 
        i === index ? { ...d, [field]: value } : d
      )
    }));
  };

  const updateMedication = (index: number, field: string, value: string) => {
    setTreatmentPlan(prev => ({
      ...prev,
      medications: prev.medications.map((m, i) => 
        i === index ? { ...m, [field]: value } : m
      )
    }));
  };

  const updateLifestyleChange = (categoryIndex: number, recIndex: number, value: string) => {
    setTreatmentPlan(prev => ({
      ...prev,
      lifestyleChanges: prev.lifestyleChanges.map((lc, i) => 
        i === categoryIndex ? {
          ...lc,
          recommendations: lc.recommendations.map((r, j) => 
            j === recIndex ? value : r
          )
        } : lc
      )
    }));
  };

  const updateDoctorNote = (index: number, value: string) => {
    setTreatmentPlan(prev => ({
      ...prev,
      doctorNotes: prev.doctorNotes.map((note, i) => 
        i === index ? value : note
      )
    }));
  };

  const deleteDiagnosis = (index: number) => {
    setTreatmentPlan(prev => ({
      ...prev,
      diagnosis: prev.diagnosis.filter((_, i) => i !== index)
    }));
    toast({
      title: "Diagnosis Deleted",
      description: "The diagnosis has been removed from the treatment plan.",
    });
  };

  const deleteMedication = (index: number) => {
    setTreatmentPlan(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
    toast({
      title: "Medication Deleted",
      description: "The medication has been removed from the treatment plan.",
    });
  };

  const deleteLifestyleRecommendation = (categoryIndex: number, recIndex: number) => {
    setTreatmentPlan(prev => ({
      ...prev,
      lifestyleChanges: prev.lifestyleChanges.map((category, i) => 
        i === categoryIndex ? {
          ...category,
          recommendations: category.recommendations.filter((_, j) => j !== recIndex)
        } : category
      ).filter(category => category.recommendations.length > 0)
    }));
    toast({
      title: "Recommendation Deleted",
      description: "The lifestyle recommendation has been removed.",
    });
  };

  const deleteDoctorNote = (index: number) => {
    setTreatmentPlan(prev => ({
      ...prev,
      doctorNotes: prev.doctorNotes.filter((_, i) => i !== index)
    }));
    toast({
      title: "Note Deleted",
      description: "The doctor's note has been removed.",
    });
  };

  const addDiagnosis = () => {
    setTreatmentPlan(prev => ({
      ...prev,
      diagnosis: [...prev.diagnosis, {
        condition: "",
        severity: "Low",
        details: ""
      }]
    }));
    setEditMode(prev => ({ ...prev, diagnosis: true }));
  };

  const addMedication = () => {
    setTreatmentPlan(prev => ({
      ...prev,
      medications: [...prev.medications, {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        purpose: ""
      }]
    }));
    setEditMode(prev => ({ ...prev, medications: true }));
  };

  const addLifestyleRecommendation = (categoryIndex: number) => {
    setTreatmentPlan(prev => ({
      ...prev,
      lifestyleChanges: prev.lifestyleChanges.map((category, i) => 
        i === categoryIndex ? {
          ...category,
          recommendations: [...category.recommendations, ""]
        } : category
      )
    }));
    setEditMode(prev => ({ ...prev, lifestyleChanges: true }));
  };

  const addDoctorNote = () => {
    setTreatmentPlan(prev => ({
      ...prev,
      doctorNotes: [...prev.doctorNotes, ""]
    }));
    setEditMode(prev => ({ ...prev, doctorNotes: true }));
  };

  const handleGenerateIntakeForm = (language: string) => {
    const pdf = generateIntakeFormPDF(mockIntakeForm, language);
    pdf.save(`intake_form_${patient?.name.replace(/\s+/g, '_')}_${language}.pdf`);
    
    toast({
      title: language === "es" ? "Formulario Generado" : "Form Generated",
      description: language === "es" 
        ? "El formulario de admisión ha sido descargado."
        : "The intake form has been downloaded.",
    });
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
            <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
            <p><strong>Date:</strong> {new Date(patient.nextAppointment).toLocaleString()}</p>
            <p><strong>Reason:</strong> {patient.reasonForVisit}</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
            <p><strong>Age:</strong> {patient.demographics.age}</p>
            <p><strong>Preferred Language:</strong> {patient.demographics.preferredLanguage === 'es' ? 'Spanish' : 'English'}</p>
            <p><strong>Insurance Status:</strong> {patient.demographics.insuranceStatus}</p>
          </div>

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
            <h2 className="text-xl font-semibold mb-4">Exam Results</h2>
            <div className="space-y-6">
              {displayedExams.map((exam) => (
                <div key={exam.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{exam.name}</h3>
                      <p className="text-sm text-muted-foreground">{exam.purpose}</p>
                    </div>
                    {getStatusBadge(exam.results)}
                  </div>
                  <p className="text-sm mb-4">{exam.results}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendResult(exam.id)}
                      className="flex items-center"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send to Patient
                    </Button>
                    <Select
                      onValueChange={(value) => handleGeneratePDF(exam.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <FileText className="mr-2 h-4 w-4" />
                        Generate PDF
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Treatment Plan</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Diagnosis</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addDiagnosis}
                      >
                        + Add Diagnosis
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditToggle('diagnosis')}
                      >
                        {editMode.diagnosis ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  {treatmentPlan.diagnosis.map((diagnosis, index) => (
                    <div key={index} className="mb-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        {editMode.diagnosis ? (
                          <div className="space-y-2 flex-grow">
                            <Input
                              value={diagnosis.condition}
                              onChange={(e) => updateDiagnosis(index, 'condition', e.target.value)}
                              placeholder="Condition"
                            />
                            <Select
                              value={diagnosis.severity}
                              onValueChange={(value) => updateDiagnosis(index, 'severity', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Moderate">Moderate</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                              </SelectContent>
                            </Select>
                            <Textarea
                              value={diagnosis.details}
                              onChange={(e) => updateDiagnosis(index, 'details', e.target.value)}
                              placeholder="Details"
                            />
                          </div>
                        ) : (
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{diagnosis.condition}</h4>
                              <Badge className={
                                diagnosis.severity === "High" ? "bg-red-500" :
                                diagnosis.severity === "Moderate" ? "bg-yellow-500" : "bg-green-500"
                              }>
                                {diagnosis.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{diagnosis.details}</p>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteDiagnosis(index)}
                          className="ml-2"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {editMode.diagnosis && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveSection('diagnosis')}
                      className="mt-2"
                    >
                      Save Changes
                    </Button>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Prescribed Medications</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addMedication}
                      >
                        + Add Medication
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditToggle('medications')}
                      >
                        {editMode.medications ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  {treatmentPlan.medications.map((medication, index) => (
                    <div key={index} className="mb-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        {editMode.medications ? (
                          <div className="space-y-2 flex-grow">
                            <Input
                              value={medication.name}
                              onChange={(e) => updateMedication(index, 'name', e.target.value)}
                              placeholder="Medication name"
                            />
                            <Input
                              value={medication.dosage}
                              onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                              placeholder="Dosage"
                            />
                            <Input
                              value={medication.frequency}
                              onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                              placeholder="Frequency"
                            />
                            <Input
                              value={medication.purpose}
                              onChange={(e) => updateMedication(index, 'purpose', e.target.value)}
                              placeholder="Purpose"
                            />
                          </div>
                        ) : (
                          <div className="flex-grow">
                            <h4 className="font-medium">{medication.name}</h4>
                            <p className="text-sm text-gray-600">
                              {medication.dosage} - {medication.frequency}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{medication.purpose}</p>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMedication(index)}
                          className="ml-2"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {editMode.medications && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveSection('medications')}
                      className="mt-2"
                    >
                      Save Changes
                    </Button>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Lifestyle Changes</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addLifestyleRecommendation(0)}
                      >
                        + Add Recommendation
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditToggle('lifestyleChanges')}
                      >
                        {editMode.lifestyleChanges ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  {treatmentPlan.lifestyleChanges.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{category.category}</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addLifestyleRecommendation(categoryIndex)}
                          >
                            + Add Recommendation
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditToggle('lifestyleChanges')}
                          >
                            {editMode.lifestyleChanges ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      {editMode.lifestyleChanges ? (
                        <div className="space-y-2">
                          {category.recommendations.map((rec, recIndex) => (
                            <div key={recIndex} className="flex items-center gap-2">
                              <Input
                                value={rec}
                                onChange={(e) => updateLifestyleChange(categoryIndex, recIndex, e.target.value)}
                                placeholder="Recommendation"
                                className="flex-grow"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteLifestyleRecommendation(categoryIndex, recIndex)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ul className="list-disc pl-5 space-y-1">
                          {category.recommendations.map((rec, recIndex) => (
                            <li key={recIndex} className="text-sm text-gray-600 flex justify-between items-center">
                              <span>{rec}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteLifestyleRecommendation(categoryIndex, recIndex)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                  {editMode.lifestyleChanges && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveSection('lifestyleChanges')}
                      className="mt-2"
                    >
                      Save Changes
                    </Button>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Doctor's Notes & Special Instructions</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addDoctorNote()}
                      >
                        + Add Note
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditToggle('doctorNotes')}
                      >
                        {editMode.doctorNotes ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {editMode.doctorNotes ? (
                      <div className="space-y-2">
                        {treatmentPlan.doctorNotes.map((note, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={note}
                              onChange={(e) => updateDoctorNote(index, e.target.value)}
                              placeholder="Note"
                              className="flex-grow"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteDoctorNote(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {treatmentPlan.doctorNotes.map((note, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start justify-between">
                            <div className="flex items-start">
                              <span className="mr-2">•</span>
                              {note}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteDoctorNote(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {editMode.doctorNotes && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveSection('doctorNotes')}
                      className="mt-2"
                    >
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendTreatmentPlan}
                  className="flex items-center"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send to Patient
                </Button>
                <Select
                  onValueChange={handleGenerateTreatmentPDF}
                >
                  <SelectTrigger className="w-[180px]">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate PDF
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
