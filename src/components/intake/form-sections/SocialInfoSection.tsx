
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface SocialInfoSectionProps {
  language: "en" | "es";
  formData: {
    hasInsurance: boolean;
    wantsLowCostInfo: boolean;
    needsTransportation: boolean;
    needsChildcare: boolean;
    otherConcerns: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

export const SocialInfoSection = ({ 
  language, 
  formData, 
  handleChange,
  handleCheckboxChange 
}: SocialInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {language === "en" ? "3️⃣ Social & Financial Considerations" : "3️⃣ Consideraciones Sociales y Financieras"}
      </h3>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            name="hasInsurance"
            checked={formData.hasInsurance}
            onCheckedChange={(checked) => handleCheckboxChange("hasInsurance", checked as boolean)}
          />
          <label className="text-sm">
            {language === "en" ? "Do you have health insurance?" : "¿Tiene seguro médico?"}
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            name="wantsLowCostInfo"
            checked={formData.wantsLowCostInfo}
            onCheckedChange={(checked) => handleCheckboxChange("wantsLowCostInfo", checked as boolean)}
          />
          <label className="text-sm">
            {language === "en" 
              ? "Would you like information on free/low-cost health services?" 
              : "¿Desea información sobre servicios de salud gratuitos o de bajo costo?"}
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            name="needsTransportation"
            checked={formData.needsTransportation}
            onCheckedChange={(checked) => handleCheckboxChange("needsTransportation", checked as boolean)}
          />
          <label className="text-sm">
            {language === "en" 
              ? "Do you need help with transportation?" 
              : "¿Necesita ayuda con el transporte?"}
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            name="needsChildcare"
            checked={formData.needsChildcare}
            onCheckedChange={(checked) => handleCheckboxChange("needsChildcare", checked as boolean)}
          />
          <label className="text-sm">
            {language === "en" 
              ? "Do you need childcare assistance for medical visits?" 
              : "¿Necesita ayuda con el cuidado de niños para las visitas médicas?"}
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-sm">
            {language === "en" 
              ? "Other concerns affecting access to healthcare?" 
              : "¿Otras preocupaciones que afecten el acceso a la atención médica?"}
          </label>
          <Textarea
            name="otherConcerns"
            value={formData.otherConcerns}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};
