import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LoginSelectorProps {
  language: "en" | "es";
  onSelectRole: (role: "patient" | "provider") => void;
}

export const LoginSelector = ({ language, onSelectRole }: LoginSelectorProps) => {
  const content = {
    en: {
      title: "Welcome to Health Connectivity Lounge",
      patient: "I am a Patient",
      provider: "I am a Healthcare Provider",
      findClinics: "Find Free & Low-Cost Clinics",
    },
    es: {
      title: "Bienvenido a Health Connectivity Lounge",
      patient: "Soy Paciente",
      provider: "Soy Proveedor de Salud",
      findClinics: "Encontrar Clínicas Gratuitas y de Bajo Costo",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 bg-gradient-to-b from-primary/20 to-background">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-primary">
          {content[language].title}
        </h1>
        <div className="space-y-4">
          <Button
            onClick={() => onSelectRole("patient")}
            className="w-full text-lg py-6"
            variant="default"
          >
            {content[language].patient}
          </Button>
          <Button
            onClick={() => onSelectRole("provider")}
            className="w-full text-lg py-6"
            variant="outline"
          >
            {content[language].provider}
          </Button>
        </div>
      </Card>
      <Button variant="link" className="text-primary">
        {content[language].findClinics}
      </Button>
    </div>
  );
};