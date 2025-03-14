import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, Heart, MapPin, ArrowRight, Baby, VideoIcon, Calendar, UserCog, Bot, ShieldCheck, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginSelectorProps {
  language: "en" | "es";
  onLanguageChange?: (language: "en" | "es") => void;
}

export const LoginSelector = ({ language, onLanguageChange }: LoginSelectorProps) => {
  const navigate = useNavigate();

  const content = {
    en: {
      title: "Welcome to Safe Haven Pediatrics",
      subtitle: "Quality Care for Every Child",
      benefits: [
        "Free & Low-Cost Pediatric Care for every child, regardless of insurance or immigration status.",
        "Easy & Quick Appointments with no long wait times.",
        "Virtual & In-Person Visits so you can choose what works best for your family.",
        "No ID, No Insurance? No Problem! We ensure safe, confidential care.",
        "Bilingual Staff & Interpreters Available to make your experience stress-free.",
      ],
      welcomeMessage1: "We provide safe, compassionate, and culturally sensitive pediatric care for every child, regardless of insurance or immigration status.",
      welcomeMessage2: "We offer virtual and in-person visits – choose what works best for your family!",
      getStarted: "Get Started – Complete Intake Form",
      formDescription: "Fill out this form in less than 5 minutes to get started with your child's care.",
      providerLogin: "Provider Login",
      switchLanguage: "Cambiar a Español",
      virtualVisits: "Virtual Visits Available",
      virtualDescription: "See a doctor from home – great for follow-ups & quick questions!",
      inPersonVisits: "In-Person Care",
      inPersonDescription: "Visit our clinic for check-ups, vaccines, and more.",
      aiAssistant: "AI Health Assistant",
      tryAiAssistant: "Try our AI Health Assistant",
      aiAssistantDescription: "Get quick answers to common health questions"
    },
    es: {
      title: "Bienvenido a Safe Haven Pediatrics",
      subtitle: "Atención de Calidad para Cada Niño",
      benefits: [
        "Atención pediátrica gratuita y de bajo costo para cada niño, sin importar el seguro o estatus migratorio.",
        "Citas fáciles y rápidas sin largas esperas.",
        "Visitas virtuales y en persona para que elija lo que mejor funcione para su familia.",
        "¿Sin identificación, sin seguro? ¡No hay problema! Garantizamos atención segura y confidencial.",
        "Personal bilingüe e intérpretes disponibles para hacer su experiencia libre de estrés.",
      ],
      welcomeMessage1: "Brindamos atención pediátrica segura, compasiva y culturalmente sensible para cada niño, sin importar su seguro o estatus migratorio.",
      welcomeMessage2: "¡Ofrecemos visitas virtuales y en persona – elija lo que mejor funcione para su familia!",
      getStarted: "Comenzar – Completar Formulario de Admisión",
      formDescription: "Complete este formulario en menos de 5 minutos para comenzar con la atención de su hijo.",
      providerLogin: "Acceso para Proveedores",
      switchLanguage: "Switch to English",
      virtualVisits: "Visitas Virtuales Disponibles",
      virtualDescription: "Consulte a un médico desde casa – ¡ideal para seguimientos y consultas rápidas!",
      inPersonVisits: "Atención en Persona",
      inPersonDescription: "Visite nuestra clínica para chequeos, vacunas y más.",
      aiAssistant: "Asistente de Salud IA",
      tryAiAssistant: "Pruebe nuestro Asistente de Salud IA",
      aiAssistantDescription: "Obtenga respuestas rápidas a preguntas comunes de salud"
    },
  };

  // Function to handle navigation to the pediatric intake form
  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    console.log("Navigating to pediatric intake form");
    navigate("/pediatric-intake");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => onLanguageChange?.(language === "en" ? "es" : "en")}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-all rounded-xl px-5 py-6 shadow-sm border-primary/10"
        >
          <Globe className="w-5 h-5 text-primary" />
          {content[language].switchLanguage}
        </Button>
      </div>

      {/* Provider Login Button */}
      <div className="absolute top-4 left-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-all rounded-xl px-5 py-6 shadow-sm border-primary/10"
        >
          <UserCog className="w-5 h-5 text-primary" />
          {content[language].providerLogin}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center space-y-6 mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            ✨ {content[language].title} ✨
          </h1>
          <p className="text-2xl md:text-3xl text-primary/80 font-medium">
            {content[language].subtitle}
          </p>
          <div className="space-y-4 mt-8 max-w-3xl mx-auto">
            {content[language].benefits.map((benefit, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-primary/5 transform transition-all hover:-translate-y-1 hover:shadow-md">
                <p className="text-lg text-gray-700 flex items-center gap-3">
                  <span className="bg-primary/10 p-2 rounded-full text-primary">
                    {[<Heart className="w-5 h-5" key="heart" />, <Calendar className="w-5 h-5" key="calendar" />, <VideoIcon className="w-5 h-5" key="video" />, <ShieldCheck className="w-5 h-5" key="shield" />, <Globe className="w-5 h-5" key="globe" />][index]}
                  </span>
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Health Assistant Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => navigate("/ai-chat")}
            variant="default"
            size="lg"
            className="group bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 text-white py-6 px-8 rounded-full transition-all duration-300 drop-shadow-md hover:drop-shadow-xl flex items-center gap-3"
          >
            <Bot className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            {content[language].tryAiAssistant}
            <span className="bg-white/20 text-xs py-1 px-2 rounded-full">New</span>
          </Button>
        </div>

        <Card className="p-8 bg-white/90 backdrop-blur shadow-xl rounded-2xl border-t border-l border-white/50 border-r-0 border-b-0">
          <div className="space-y-8">
            <div className="space-y-5 bg-gradient-to-br from-primary/5 to-purple-50 p-5 rounded-xl">
              <p className="text-lg leading-relaxed text-gray-700 flex items-start gap-3">
                <Heart className="w-6 h-6 text-primary shrink-0 mt-1" />
                <span>{content[language].welcomeMessage1}</span>
              </p>
              <p className="text-lg leading-relaxed text-gray-700 flex items-start gap-3">
                <Baby className="w-6 h-6 text-primary shrink-0 mt-1" />
                <span>{content[language].welcomeMessage2}</span>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 my-8">
              <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-primary/5 flex flex-col items-center text-center">
                <div className="bg-gradient-to-r from-primary/10 to-purple-100 p-4 rounded-full mb-4">
                  <VideoIcon className="w-8 h-8 text-primary" />
                </div>
                <p className="font-semibold text-primary">{content[language].virtualVisits}</p>
                <p className="text-sm mt-2 text-gray-600">{content[language].virtualDescription}</p>
              </div>
              
              <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-primary/5 flex flex-col items-center text-center">
                <div className="bg-gradient-to-r from-primary/10 to-purple-100 p-4 rounded-full mb-4">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <p className="font-semibold text-primary">{content[language].inPersonVisits}</p>
                <p className="text-sm mt-2 text-gray-600">{content[language].inPersonDescription}</p>
              </div>
              
              <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-primary/5 flex flex-col items-center text-center">
                <div className="bg-gradient-to-r from-primary/10 to-purple-100 p-4 rounded-full mb-4">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <p className="font-semibold text-primary">{content[language].aiAssistant}</p>
                <p className="text-sm mt-2 text-gray-600">{content[language].aiAssistantDescription}</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleGetStarted}
                className="w-full py-6 text-lg bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 text-white flex items-center justify-center gap-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {content[language].getStarted}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-sm text-center text-gray-600 bg-primary/5 py-2 px-4 rounded-lg inline-block mx-auto">
                ✅ {content[language].formDescription}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
