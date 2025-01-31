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
} from "lucide-react";
import { MedicalChat } from "./MedicalChat";

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
    },
  };

  const healthMetrics = [
    { 
      icon: <HeartPulse className="w-6 h-6" />, 
      label: "BP", 
      value: "120/80",
      status: "normal", // could be 'normal', 'warning', or 'alert'
      bgColor: "bg-green-100", // dynamic background based on status
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="p-6 flex flex-col items-center space-y-2"
            onClick={() => toast({ title: "Booking system opening..." })}
          >
            <Calendar className="w-8 h-8" />
            <span>{content[language].book}</span>
          </Button>
          <Button
            variant="outline"
            className="p-6 flex flex-col items-center space-y-2"
            onClick={() => toast({ title: "Loading health stats..." })}
          >
            <Activity className="w-8 h-8" />
            <span>{content[language].stats}</span>
          </Button>
          <Button
            variant="outline"
            className="p-6 flex flex-col items-center space-y-2"
            onClick={() => toast({ title: "Opening messages..." })}
          >
            <MessageSquare className="w-8 h-8" />
            <span>{content[language].message}</span>
          </Button>
        </div>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">{content[language].vitals}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">{content[language].upcoming}</h2>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-secondary/10 rounded-lg gap-4">
              <div className="space-y-2">
                <div className="font-semibold">Dr. Alex Rivera</div>
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
      </div>
    </div>
  );
};