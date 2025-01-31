import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  Calendar,
  Activity,
  MessageSquare,
  HeartPulse,
  Droplet,
  Scale,
  Baby,
  Pill,
  TestTube,
  DollarSign,
  AlertOctagon,
  WhatsApp,
  MessageCircle,
} from "lucide-react";
import { MedicalChat } from "./MedicalChat";
import { Doctors } from "./Doctors";

interface PatientDashboardProps {
  language: "en" | "es";
}

export const PatientDashboard = ({ language }: PatientDashboardProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  const content = {
    en: {
      greeting: "Welcome, Maria! You are in your 3rd trimester",
      book: "Book an Appointment",
      stats: "Check Health Stats",
      message: "Message a Provider",
      vitals: "Your Vitals",
      upcoming: "Upcoming Appointments",
      reschedule: "Reschedule",
      aiChat: "Ask AI Assistant",
      appointmentIn: "Your appointment is in",
      hours: "hours",
      whatsapp: "Schedule via WhatsApp",
      sms: "Schedule via SMS",
      lowCost: "Low-Cost Options Available",
      aiTriage: "AI Symptom Check",
    },
    es: {
      greeting: "¡Bienvenida, Maria! Estás en tu tercer trimestre",
      book: "Agendar Cita",
      stats: "Ver Estadísticas de Salud",
      message: "Mensajear a Proveedor",
      vitals: "Tus Signos Vitales",
      upcoming: "Próximas Citas",
      reschedule: "Reagendar",
      aiChat: "Preguntar al Asistente AI",
      appointmentIn: "Tu cita es en",
      hours: "horas",
      whatsapp: "Agendar por WhatsApp",
      sms: "Agendar por SMS",
      lowCost: "Opciones de Bajo Costo Disponibles",
      aiTriage: "Evaluación de Síntomas por AI",
    },
  };

  const healthMetrics = [
    { 
      icon: <HeartPulse className="w-6 h-6" />, 
      label: "BP", 
      value: "120/80",
      status: "normal",
      bgColor: "bg-green-100",
      textColor: "text-green-700"
    },
    { 
      icon: <Droplet className="w-6 h-6" />, 
      label: "Glucose", 
      value: "95 mg/dL",
      status: "normal",
      bgColor: "bg-green-100",
      textColor: "text-green-700"
    },
    { 
      icon: <Scale className="w-6 h-6" />, 
      label: "Weight", 
      value: "68 kg",
      status: "normal",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700"
    },
    { 
      icon: <Baby className="w-6 h-6" />, 
      label: "Movements", 
      value: "Active",
      status: "normal",
      bgColor: "bg-green-100",
      textColor: "text-green-700"
    },
  ];

  const handleBooking = (method: string) => {
    toast({
      title: language === "en" ? `Booking via ${method}` : `Agendando por ${method}`,
      description: language === "en" 
        ? "We'll contact you shortly to confirm your appointment" 
        : "Nos contactaremos pronto para confirmar su cita",
    });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-background text-foreground p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">
            {content[language].greeting}
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-primary"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => toast({ title: "Language changed" })}
            >
              {language === "en" ? "🇪🇸 Español" : "🇺🇸 English"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">{content[language].book}</h2>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 py-6"
                onClick={() => handleBooking("WhatsApp")}
              >
                <WhatsApp className="w-6 h-6" />
                {content[language].whatsapp}
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 py-6"
                onClick={() => handleBooking("SMS")}
              >
                <MessageCircle className="w-6 h-6" />
                {content[language].sms}
              </Button>
              <Button
                variant="secondary"
                className="w-full flex items-center gap-2 py-6"
                onClick={() => handleBooking("AI Triage")}
              >
                <Activity className="w-6 h-6" />
                {content[language].aiTriage}
              </Button>
              <p className="text-sm text-center text-primary">
                {content[language].lowCost}
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">{content[language].vitals}</h2>
            <div className="grid grid-cols-2 gap-4">
              {healthMetrics.map((metric, index) => (
                <div 
                  key={index} 
                  className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${metric.bgColor}`}
                >
                  <div className={metric.textColor}>{metric.icon}</div>
                  <div>
                    <div className="text-sm font-medium">{metric.label}</div>
                    <div className={`font-semibold ${metric.textColor}`}>{metric.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">{content[language].upcoming}</h2>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-secondary/10 rounded-lg gap-4">
              <div className="space-y-2">
                <div className="font-semibold">Dr. Emily Smith</div>
                <div className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</div>
                <div className="text-sm font-medium text-primary">
                  {content[language].appointmentIn} 12 {content[language].hours}
                </div>
              </div>
              <Button 
                variant="secondary" 
                size="lg"
                className="w-full md:w-auto flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                {content[language].reschedule}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">{content[language].aiChat}</h2>
          <ScrollArea className="h-[300px]">
            <MedicalChat language={language} />
          </ScrollArea>
        </Card>

        <Doctors language={language} />
      </div>
    </div>
  );
};