
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
  Bot,
  User,
  Heart
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
      secureChat: "Secure Chat",
      communication: "Communication"
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
      secureChat: "Chat Seguro",
      communication: "Comunicación"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white text-foreground p-5 space-y-6 max-w-2xl mx-auto animate-fadeIn">
      <div className="mb-8 flex justify-center">
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-xl shadow-md inline-flex items-center gap-3">
          <User className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold">
              {language === "en" ? "Patient Dashboard" : "Panel del Paciente"}
            </h1>
            <p className="text-sm opacity-80">
              {language === "en" ? "Welcome back" : "Bienvenido de nuevo"}
            </p>
          </div>
        </div>
      </div>
      
      <Card className="p-5 border-t-4 border-primary shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
        <h2 className="text-xl font-semibold text-primary flex items-center gap-3 mb-4">
          <Heart className="h-5 w-5 text-primary" />
          {content[currentLanguage].upcomingAppointment}
        </h2>
        <div className="grid gap-4">
          <Button 
            variant="gradient"
            className="w-full flex items-center justify-start gap-3 py-6 rounded-xl"
            onClick={() => navigate("/symptoms")}
          >
            <Clock className="w-5 h-5" />
            {content[currentLanguage].symptoms}
          </Button>
        </div>
      </Card>

      <Card className="p-5 border-t-4 border-accent shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
        <h2 className="text-xl font-semibold text-primary flex items-center gap-3 mb-4">
          <Hospital className="h-5 w-5 text-primary" />
          {content[currentLanguage].communityResources}
        </h2>
        <div className="grid gap-3">
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-3 hover:border-primary"
            onClick={() => navigate("/free-clinic")}
          >
            <Hospital className="w-5 h-5" />
            {content[currentLanguage].findClinics}
          </Button>
        </div>
      </Card>

      <Card className="p-5 border-t-4 border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
        <h2 className="text-xl font-semibold text-primary flex items-center gap-3 mb-4">
          <MessageSquare className="h-5 w-5 text-primary" />
          {content[currentLanguage].communication}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-3 hover:border-primary"
            onClick={() => navigate("/chat")}
          >
            <MessageSquare className="w-5 h-5" />
            {content[currentLanguage].secureChat}
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-3 hover:border-primary"
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
