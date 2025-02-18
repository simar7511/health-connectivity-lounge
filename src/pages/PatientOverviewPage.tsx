
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle, XCircle, Send, FileText } from "lucide-react";
import { Patient } from "@/types/patient";
import { useToast } from "@/hooks/use-toast";
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
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState("");

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
