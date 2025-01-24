import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Globe, MessageSquare } from "lucide-react";
import { useState } from "react";

export const Hero = ({ language, onLanguageChange }: { language: "en" | "es", onLanguageChange: (lang: "en" | "es") => void }) => {
  const navigate = useNavigate();

  const content = {
    en: {
      title: "Your Health, Our Priority",
      subtitle: "Experience healthcare reimagined with our virtual clinic. Professional care from the comfort of your home.",
      buttonText: "Book Appointment",
      languageText: "Español"
    },
    es: {
      title: "Su Salud, Nuestra Prioridad",
      subtitle: "Experimente la atención médica reinventada con nuestra clínica virtual. Atención profesional desde la comodidad de su hogar.",
      buttonText: "Reservar Cita",
      languageText: "English"
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-primary to-blue-400 py-20 text-white animate-fadeIn">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <img
            src="/placeholder.svg"
            alt="Health Connectivity Lounge Logo"
            className="h-16 w-auto"
          />
          <Button
            variant="ghost"
            className="text-white hover:text-blue-200"
            onClick={() => onLanguageChange(language === "en" ? "es" : "en")}
          >
            <Globe className="mr-2 h-4 w-4" />
            {content[language].languageText}
          </Button>
        </div>
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">{content[language].title}</h1>
          <p className="text-xl mb-8">{content[language].subtitle}</p>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate("/book")} 
              className="bg-secondary hover:bg-green-600 text-white px-8 py-6 text-lg rounded-full transition-all"
            >
              {content[language].buttonText}
            </Button>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white/10"
              onClick={() => navigate("/chat")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {language === "en" ? "Chat with Doctor" : "Chatear con el Doctor"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};