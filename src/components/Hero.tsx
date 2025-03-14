
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Languages, Calendar, ChevronRight } from "lucide-react";

export const Hero = ({ language, onLanguageChange }: { language: "en" | "es", onLanguageChange: (lang: "en" | "es") => void }) => {
  const navigate = useNavigate();

  const content = {
    en: {
      title: "Your Child's Health, Our Priority",
      subtitle: "Quality pediatric care accessible to all families, regardless of immigration or insurance status.",
      buttonText: "Book Appointment",
      languageText: "Español",
      features: [
        "Free & Low-Cost Care",
        "Virtual Visits Available",
        "Safe & Confidential Environment",
        "No Insurance Needed"
      ]
    },
    es: {
      title: "La Salud de su Hijo, Nuestra Prioridad",
      subtitle: "Atención pediátrica de calidad accesible para todas las familias, sin importar su estado migratorio o de seguro.",
      buttonText: "Reservar Cita",
      languageText: "English",
      features: [
        "Atención Gratuita y de Bajo Costo",
        "Visitas Virtuales Disponibles",
        "Ambiente Seguro y Confidencial",
        "No Se Necesita Seguro"
      ]
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-primary via-purple-600 to-purple-500 py-24 text-white animate-fadeIn">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMzUpIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMyIgaGVpZ2h0PSIzIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <img
                src="/placeholder.svg"
                alt="Safe Haven Pediatrics Logo"
                className="h-8 w-auto"
              />
            </div>
            <span className="text-xl font-bold">Safe Haven Pediatrics</span>
          </div>
          
          <Button
            variant="outline"
            className="text-white border-white/30 hover:bg-white/20 hover:text-white flex items-center gap-2 rounded-full px-5 py-2"
            onClick={() => onLanguageChange(language === "en" ? "es" : "en")}
          >
            <Languages className="h-4 w-4" />
            {content[language].languageText}
          </Button>
        </div>
        
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            {content[language].title}
          </h1>
          
          <p className="text-xl mb-8 opacity-90 max-w-2xl">
            {content[language].subtitle}
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {content[language].features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/10 flex items-center justify-center text-center">
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={() => navigate("/book")} 
            className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg rounded-full transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group"
          >
            <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {content[language].buttonText}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/10 to-transparent"></div>
    </div>
  );
};
