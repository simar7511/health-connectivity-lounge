import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { VoiceRecorder } from "@/components/symptom-checker/VoiceRecorder"; // Ensure correct import path

interface MedicalInfoSectionProps {
  language: "en" | "es";
  formData: {
    symptoms: string;
    medicalHistory: string;
    medicationsAndAllergies: string;
    hasRecentHospitalVisits: boolean | null;
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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        {language === "en" ? "2️⃣ Medical Information" : "2️⃣ Información Médica"}
      </h3>

      {/* Symptoms */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {language === "en" ? "What symptoms are you experiencing?" : "¿Qué síntomas tiene?"}
        </Label>
        <Textarea
          name="symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          required
        />
        <VoiceRecorder 
          language={language} 
          fieldName="symptoms" // ✅ Pass the fieldName prop
          onVoiceInput={onVoiceInput}  
        />
      </div>

      {/* Medical History */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {language === "en" ? "Medical History (Past Conditions, Surgeries, Chronic Illnesses)" : "Historial Médico (Condiciones Previas, Cirugías, Enfermedades Crónicas)"}
        </Label>
        <Textarea
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleChange}
        />
        <VoiceRecorder 
          language={language} 
          fieldName="medicalHistory" // ✅ Pass the fieldName prop
          onVoiceInput={onVoiceInput} 
        />
      </div>

      {/* Medications & Allergies */}
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
          fieldName="medicationsAndAllergies" // ✅ Pass the fieldName prop
          onVoiceInput={onVoiceInput} 
        />
      </div>

      {/* Recent Hospital Visits */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {language === "en" ? "Have you been to a hospital recently for medical care?" : "¿Ha estado en un hospital recientemente para atención médica?"}
        </Label>
        <div className="flex items-center space-x-4">
          {["Yes", "No"].map((value, index) => (
            <label key={index} className="flex items-center space-x-2">
              <input
                type="radio"
                name="hasRecentHospitalVisits"
                checked={formData.hasRecentHospitalVisits === (value === "Yes")}
                onChange={() => handleCheckboxChange("hasRecentHospitalVisits", value === "Yes")}
                className="rounded-full"
              />
              <span>{language === "en" ? value : value === "Yes" ? "Sí" : "No"}</span>
            </label>
          ))}
        </div>

        {/* Conditional field for Hospital Visit Location */}
        {formData.hasRecentHospitalVisits && (
          <div className="space-y-2 mt-2">
            <Label className="text-sm font-medium">
              {language === "en" ? "Where did you receive care?" : "¿Dónde recibió atención?"}
            </Label>
            <VoiceRecorder 
              language={language} 
              fieldName="hospitalVisitLocation" // ✅ Pass the fieldName prop
              onVoiceInput={onVoiceInput} 
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
