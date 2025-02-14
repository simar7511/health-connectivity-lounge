
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export interface ConfirmationPageProps {
  language: "en" | "es";
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ language }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card className="shadow-lg p-6">
        <CardHeader>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <ClipboardCheck className="h-7 w-7 text-green-500" />
            <span>{language === "en" ? "Form Submitted!" : "¡Formulario Enviado!"}</span>
          </h1>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-lg text-gray-700">
            {language === "en"
              ? "Your intake form has been successfully submitted to the clinic."
              : "Su formulario de ingreso ha sido enviado con éxito a la clínica."}
          </p>

          <div className="bg-gray-100 p-4 rounded-md text-gray-800">
            <h2 className="font-semibold text-xl">
              {language === "en" ? "What Happens Next?" : "¿Qué Sucede Ahora?"}
            </h2>
            <p className="mt-2">
              {language === "en"
                ? "A clinic representative will review your information and contact you if additional details are needed."
                : "Un representante de la clínica revisará su información y se pondrá en contacto con usted si se necesitan más detalles."}
            </p>
            <p>
              {language === "en"
                ? "If you have any urgent medical concerns, please visit the clinic or contact a healthcare provider."
                : "Si tiene preocupaciones médicas urgentes, visite la clínica o contacte a un proveedor de salud."}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/")}>
            {language === "en" ? "Return to Home" : "Volver a Inicio"}
          </Button>
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            variant="outline"
            onClick={() => navigate("/appointment")}
          >
            {language === "en" ? "Schedule an Appointment" : "Agendar una Cita"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConfirmationPage;
