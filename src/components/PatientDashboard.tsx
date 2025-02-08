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
  MessageSquare,
  PhoneCall
} from "lucide-react";

const PatientDashboard = ({ language }: { language: "en" | "es" }) => {
  const navigate = useNavigate();
  const patientPhoneNumber = "+1234567890"; // Replace with actual patient phone

  const sendSMS = () => {
    const message = encodeURIComponent(
      language === "en"
        ? "Reminder: Your appointment is on March 25, 2024, at 10:00 AM with Dr. Sarah Johnson."
        : "Recordatorio: Su cita es el 25 de marzo de 2024 a las 10:00 AM con la Dra. Sarah Johnson."
    );
    window.open(`sms:${patientPhoneNumber}?body=${message}`, "_blank");
  };

  const sendWhatsApp = () => {
    const message = encodeURIComponent(
      language === "en"
        ? "Reminder: Your appointment is on March 25, 2024, at 10:00 AM with Dr. Sarah Johnson."
        : "Recordatorio: Su cita es el 25 de marzo de 2024 a las 10:00 AM con la Dra. Sarah Johnson."
    );
    window.open(`https://wa.me/${patientPhoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 space-y-6 max-w-2xl mx-auto">
      {/* Upcoming Appointment & Transportation */}
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-semibold text-primary">Upcoming Appointment</h2>
        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="font-medium">Next Check-up</p>
              <p className="text-sm text-muted-foreground">March 25, 2024 - 10:00 AM</p>
              <p className="text-sm text-muted-foreground">Dr. Sarah Johnson</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Car className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="font-medium">Transportation Details</p>
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
          <Button className="bg-green-500 text-white" onClick={sendWhatsApp}>
            <PhoneCall className="w-5 h-5" /> Send WhatsApp Reminder
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PatientDashboard;
