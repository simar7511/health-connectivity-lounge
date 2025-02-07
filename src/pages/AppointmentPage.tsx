
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Provider {
  id: string;
  name: string;
  specialty: string;
  availability: string[];
}

interface AppointmentPageProps {
  language: "en" | "es";
  onProceed: (appointmentDetails: {
    type: string;
    date: Date;
    time: string;
    provider: Provider;
  }) => void;
}

const AppointmentPage: React.FC<AppointmentPageProps> = ({ language, onProceed }) => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const { toast } = useToast();

  // Simulated provider database - in a real app this would come from a backend
  const providers: Provider[] = [
    {
      id: "1",
      name: "Dr. Maria Rodriguez",
      specialty: "prenatal",
      availability: ["09:00", "10:00", "11:00", "14:00", "15:00"],
    },
    {
      id: "2",
      name: "Dr. James Smith",
      specialty: "general",
      availability: ["09:30", "10:30", "13:30", "14:30", "16:30"],
    },
    {
      id: "3",
      name: "Dr. Sarah Chen",
      specialty: "emergency",
      availability: ["08:00", "09:00", "10:00", "11:00", "12:00"],
    },
  ];

  const appointmentOptions = [
    { label: language === "en" ? "Prenatal Checkup" : "Chequeo Prenatal", value: "prenatal" },
    { label: language === "en" ? "General Consultation" : "Consulta General", value: "general" },
    { label: language === "en" ? "Emergency Visit" : "Visita de Emergencia", value: "emergency" }
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", 
    "11:30", "14:00", "14:30", "15:00", "15:30"
  ];

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setSelectedDate(undefined);
    setSelectedTime("");
  };

  const handleProceed = () => {
    if (!selectedType || !selectedDate || !selectedTime) {
      toast({
        title: language === "en" ? "Missing Information" : "Información Faltante",
        description: language === "en" 
          ? "Please select appointment type, date, and time" 
          : "Por favor seleccione tipo de cita, fecha y hora",
        variant: "destructive"
      });
      return;
    }

    // Find available provider based on specialty
    const availableProvider = providers.find(p => p.specialty === selectedType);
    
    if (!availableProvider) {
      toast({
        title: language === "en" ? "No Provider Available" : "No Hay Proveedor Disponible",
        description: language === "en" 
          ? "Please try a different time or date" 
          : "Por favor intente otra hora o fecha",
        variant: "destructive"
      });
      return;
    }

    // Pass appointment details to next page
    onProceed({
      type: selectedType,
      date: selectedDate,
      time: selectedTime,
      provider: availableProvider
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        📅 {language === "en" ? "Schedule an Appointment" : "Agendar una Cita"}
      </h1>
      
      {/* Appointment Type Selection */}
      <div className="mb-6">
        <h2 className="text-xl mb-2">
          {language === "en" ? "Select Appointment Type:" : "Seleccione el Tipo de Cita:"}
        </h2>
        <div className="flex flex-col space-y-2">
          {appointmentOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedType === option.value ? "default" : "outline"}
              className="w-full py-6"
              onClick={() => handleTypeSelect(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      {selectedType && (
        <div className="mb-6">
          <h2 className="text-xl mb-2">
            {language === "en" ? "Select Date:" : "Seleccione la Fecha:"}
          </h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
          />
        </div>
      )}

      {/* Time Selection */}
      {selectedDate && (
        <div className="mb-6">
          <h2 className="text-xl mb-2">
            {language === "en" ? "Select Time:" : "Seleccione la Hora:"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className="flex items-center justify-center gap-2"
                onClick={() => setSelectedTime(time)}
              >
                <Clock className="h-4 w-4" />
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Proceed Button */}
      <Button 
        className="w-full py-6 mt-4" 
        onClick={handleProceed}
        disabled={!selectedType || !selectedDate || !selectedTime}
      >
        {language === "en" ? "Proceed to Symptom Checker" : "Continuar al Verificador de Síntomas"}
      </Button>
    </div>
  );
};

export default AppointmentPage;
