
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export interface ConfirmationPageProps {
  language: "en" | "es";
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ language }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Store the submission time in local storage for provider notifications
    const submissionTime = new Date().toISOString();
    localStorage.setItem("lastIntakeSubmissionTime", submissionTime);
  }, []);

  const translations = {
    en: {
      submitted: "Form Submitted!",
      success: "Your intake form has been successfully submitted to the clinic.",
      whatNext: "What Happens Next?",
      reviewMessage: "A clinic representative will review your information and contact you if additional details are needed.",
      urgentConcerns: "If you have any urgent medical concerns, please visit the clinic or contact a healthcare provider.",
      providerAlert: "Your information has been sent to our clinic providers, who will review your case shortly.",
      returnHome: "Return to Home",
      scheduleAppointment: "Schedule an Appointment"
    },
    es: {
      submitted: "¡Formulario Enviado!",
      success: "Su formulario de ingreso ha sido enviado con éxito a la clínica.",
      whatNext: "¿Qué Sucede Ahora?",
      reviewMessage: "Un representante de la clínica revisará su información y se pondrá en contacto con usted si se necesitan más detalles.",
      urgentConcerns: "Si tiene preocupaciones médicas urgentes, visite la clínica o contacte a un proveedor de salud.",
      providerAlert: "Su información ha sido enviada a nuestros proveedores de la clínica, quienes revisarán su caso en breve.",
      returnHome: "Volver a Inicio",
      scheduleAppointment: "Agendar una Cita"
    }
  };

  const content = translations[language];

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card className="shadow-lg p-6">
        <CardHeader>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <ClipboardCheck className="h-7 w-7 text-green-500" />
            <span>{content.submitted}</span>
          </h1>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-lg text-gray-700">
            {content.success}
          </p>

          <div className="bg-gray-100 p-4 rounded-md text-gray-800">
            <h2 className="font-semibold text-xl">
              {content.whatNext}
            </h2>
            <p className="mt-2">
              {content.reviewMessage}
            </p>
            <p>
              {content.urgentConcerns}
            </p>
          </div>
          
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              {content.providerAlert}
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/")}>
            {content.returnHome}
          </Button>
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            variant="outline"
            onClick={() => navigate("/appointment")}
          >
            {content.scheduleAppointment}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConfirmationPage;
