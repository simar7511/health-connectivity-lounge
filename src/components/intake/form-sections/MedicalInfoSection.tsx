
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { VoiceRecorder } from "@/components/symptom-checker/VoiceRecorder";

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
  onVoiceInput: (fieldName: string, input: string) => void;
}

export const MedicalInfoSection = ({ 
  language, 
  formData, 
  handleChange,
  handleCheckboxChange,
  onVoiceInput 
}: MedicalInfoSectionProps) => {
  return (
    <div className="space-y-6 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
        <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
        {language === "en" ? "Medical Information" : "Información Médica"}
      </h3>

      {/* Symptoms */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          {language === "en" ? "What symptoms are you experiencing?" : "¿Qué síntomas tiene?"}
        </Label>
        <Textarea
          name="symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          className="min-h-24 border-gray-300 focus:border-primary focus:ring-primary"
          required
        />
        <VoiceRecorder 
          language={language}
          fieldName="symptoms"
          onVoiceInput={onVoiceInput}
        />
      </div>

      {/* Medical History */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          {language === "en" ? "Medical History (Past Conditions, Surgeries, Chronic Illnesses)" : "Historial Médico (Condiciones Previas, Cirugías, Enfermedades Crónicas)"}
        </Label>
        <Textarea
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleChange}
          className="min-h-20 border-gray-300 focus:border-primary focus:ring-primary"
        />
        <VoiceRecorder 
          language={language}
          fieldName="medicalHistory"
          onVoiceInput={onVoiceInput}
        />
      </div>

      {/* Medications & Allergies */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          {language === "en" ? "Current Medications & Allergies" : "Medicamentos Actuales y Alergias"}
        </Label>
        <Textarea
          name="medicationsAndAllergies"
          value={formData.medicationsAndAllergies}
          onChange={handleChange}
          className="min-h-20 border-gray-300 focus:border-primary focus:ring-primary"
        />
        <VoiceRecorder 
          language={language}
          fieldName="medicationsAndAllergies"
          onVoiceInput={onVoiceInput}
        />
      </div>

      {/* Recent Hospital Visits */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
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
                className="text-primary focus:ring-primary h-4 w-4"
              />
              <span className="text-gray-700">{language === "en" ? value : value === "Yes" ? "Sí" : "No"}</span>
            </label>
          ))}
        </div>

        {/* Conditional field for Hospital Visit Location */}
        {formData.hasRecentHospitalVisits && (
          <div className="space-y-2 mt-2 p-3 bg-purple-50 rounded-md">
            <Label className="text-sm font-medium text-gray-700">
              {language === "en" ? "Where did you receive care?" : "¿Dónde recibió atención?"}
            </Label>
            <Input
              name="hospitalVisitLocation"
              value={formData.hospitalVisitLocation}
              onChange={handleChange}
              placeholder={language === "en" ? "Enter location" : "Ingrese ubicación"}
              className="border-gray-300 focus:border-primary focus:ring-primary"
            />
            <VoiceRecorder 
              language={language}
              fieldName="hospitalVisitLocation"
              onVoiceInput={onVoiceInput}
            />
          </div>
        )}
      </div>
    </div>
  );
};
