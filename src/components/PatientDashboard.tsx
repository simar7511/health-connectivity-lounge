
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
  Heart,
  ChevronRight,
  Shield
} from "lucide-react";

const PatientDashboard = ({ language }: { language: "en" | "es" }) => {
  const navigate = useNavigate();
  const patientPhoneNumber = "+1234567890"; // Replace with actual patient phone
  const currentLanguage = language; // Set current language

  const content = {
    en: {
      upcomingAppointment: "Health Services",
      nextCheckup: "Next Check-up",
      transportation: "Transportation Details",
      pickup: "Pickup: 9:15 AM",
      symptoms: "Check Symptoms",
      reminders: "Appointment Reminders",
      communityResources: "Community Resources",
      findClinics: "Find Free Clinics",
      sendWhatsApp: "Send WhatsApp Reminder",
      aiAssistant: "AI Health Assistant",
      secureChat: "Secure Chat",
      communication: "Communication",
      welcome: "Welcome back",
      dashboard: "Patient Dashboard"
    },
    es: {
      upcomingAppointment: "Servicios de Salud",
      nextCheckup: "Próxima Revisión",
      transportation: "Detalles de Transporte",
      pickup: "Recogida: 9:15 AM",
      symptoms: "Verificar Síntomas",
      reminders: "Recordatorios de Citas",
      communityResources: "Recursos Comunitarios",
      findClinics: "Encontrar Clínicas Gratuitas",
      sendWhatsApp: "Enviar Recordatorio por WhatsApp",
      aiAssistant: "Asistente de Salud IA",
      secureChat: "Chat Seguro",
      communication: "Comunicación",
      welcome: "Bienvenido de nuevo",
      dashboard: "Panel del Paciente"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white text-foreground p-5 space-y-8 max-w-2xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary to-purple-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {language === "en" ? content.en.dashboard : content.es.dashboard}
              </h1>
              <p className="text-sm opacity-90">
                {language === "en" ? content.en.welcome : content.es.welcome}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Card className="overflow-hidden rounded-xl border-none shadow-lg transition-all duration-300 hover:shadow-xl bg-white">
        <div className="p-1">
          <div className="bg-gradient-to-r from-primary to-purple-500 p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <Heart className="h-5 w-5 text-white" />
              {content[currentLanguage].upcomingAppointment}
            </h2>
          </div>
        </div>
        <div className="p-5">
          <div className="grid gap-4">
            <Button 
              variant="default"
              className="w-full flex items-center justify-between py-5 px-4 bg-gradient-to-r from-primary/90 to-purple-500/90 hover:from-primary hover:to-purple-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
              onClick={() => navigate("/symptoms")}
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="font-medium">{content[currentLanguage].symptoms}</span>
              </div>
              <ChevronRight className="w-5 h-5 opacity-70" />
            </Button>
            
            <Button 
              variant="outline"
              className="w-full flex items-center justify-between py-5 px-4 border-primary/10 bg-primary/5 hover:bg-primary/10 text-primary rounded-xl transition-all"
              onClick={() => navigate("/appointment")}
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="font-medium">{content[currentLanguage].reminders}</span>
              </div>
              <ChevronRight className="w-5 h-5 opacity-70" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden rounded-xl border-none shadow-lg transition-all duration-300 hover:shadow-xl bg-white">
        <div className="p-1">
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <Hospital className="h-5 w-5 text-white" />
              {content[currentLanguage].communityResources}
            </h2>
          </div>
        </div>
        <div className="p-5">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-between py-5 px-4 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all"
            onClick={() => navigate("/free-clinic")}
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Hospital className="w-5 h-5" />
              </div>
              <span className="font-medium">{content[currentLanguage].findClinics}</span>
            </div>
            <ChevronRight className="w-5 h-5 opacity-70" />
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden rounded-xl border-none shadow-lg transition-all duration-300 hover:shadow-xl bg-white">
        <div className="p-1">
          <div className="bg-gradient-to-r from-green-500 to-teal-400 p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-white" />
              {content[currentLanguage].communication}
            </h2>
          </div>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            variant="outline"
            className="flex flex-col items-center justify-center gap-3 p-5 border-green-200 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-all h-auto"
            onClick={() => navigate("/chat")}
          >
            <div className="bg-green-100 p-3 rounded-full">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="font-medium text-center">{content[currentLanguage].secureChat}</span>
          </Button>
          
          <Button 
            variant="outline"
            className="flex flex-col items-center justify-center gap-3 p-5 border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-all h-auto"
            onClick={() => navigate("/ai-chat")}
          >
            <div className="bg-purple-100 p-3 rounded-full">
              <Bot className="w-6 h-6" />
            </div>
            <span className="font-medium text-center">{content[currentLanguage].aiAssistant}</span>
          </Button>
        </div>
      </Card>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white p-3 shadow-lg border-t border-gray-100 flex justify-center">
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-purple-100 hover:from-primary/15 hover:to-purple-200 text-primary border-none rounded-full px-6 py-2"
          onClick={() => navigate("/")}
        >
          <Shield className="w-4 h-4" />
          {language === "en" ? "Safe Haven Pediatrics" : "Safe Haven Pediatrics"}
        </Button>
      </div>
    </div>
  );
};

export default PatientDashboard;
