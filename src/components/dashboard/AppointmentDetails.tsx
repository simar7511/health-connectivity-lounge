
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Languages, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { PrenatalExam } from "@/types/exam";
import { useToast } from "@/components/ui/use-toast";
import { Patient } from "@/types/patient";

// Mock exam data
const prenatalExams: PrenatalExam[] = [
  {
    id: "ultrasound",
    name: "Ultrasound",
    purpose: "Check baby's growth, placenta health",
    possibleResults: ["Normal growth", "Possible abnormalities"],
  },
  {
    id: "gtt",
    name: "Glucose Tolerance Test (GTT)",
    purpose: "Screen for gestational diabetes",
    possibleResults: ["Normal", "High sugar levels (diabetes risk)"],
  },
  {
    id: "gbs",
    name: "Group B Strep Test",
    purpose: "Check for bacterial infection in mother",
    possibleResults: ["Negative", "Positive (requires antibiotics)"],
  },
  {
    id: "bp",
    name: "Blood Pressure Check",
    purpose: "Monitor for preeclampsia risk",
    possibleResults: ["Normal", "High BP (risk of complications)"],
  },
  {
    id: "urine",
    name: "Urine Test",
    purpose: "Check for infections and protein levels",
    possibleResults: ["Normal", "Protein found (preeclampsia risk)"],
  },
  {
    id: "nst",
    name: "Non-Stress Test (NST)",
    purpose: "Monitor baby's heart rate & movement",
    possibleResults: ["Normal", "Irregular heartbeat (further tests needed)"],
  },
  {
    id: "cbc",
    name: "Complete Blood Count (CBC)",
    purpose: "Detect anemia or infections",
    possibleResults: ["Normal", "Low iron (anemia risk)"],
  },
];

const content = {
  en: {
    title: "Appointment Details",
    reasonForVisit: "Reason for Visit",
    preferredLanguage: "Preferred Language",
    recommendExam: "Recommend Exam",
    selectExam: "Select an exam",
    examRecommended: "Exam recommended successfully",
    examDetails: "Exam Details",
    purpose: "Purpose",
    possibleResults: "Possible Results",
  },
  es: {
    title: "Detalles de la Cita",
    reasonForVisit: "Motivo de la Visita",
    preferredLanguage: "Idioma Preferido",
    recommendExam: "Recomendar Examen",
    selectExam: "Seleccionar un examen",
    examRecommended: "Examen recomendado exitosamente",
    examDetails: "Detalles del Examen",
    purpose: "Propósito",
    possibleResults: "Resultados Posibles",
  },
};

interface AppointmentDetailsProps {
  language: "en" | "es";
  patients: Patient[];
}

export const AppointmentDetails = ({ language, patients }: AppointmentDetailsProps) => {
  const { patientId } = useParams();
  const { toast } = useToast();
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return <div>Patient not found</div>;
  }

  const handleExamSelect = (examId: string) => {
    const exam = prenatalExams.find((e) => e.id === examId);
    if (exam) {
      setSelectedExam(examId);
      toast({
        title: content[language].examRecommended,
        description: exam.name,
      });
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {content[language].title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="font-medium">{patient.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(patient.nextAppointment).toLocaleString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">
                    {content[language].reasonForVisit}:
                  </span>{" "}
                  {patient.reasonForVisit}
                </p>
                {patient.demographics.preferredLanguage === "es" && (
                  <span className="inline-flex items-center text-sm text-blue-600">
                    <Languages className="h-4 w-4 mr-1" />
                    Español
                  </span>
                )}
                
                <div className="mt-4">
                  <Select onValueChange={handleExamSelect}>
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue placeholder={content[language].selectExam} />
                    </SelectTrigger>
                    <SelectContent>
                      {prenatalExams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedExam && (
                  <div className="mt-4 p-4 bg-secondary rounded-lg">
                    <h4 className="font-medium mb-2">
                      {content[language].examDetails}
                    </h4>
                    {(() => {
                      const exam = prenatalExams.find(
                        (e) => e.id === selectedExam
                      );
                      if (!exam) return null;
                      return (
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">
                              {content[language].purpose}:
                            </span>{" "}
                            {exam.purpose}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">
                              {content[language].possibleResults}:
                            </span>
                            <ul className="list-disc ml-4">
                              {exam.possibleResults.map((result, index) => (
                                <li key={index}>{result}</li>
                              ))}
                            </ul>
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
              {patient.risks.length > 0 && (
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

