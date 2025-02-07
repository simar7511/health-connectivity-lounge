
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  FileText,
  Users,
  HospitalSquare,
  Languages,
  Info,
  Car,
  Bell,
  CalendarX,
} from "lucide-react";

interface PatientDashboardProps {
  language: "en" | "es";
}

const PatientDashboard = ({ language }: PatientDashboardProps) => {
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const { toast } = useToast();
  const navigate = useNavigate();

  const content = {
    en: {
      upcomingAppointment: "Upcoming Appointment",
      appointmentDetails: "Next Check-up",
      transportationDetails: "Transportation Details",
      healthCheckIns: "Health Check-ins",
      communityResources: "Support & Resources",
      manageAppointments: "Manage Appointments",
      switchLang: "Switch to Spanish",
      recordSymptoms: "Record Daily Symptoms",
      viewReminders: "View Care Reminders",
      findClinics: "Find Free Clinics",
      communityPrograms: "Community Programs",
      helplines: "Healthcare Hotlines",
      rights: "Rights & Resources",
      cancel: "Cancel Appointment",
      reschedule: "Reschedule",
      pastVisits: "Past Visits",
    },
    es: {
      upcomingAppointment: "Próxima Cita",
      appointmentDetails: "Próximo Control",
      transportationDetails: "Detalles de Transporte",
      healthCheckIns: "Control de Salud",
      communityResources: "Apoyo y Recursos",
      manageAppointments: "Gestionar Citas",
      switchLang: "Cambiar a Inglés",
      recordSymptoms: "Registrar Síntomas Diarios",
      viewReminders: "Ver Recordatorios",
      findClinics: "Buscar Clínicas Gratuitas",
      communityPrograms: "Programas Comunitarios",
      helplines: "Líneas de Ayuda",
      rights: "Derechos y Recursos",
      cancel: "Cancelar Cita",
      reschedule: "Reprogramar",
      pastVisits: "Visitas Anteriores",
    },
  };

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === "en" ? "es" : "en");
  };

  const handleCancelAppointment = () => {
    toast({
      title: currentLanguage === "en" ? "Appointment Cancelled" : "Cita Cancelada",
      description: currentLanguage === "en" 
        ? "Your appointment has been cancelled. You can schedule a new one anytime."
        : "Su cita ha sido cancelada. Puede programar una nueva en cualquier momento.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 space-y-6 max-w-2xl mx-auto">
      {/* Language Toggle */}
      <div className="flex justify-end">
        <Button variant="outline" className="flex items-center gap-2" onClick={toggleLanguage}>
          <Languages className="w-4 h-4" />
          {content[currentLanguage].switchLang}
        </Button>
      </div>

      {/* Upcoming Appointment & Transportation */}
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-semibold text-primary">
          {content[currentLanguage].upcomingAppointment}
        </h2>
        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="font-medium">{content[currentLanguage].appointmentDetails}</p>
              <p className="text-sm text-muted-foreground">March 25, 2024 - 10:00 AM</p>
              <p className="text-sm text-muted-foreground">Dr. Sarah Johnson</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Car className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="font-medium">{content[currentLanguage].transportationDetails}</p>
              <p className="text-sm text-muted-foreground">Pickup: 9:15 AM</p>
              <p className="text-sm text-muted-foreground">123 Main St, Front Entrance</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Health Check-ins & Reminders */}
      <div className="grid gap-4">
        <Button 
          className="w-full flex items-center justify-start gap-3 py-6 bg-blue-500 hover:bg-blue-600"
          onClick={() => navigate("/symptoms")}
        >
          <Clock className="w-5 h-5" />
          {content[currentLanguage].recordSymptoms}
        </Button>
        <Button 
          className="w-full flex items-center justify-start gap-3 py-6 bg-purple-500 hover:bg-purple-600"
          onClick={() => navigate("/reminders")}
        >
          <Bell className="w-5 h-5" />
          {content[currentLanguage].viewReminders}
        </Button>
      </div>

      {/* Support & Community Resources */}
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
            <HospitalSquare className="w-5 h-5" />
            {content[currentLanguage].findClinics}
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-3"
            onClick={() => navigate("/community")}
          >
            <Users className="w-5 h-5" />
            {content[currentLanguage].communityPrograms}
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-3"
            onClick={() => navigate("/helplines")}
          >
            <Phone className="w-5 h-5" />
            {content[currentLanguage].helplines}
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-3"
            onClick={() => navigate("/resources")}
          >
            <Info className="w-5 h-5" />
            {content[currentLanguage].rights}
          </Button>
        </div>
      </Card>

      {/* Appointment Management */}
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-semibold text-primary">
          {content[currentLanguage].manageAppointments}
        </h2>
        <div className="grid gap-3">
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-3 text-red-500 hover:text-red-600"
            onClick={handleCancelAppointment}
          >
            <CalendarX className="w-5 h-5" />
            {content[currentLanguage].cancel}
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-3"
            onClick={() => navigate("/appointment")}
          >
            <Calendar className="w-5 h-5" />
            {content[currentLanguage].reschedule}
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-3"
            onClick={() => navigate("/past-visits")}
          >
            <FileText className="w-5 h-5" />
            {content[currentLanguage].pastVisits}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PatientDashboard;
