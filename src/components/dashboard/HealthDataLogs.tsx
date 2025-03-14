
import { useState } from "react";
import { Patient } from "@/types/patient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, FileText, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";

interface HealthDataLogsProps {
  patient: Patient;
}

type Severity = "mild" | "moderate" | "severe";
type TimeFilter = "7days" | "30days" | "90days" | "all";
type HealthStatus = "normal" | "attention" | "high-risk";

interface SymptomLog {
  timestamp: string;
  symptom: string;
  severity: Severity;
  description: string;
  relatedCondition?: string;
  bp?: number[];
  glucose?: number;
}

interface PatientSummary {
  id: string;
  name: string;
  latestVitals: {
    bp?: number[];
    glucose?: number;
    temp?: number;
  };
  recentSymptoms: string[];
  healthStatus: HealthStatus;
  lastFollowUp: string;
}

const patientSummaries: PatientSummary[] = [
  {
    id: "1",
    name: "Maria Garcia",
    latestVitals: {
      bp: [150, 95],
      glucose: 98,
      temp: 37.2
    },
    recentSymptoms: ["Headache", "Swollen ankles"],
    healthStatus: "high-risk",
    lastFollowUp: "2024-03-15"
  },
  {
    id: "2",
    name: "John Smith",
    latestVitals: {
      bp: [122, 78],
      glucose: 92,
      temp: 36.8
    },
    recentSymptoms: [],
    healthStatus: "normal",
    lastFollowUp: "2024-03-18"
  },
  {
    id: "3",
    name: "Sarah Johnson",
    latestVitals: {
      bp: [135, 88],
      glucose: 105,
      temp: 37.0
    },
    recentSymptoms: ["Nausea", "Fatigue"],
    healthStatus: "attention",
    lastFollowUp: "2024-03-17"
  },
  {
    id: "4",
    name: "Emily Chen",
    latestVitals: {
      bp: [118, 75],
      glucose: 88,
      temp: 36.9
    },
    recentSymptoms: ["Mild cramps"],
    healthStatus: "normal",
    lastFollowUp: "2024-03-19"
  },
  {
    id: "5",
    name: "David Wilson",
    latestVitals: {
      bp: [142, 92],
      glucose: 110,
      temp: 37.1
    },
    recentSymptoms: ["Dizziness", "Blurred vision"],
    healthStatus: "high-risk",
    lastFollowUp: "2024-03-16"
  },
  {
    id: "6",
    name: "Ana Rodriguez",
    latestVitals: {
      bp: [125, 82],
      glucose: 95,
      temp: 36.7
    },
    recentSymptoms: ["Back pain"],
    healthStatus: "attention",
    lastFollowUp: "2024-03-20"
  },
  {
    id: "7",
    name: "Michael Brown",
    latestVitals: {
      bp: [128, 84],
      glucose: 90,
      temp: 36.9
    },
    recentSymptoms: [],
    healthStatus: "normal",
    lastFollowUp: "2024-03-19"
  },
  {
    id: "8",
    name: "Lisa Taylor",
    latestVitals: {
      bp: [145, 94],
      glucose: 115,
      temp: 37.3
    },
    recentSymptoms: ["Severe headache", "Vision changes"],
    healthStatus: "high-risk",
    lastFollowUp: "2024-03-18"
  }
];

