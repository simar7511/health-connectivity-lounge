
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Clock, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const [confirming, setConfirming] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
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
    setConfirming(false);
    setSelectedProvider(null);
  };

  const checkProviderAvailability = () => {
    if (!selectedType || !selectedDate || !selectedTime) return null;

    // Find available provider based on specialty and time slot
    const availableProvider = providers.find(p => 
      p.specialty === selectedType && 
      p.availability.includes(selectedTime)
    );

    if (!availableProvider) {
      // Find next available slot
      const typeProviders = providers.filter(p => p.specialty === selectedType);
      const nextSlot = typeProviders.length > 0 ? typeProviders[0].availability[0] : null;

      toast({
        title: language === "en" ? "No Provider Available" : "No Hay Proveedor Disponible",
        description: language === "en" 
          ? `Next available slot: ${nextSlot || 'None found'}` 
          : `Próximo horario disponible: ${nextSlot || 'No encontrado'}`,
        variant: "destructive"
      });
      return null;
    }

    return availableProvider;
  };

  const handleConfirmSelection = () => {
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

    const provider = checkProviderAvailability();
    if (provider) {
      setSelectedProvider(provider);
      setConfirming(true);
    }
  };

  const handleModifySelection = () => {
    setConfirming(false);
    setSelectedProvider(null);
  };

  const handleProceed = () => {
    if (!selectedProvider) return;

    onProceed({
      type: selectedType,
      date: selectedDate!,
      time: selectedTime,
      provider: selectedProvider
    });
  };

  if (confirming && selectedProvider) {
    return (
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>
              {language === "en" ? "Confirm Your Appointment" : "Confirmar su Cita"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">{language === "en" ? "Type:" : "Tipo:"}</h3>
              <p>{appointmentOptions.find(opt => opt.value === selectedType)?.label}</p>
            </div>
            <div>
              <h3 className="font-semibold">{language === "en" ? "Date:" : "Fecha:"}</h3>
              <p>{format(selectedDate!, "PPP")}</p>
            </div>
            <div>
              <h3 className="font-semibold">{language === "en" ? "Time:" : "Hora:"}</h3>
              <p>{selectedTime}</p>
            </div>
            <div>
              <h3 className="font-semibold">{language === "en" ? "Provider:" : "Proveedor:"}</h3>
              <p>{selectedProvider.name}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleModifySelection}>
              <Edit2 className="mr-2 h-4 w-4" />
              {language === "en" ? "Modify" : "Modificar"}
            </Button>
            <Button onClick={handleProceed}>
              {language === "en" ? "Proceed to Symptom Checker" : "Continuar al Verificador de Síntomas"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

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

      {/* Confirm Selection Button */}
      <Button 
        className="w-full py-6 mt-4" 
        onClick={handleConfirmSelection}
        disabled={!selectedType || !selectedDate || !selectedTime}
      >
        {language === "en" ? "Check Availability" : "Verificar Disponibilidad"}
      </Button>
    </div>
  );
};

export default AppointmentPage;
