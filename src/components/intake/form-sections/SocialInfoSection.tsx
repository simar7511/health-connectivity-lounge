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
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-md border-l-4 border-l-primary transition-all duration-300 hover:shadow-lg">
      <h3 className="text-lg font-semibold text-primary flex items-center gap-3">
        <span className="bg-gradient-to-r from-primary to-purple-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-md">3</span>
        {language === "en" ? "Social & Financial Considerations" : "Consideraciones Sociales y Financieras"}
      </h3>

      {/* Health Insurance Question */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          {language === "en" ? "Do you have health insurance?" : "¿Tiene seguro médico?"}
        </Label>
        <div className="flex items-center space-x-4 pt-1">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <div className="relative">
              <input
                type="radio"
                name="hasInsurance"
                checked={formData.hasInsurance === true}
                onChange={() => handleCheckboxChange("hasInsurance", true)}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-2 rounded-full ${formData.hasInsurance === true 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-300 group-hover:border-primary/50'} transition-colors`}>
                {formData.hasInsurance === true && (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                )}
              </div>
            </div>
            <span className="text-gray-700 group-hover:text-primary transition-colors">{language === "en" ? "Yes" : "Sí"}</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer group">
            <div className="relative">
              <input
                type="radio"
                name="hasInsurance"
                checked={formData.hasInsurance === false}
                onChange={() => handleCheckboxChange("hasInsurance", false)}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-2 rounded-full ${formData.hasInsurance === false 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-300 group-hover:border-primary/50'} transition-colors`}>
                {formData.hasInsurance === false && (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                )}
              </div>
            </div>
            <span className="text-gray-700 group-hover:text-primary transition-colors">{language === "en" ? "No" : "No"}</span>
          </label>
        </div>

        {/* Show Alert if No Insurance */}
        {formData.hasInsurance === false && (
          <Alert className="mt-3 bg-purple-50 border border-purple-200 text-gray-700 animate-fadeIn">
            <InfoIcon className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              {language === "en" 
                ? "Your information will NOT be shared with law enforcement or immigration authorities. This clinic provides care regardless of immigration status."
                : "Su información NO será compartida con la policía ni con autoridades de inmigración. Esta clínica brinda atención sin importar el estado migratorio."}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Other Concerns */}
      <div className="space-y-3 pt-2">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          {language === "en" ? "Other concerns affecting access to healthcare?" : "¿Otras preocupaciones que afecten el acceso a la atención médica?"}
        </Label>
        <Textarea
          name="otherConcerns"
          value={formData.otherConcerns}
          onChange={handleChange}
          className="min-h-20 border-gray-200 focus:border-primary focus:ring-primary rounded-lg resize-y transition-all"
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