// Patient-specific symptom logs - each patient has different entries
const patientSymptomLogs: Record<string, SymptomLog[]> = {
  "1": [
    {
      timestamp: "2024-03-20T09:30:00",
      symptom: "Headache",
      severity: "moderate",
      description: "Persistent headache with visual disturbances",
      relatedCondition: "Gestational Hypertension",
      bp: [140, 90]
    },
    {
      timestamp: "2024-03-19T15:45:00",
      symptom: "Swelling",
      severity: "mild",
      description: "Slight ankle swelling",
      bp: [135, 88]
    },
    {
      timestamp: "2024-03-18T11:20:00",
      symptom: "Dizziness",
      severity: "severe",
      description: "Severe dizziness upon standing",
      relatedCondition: "Gestational Hypertension",
      bp: [150, 95]
    }
  ],
  "2": [
    {
      timestamp: "2024-03-19T14:15:00",
      symptom: "Mild cough",
      severity: "mild",
      description: "Occasional dry cough, especially in the morning",
      bp: [120, 76]
    },
    {
      timestamp: "2024-03-17T10:30:00",
      symptom: "Fatigue",
      severity: "mild",
      description: "Feeling tired after light activities",
      bp: [125, 80]
    }
  ],
  "3": [
    {
      timestamp: "2024-03-20T08:45:00",
      symptom: "Nausea",
      severity: "moderate",
      description: "Morning sickness, unable to eat breakfast",
      relatedCondition: "Pregnancy",
      bp: [132, 85]
    },
    {
      timestamp: "2024-03-19T16:20:00",
      symptom: "Fatigue",
      severity: "moderate",
      description: "Extreme tiredness even after resting",
      bp: [136, 87],
      glucose: 108
    },
    {
      timestamp: "2024-03-16T12:10:00",
      symptom: "Heartburn",
      severity: "mild",
      description: "Burning sensation after meals",
      relatedCondition: "Pregnancy",
      bp: [130, 84]
    }
  ],
  "4": [
    {
      timestamp: "2024-03-19T13:40:00",
      symptom: "Mild cramps",
      severity: "mild",
      description: "Occasional cramping in lower abdomen",
      bp: [116, 74]
    }
  ],
  "5": [
    {
      timestamp: "2024-03-20T10:15:00",
      symptom: "Dizziness",
      severity: "severe",
      description: "Almost passed out when getting up",
      relatedCondition: "Hypertension",
      bp: [150, 95],
      glucose: 115
    },
    {
      timestamp: "2024-03-19T14:50:00",
      symptom: "Blurred vision",
      severity: "moderate",
      description: "Difficulty focusing, especially in bright light",
      relatedCondition: "Hypertension",
      bp: [145, 92]
    },
    {
      timestamp: "2024-03-16T09:30:00",
      symptom: "Headache",
      severity: "severe",
      description: "Pounding headache at the back of the head",
      relatedCondition: "Hypertension",
      bp: [148, 94]
    }
  ],
  "6": [
    {
      timestamp: "2024-03-20T11:25:00",
      symptom: "Back pain",
      severity: "moderate",
      description: "Lower back pain, worse when sitting for long periods",
      bp: [126, 81]
    },
    {
      timestamp: "2024-03-17T15:30:00",
      symptom: "Insomnia",
      severity: "mild",
      description: "Difficulty falling asleep",
      bp: [128, 83]
    }
  ],
  "7": [
    {
      timestamp: "2024-03-18T09:10:00",
      symptom: "Mild allergies",
      severity: "mild",
      description: "Occasional sneezing and itchy eyes",
      bp: [126, 82]
    }
  ],
  "8": [
    {
      timestamp: "2024-03-20T08:00:00",
      symptom: "Severe headache",
      severity: "severe",
      description: "Intense pain on one side of the head with nausea",
      relatedCondition: "Hypertension",
      bp: [152, 97]
    },
    {
      timestamp: "2024-03-19T10:45:00",
      symptom: "Vision changes",
      severity: "moderate",
      description: "Seeing spots and temporary visual disturbances",
      relatedCondition: "Hypertension",
      bp: [148, 95]
    },
    {
      timestamp: "2024-03-17T14:20:00",
      symptom: "Palpitations",
      severity: "moderate",
      description: "Heart racing, especially when lying down",
      bp: [145, 93],
      glucose: 112
    }
  ]
};

