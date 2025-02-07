
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jsPDF } from "jspdf";

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

const SymptomCheckerPage: React.FC<SymptomCheckerPageProps> = ({ language, onProceed }) => {
  const [symptoms, setSymptoms] = useState("");
  const [providerPhone, setProviderPhone] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");

  // ✅ Simulated list of providers (Can be fetched from API later)
  const providers = [
    { name: "Dr. Maria Rodriguez", phone: "+1234567890" },
    { name: "Dr. James Smith", phone: "+1987654321" },
    { name: "Dr. Aisha Patel", phone: "+1122334455" },
  ];

  const handleVoiceInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = language === "en" ? "en-US" : "es-ES";
    recognition.interimResults = false;
    recognition.continuous = false;

    setIsRecording(true);

    recognition.onresult = (event: Event & { results: SpeechRecognitionResultList }) => {
      const transcript = event.results[0][0].transcript;
      setSymptoms(transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event: Event) => {
      console.error("Speech recognition error:", event);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // ✅ Generates a PDF of the symptoms report
  const generatePDF = () => {
    if (!symptoms.trim()) {
      alert(language === "en" ? "No symptoms to generate a report!" : "¡No hay síntomas para generar un informe!");
      return;
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Symptom Report", 10, 10);
    doc.setFont("helvetica", "normal");
    doc.text(`📅 Date: ${new Date().toLocaleDateString()}`, 10, 20);
    doc.text(`⏰ Time: ${new Date().toLocaleTimeString()}`, 10, 30);
    doc.text(`👩‍⚕️ Provider: ${selectedProvider || providerPhone || "Not provided"}`, 10, 40);
    doc.text("📝 Symptoms:", 10, 50);
    doc.text(symptoms, 10, 60, { maxWidth: 180 });

    doc.save("Symptom_Report.pdf");
  };

  // ✅ Handle Provider Selection
  const handleProviderSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = providers.find((p) => p.name === e.target.value);
    setSelectedProvider(selected?.name || "");
    setProviderPhone(selected?.phone || "");
  };

  // ✅ Placeholder function to simulate sending SMS/WhatsApp (Backend can be added later)
  const sendMessage = (type: "sms" | "whatsapp") => {
    if (!providerPhone || !symptoms) {
      alert(language === "en" ? "Enter provider phone number and symptoms before sending!" : "Ingrese el número de teléfono del proveedor y los síntomas antes de enviar.");
      return;
    }

    if (type === "sms") {
      alert(`📩 SMS sent to ${providerPhone} with message: ${symptoms}`);
    } else {
      alert(`📲 WhatsApp message sent to ${providerPhone} with message: ${symptoms}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">🩺 {language === "en" ? "Symptom Checker" : "Verificador de Síntomas"}</h1>
      <p>{language === "en" ? "Describe your symptoms, and we'll send them to the provider." : "Describa sus síntomas y le proporcionaremos orientación."}</p>

      {/* ✅ Symptom Input */}
      <textarea
        className="w-full p-2 border rounded"
        placeholder={language === "en" ? "Type or speak your symptoms here..." : "Escriba o diga sus síntomas aquí..."}
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      ></textarea>

      {/* ✅ Voice Input Button */}
      <Button className="w-full py-6 bg-blue-500 text-white mt-2" onClick={handleVoiceInput} disabled={isRecording}>
        {isRecording ? "🎤 Listening..." : "🎤 Speak Symptoms"}
      </Button>

      {/* ✅ Provider Selection Dropdown */}
      <select
        className="w-full p-2 mt-2 border rounded"
        value={selectedProvider}
        onChange={handleProviderSelect}
      >
        <option value="">{language === "en" ? "Select Provider (Optional)" : "Seleccionar proveedor (Opcional)"}</option>
        {providers.map((provider) => (
          <option key={provider.phone} value={provider.name}>
            {provider.name}
          </option>
        ))}
      </select>

      {/* ✅ Manual Provider Input */}
      <Input
        type="tel"
        value={providerPhone}
        onChange={(e) => setProviderPhone(e.target.value)}
        placeholder={language === "en" ? "Enter provider's phone number" : "Ingrese el número de teléfono del proveedor"}
        className="mt-2"
      />

      {/* ✅ Send Message Buttons */}
      <Button className="mt-4 bg-blue-500 text-white w-full" onClick={() => sendMessage("sms")}>
        📩 {language === "en" ? "Send SMS" : "Enviar SMS"}
      </Button>

      <Button className="mt-2 bg-green-500 text-white w-full" onClick={() => sendMessage("whatsapp")}>
        📲 {language === "en" ? "Send WhatsApp" : "Enviar WhatsApp"}
      </Button>

      {/* ✅ Download Report Button */}
      <Button className="mt-2 bg-gray-700 text-white w-full" onClick={generatePDF}>
        📄 {language === "en" ? "Download Symptom Report" : "Descargar Informe de Síntomas"}
      </Button>

      {/* ✅ Proceed Button */}
      <Button className="mt-4 w-full py-6 bg-green-500 text-white" onClick={onProceed}>
        {language === "en" ? "Proceed to Transportation" : "Proceder al Transporte"}
      </Button>
    </div>
  );
};

export default SymptomCheckerPage;
