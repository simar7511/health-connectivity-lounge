
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
  date: Date;
  time: string;
  provider: Provider;
}

export const AppointmentDetails = ({ language, type, date, time, provider }: AppointmentDetailsProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{language === "en" ? "Your Appointment" : "Su Cita"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p><strong>{language === "en" ? "Type:" : "Tipo:"}</strong> {type}</p>
        <p><strong>{language === "en" ? "Date:" : "Fecha:"}</strong> {format(date, "PPP")}</p>
        <p><strong>{language === "en" ? "Time:" : "Hora:"}</strong> {time}</p>
        <p><strong>{language === "en" ? "Provider:" : "Proveedor:"}</strong> {provider.name}</p>
      </CardContent>
    </Card>
  );
};
