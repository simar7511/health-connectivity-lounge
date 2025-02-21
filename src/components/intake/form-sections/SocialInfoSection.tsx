import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InfoIcon } from "lucide-react";
import { VoiceRecorder } from "@/components/symptom-checker/VoiceRecorder";

interface SocialInfoSectionProps {
  language: "en" | "es";
  formData: {
    hasInsurance: boolean;
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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        {language === "en" ? "3️⃣ Social & Financial Considerations" : "3️⃣ Consideraciones Sociales y Financieras"}
      </h3>

      {/* Health Insurance Question */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {language === "en" ? "Do you have health insurance?" : "¿Tiene seguro médico?"}
        </Label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="hasInsurance"
              checked={formData.hasInsurance}
              onChange={() => handleCheckboxChange("hasInsurance", true)}
              className="rounded-full"
            />
            <span>{language === "en" ? "Yes" : "Sí"}</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="hasInsurance"
              checked={!formData.hasInsurance}
              onChange={() => handleCheckboxChange("hasInsurance", false)}
              className="rounded-full"
            />
            <span>{language === "en" ? "No" : "No"}</span>
          </label>
        </div>

        {/* Show Alert if No Insurance */}
        {!formData.hasInsurance && (
          <Alert className="mt-2 bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-800">
              {language === "en" 
                ? "Your information will NOT be shared with law enforcement or immigration authorities. This clinic provides care regardless of immigration status."
                : "Su información NO será compartida con la policía ni con autoridades de inmigración. Esta clínica brinda atención sin importar el estado migratorio."}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Other Concerns */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {language === "en" ? "Other concerns affecting access to healthcare?" : "¿Otras preocupaciones que afecten el acceso a la atención médica?"}
        </Label>
        <Textarea
          name="otherConcerns"
          value={formData.otherConcerns}
          onChange={handleChange}
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
