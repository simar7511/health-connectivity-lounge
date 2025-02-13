
import { Textarea } from "@/components/ui/textarea";
import { VoiceRecorder } from "@/components/VoiceTranslator";

interface MedicalInfoSectionProps {
  language: "en" | "es";
  formData: {
    symptoms: string;
    medicalHistory: string;
    medications: string;
    hospitalVisits: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onVoiceInput: (input: string) => void;
}

export const MedicalInfoSection = ({ 
  language, 
  formData, 
  handleChange,
  onVoiceInput 
}: MedicalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {language === "en" ? "Medical Information" : "Información Médica"}
      </h3>

      <Textarea
        name="symptoms"
        value={formData.symptoms}
        onChange={handleChange}
        placeholder={language === "en" ? "Symptoms" : "Síntomas"}
        required
      />

      <VoiceRecorder language={language} onSymptomsUpdate={onVoiceInput} />

      <Textarea
        name="medicalHistory"
        value={formData.medicalHistory}
        onChange={handleChange}
        placeholder={language === "en" ? "Medical History" : "Historial Médico"}
      />

      <Textarea
        name="medications"
        value={formData.medications}
        onChange={handleChange}
        placeholder={language === "en" ? "Medications" : "Medicamentos"}
      />

      <Textarea
        name="hospitalVisits"
        value={formData.hospitalVisits}
        onChange={handleChange}
        placeholder={language === "en" ? "Hospital Visits" : "Visitas al Hospital"}
      />
    </div>
  );
};
