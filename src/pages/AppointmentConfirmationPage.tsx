
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { sendAppointmentConfirmation, scheduleAppointmentReminder } from "@/utils/twilioService";

interface AppointmentConfirmationProps {
  language: "en" | "es";  // ✅ Ensure language is properly defined as a prop
}

const AppointmentConfirmationPage: React.FC<AppointmentConfirmationProps> = ({ language }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const appointmentDetails = location.state || {};
  const [copied, setCopied] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [smsSent, setSmsSent] = useState(false);

  useEffect(() => {
    // If we don't have appointment details, redirect back to appointment page
    if (!appointmentDetails.date || !appointmentDetails.time) {
      navigate("/appointment");
    }

    // Check for phone number in session storage (from intake form)
    const storedPhone = sessionStorage.getItem("patientPhone") || "";
    setPhoneNumber(storedPhone);

    // Send confirmation SMS if we have a phone number
    const sendSMSConfirmation = async () => {
      if (storedPhone && appointmentDetails.date && appointmentDetails.time && !smsSent) {
        await sendAppointmentConfirmation(storedPhone, appointmentDetails, language);
        
        // Schedule a reminder 24 hours before appointment
        await scheduleAppointmentReminder(storedPhone, appointmentDetails, language);
        
        setSmsSent(true);
      }
    };
    
    sendSMSConfirmation();
  }, [appointmentDetails, navigate, language, smsSent]);

  const handleCopyCode = () => {
    if (appointmentDetails.meetingCode) {
      navigator.clipboard.writeText(appointmentDetails.meetingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // If user enters a phone number manually
  const handleManualSendSMS = async () => {
    if (phoneNumber && appointmentDetails.date && appointmentDetails.time) {
      await sendAppointmentConfirmation(phoneNumber, appointmentDetails, language);
      await scheduleAppointmentReminder(phoneNumber, appointmentDetails, language);
      sessionStorage.setItem("patientPhone", phoneNumber);
      setSmsSent(true);
    }
  };

  let formattedDate = "Invalid Date";
  if (appointmentDetails.date) {
    const parsedDate = new Date(appointmentDetails.date);
    if (isValid(parsedDate)) {
      formattedDate = format(parsedDate, "PPP");
    }
  }

  const translations = {
    en: {
      title: "Appointment Confirmed!",
      successMessage: "Your appointment has been successfully scheduled!",
      appointmentDetails: "Appointment Details",
      date: "Date",
      time: "Time",
      visitType: "Visit Type",
      virtualMeetingCode: "Meeting Code",
      copyCode: "Copy Code",
      copied: "Copied!",
      missingDetails: "⚠️ Missing appointment details.",
      returnHome: "Return to Home",
      reschedule: "Reschedule or Cancel Appointment",
      smsSent: "An SMS confirmation has been sent to your registered phone number.",
      smsNotSent: "Provide your phone number to receive an SMS confirmation:",
      sendSMS: "Send SMS Confirmation",
      phoneLabel: "Phone Number",
      transportation: "Transportation Arranged",
      pickupTime: "Pickup Time",
      pickupLocation: "Pickup Location",
    },
    es: {
      title: "¡Cita Confirmada!",
      successMessage: "Su cita ha sido programada con éxito.",
      appointmentDetails: "Detalles de la Cita",
      date: "Fecha",
      time: "Hora",
      visitType: "Tipo de Visita",
      virtualMeetingCode: "Código de Reunión",
      copyCode: "Copiar Código",
      copied: "¡Copiado!",
      missingDetails: "⚠️ Faltan detalles de la cita.",
      returnHome: "Regresar a Inicio",
      reschedule: "Reprogramar o Cancelar Cita",
      smsSent: "Se ha enviado una confirmación por SMS a su número de teléfono registrado.",
      smsNotSent: "Proporcione su número de teléfono para recibir una confirmación por SMS:",
      sendSMS: "Enviar confirmación por SMS",
      phoneLabel: "Número de teléfono",
      transportation: "Transporte Arreglado",
      pickupTime: "Hora de Recogida",
      pickupLocation: "Lugar de Recogida",
    },
  };

  const content = translations[language];

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card className="shadow-lg p-6">
        <CardHeader>
          <h1 className="text-3xl font-bold flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-7 w-7" />
            <span>{content.title}</span>
          </h1>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-lg">{content.successMessage}</p>

          {appointmentDetails.date && appointmentDetails.time ? (
            <div className="bg-gray-100 p-4 rounded-md">
              <h2 className="font-semibold text-xl">{content.appointmentDetails}</h2>
              <p className="mt-2">📅 <strong>{content.date}:</strong> {formattedDate}</p>
              <p>⏰ <strong>{content.time}:</strong> {appointmentDetails.time}</p>
              <p>🩺 <strong>{content.visitType}:</strong> {appointmentDetails.appointmentType}</p>

              {appointmentDetails.appointmentType === "Virtual Visit" && appointmentDetails.meetingCode && (
                <div className="mt-4 bg-white p-3 border rounded-md flex items-center justify-between">
                  <span className="font-bold text-blue-600">🔢 {content.virtualMeetingCode}: {appointmentDetails.meetingCode}</span>
                  <Button variant="outline" size="sm" onClick={handleCopyCode}>
                    {copied ? content.copied : content.copyCode}
                  </Button>
                </div>
              )}

              {appointmentDetails.transportation && (
                <div className="mt-4 bg-green-50 p-4 rounded-md border border-green-300">
                  <h3 className="font-semibold text-lg">{content.transportation}</h3>
                  <p>🚌 <strong>{content.pickupTime}:</strong> {appointmentDetails.pickupTime}</p>
                  <p>📍 <strong>{content.pickupLocation}:</strong> {appointmentDetails.pickupLocation}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-500">{content.missingDetails}</p>
          )}

          {smsSent ? (
            <div className="mt-4 bg-green-50 p-4 rounded-md flex items-center gap-2 text-green-700 border border-green-300">
              <MessageCircle className="h-6 w-6 text-green-600" />
              <p>{content.smsSent}</p>
            </div>
          ) : (
            <div className="mt-4 bg-gray-100 p-4 rounded-md border">
              <p className="mb-2">{content.smsNotSent}</p>
              <div className="flex gap-2">
                <input 
                  type="tel" 
                  placeholder={content.phoneLabel}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border rounded-md px-3 py-2 flex-1"
                />
                <Button onClick={handleManualSendSMS} disabled={!phoneNumber}>
                  {content.sendSMS}
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/")}>
            {content.returnHome}
          </Button>
          <Button className="w-full bg-red-600 hover:bg-red-700" variant="outline" onClick={() => navigate("/appointment")}>
            {content.reschedule}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppointmentConfirmationPage;
