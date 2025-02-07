
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Languages } from "lucide-react";
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
  },
  es: {
    title: "Próximas Citas",
    reasonForVisit: "Motivo de la Visita",
    preferredLanguage: "Idioma Preferido",
  },
};

export const AppointmentsList = ({ language, patients }: AppointmentsListProps) => {
  const navigate = useNavigate();

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
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/provider/appointments/${patient.id}`)}
            >
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
