import { useState } from "react";
import { useSpeechRecognition } from "react-speech-kit";
import { useNavigate } from "react-router-dom"; // ✅ Navigation for multiple pages
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Hospital, MapPin, AlertCircle, Mic, Languages } from "lucide-react";
import { MedicalChat } from "./MedicalChat";
import { Doctors } from "./Doctors";

interface PatientDashboardProps {
  language: "en" | "es";
}

const PatientDashboard = ({ language }: PatientDashboardProps) => {
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [spokenText, setSpokenText] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate(); // ✅ Enables page navigation

  // Initialize voice recognition
  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => setSpokenText(result),
  });

  const content = {
    en: {
      greeting: "Welcome, Maria! You are in your 3rd trimester",
      book: "Book an Appointment",
      findClinic: "Find a Free Clinic",
      transport: "Need Transportation?",
      symptoms: "Check Symptoms",
      aiChat: "Ask AI Assistant",
      voicePrompt: "Tap the microphone and say your request.",
      switchLang: "Switch to Spanish",
    },
    es: {
      greeting: "¡Bienvenida, María! Estás en tu tercer trimestre",
      book: "Agendar Cita",
      findClinic: "Buscar una Clínica Gratuita",
      transport: "¿Necesita Transporte?",
      symptoms: "Evaluar Síntomas",
      aiChat: "Preguntar al Asistente AI",
      voicePrompt: "Toque el micrófono y diga su solicitud.",
      switchLang: "Cambiar a Inglés",
    },
  };

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === "en" ? "es" : "en");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">{content[currentLanguage].greeting}</h1>
        <Button variant="outline" className="flex items-center gap-2" onClick={toggleLanguage}>
          <Languages className="w-5 h-5" />
          {content[currentLanguage].switchLang}
        </Button>
      </div>

      {/* Booking and Resources Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointments & Free Clinics */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">{content[currentLanguage].book}</h2>
          <Button className="w-full flex items-center gap-2 py-6 bg-green-500 text-white" onClick={() => navigate("/appointment")}>
            <Calendar className="w-6 h-6" />
            {content[currentLanguage].book}
          </Button>
          <Button className="w-full flex items-center gap-2 py-6 mt-4 bg-blue-500 text-white" onClick={() => navigate("/free-clinic")}>
            <Hospital className="w-6 h-6" />
            {content[currentLanguage].findClinic}
          </Button>
        </Card>

        {/* Transportation Help */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">{content[currentLanguage].transport}</h2>
          <Button className="w-full flex items-center gap-2 py-6 bg-purple-500 text-white" onClick={() => navigate("/transportation")}>
            <MapPin className="w-6 h-6" />
            {content[currentLanguage].transport}
          </Button>
        </Card>
      </div>

      {/* AI Chat & Symptom Checker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">{content[currentLanguage].aiChat}</h2>
          <ScrollArea className="h-[300px]">
            <MedicalChat language={currentLanguage} />
          </ScrollArea>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">{content[currentLanguage].symptoms}</h2>
          <Button className="w-full flex items-center gap-2 py-6 bg-red-500 text-white" onClick={() => navigate("/symptoms")}>
            <AlertCircle className="w-6 h-6" />
            {content[currentLanguage].symptoms}
          </Button>
        </Card>
      </div>

      {/* Voice Input for Scheduling */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">{content[currentLanguage].voicePrompt}</h2>
        <Button className="w-full flex items-center gap-2 py-6 bg-gray-500 text-white" onMouseDown={listen} onMouseUp={stop}>
          <Mic className="w-6 h-6" />
          {spokenText || (currentLanguage === "en" ? "Hold to Speak" : "Mantenga presionado para hablar")}
        </Button>
      </Card>

      {/* Doctors List */}
      <Doctors language={currentLanguage} />
    </div>
  );
};

export default PatientDashboard;
