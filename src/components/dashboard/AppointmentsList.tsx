import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Languages, AlertTriangle } from "lucide-react";
import { Patient } from "@/types/patient";

interface AppointmentsListProps {
  language: "en" | "es";
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

const content = {
  en: {
    title: "Upcoming Appointments",
  },
  es: {
    title: "Próximas Citas",
  },
};

export const AppointmentsList = ({ language, patients, onSelectPatient }: AppointmentsListProps) => (
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
            className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
            onClick={() => onSelectPatient(patient)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{patient.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(patient.nextAppointment).toLocaleString()}
                </p>
                {patient.demographics.preferredLanguage === "es" && (
                  <span className="inline-flex items-center text-sm text-blue-600">
                    <Languages className="h-4 w-4 mr-1" />
                    Español
                  </span>
                )}
              </div>
              {patient.risks.length > 0 && (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              )}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);