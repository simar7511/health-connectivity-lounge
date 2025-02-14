import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Provider {
  id: string;
  name: string;
  specialty: string;
  availability: string[];
}

interface AppointmentDetailsProps {
  language: "en" | "es";
  type: string;
  date: Date | null;
  time: string;
  provider?: Provider;
}

export const AppointmentDetails = ({ language, type, date, time, provider }: AppointmentDetailsProps) => {
  return (
    <Card className="mb-6 shadow-md border border-gray-200">
      <CardHeader className="bg-blue-50 py-3 rounded-t-md">
        <CardTitle className="text-lg font-semibold text-blue-600">
          {language === "en" ? "Your Appointment" : "Su Cita"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        <p>
          <strong>{language === "en" ? "Type:" : "Tipo:"}</strong> {type}
        </p>
        <p>
          <strong>{language === "en" ? "Date:" : "Fecha:"}</strong> {date ? format(date, "PPP") : "Not selected"}
        </p>
        <p>
          <strong>{language === "en" ? "Time:" : "Hora:"}</strong> {time || "Not selected"}
        </p>
        <p>
          <strong>{language === "en" ? "Provider:" : "Proveedor:"}</strong>{" "}
          {provider?.name || (language === "en" ? "To be assigned" : "Por asignar")}
        </p>
      </CardContent>
    </Card>
  );
};
