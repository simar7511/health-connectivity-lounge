import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Mic, StopCircle } from "lucide-react";
import 'regenerator-runtime/runtime';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  availability: string[];
}

interface AppointmentDetails {
  type: string;
  date: Date;
  time: string;
  provider: Provider;
}

interface SymptomCheckerPageProps {
  language: "en" | "es";
  onProceed: () => void;
  appointmentDetails?: AppointmentDetails;
}

const SymptomCheckerPage: React.FC<SymptomCheckerPageProps> = ({ language, onProceed, appointmentDetails }) => {
  const [symptoms, setSymptoms] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    
    if (SpeechRecognition) {
      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = true;
      newRecognition.interimResults = true;
      newRecognition.lang = language === "en" ? "en-US" : "es-ES";

      newRecognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setSymptoms(prev => prev + finalTranscript);
        }
      };

      newRecognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event);
        setIsRecording(false);
        
        toast({
          title: language === "en" ? "Error" : "Error",
          description: language === "en" 
            ? "Failed to record symptoms. Please check your microphone and try again." 
            : "Error al grabar síntomas. Por favor verifique su micrófono e intente nuevamente.",
          variant: "destructive"
        });
      };

      newRecognition.onend = () => {
        setIsRecording(false);
        if (symptoms.trim()) {
          toast({
            title: language === "en" ? "Recording Complete" : "Grabación Completa",
            description: language === "en" 
              ? "Your symptoms have been recorded. You can now generate the report." 
              : "Sus síntomas han sido registrados. Ahora puede generar el informe.",
          });
        }
      };

      setRecognition(newRecognition);
    } else {
      toast({
        title: language === "en" ? "Not Supported" : "No Soportado",
        description: language === "en" 
          ? "Speech recognition is not supported in your browser" 
          : "El reconocimiento de voz no está soportado en su navegador",
        variant: "destructive"
      });
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [language]);

  const handleVoiceInput = () => {
    if (!recognition) {
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "Speech recognition is not available" 
          : "El reconocimiento de voz no está disponible",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognition.start();
    }
  };

  const generateAndSendReport = () => {
    if (!symptoms.trim()) {
      toast({
        title: language === "en" ? "No Symptoms" : "Sin Síntomas",
        description: language === "en" 
          ? "Please record your symptoms before generating a report" 
          : "Por favor registre sus síntomas antes de generar el informe",
        variant: "destructive"
      });
      return;
    }

    // Generate PDF
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Symptom Report", 10, 10);
    doc.setFont("helvetica", "normal");
    doc.text(`📅 Date: ${format(new Date(), "PPP")}`, 10, 20);
    doc.text(`⏰ Time: ${new Date().toLocaleTimeString()}`, 10, 30);
    doc.text(`👩‍⚕️ Provider: ${appointmentDetails?.provider.name || "Not assigned"}`, 10, 40);
    doc.text(`🏥 Appointment Type: ${appointmentDetails?.type || "Not specified"}`, 10, 50);
    doc.text(`📅 Appointment Date: ${appointmentDetails?.date ? format(appointmentDetails.date, "PPP") : "Not specified"}`, 10, 60);
    doc.text(`⏰ Appointment Time: ${appointmentDetails?.time || "Not specified"}`, 10, 70);
    doc.text("📝 Symptoms:", 10, 80);
    doc.text(symptoms, 10, 90, { maxWidth: 180 });

    // Save PDF
    doc.save("Symptom_Report.pdf");

    // Simulate sending to provider
    toast({
      title: language === "en" ? "Report Sent" : "Informe Enviado",
      description: language === "en"
        ? `Report has been sent to ${appointmentDetails?.provider.name}`
        : `El informe ha sido enviado a ${appointmentDetails?.provider.name}`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        🩺 {language === "en" ? "Symptom Checker" : "Verificador de Síntomas"}
      </h1>
      
      {appointmentDetails && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{language === "en" ? "Your Appointment" : "Su Cita"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>{language === "en" ? "Type:" : "Tipo:"}</strong> {appointmentDetails.type}</p>
            <p><strong>{language === "en" ? "Date:" : "Fecha:"}</strong> {format(appointmentDetails.date, "PPP")}</p>
            <p><strong>{language === "en" ? "Time:" : "Hora:"}</strong> {appointmentDetails.time}</p>
            <p><strong>{language === "en" ? "Provider:" : "Proveedor:"}</strong> {appointmentDetails.provider.name}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <p className="mb-4">
          {language === "en" 
            ? "Please describe your symptoms. Click the microphone button and speak clearly." 
            : "Por favor describa sus síntomas. Haga clic en el botón del micrófono y hable claramente."}
        </p>

        {/* Voice Input Button */}
        <Button 
          className="w-full py-6" 
          onClick={handleVoiceInput}
        >
          {isRecording ? (
            <>
              <StopCircle className="mr-2 h-4 w-4" />
              {language === "en" ? "Stop Recording" : "Detener Grabación"}
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              {language === "en" ? "Start Recording" : "Comenzar Grabación"}
            </>
          )}
        </Button>

        {/* Symptoms Display */}
        {symptoms && (
          <div className="p-4 bg-secondary/10 rounded-lg mt-4">
            <h3 className="font-semibold mb-2">
              {language === "en" ? "Recorded Symptoms:" : "Síntomas Registrados:"}
            </h3>
            <p>{symptoms}</p>
          </div>
        )}

        {/* Generate Report Button */}
        <Button 
          className="w-full py-6 mt-4" 
          onClick={generateAndSendReport}
          disabled={!symptoms.trim()}
        >
          {language === "en" ? "Generate and Send Report" : "Generar y Enviar Informe"}
        </Button>

        {/* Proceed Button */}
        <Button 
          className="w-full py-6 mt-4 bg-green-500 hover:bg-green-600" 
          onClick={onProceed}
        >
          {language === "en" ? "Proceed to Transportation" : "Proceder al Transporte"}
        </Button>
      </div>
    </div>
  );
};

export default SymptomCheckerPage;
