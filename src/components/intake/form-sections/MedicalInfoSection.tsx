
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
        <Label className="text-sm font-medium">
          {language === "en" ? "What symptoms are you experiencing?" : "¿Qué síntomas tiene?"}
        </Label>
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
        <Label className="text-sm font-medium">
          {language === "en" ? "Medical History" : "Historial Médico"}
        </Label>
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
        <Label className="text-sm font-medium">
          {language === "en" ? "Current Medications & Allergies" : "Medicamentos Actuales y Alergias"}
        </Label>
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
        <Label className="text-sm font-medium">
          {language === "en" ? "Have you been to a hospital recently for medical care?" : "¿Ha estado en un hospital recientemente para atención médica?"}
        </Label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="hasRecentHospitalVisits"
              checked={formData.hasRecentHospitalVisits}
              onChange={(e) => handleCheckboxChange("hasRecentHospitalVisits", true)}
              className="rounded-full"
            />
            <span>{language === "en" ? "Yes" : "Sí"}</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="hasRecentHospitalVisits"
              checked={!formData.hasRecentHospitalVisits}
              onChange={(e) => handleCheckboxChange("hasRecentHospitalVisits", false)}
              className="rounded-full"
            />
            <span>{language === "en" ? "No" : "No"}</span>
          </label>
        </div>
        
        {formData.hasRecentHospitalVisits && (
          <div className="space-y-2 mt-2">
            <Label className="text-sm font-medium">
              {language === "en" ? "Where did you receive care?" : "¿Dónde recibió atención?"}
            </Label>
            <VoiceRecorder 
              language={language} 
              onSymptomsUpdate={(input) => onVoiceInput("hospitalVisitLocation", input)} 
            />
            <Input
              name="hospitalVisitLocation"
              value={formData.hospitalVisitLocation}
              onChange={handleChange}
              placeholder={language === "en" ? "Enter location" : "Ingrese ubicación"}
            />
          </div>
        )}
      </div>
    </div>
  );
};
