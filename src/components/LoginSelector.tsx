
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, Heart, MapPin, ArrowRight, Baby, VideoIcon, Calendar, UserCog } from "lucide-react";
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
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => onLanguageChange?.(language === "en" ? "es" : "en")}
          className="flex items-center gap-2"
        >
          <Globe className="w-5 h-5" />
          {content[language].switchLanguage}
        </Button>
      </div>

      {/* Provider Login Button */}
      <div className="absolute top-4 left-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate("/provider/login")}
          className="flex items-center gap-2"
        >
          <UserCog className="w-5 h-5" />
          {content[language].providerLogin}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            ✨ {content[language].title} ✨
          </h1>
          <p className="text-2xl md:text-3xl text-primary/80">
            {content[language].subtitle}
          </p>
          <div className="space-y-3 mt-8">
            {content[language].benefits.map((benefit, index) => (
              <p key={index} className="text-lg text-primary/90 flex items-center justify-center gap-2">
                {["🏥", "📅", "🏡", "🛑", "🌎"][index]}
                {benefit}
              </p>
            ))}
          </div>
        </div>

        <Card className="p-8 bg-white/80 backdrop-blur shadow-lg">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-gray-700 flex items-start gap-2">
                <Heart className="w-6 h-6 text-primary shrink-0 mt-1" />
                {content[language].welcomeMessage1}
              </p>
              <p className="text-lg leading-relaxed text-gray-700 flex items-start gap-2">
                <Baby className="w-6 h-6 text-primary shrink-0 mt-1" />
                {content[language].welcomeMessage2}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 my-8">
              <div className="text-center p-4 rounded-lg bg-primary/5">
                <VideoIcon className="w-8 h-8 mx-auto text-primary mb-2" />
                <p className="font-medium">{content[language].virtualVisits}</p>
                <p className="text-sm mt-2 text-gray-600">💻 {content[language].virtualDescription}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/5">
                <Calendar className="w-8 h-8 mx-auto text-primary mb-2" />
                <p className="font-medium">{content[language].inPersonVisits}</p>
                <p className="text-sm mt-2 text-gray-600">🏥 {content[language].inPersonDescription}</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => navigate("/pediatric-intake")}
                className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
              >
                {content[language].getStarted}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-sm text-center text-gray-600">
                ✅ {content[language].formDescription}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
