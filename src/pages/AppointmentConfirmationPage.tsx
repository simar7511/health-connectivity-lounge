import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle, Phone, AlertCircle, MapPin, Navigation, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { sendAppointmentConfirmation, scheduleAppointmentReminder } from "@/utils/firebaseMessagingService";
import { toast } from "@/hooks/use-toast";
import { SmsMessageList } from "@/components/SmsMessageList";
import { WhatsAppMessageList } from "@/components/WhatsAppMessageList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationHeader } from "@/components/layout/NavigationHeader";

interface AppointmentConfirmationProps {
  language: "en" | "es";
}

const AppointmentConfirmationPage: React.FC<AppointmentConfirmationProps> = ({ language }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const appointmentDetails = location.state || {};
  const [copied, setCopied] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [smsSent, setSmsSent] = useState(false);
  const [whatsAppSent, setWhatsAppSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<"sms" | "whatsapp">("sms");

  const transportationInfo = {
    clinicAddress: "123 Healthcare Ave, Seattle, WA 98101",
    mapsUrl: "https://maps.google.com/?q=123+Healthcare+Ave+Seattle+WA+98101"
  };

  useEffect(() => {
    if (!appointmentDetails.date || !appointmentDetails.time) {
      navigate("/appointment");
    }

    const storedPhone = sessionStorage.getItem("patientPhone") || "";
    setPhoneNumber(storedPhone);

    const sendConfirmation = async () => {
      if (storedPhone && appointmentDetails.date && appointmentDetails.time && !smsSent && notificationType === "sms") {
        setIsSending(true);
        setError(null);
        try {
          await sendAppointmentConfirmation(storedPhone, appointmentDetails, "sms", language);
          
          await scheduleAppointmentReminder(storedPhone, appointmentDetails, "sms", language);
          
          setSmsSent(true);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          console.error("Error sending SMS:", errorMessage);
          setError(errorMessage);
          toast({
            title: language === "en" ? "SMS Error" : "Error de SMS",
            description: language === "en" 
              ? "There was an error sending the SMS. Please try again." 
              : "Hubo un error al enviar el SMS. Por favor, inténtelo de nuevo.",
            variant: "destructive"
          });
        } finally {
          setIsSending(false);
        }
      }
    };
    
    const sendWhatsAppConfirmation = async () => {
      if (storedPhone && appointmentDetails.date && appointmentDetails.time && !whatsAppSent && notificationType === "whatsapp") {
        setIsSending(true);
        setError(null);
        try {
          await sendAppointmentConfirmation(storedPhone, appointmentDetails, "whatsapp", language);
          
          await scheduleAppointmentReminder(storedPhone, appointmentDetails, "whatsapp", language);
          
          setWhatsAppSent(true);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          console.error("Error sending WhatsApp:", errorMessage);
          setError(errorMessage);
          toast({
            title: language === "en" ? "WhatsApp Error" : "Error de WhatsApp",
            description: language === "en" 
              ? "There was an error sending the WhatsApp message. Please try again." 
              : "Hubo un error al enviar el mensaje de WhatsApp. Por favor, inténtelo de nuevo.",
            variant: "destructive"
          });
        } finally {
          setIsSending(false);
        }
      }
    };
    
    if (notificationType === "sms") {
      sendConfirmation();
    } else {
      sendWhatsAppConfirmation();
    }
  }, [appointmentDetails, navigate, language, smsSent, whatsAppSent, notificationType]);

  const handleCopyCode = () => {
    if (appointmentDetails.meetingCode) {
      navigator.clipboard.writeText(appointmentDetails.meetingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleManualSend = async () => {
    if (!phoneNumber) {
      toast({
        title: language === "en" ? "Phone Number Required" : "Número de Teléfono Requerido",
        description: language === "en" 
          ? "Please enter a valid phone number" 
          : "Por favor, introduzca un número de teléfono válido",
        variant: "destructive"
      });
      return;
    }
    
    if (phoneNumber && appointmentDetails.date && appointmentDetails.time) {
      setIsSending(true);
      setError(null);
      try {
        if (notificationType === "sms") {
          await sendAppointmentConfirmation(phoneNumber, appointmentDetails, "sms", language);
          await scheduleAppointmentReminder(phoneNumber, appointmentDetails, "sms", language);
          setSmsSent(true);
          
          toast({
            title: language === "en" ? "SMS Sent" : "SMS Enviado",
            description: language === "en" 
              ? "SMS confirmation has been sent successfully" 
              : "La confirmación por SMS se ha enviado con éxito",
          });
        } else {
          await sendAppointmentConfirmation(phoneNumber, appointmentDetails, "whatsapp", language);
          await scheduleAppointmentReminder(phoneNumber, appointmentDetails, "whatsapp", language);
          setWhatsAppSent(true);
          
          toast({
            title: language === "en" ? "WhatsApp Sent" : "WhatsApp Enviado",
            description: language === "en" 
              ? "WhatsApp confirmation has been sent successfully" 
              : "La confirmación por WhatsApp se ha enviado con éxito",
          });
        }
        
        sessionStorage.setItem("patientPhone", phoneNumber);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Error sending ${notificationType === "sms" ? "SMS" : "WhatsApp"}:`, errorMessage);
        setError(errorMessage);
        toast({
          title: language === "en" ? `${notificationType.toUpperCase()} Error` : `Error de ${notificationType.toUpperCase()}`,
          description: language === "en" 
            ? `There was an error sending the ${notificationType === "sms" ? "SMS" : "WhatsApp"}. Please try again.` 
            : `Hubo un error al enviar el ${notificationType === "sms" ? "SMS" : "WhatsApp"}. Por favor, inténtelo de nuevo.`,
          variant: "destructive"
        });
      } finally {
        setIsSending(false);
      }
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
      whatsAppSent: "A WhatsApp confirmation has been sent to your registered phone number.",
      smsNotSent: "Provide your phone number to receive a confirmation:",
      sendSMS: "Send SMS Confirmation",
      sendWhatsApp: "Send WhatsApp Confirmation",
      phoneLabel: "Phone Number",
      transportation: "Transportation Arranged",
      pickupTime: "Pickup Time",
      pickupLocation: "Pickup Location",
      sending: "Sending...",
      error: "Error details:",
      notificationMethod: "Notification Method",
      inPersonVisitTitle: "You're all set for your in-person visit! 🏥✨",
      inPersonVisitMessage: "To make your trip smooth and stress-free, here's everything you need to get to your appointment:",
      distance: "Distance to the Clinic",
      miles: "miles",
      byCar: "By Car",
      estimatedTime: "Estimated travel time",
      parkingInfo: "Parking Info",
      byPublicTransit: "By Public Transit",
      take: "Take",
      walking: "Walking/Biking",
      enjoyFreshAir: "Enjoy the fresh air along the way!",
      needDirections: "Need directions? We've got you covered! Tap below to open your personalized route in Google Maps:",
      openInMaps: "Open in Google Maps",
      seeYouSoon: "We can't wait to see you! Let us know if you have any questions or need special accommodations. Safe travels! 💙😊"
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
      whatsAppSent: "Se ha enviado una confirmación por WhatsApp a su número de teléfono registrado.",
      smsNotSent: "Proporcione su número de teléfono para recibir una confirmación:",
      sendSMS: "Enviar confirmación por SMS",
      sendWhatsApp: "Enviar confirmación por WhatsApp",
      phoneLabel: "Número de teléfono",
      transportation: "Transporte Arreglado",
      pickupTime: "Hora de Recogida",
      pickupLocation: "Lugar de Recogida",
      sending: "Enviando...",
      error: "Detalles del error:",
      notificationMethod: "Método de Notificación",
      inPersonVisitTitle: "¡Todo listo para su visita en persona! 🏥✨",
      inPersonVisitMessage: "Para que su viaje sea tranquilo y sin estrés, aquí tiene todo lo que necesita para llegar a su cita:",
      distance: "Distancia a la Clínica",
      miles: "millas",
      byCar: "En Coche",
      estimatedTime: "Tiempo estimado de viaje",
      parkingInfo: "Información de estacionamiento",
      byPublicTransit: "En Transporte Público",
      take: "Tome",
      walking: "Caminando/En Bicicleta",
      enjoyFreshAir: "¡Disfrute del aire fresco en el camino!",
      needDirections: "¿Necesita indicaciones? ¡Le cubrimos! Toque a continuación para abrir su ruta personalizada en Google Maps:",
      openInMaps: "Abrir en Google Maps",
      seeYouSoon: "¡Estamos ansiosos por verle! Háganos saber si tiene alguna pregunta o necesita adaptaciones especiales. ¡Buen viaje! 💙😊"
    },
  };

  const content = translations[language];
  const pageTitle = language === "en" ? "Appointment Confirmation" : "Confirmación de Cita";

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationHeader 
        title={pageTitle}
        language={language}
        showBackButton={true}
        showBreadcrumbs={true}
      />
      
      <main className="flex-1 container mx-auto p-6 max-w-3xl">
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

                {appointmentDetails.appointmentType === "In-Person Visit" && (
                  <div className="mt-4 bg-blue-50 p-4 rounded-md border border-blue-200">
                    <h3 className="font-semibold text-xl text-blue-700">{content.inPersonVisitTitle}</h3>
                    
                    <div className="mt-4 flex flex-col items-center">
                      <p className="mb-3 text-center">
                        <MapPin className="h-5 w-5 text-blue-600 inline mr-2" />
                        <span>{transportationInfo.clinicAddress}</span>
                      </p>
                      
                      <Button 
                        className="mt-2 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                        onClick={() => window.open(transportationInfo.mapsUrl, '_blank')}
                      >
                        <Navigation className="h-4 w-4" />
                        <span>{content.openInMaps}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <p className="mt-4 text-sm text-blue-700 text-center">{content.seeYouSoon}</p>
                    </div>
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

            {error && (
              <div className="mt-4 bg-red-50 p-4 rounded-md flex items-start gap-2 text-red-700 border border-red-300">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <p className="font-semibold">{content.error}</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            <div className="mt-4 bg-gray-100 p-4 rounded-md border">
              <Tabs defaultValue="sms" onValueChange={(value) => setNotificationType(value as "sms" | "whatsapp")}>
                <div className="mb-4">
                  <p className="mb-2">{content.notificationMethod}:</p>
                  <TabsList className="w-full">
                    <TabsTrigger value="sms" className="flex-1">SMS</TabsTrigger>
                    <TabsTrigger value="whatsapp" className="flex-1">WhatsApp</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="sms">
                  {smsSent ? (
                    <div className="bg-green-50 p-4 rounded-md flex items-center gap-2 text-green-700 border border-green-300">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                      <p>{content.smsSent}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2">{content.smsNotSent}</p>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <input 
                            type="tel" 
                            placeholder={content.phoneLabel}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="border rounded-md pl-10 pr-3 py-2 w-full"
                          />
                        </div>
                        <Button onClick={handleManualSend} disabled={!phoneNumber || isSending}>
                          {isSending ? content.sending : content.sendSMS}
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="whatsapp">
                  {whatsAppSent ? (
                    <div className="bg-green-50 p-4 rounded-md flex items-center gap-2 text-green-700 border border-green-300">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                      <p>{content.whatsAppSent}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2">{content.smsNotSent}</p>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <input 
                            type="tel" 
                            placeholder={content.phoneLabel}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="border rounded-md pl-10 pr-3 py-2 w-full"
                          />
                        </div>
                        <Button onClick={handleManualSend} disabled={!phoneNumber || isSending} className="bg-green-600 hover:bg-green-700">
                          {isSending ? content.sending : content.sendWhatsApp}
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
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
        
        <div className="mt-4 space-y-4">
          <SmsMessageList />
          <WhatsAppMessageList />
        </div>
      </main>
    </div>
  );
};

export default AppointmentConfirmationPage;
