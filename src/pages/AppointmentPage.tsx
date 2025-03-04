
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Clock, CheckCircle, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { ReturnToHomeButton } from "@/components/layout/ReturnToHomeButton";

interface AppointmentPageProps {
  language: "en" | "es";
  onProceed?: () => void;
}

const AppointmentPage: React.FC<AppointmentPageProps> = ({ language, onProceed }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVirtual, setIsVirtual] = useState<boolean | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const availableTimes = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "15:30"];

  const handleConfirmSelection = (event: React.FormEvent) => {
    event.preventDefault();

    if (isVirtual === null || !selectedDate || !selectedTime) {
      toast({
        title: language === "en" ? "Missing Information" : "Información Faltante",
        description:
          language === "en"
            ? "Please select an appointment type, date, and time."
            : "Por favor seleccione tipo de cita, fecha y hora.",
        variant: "destructive",
      });
      return;
    }

    setIsConfirmed(true);
  };

  const handleProceed = () => {
    if (!selectedDate || !selectedTime) return;

    navigate("/appointment-confirmation", {
      state: {
        appointmentType: isVirtual ? "Virtual Visit" : "In-Person Visit",
        date: selectedDate.toISOString(),
        time: selectedTime,
      },
    });

    if (onProceed) {
      onProceed();
    }
  };

  const pageTitle = language === "en" ? "Schedule an Appointment" : "Agendar una Cita";

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationHeader 
        title={pageTitle}
        language={language}
        showBackButton={true}
        showBreadcrumbs={true}
      />
      
      <main className="flex-1 container mx-auto p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg p-6">
            <CardHeader>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <CalendarDays className="h-7 w-7 text-blue-500" />
                <span>{pageTitle}</span>
              </h1>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {language === "en" ? "How would you like to meet?" : "¿Cómo le gustaría reunirse?"}
                </h2>
                <div className="flex gap-4">
                  <Button
                    variant={isVirtual === true ? "default" : "outline"}
                    className="w-full py-3"
                    onClick={() => {
                      setIsVirtual(true);
                      setSelectedDate(null);
                      setSelectedTime(null);
                      setIsConfirmed(false);
                    }}
                  >
                    🖥 {language === "en" ? "Virtual Visit" : "Visita Virtual"}
                  </Button>
                  <Button
                    variant={isVirtual === false ? "default" : "outline"}
                    className="w-full py-3"
                    onClick={() => {
                      setIsVirtual(false);
                      setSelectedDate(null);
                      setSelectedTime(null);
                      setIsConfirmed(false);
                    }}
                  >
                    🏥 {language === "en" ? "In-Person Visit" : "Visita en Persona"}
                  </Button>
                </div>
              </div>

              {isVirtual !== null && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">{language === "en" ? "Select Date" : "Seleccione la Fecha"}</h2>
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border p-2 shadow-sm" />
                </div>
              )}

              {selectedDate && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">{language === "en" ? "Select Time" : "Seleccione la Hora"}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className="flex items-center justify-center gap-2 py-2"
                        onClick={() => setSelectedTime(time)}
                      >
                        <Clock className="h-4 w-4 text-gray-600" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button
                className={`w-full py-4 text-lg ${selectedDate && selectedTime ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
                onClick={handleConfirmSelection}
                disabled={!selectedDate || !selectedTime}
              >
                {language === "en" ? "Confirm Selection" : "Confirmar Selección"}
              </Button>
            </CardFooter>
          </Card>

          {isConfirmed && (
            <div className="mt-6 p-4 border rounded-md bg-gray-50">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span>{language === "en" ? "Appointment Confirmed!" : "¡Cita Confirmada!"}</span>
              </h3>
              <p className="mt-2">
                {language === "en" ? "You have scheduled a" : "Ha programado una"} <strong>{isVirtual ? "Virtual Visit" : "In-Person Visit"}</strong> {language === "en" ? "on" : "el"}{" "}
                {format(selectedDate!, "PPP")} {language === "en" ? "at" : "a las"} {selectedTime}.
              </p>
              <Button className="mt-4 w-full bg-green-600 hover:bg-green-700" onClick={handleProceed}>
                {language === "en" ? "Proceed to Confirmation" : "Proceder a Confirmación"}
              </Button>
            </div>
          )}
          
          <div className="mt-6 flex justify-center">
            <ReturnToHomeButton language={language} variant="outline" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppointmentPage;
