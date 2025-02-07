import { Button } from "@/components/ui/button";

interface AppointmentPageProps {
  language: "en" | "es";
  onProceed: (appointmentType: string) => void;
}

const AppointmentPage: React.FC<AppointmentPageProps> = ({ language, onProceed }) => {
  const appointmentOptions = [
    { label: language === "en" ? "Prenatal Checkup" : "Chequeo Prenatal", value: "prenatal" },
    { label: language === "en" ? "General Consultation" : "Consulta General", value: "general" },
    { label: language === "en" ? "Emergency Visit" : "Visita de Emergencia", value: "emergency" }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">📅 {language === "en" ? "Schedule an Appointment" : "Agendar una Cita"}</h1>
      <p>{language === "en" ? "Select the type of appointment you need:" : "Seleccione el tipo de cita que necesita:"}</p>
      
      <div className="flex flex-col space-y-4">
        {appointmentOptions.map((option) => (
          <Button key={option.value} className="w-full py-6 bg-blue-500 text-white" onClick={() => onProceed(option.value)}>
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AppointmentPage;
