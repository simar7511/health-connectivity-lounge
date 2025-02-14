import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns"; // ✅ Fix: Import format from date-fns
import { Button } from "@/components/ui/button";
import { CheckCircle, CalendarDays, Video, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface ConfirmationPageProps {
  language: "en" | "es";
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ language }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const appointmentDetails = location.state; // ✅ Extracting appointment details correctly

  useEffect(() => {
    if (!appointmentDetails) {
      navigate("/appointment"); // ✅ Redirect to appointment if no details exist
    }
  }, [appointmentDetails, navigate]);

  if (!appointmentDetails) return null;

  const { date, time, isVirtual } = appointmentDetails;

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card className="shadow-lg p-6">
        <CardHeader>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <CheckCircle className="h-7 w-7 text-green-500" />
            <span>{language === "en" ? "Appointment Confirmed!" : "¡Cita Confirmada!"}</span>
          </h1>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-lg">
            {language === "en"
              ? "Your appointment has been successfully scheduled!"
              : "¡Su cita ha sido programada con éxito!"}
          </p>

          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="font-semibold text-xl">
              {language === "en" ? "Appointment Details" : "Detalles de la Cita"}
            </h2>
            <p className="mt-2">
              📅 <strong>{language === "en" ? "Date:" : "Fecha:"}</strong> {format(new Date(date), "PPP")}
            </p>
            <p>
              ⏰ <strong>{language === "en" ? "Time:" : "Hora:"}</strong> {time}
            </p>
            <p>
              {isVirtual ? (
                <>
                  🎥 <strong>{language === "en" ? "Visit Type:" : "Tipo de Cita:"}</strong> Virtual Visit
                </>
              ) : (
                <>
                  🏥 <strong>{language === "en" ? "Visit Type:" : "Tipo de Cita:"}</strong> In-Person Visit
                </>
              )}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/")}>
            {language === "en" ? "Return to Home" : "Volver a Inicio"}
          </Button>
          <Button className="w-full bg-red-600 hover:bg-red-700" variant="outline" onClick={() => navigate("/appointment")}>
            {language === "en" ? "Reschedule or Cancel Appointment" : "Reprogramar o Cancelar Cita"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConfirmationPage;

