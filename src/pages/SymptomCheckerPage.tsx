
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { VoiceRecorder } from "@/components/symptom-checker/VoiceRecorder";
import { AppointmentDetails } from "@/components/symptom-checker/AppointmentDetails";
import { SymptomsDisplay } from "@/components/symptom-checker/SymptomsDisplay";
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

const SymptomCheckerPage: React.FC<SymptomCheckerPageProps> = ({ 
  language, 
  onProceed, 
  appointmentDetails 
}) => {
  const [symptoms, setSymptoms] = useState("");
  const { toast } = useToast();

  const saveReportToFirestore = async () => {
    if (!symptoms.trim() || !appointmentDetails?.provider) {
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "Missing symptoms or provider information" 
          : "Faltan síntomas o información del proveedor",
        variant: "destructive"
      });
      return;
    }

    try {
      const reportData = {
        symptoms,
        patientId: auth.currentUser?.uid,
        patientName: auth.currentUser?.displayName || "Unknown Patient",
        providerId: appointmentDetails.provider.id,
        providerName: appointmentDetails.provider.name,
        appointmentType: appointmentDetails.type,
        appointmentDate: appointmentDetails.date,
        appointmentTime: appointmentDetails.time,
        createdAt: serverTimestamp(),
        status: 'pending'
      };

      const docRef = await addDoc(collection(db, "symptom_reports"), reportData);

      toast({
        title: language === "en" ? "Report Sent" : "Informe Enviado",
        description: language === "en"
          ? `Your symptom report has been sent to ${appointmentDetails.provider.name}`
          : `Su informe de síntomas ha sido enviado a ${appointmentDetails.provider.name}`,
      });

      return docRef.id;
    } catch (error) {
      console.error("Error saving report:", error);
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en"
          ? "Failed to save report. Please try again."
          : "Error al guardar el informe. Por favor intente nuevamente.",
        variant: "destructive"
      });
      return null;
    }
  };

  const generateAndSendReport = async () => {
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

    // Save PDF locally
    doc.save("Symptom_Report.pdf");

    // Save to Firestore and automatically send to provider
    const reportId = await saveReportToFirestore();
    
    if (reportId) {
      onProceed(); // Only proceed if save was successful
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        🩺 {language === "en" ? "Symptom Checker" : "Verificador de Síntomas"}
      </h1>
      
      {appointmentDetails && (
        <AppointmentDetails 
          language={language}
          type={appointmentDetails.type}
          date={appointmentDetails.date}
          time={appointmentDetails.time}
          provider={appointmentDetails.provider}
        />
      )}

      <div className="space-y-4">
        <p className="mb-4">
          {language === "en" 
            ? "Please describe your symptoms. Click the microphone button and speak clearly." 
            : "Por favor describa sus síntomas. Haga clic en el botón del micrófono y hable claramente."}
        </p>

        <VoiceRecorder 
          language={language}
          onSymptomsUpdate={setSymptoms}
        />

        <SymptomsDisplay 
          language={language}
          symptoms={symptoms}
        />

        <Button 
          className="w-full py-6 mt-4" 
          onClick={generateAndSendReport}
          disabled={!symptoms.trim()}
        >
          {language === "en" ? "Generate and Send Report" : "Generar y Enviar Informe"}
        </Button>

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
