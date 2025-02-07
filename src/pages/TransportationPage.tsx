import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">🚍 {language === "en" ? "Transportation Details" : "Detalles de Transporte"}</h1>
      <p>{language === "en" 
        ? "Your transportation to the clinic has been arranged." 
        : "Su transporte a la clínica ha sido arreglado."}</p>

      <div className="mt-4 p-4 border rounded bg-gray-100">
        <p><strong>{language === "en" ? "Pickup Time:" : "Hora de Recogida:"}</strong> {pickupTime}</p>
        <p><strong>{language === "en" ? "Pickup Location:" : "Lugar de Recogida:"}</strong> {pickupLocation}</p>
      </div>

      <Button className="mt-4 w-full py-6 bg-green-500 text-white" onClick={handleConfirm}>
        {language === "en" ? "Confirm Transportation" : "Confirmar Transporte"}
      </Button>
      
      <Button className="mt-4 w-full py-6 bg-gray-500 text-white" onClick={() => navigate("/symptom-checker")}>
        {language === "en" ? "Back to Symptom Checker" : "Volver al Verificador de Síntomas"}
      </Button>
    </div>
  );
};

export default TransportationPage;