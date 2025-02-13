
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
      
      <div className="space-y-2">
        <Label htmlFor="childName" className="flex items-center gap-2">
          👶 {language === "en" ? "Child's Full Name / Preferred Name" : "Nombre Completo del Niño / Nombre Preferido"}
        </Label>
        <Input
          id="childName"
          name="childName"
          value={formData.childName}
          onChange={handleChange}
          placeholder={language === "en" ? "Enter name" : "Ingrese nombre"}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob" className="flex items-center gap-2">
          📅 {language === "en" ? "Date of Birth" : "Fecha de Nacimiento"}
        </Label>
        <Input
          id="dob"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="languagePreference" className="flex items-center gap-2">
          🗣 {language === "en" ? "Preferred Language" : "Idioma Preferido"}
        </Label>
        <select
          id="languagePreference"
          name="languagePreference"
          value={formData.languagePreference}
          onChange={handleChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          required
        >
          <option value="">{language === "en" ? "Select Language" : "Seleccionar Idioma"}</option>
          <option value="spanish">{language === "en" ? "Spanish 🔘" : "Español 🔘"}</option>
          <option value="english">{language === "en" ? "English 🔘" : "Inglés 🔘"}</option>
          <option value="other">{language === "en" ? "Other 🔘" : "Otro 🔘"}</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          👂 {language === "en" ? "Do you need an interpreter?" : "¿Necesita un intérprete?"}
        </Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="needsInterpreter"
            name="needsInterpreter"
            checked={formData.needsInterpreter}
            onCheckedChange={(checked) => handleCheckboxChange("needsInterpreter", checked as boolean)}
          />
          <label htmlFor="needsInterpreter" className="text-sm">
            {language === "en" ? "Yes, I need an interpreter" : "Sí, necesito un intérprete"}
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="flex items-center gap-2">
          📞 {language === "en" ? "Phone Number (Optional)" : "Número de Teléfono (Opcional)"}
        </Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder={language === "en" ? "Enter phone number" : "Ingrese número de teléfono"}
          type="tel"
        />
      </div>

      <div className="space-y-2 border-t pt-4">
        <Label className="block mb-2">
          {language === "en" ? "Emergency Contact (Optional)" : "Contacto de Emergencia (Opcional)"}
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
            placeholder={language === "en" ? "Contact Name" : "Nombre de Contacto"}
          />
          <Input
            name="emergencyContactRelation"
            value={formData.emergencyContactRelation}
            onChange={handleChange}
            placeholder={language === "en" ? "Relationship" : "Relación"}
          />
        </div>
      </div>
    </div>
  );
};
