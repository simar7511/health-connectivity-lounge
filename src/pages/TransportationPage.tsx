
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { ReturnToHomeButton } from "@/components/layout/ReturnToHomeButton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface TransportationPageProps {
  language: "en" | "es";
  onProceed: () => void;
}

const TransportationPage: React.FC<TransportationPageProps> = ({ language, onProceed }) => {
  const navigate = useNavigate();
  const [pickupTime, setPickupTime] = useState("8:30 AM");
  const [pickupLocation, setPickupLocation] = useState("Community Health Center - Main Entrance");

  const handleConfirm = () => {
    alert(language === "en" 
      ? `Transportation confirmed! Pickup at ${pickupTime} from ${pickupLocation}` 
      : `¡Transporte confirmado! Recogida a las ${pickupTime} en ${pickupLocation}`);
    onProceed();
  };

  const pageTitle = language === "en" ? "Transportation Details" : "Detalles de Transporte";

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationHeader 
        title={pageTitle}
        language={language}
      />
      
      <main className="flex-1 container mx-auto p-4">
        <div className="max-w-md mx-auto">
          <Card className="shadow-md">
            <CardHeader>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <MapPin className="h-7 w-7 text-primary" />
                {pageTitle}
              </h1>
              <p className="text-muted-foreground">
                {language === "en" 
                  ? "Your transportation to the clinic has been arranged." 
                  : "Su transporte a la clínica ha sido arreglado."}
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="p-4 bg-muted/50 rounded-md space-y-2">
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{language === "en" ? "Pickup Time:" : "Hora de Recogida:"}</p>
                    <p>{pickupTime}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{language === "en" ? "Pickup Location:" : "Lugar de Recogida:"}</p>
                    <p>{pickupLocation}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full py-3" onClick={handleConfirm}>
                <Check className="mr-2 h-4 w-4" />
                {language === "en" ? "Confirm Transportation" : "Confirmar Transporte"}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/symptom-checker")}
              >
                {language === "en" ? "Back to Symptom Checker" : "Volver al Verificador de Síntomas"}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6 flex justify-center">
            <ReturnToHomeButton language={language} variant="outline" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransportationPage;
