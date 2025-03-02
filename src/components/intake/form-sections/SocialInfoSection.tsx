import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InfoIcon } from "lucide-react";
import { VoiceRecorder } from "@/components/symptom-checker/VoiceRecorder";

interface SocialInfoSectionProps {
  language: "en" | "es";
  formData: {
    hasInsurance: boolean | null;
    otherConcerns: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  onVoiceInput: (fieldName: string, input: string) => void;
}

export const SocialInfoSection = ({ 
  language, 
  formData, 
  handleChange,
  handleCheckboxChange,
  onVoiceInput 
}: SocialInfoSectionProps) => {
  return (
    <div className="space-y-6 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
        <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
        {language === "en" ? "Social & Financial Considerations" : "Consideraciones Sociales y Financieras"}
      </h3>

      {/* Health Insurance Question */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          {language === "en" ? "Do you have health insurance?" : "¿Tiene seguro médico?"}
        </Label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="hasInsurance"
              checked={formData.hasInsurance === true}
              onChange={() => handleCheckboxChange("hasInsurance", true)}
              className="text-primary focus:ring-primary h-4 w-4"
            />
            <span className="text-gray-700">{language === "en" ? "Yes" : "Sí"}</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="hasInsurance"
              checked={formData.hasInsurance === false}
              onChange={() => handleCheckboxChange("hasInsurance", false)}
              className="text-primary focus:ring-primary h-4 w-4"
            />
            <span className="text-gray-700">{language === "en" ? "No" : "No"}</span>
          </label>
        </div>

        {/* Show Alert if No Insurance */}
        {formData.hasInsurance === false && (
          <Alert className="mt-2 bg-purple-50 border-purple-200">
            <InfoIcon className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm text-gray-700">
              {language === "en" 
                ? "Your information will NOT be shared with law enforcement or immigration authorities. This clinic provides care regardless of immigration status."
                : "Su información NO será compartida con la policía ni con autoridades de inmigración. Esta clínica brinda atención sin importar el estado migratorio."}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Other Concerns */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          {language === "en" ? "Other concerns affecting access to healthcare?" : "¿Otras preocupaciones que afecten el acceso a la atención médica?"}
        </Label>
        <Textarea
          name="otherConcerns"
          value={formData.otherConcerns}
          onChange={handleChange}
          className="min-h-20 border-gray-300 focus:border-primary focus:ring-primary"
        />
        <VoiceRecorder 
          language={language}
          fieldName="otherConcerns"
          onVoiceInput={onVoiceInput}
        />
      </div>
    </div>
  );
};
