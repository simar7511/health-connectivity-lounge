
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient } from "@/types/patient";
import { Heart, FileText, Clipboard, AlertTriangle } from "lucide-react";
import { useParams } from "react-router-dom";

// The patient health summary page will receive language as a prop
interface PatientHealthSummaryPageProps {
  language?: "en" | "es";
}

const mockPatient: Patient = {
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
};

const translations = {
  en: {
    title: "Patient Health Summary",
    intake: "Initial Intake Form",
    vitals: "Vitals History",
    risks: "Risk Factors",
    symptoms: "Recent Symptoms",
    age: "Age",
    language: "Preferred Language",
    insurance: "Insurance Status",
    bp: "Blood Pressure",
    glucose: "Glucose",
    weight: "Weight",
    movements: "Fetal Movements",
    lastUpdated: "Last Updated",
    spanish: "Spanish",
    english: "English",
    insured: "Insured",
    uninsured: "Uninsured",
  },
  es: {
    title: "Resumen de Salud del Paciente",
    intake: "Formulario de Admisión Inicial",
    vitals: "Historial de Signos Vitales",
    risks: "Factores de Riesgo",
    symptoms: "Síntomas Recientes",
    age: "Edad",
    language: "Idioma Preferido",
    insurance: "Estado del Seguro",
    bp: "Presión Arterial",
    glucose: "Glucosa",
    weight: "Peso",
    movements: "Movimientos Fetales",
    lastUpdated: "Última Actualización",
    spanish: "Español",
    english: "Inglés",
    insured: "Asegurado",
    uninsured: "Sin Seguro",
  },
};

const mockIntakeForm = {
  medications: ["Prenatal vitamins", "Iron supplements"],
  allergies: ["Penicillin"],
  previousPregnancies: 1,
  familyHistory: ["Diabetes", "Hypertension"],
  lifestyle: {
    smoking: false,
    alcohol: false,
    exercise: "Moderate",
  },
};

export const PatientHealthSummaryPage = ({ language = "en" }: PatientHealthSummaryPageProps) => {
  const { patientId } = useParams();
  const t = translations[language];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Health Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                {t.vitals}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t.bp}</p>
                  <p className="font-medium">{mockPatient.vitals.bp[mockPatient.vitals.bp.length - 1]} mmHg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.glucose}</p>
                  <p className="font-medium">{mockPatient.vitals.glucose[mockPatient.vitals.glucose.length - 1]} mg/dL</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.weight}</p>
                  <p className="font-medium">{mockPatient.vitals.weight[mockPatient.vitals.weight.length - 1]} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.movements}</p>
                  <p className="font-medium">{mockPatient.vitals.fetalMovements?.[mockPatient.vitals.fetalMovements.length - 1] || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {mockPatient.risks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  {t.risks}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mockPatient.risks.map((risk, index) => (
                    <li key={index} className="flex items-center gap-2 text-destructive">
                      <span>•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Intake Form Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {t.intake}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Medications & Allergies</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Medications: </span>
                    {mockIntakeForm.medications.join(", ")}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Allergies: </span>
                    {mockIntakeForm.allergies.join(", ")}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Medical History</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Previous Pregnancies: </span>
                    {mockIntakeForm.previousPregnancies}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Family History: </span>
                    {mockIntakeForm.familyHistory.join(", ")}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Lifestyle</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Smoking: </span>
                    {mockIntakeForm.lifestyle.smoking ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Alcohol: </span>
                    {mockIntakeForm.lifestyle.alcohol ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Exercise: </span>
                    {mockIntakeForm.lifestyle.exercise}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clipboard className="h-5 w-5 text-primary" />
                {t.symptoms}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mockPatient.recentSymptoms.map((symptom, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span>•</span>
                    {symptom}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientHealthSummaryPage;
