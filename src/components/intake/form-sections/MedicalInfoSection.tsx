
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
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-md border-l-4 border-l-primary transition-all duration-300 hover:shadow-lg">
      <h3 className="text-lg font-semibold text-primary flex items-center gap-3">
        <span className="bg-gradient-to-r from-primary to-purple-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-md">2</span>
        {language === "en" ? "Medical Information" : "Información Médica"}
      </h3>

      {/* Symptoms */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          {language === "en" ? "What symptoms is your child experiencing?" : "¿Qué síntomas tiene su hijo?"}
        </Label>
        <Textarea
          name="symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          className="min-h-24 border-gray-200 focus:border-primary focus:ring-primary rounded-lg resize-y transition-all"
          required
        />
        <VoiceRecorder 
          language={language}
          fieldName="symptoms"
          onVoiceInput={onVoiceInput}
        />
      </div>

      {/* Medical History */}
      <div className="space-y-3 pt-2">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          {language === "en" ? "Child's Medical History (Past Conditions, Surgeries, Chronic Illnesses)" : "Historial Médico del Niño (Condiciones Previas, Cirugías, Enfermedades Crónicas)"}
        </Label>
        <Textarea
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleChange}
          className="min-h-20 border-gray-200 focus:border-primary focus:ring-primary rounded-lg resize-y transition-all"
        />
        <VoiceRecorder 
          language={language}
          fieldName="medicalHistory"
          onVoiceInput={onVoiceInput}
        />
      </div>

      {/* Medications & Allergies */}
      <div className="space-y-3 pt-2">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          {language === "en" ? "Child's Medications & Allergies" : "Medicamentos y Alergias del Niño"}
        </Label>
        <Textarea
          name="medicationsAndAllergies"
          value={formData.medicationsAndAllergies}
          onChange={handleChange}
          className="min-h-20 border-gray-200 focus:border-primary focus:ring-primary rounded-lg resize-y transition-all"
        />
        <VoiceRecorder 
          language={language}
          fieldName="medicationsAndAllergies"
          onVoiceInput={onVoiceInput}
        />
      </div>

      {/* Recent Hospital Visits */}
      <div className="space-y-3 pt-2">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          {language === "en" ? "Has your child been to a hospital recently for medical care?" : "¿Ha estado su hijo en un hospital recientemente para atención médica?"}
        </Label>
        <div className="flex items-center space-x-4 pt-1">
          {["Yes", "No"].map((value, index) => (
            <label key={index} className="flex items-center space-x-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="radio"
                  name="hasRecentHospitalVisits"
                  checked={formData.hasRecentHospitalVisits === (value === "Yes")}
                  onChange={() => handleCheckboxChange("hasRecentHospitalVisits", value === "Yes")}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded-full ${formData.hasRecentHospitalVisits === (value === "Yes") 
                  ? 'border-primary bg-primary/10' 
                  : 'border-gray-300 group-hover:border-primary/50'} transition-colors`}>
                  {formData.hasRecentHospitalVisits === (value === "Yes") && (
                    <div className="w-2.5 h-2.5 bg-primary rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  )}
                </div>
              </div>
              <span className="text-gray-700 group-hover:text-primary transition-colors">
                {language === "en" ? value : value === "Yes" ? "Sí" : "No"}
              </span>
            </label>
          ))}
        </div>

        {/* Conditional field for Hospital Visit Location */}
        {formData.hasRecentHospitalVisits && (
          <div className="space-y-3 mt-3 p-4 bg-purple-50 rounded-lg border border-purple-100 animate-fadeIn">
            <Label className="text-sm font-medium text-gray-700">
              {language === "en" ? "Where did your child receive care?" : "¿Dónde recibió atención su hijo?"}
            </Label>
            <Input
              name="hospitalVisitLocation"
              value={formData.hospitalVisitLocation}
              onChange={handleChange}
              placeholder={language === "en" ? "Enter location" : "Ingrese ubicación"}
              className="border-gray-200 focus:border-primary focus:ring-primary rounded-lg transition-all"
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
