
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Languages, AlertTriangle, Clock } from "lucide-react";
import { Patient } from "@/types/patient";
import { useNavigate } from "react-router-dom";

interface AppointmentsListProps {
  language: "en" | "es";
  patients: Patient[];
}

const content = {
  en: {
    title: "Upcoming Appointments",
    reasonForVisit: "Reason for Visit",
    preferredLanguage: "Preferred Language",
    risks: "Risk Factors",
    symptoms: "Recent Symptoms",
  },
  es: {
    title: "Próximas Citas",
    reasonForVisit: "Motivo de la Visita",
    preferredLanguage: "Idioma Preferido",
    risks: "Factores de Riesgo",
    symptoms: "Síntomas Recientes",
  },
};

export const AppointmentsList = ({ language, patients }: AppointmentsListProps) => {
  const navigate = useNavigate();

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {content[language].title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="p-6 border rounded-lg hover:bg-accent cursor-pointer transition-colors animate-fade-in"
              onClick={() => navigate(`/patient/${patient.id}`)}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{patient.name}</h3>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(patient.nextAppointment).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {content[language].reasonForVisit}
                      </p>
                      <p>{patient.reasonForVisit}</p>
                    </div>

                    {patient.risks.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {content[language].risks}
                        </p>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-1" />
                          <ul className="text-destructive text-sm">
                            {patient.risks.map((risk, index) => (
                              <li key={index}>{risk}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {patient.recentSymptoms.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {content[language].symptoms}
                      </p>
                      <ul className="text-sm list-disc list-inside">
                        {patient.recentSymptoms.map((symptom, index) => (
                          <li key={index}>{symptom}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
