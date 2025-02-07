
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Patient } from "@/types/patient";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

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
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [otherExam, setOtherExam] = useState("");
  const [customExams, setCustomExams] = useState<string[]>([]);

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

    const standardExams = selectedExams
      .map(id => commonExams.find(e => e.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    const allExams = [
      ...selectedExams.map(id => commonExams.find(e => e.id === id)?.name).filter(Boolean),
      ...customExams
    ].join(", ");

    toast({
      title: "Exam Request Ordered",
      description: `Ordered the following exams for ${patient.name}: ${allExams}`,
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
        </div>
      </div>
    </div>
  );
};

export default PatientOverviewPage;
