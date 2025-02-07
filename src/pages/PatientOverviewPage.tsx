
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Patient } from "@/types/patient";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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
  { id: "ultrasound", name: "Ultrasound", purpose: "Check baby's growth, placenta health", results: "Normal growth, possible abnormalities" },
  { id: "gtt", name: "Glucose Tolerance Test (GTT)", purpose: "Screen for gestational diabetes", results: "Normal, High sugar levels (diabetes risk)" },
  { id: "gbs", name: "Group B Strep Test", purpose: "Check for bacterial infection in mother", results: "Negative, Positive (requires antibiotics)" },
  { id: "bp", name: "Blood Pressure Check", purpose: "Monitor for preeclampsia risk", results: "Normal, High BP (risk of complications)" },
  { id: "urine", name: "Urine Test", purpose: "Check for infections and protein levels", results: "Normal, Protein found (preeclampsia risk)" },
  { id: "nst", name: "Non-Stress Test (NST)", purpose: "Monitor baby's heart rate & movement", results: "Normal, Irregular heartbeat (further tests needed)" },
  { id: "cbc", name: "Complete Blood Count (CBC)", purpose: "Detect anemia or infections", results: "Normal, Low iron (anemia risk)" },
];

const PatientOverviewPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const patient = mockPatients.find(p => p.id === patientId);
  const [selectedExam, setSelectedExam] = useState<string>("");

  if (!patient) {
    return <div>Patient not found</div>;
  }

  const handleExamSelect = (examId: string) => {
    setSelectedExam(examId);
    const exam = commonExams.find(e => e.id === examId);
    if (exam) {
      toast({
        title: "Exam Recommended",
        description: `${exam.name} has been recommended for ${patient.name}`,
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
            <Select onValueChange={handleExamSelect} value={selectedExam}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an exam to recommend" />
              </SelectTrigger>
              <SelectContent>
                {commonExams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedExam && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">
                  {commonExams.find(e => e.id === selectedExam)?.name}
                </h4>
                <p><strong>Purpose:</strong> {commonExams.find(e => e.id === selectedExam)?.purpose}</p>
                <p><strong>Possible Results:</strong> {commonExams.find(e => e.id === selectedExam)?.results}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientOverviewPage;
