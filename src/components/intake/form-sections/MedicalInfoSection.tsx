
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { VoiceRecorder } from "@/components/VoiceTranslator";

interface MedicalInfoSectionProps {
  language: "en" | "es";
  formData: {
    reasonForVisit: string;
    medicalHistory: string;
    medicationsAndAllergies: string;
    hasRecentHospitalVisits: boolean;
    hospitalVisitLocation: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  onVoiceInput: (field: string, input: string) => void;
}

export const MedicalInfoSection = ({ 
  language, 
  formData, 
  handleChange,
  handleCheckboxChange,
  onVoiceInput 
}: MedicalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {language === "en" ? "2️⃣ Medical Information" : "2️⃣ Información Médica"}
      </h3>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {language === "en" ? "Reason for Visit" : "Razón de la Visita"}
        </label>
        <Textarea
          name="reasonForVisit"
          value={formData.reasonForVisit}
          onChange={handleChange}
          required
        />
        <VoiceRecorder 
          language={language} 
          onSymptomsUpdate={(input) => onVoiceInput("reasonForVisit", input)} 
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {language === "en" ? "Medical History" : "Historial Médico"}
        </label>
        <Textarea
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleChange}
        />
        <VoiceRecorder 
          language={language} 
          onSymptomsUpdate={(input) => onVoiceInput("medicalHistory", input)} 
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {language === "en" ? "Current Medications & Allergies" : "Medicamentos Actuales y Alergias"}
        </label>
        <Textarea
          name="medicationsAndAllergies"
          value={formData.medicationsAndAllergies}
          onChange={handleChange}
        />
        <VoiceRecorder 
          language={language} 
          onSymptomsUpdate={(input) => onVoiceInput("medicationsAndAllergies", input)} 
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            name="hasRecentHospitalVisits"
            checked={formData.hasRecentHospitalVisits}
            onCheckedChange={(checked) => handleCheckboxChange("hasRecentHospitalVisits", checked as boolean)}
          />
          <label className="text-sm">
            {language === "en" ? "Recent Hospital Visits?" : "¿Visitas Recientes al Hospital?"}
          </label>
        </div>
        {formData.hasRecentHospitalVisits && (
          <Input
            name="hospitalVisitLocation"
            value={formData.hospitalVisitLocation}
            onChange={handleChange}
            placeholder={language === "en" ? "Where?" : "¿Dónde?"}
          />
        )}
      </div>
    </div>
  );
};