// Patient-specific intake forms - each patient has different information
const patientIntakeForms: Record<string, any> = {
  "1": {
    patientInfo: {
      name: "Maria Garcia",
      dob: "1996-05-12",
      phone: "415-555-7890"
    },
    medicalHistory: {
      allergies: ["Penicillin"],
      currentMedications: ["Prenatal vitamins", "Iron supplements"]
    },
    currentPregnancy: {
      dueDate: "2024-06-15",
      complications: "Gestational hypertension"
    }
  },
  "2": {
    patientInfo: {
      name: "John Smith",
      dob: "1985-09-23",
      phone: "510-555-1234"
    },
    medicalHistory: {
      allergies: ["None"],
      currentMedications: ["Multivitamin"]
    },
    currentPregnancy: {
      dueDate: "2024-07-22",
      complications: "None"
    }
  },
  "3": {
    patientInfo: {
      name: "Sarah Johnson",
      dob: "1992-11-30",
      phone: "628-555-4567"
    },
    medicalHistory: {
      allergies: ["Shellfish", "Latex"],
      currentMedications: ["Prenatal vitamins", "Folic acid"]
    },
    currentPregnancy: {
      dueDate: "2024-08-10",
      complications: "Morning sickness"
    }
  },
  "4": {
    patientInfo: {
      name: "Emily Chen",
      dob: "1994-04-18",
      phone: "408-555-8901"
    },
    medicalHistory: {
      allergies: ["None"],
      currentMedications: ["Prenatal vitamins"]
    },
    currentPregnancy: {
      dueDate: "2024-09-05",
      complications: "None"
    }
  },
  "5": {
    patientInfo: {
      name: "David Wilson",
      dob: "1978-07-14",
      phone: "650-555-2345"
    },
    medicalHistory: {
      allergies: ["Sulfa drugs"],
      currentMedications: ["Labetalol", "Prenatal vitamins"]
    },
    currentPregnancy: {
      dueDate: "2024-05-30",
      complications: "Chronic hypertension"
    }
  },
  "6": {
    patientInfo: {
      name: "Ana Rodriguez",
      dob: "1990-12-25",
      phone: "925-555-6789"
    },
    medicalHistory: {
      allergies: ["Aspirin"],
      currentMedications: ["Prenatal vitamins"]
    },
    currentPregnancy: {
      dueDate: "2024-07-15",
      complications: "Back pain"
    }
  },
  "7": {
    patientInfo: {
      name: "Michael Brown",
      dob: "1987-02-14",
      phone: "510-555-9012"
    },
    medicalHistory: {
      allergies: ["Pollen"],
      currentMedications: ["Claritin", "Prenatal vitamins"]
    },
    currentPregnancy: {
      dueDate: "2024-08-22",
      complications: "None"
    }
  },
  "8": {
    patientInfo: {
      name: "Lisa Taylor",
      dob: "1984-06-08",
      phone: "415-555-3456"
    },
    medicalHistory: {
      allergies: ["Penicillin", "Ibuprofen"],
      currentMedications: ["Methyldopa", "Prenatal vitamins"]
    },
    currentPregnancy: {
      dueDate: "2024-06-05",
      complications: "Severe hypertension, requires close monitoring"
    }
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

  pdf.setFont("helvetica", "bold");
  pdf.text(language === "es" ? "Historia Médica" : "Medical History", 20, yPosition);
  pdf.setFont("helvetica", "normal");
  yPosition += lineHeight;
  pdf.text(`${language === "es" ? "Alergias" : "Allergies"}: ${patientData.medicalHistory.allergies.join(", ")}`, 20, yPosition);
  yPosition += lineHeight;
  pdf.text(`${language === "es" ? "Medicamentos Actuales" : "Current Medications"}: ${patientData.medicalHistory.currentMedications.join(", ")}`, 20, yPosition);
  yPosition += lineHeight * 2;

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

export const HealthDataLogs = ({ patient }: HealthDataLogsProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("7days");
  const [providerNote, setProviderNote] = useState("");
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;

  const filteredPatients = patientSummaries.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const startIndex = (currentPage - 1) * patientsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + patientsPerPage);

  const getHealthStatusIcon = (status: HealthStatus) => {
    switch (status) {
      case "high-risk":
        return "🔴";
      case "attention":
        return "🟠";
      case "normal":
        return "🟢";
    }
  };

  const getVitalsStatus = (bp?: number[]) => {
    if (!bp) return null;
    const [systolic, diastolic] = bp;
    if (systolic >= 140 || diastolic >= 90) return "High";
    if (systolic <= 90 || diastolic <= 60) return "Low";
    return "Normal";
  };

  const getSeverityColor = (severity: Severity) => {
    return {
      severe: "bg-red-500",
      moderate: "bg-orange-500",
      mild: "bg-green-500"
    }[severity];
  };

  const getAlertIcon = (severity: Severity) => {
    switch (severity) {
      case "severe":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "moderate":
        return <Activity className="h-5 w-5 text-orange-500" />;
      case "mild":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  // Get patient-specific symptom logs based on the expanded patient ID
  const getPatientSymptomLogs = () => {
    if (!expandedPatientId) return [];
    return patientSymptomLogs[expandedPatientId] || [];
  };

  // Get patient-specific intake form
  const getPatientIntakeForm = () => {
    if (!expandedPatientId) return patientIntakeForms["1"]; // Default fallback
    return patientIntakeForms[expandedPatientId] || patientIntakeForms["1"];
  };

  // Filter logs by severity and time
  const filteredLogs = getPatientSymptomLogs()
    .filter(log => severityFilter === "all" || log.severity === severityFilter)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const sendNoteToPatient = () => {
    if (providerNote.trim()) {
      toast({
        title: "Note Sent",
        description: `Message has been sent to ${expandedPatientId ? patientSummaries.find(p => p.id === expandedPatientId)?.name : "the patient"} via secure messaging.`,
      });
      setProviderNote("");
    }
  };

  const handleGenerateIntakeForm = (language: string) => {
    const patientData = getPatientIntakeForm();
    const pdf = generateIntakeFormPDF(patientData, language);
    pdf.save(`intake_form_${patientData.patientInfo.name.replace(/\s+/g, '_')}_${language}.pdf`);
    
    toast({
      title: language === "es" ? "Formulario Generado" : "Form Generated",
      description: language === "es" 
        ? "El formulario de admisión ha sido descargado."
        : "The intake form has been downloaded.",
    });
  };

  const renderSummaryView = () => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Patient Health Summary</CardTitle>
          <div className="relative w-64">
            <Input
              placeholder="Search patient name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Latest Vitals</th>
                <th className="py-3 px-4">Key Symptoms</th>
                <th className="py-3 px-4">Health Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{patient.name}</td>
                  <td className="py-3 px-4">
                    {patient.latestVitals.bp && (
                      <div className="flex items-center gap-2">
                        <span>BP: {patient.latestVitals.bp.join('/')}</span>
                        <Badge 
                          className={
                            getVitalsStatus(patient.latestVitals.bp) === "High" 
                              ? "bg-red-500" 
                              : getVitalsStatus(patient.latestVitals.bp) === "Low"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }
                        >
                          {getVitalsStatus(patient.latestVitals.bp)}
                        </Badge>
                      </div>
                    )}
                    {patient.latestVitals.glucose && (
                      <div>Glucose: {patient.latestVitals.glucose} mg/dL</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {patient.recentSymptoms.length > 0 
                      ? patient.recentSymptoms.join(", ")
                      : "No symptoms"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getHealthStatusIcon(patient.healthStatus)}
                      <span className="capitalize">{patient.healthStatus.replace("-", " ")}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedPatientId(
                        expandedPatientId === patient.id ? null : patient.id
                      )}
                      className="flex items-center gap-2"
                    >
                      <Search className="h-4 w-4" />
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex justify-between items-center mt-4 px-4">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(startIndex + patientsPerPage, filteredPatients.length)} of {filteredPatients.length} patients
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                    className="w-8 h-8 p-0"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderDetailedView = () => {
    if (!expandedPatientId) return null;
    
    // Get the selected patient's data
    const selectedPatient = patientSummaries.find(p => p.id === expandedPatientId);
    if (!selectedPatient) return null;

    return (
      <div className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              {selectedPatient.name}'s Reported Symptoms
            </CardTitle>
            <div className="flex items-center gap-4">
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
              <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={(value: any) => setSeverityFilter(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredLogs.length === 0 ? (
              <Alert>
                <AlertTitle>No symptoms reported</AlertTitle>
                <AlertDescription>
                  {selectedPatient.name} has not reported any symptoms in the selected time period and severity.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {filteredLogs.map((log, index) => (
                  <Alert key={index} className="relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <AlertTitle className="flex items-center gap-2">
                          {getAlertIcon(log.severity)}
                          {log.symptom}
                          <Badge className={`${getSeverityColor(log.severity)} text-white`}>
                            {log.severity}
                          </Badge>
                        </AlertTitle>
                        <AlertDescription>
                          <p className="mt-1">{log.description}</p>
                          {log.relatedCondition && (
                            <Badge variant="outline" className="mt-2">
                              Related: {log.relatedCondition}
                            </Badge>
                          )}
                          {log.bp && (
                            <div className="mt-2 text-sm">
                              BP at time of report: {log.bp[0]}/{log.bp[1]} mmHg
                            </div>
                          )}
                          {log.glucose && (
                            <div className="mt-1 text-sm">
                              Glucose at time of report: {log.glucose} mg/dL
                            </div>
                          )}
                        </AlertDescription>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </Alert>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Send Message to {selectedPatient.name}
              </h3>
              <Textarea
                value={providerNote}
                onChange={(e) => setProviderNote(e.target.value)}
                placeholder={`Write a message to ${selectedPatient.name} regarding their symptoms...`}
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setProviderNote("")}>
                  Clear
                </Button>
                <Button onClick={sendNoteToPatient}>
                  Send Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderSummaryView()}
      {renderDetailedView()}
    </div>
  );
};
