
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface BasicInfoSectionProps {
  language: "en" | "es";
  formData: {
    childName: string;
    dob: string;
    languagePreference: string;
    needsInterpreter: boolean;
    phoneNumber: string;
    emergencyContactName: string;
    emergencyContactRelation: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

export const BasicInfoSection = ({ 
  language, 
  formData, 
  handleChange,
  handleCheckboxChange 
}: BasicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {language === "en" ? "1️⃣ Basic Information" : "1️⃣ Información Básica"}
      </h3>
      
      <Input
        name="childName"
        value={formData.childName}
        onChange={handleChange}
        placeholder={language === "en" ? "Full Name/Preferred Name" : "Nombre Completo/Preferido"}
        required
      />

      <Input
        name="dob"
        type="date"
        value={formData.dob}
        onChange={handleChange}
        required
      />

      <select
        name="languagePreference"
        value={formData.languagePreference}
        onChange={handleChange}
        className="w-full rounded-md border border-input bg-background px-3 py-2"
        required
      >
        <option value="">{language === "en" ? "Select Language" : "Seleccionar Idioma"}</option>
        <option value="english">{language === "en" ? "English" : "Inglés"}</option>
        <option value="spanish">{language === "en" ? "Spanish" : "Español"}</option>
        <option value="other">{language === "en" ? "Other" : "Otro"}</option>
      </select>

      <div className="flex items-center space-x-2">
        <Checkbox
          name="needsInterpreter"
          checked={formData.needsInterpreter}
          onCheckedChange={(checked) => handleCheckboxChange("needsInterpreter", checked as boolean)}
        />
        <label className="text-sm">
          {language === "en" ? "Need an Interpreter?" : "¿Necesita un Intérprete?"}
        </label>
      </div>

      <Input
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder={language === "en" ? "Phone Number (Optional)" : "Número de Teléfono (Opcional)"}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="emergencyContactName"
          value={formData.emergencyContactName}
          onChange={handleChange}
          placeholder={language === "en" ? "Emergency Contact Name" : "Nombre de Contacto de Emergencia"}
        />
        <Input
          name="emergencyContactRelation"
          value={formData.emergencyContactRelation}
          onChange={handleChange}
          placeholder={language === "en" ? "Relationship" : "Relación"}
        />
      </div>
    </div>
  );
};
