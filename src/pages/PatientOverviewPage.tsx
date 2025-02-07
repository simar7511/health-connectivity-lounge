import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle, XCircle, Send, FileText } from "lucide-react";
import { Patient } from "@/types/patient";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  { id: "ultrasound", name: "Ultrasound", purpose: "Check baby's growth, placenta health", results: "Normal growth, possible abnormalities" },
  { id: "gtt", name: "Glucose Tolerance Test (GTT)", purpose: "Screen for gestational diabetes", results: "Normal, High sugar levels (diabetes risk)" },
  { id: "cbc", name: "Complete Blood Count", purpose: "Check for anemia and infection", results: "Normal blood cell counts" },
  { id: "urine", name: "Urine Analysis", purpose: "Check for protein, bacteria, and sugar", results: "Normal levels" },
  { id: "thyroid", name: "Thyroid Function Test", purpose: "Monitor thyroid hormone levels", results: "Within normal range" },
  { id: "strep", name: "Group B Strep Culture", purpose: "Screen for bacterial infection", results: "Negative for GBS" },
  { id: "hiv", name: "HIV Test", purpose: "Screen for HIV infection", results: "Non-reactive" },
  { id: "iron", name: "Iron Studies", purpose: "Check iron levels and storage", results: "Normal ferritin levels" },
];

// Only show the first three exams in results
const displayedExams = commonExams.slice(0, 3);

const getStatusBadge = (results: string) => {
  if (results.toLowerCase().includes('normal')) {
    return <Badge className="bg-green-500"><CheckCircle className="w-4 h-4 mr-1" /> Normal</Badge>;
  }
  if (results.toLowerCase().includes('high')) {
    return <Badge className="bg-red-500"><XCircle className="w-4 h-4 mr-1" /> High Risk</Badge>;
  }
  return <Badge className="bg-yellow-500"><AlertCircle className="w-4 h-4 mr-1" /> Attention Needed</Badge>;
};

const PatientOverviewPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const patient = mockPatients.find(p => p.id === patientId);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [otherExam, setOtherExam] = useState("");
  const [customExams, setCustomExams] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState("");

  if (!patient) {
    return <div>Patient not found</div>;
  }

  const handleExamSelect = (examId: string, checked: boolean) => {
    setSelectedExams(prev => {
      if (checked) {
        return [...prev, examId];
      }
      return prev.filter(id => id !== examId);
    });
  };

  const handleAddOtherExam = () => {
    if (otherExam.trim()) {
      setCustomExams(prev => [...prev, otherExam.trim()]);
      setOtherExam("");
    }
  };

  const handleOrderExams = () => {
    if (selectedExams.length === 0 && customExams.length === 0) {
      toast({
        title: "No Exams Selected",
        description: "Please select at least one exam to order.",
        variant: "destructive",
      });
      return;
    }

    const allExams = [
      ...selectedExams.map(id => commonExams.find(e => e.id === id)?.name).filter(Boolean),
      ...customExams
    ].join(", ");

    console.log("Showing first toast");
    toast({
      title: "Exam Request Sent",
      description: `The exam request has been sent to the provider. You will be notified when it's reviewed.`,
      variant: "default",
    });

    console.log("Setting timeout for second toast");
    setTimeout(() => {
      console.log("Showing second toast");
      toast({
        title: "Exam Request Details",
        description: `Ordered the following exams for ${patient.name}: ${allExams}`,
        variant: "default",
      });
    }, 1000);

    // Clear selections after order
    setSelectedExams([]);
    setCustomExams([]);
  };

  const handleSendResult = (examId: string) => {
    const exam = commonExams.find(e => e.id === examId);
    if (exam) {
      toast({
        title: "Results Sent",
        description: `${exam.name} results have been sent to ${patient.name}'s patient portal.`,
      });
    }
  };

  const handleGeneratePDF = (examId: string, language: string) => {
    const exam = commonExams.find(e => e.id === examId);
    if (exam && exam.id === "bp" && patient) {
      const reportData = {
        patientName: patient.name,
        examDate: exam.date,
        systolic: exam.values.systolic,
        diastolic: exam.values.diastolic
      };
      
      const report = generateBloodPressureReport(reportData, language as 'en' | 'es');
      setCurrentReport(report);
      setReportDialogOpen(true);
      
      // Generate PDF with proper formatting
      const pdf = new jsPDF();
      const splitReport = report.split('\n');
      let yOffset = 20;
      
      // Add hospital logo or header
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(language === 'es' ? 'INFORME MÉDICO' : 'MEDICAL REPORT', 105, 10, { align: 'center' });
      
      // Reset font for content
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      splitReport.forEach((line) => {
        if (line.trim()) {
          if (line.includes('----------------------------------------')) {
            // Draw a line instead of dashes
            pdf.line(10, yOffset - 2, 200, yOffset - 2);
            yOffset += 5;
          } else if (line === (language === 'es' ? 'INFORME DE PRESIÓN ARTERIAL' : 'BLOOD PRESSURE REPORT')) {
            // Make titles bold
            pdf.setFont('helvetica', 'bold');
            pdf.text(line, 10, yOffset);
            pdf.setFont('helvetica', 'normal');
            yOffset += 10;
          } else {
            // Regular text
            pdf.text(line, 10, yOffset);
            yOffset += 7;
          }
        }
      });
      
      // Add footer
      pdf.setFontSize(8);
      const currentDate = new Date().toLocaleDateString();
      pdf.text(`Generated on: ${currentDate}`, 10, pdf.internal.pageSize.height - 10);
      
      // Save the PDF
      pdf.save(`blood_pressure_report_${patient.name.replace(/\s+/g, '_')}.pdf`);
      
      toast({
        title: "Report Generated",
        description: `Blood pressure report has been generated in ${language === 'es' ? 'Spanish' : 'English'} and downloaded.`,
      });
    } else {
      toast({
        title: "Report Generated",
        description: `${exam?.name} report has been generated in ${language === 'es' ? 'Spanish' : 'English'}.`,
      });
    }
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
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recommended Exams</h2>
            <div className="space-y-4">
              {commonExams.map((exam) => (
                <div key={exam.id} className="flex items-start space-x-3">
                  <Checkbox 
                    id={exam.id}
                    checked={selectedExams.includes(exam.id)}
                    onCheckedChange={(checked) => handleExamSelect(exam.id, checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={exam.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {exam.name}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {exam.purpose}
                    </p>
                  </div>
                </div>
              ))}

              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-medium mb-3">Other Exams</h3>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Enter other exam name"
                    value={otherExam}
                    onChange={(e) => setOtherExam(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAddOtherExam}
                    variant="secondary"
                  >
                    Add Exam
                  </Button>
                </div>

                {customExams.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium">Added Custom Exams:</p>
                    <ul className="list-disc pl-5">
                      {customExams.map((exam, index) => (
                        <li key={index}>{exam}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {(selectedExams.length > 0 || customExams.length > 0) && (
              <div className="mt-6">
                <Button 
                  onClick={handleOrderExams}
                  className="w-full"
                >
                  Order Exam Request ({selectedExams.length + customExams.length} selected)
                </Button>
              </div>
            )}
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
                      value={selectedLanguage}
                      onValueChange={(value) => {
                        setSelectedLanguage(value);
                        handleGeneratePDF(exam.id, value);
                      }}
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
