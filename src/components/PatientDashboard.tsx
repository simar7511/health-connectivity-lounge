
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  FileText, 
  Users, 
  Hospital, 
  Languages, 
  Info, 
  Car, 
  Bell, 
  MessageSquare, 
  Bot
} from "lucide-react";

const PatientDashboard = ({ language }: { language: "en" | "es" }) => {
  const navigate = useNavigate();
  const patientPhoneNumber = "+1234567890"; // Replace with actual patient phone
  const currentLanguage = language; // Set current language

  const content = {
    en: {
      upcomingAppointment: "Upcoming Appointment",
      nextCheckup: "Next Check-up",
      transportation: "Transportation Details",
      pickup: "Pickup: 9:15 AM",
      symptoms: "Record Symptoms",
      reminders: "View Reminders",
      communityResources: "Community Resources",
      findClinics: "Find Free Clinics",
      sendWhatsApp: "Send WhatsApp Reminder",
      aiAssistant: "AI Health Assistant",
      secureChat: "Secure Chat"
    },
    es: {
      upcomingAppointment: "Próxima Cita",
      nextCheckup: "Próxima Revisión",
      transportation: "Detalles de Transporte",
      pickup: "Recogida: 9:15 AM",
      symptoms: "Registrar Síntomas",
      reminders: "Ver Recordatorios",
      communityResources: "Recursos Comunitarios",
      findClinics: "Encontrar Clínicas Gratuitas",
      sendWhatsApp: "Enviar Recordatorio por WhatsApp",
      aiAssistant: "Asistente de Salud IA",
      secureChat: "Chat Seguro"
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 space-y-6 max-w-2xl mx-auto">
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-semibold text-primary">
          {content[currentLanguage].upcomingAppointment}
        </h2>
        <div className="grid gap-4">
          <Button 
            className="w-full flex items-center justify-start gap-3 py-6 bg-blue-500 hover:bg-blue-600"
            onClick={() => navigate("/symptoms")}
          >
            <Clock className="w-5 h-5" />
            {content[currentLanguage].symptoms}
          </Button>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-semibold text-primary">
          {content[currentLanguage].communityResources}
        </h2>
        <div className="grid gap-3">
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-3"
            onClick={() => navigate("/free-clinic")}
          >
            <Hospital className="w-5 h-5" />
            {content[currentLanguage].findClinics}
          </Button>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-semibold text-primary">
          Communication
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-3"
            onClick={() => navigate("/chat")}
          >
            <MessageSquare className="w-5 h-5" />
            {content[currentLanguage].secureChat}
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-3"
            onClick={() => navigate("/ai-chat")}
          >
            <Bot className="w-5 h-5" />
            {content[currentLanguage].aiAssistant}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PatientDashboard;
