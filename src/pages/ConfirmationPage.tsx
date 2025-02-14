
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

interface ConfirmationPageProps {
  language: "en" | "es";
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ language }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center space-y-6">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        
        <h1 className="text-2xl font-bold text-gray-900">
          {language === "en" ? "Submission Confirmed!" : "¡Envío Confirmado!"}
        </h1>
        
        <p className="text-gray-600">
          {language === "en" 
            ? "Your information has been successfully submitted. We'll be in touch soon."
            : "Su información ha sido enviada exitosamente. Nos pondremos en contacto pronto."}
        </p>

        <div className="pt-4">
          <Button 
            onClick={() => navigate("/")}
            className="w-full"
          >
            {language === "en" ? "Return to Home" : "Volver al Inicio"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
