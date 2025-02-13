
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { MedicalInfoSection } from "./form-sections/MedicalInfoSection";
import { SocialInfoSection } from "./form-sections/SocialInfoSection";
import { ConsentSection } from "./form-sections/ConsentSection";

interface PediatricIntakeFormProps {
  language: "en" | "es";
}

const PediatricIntakeForm = ({ language: propLanguage }: PediatricIntakeFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState(propLanguage);
  const [formData, setFormData] = useState({
    childName: "",
    dob: "",
    languagePreference: "",
    emergencyContact: "",
    symptoms: "",
    medicalHistory: "",
    medications: "",
    hospitalVisits: "",
    insuranceStatus: "",
    transportation: "",
    childcare: "",
    consentToTreatment: false,
  });

  useEffect(() => {
    const savedLanguage = sessionStorage.getItem('preferredLanguage') as "en" | "es" | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleVoiceInput = (input: string) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: input,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consentToTreatment) {
      toast({
        title: language === "en" ? "Consent Required" : "Se Requiere Consentimiento",
        description: language === "en" 
          ? "Please agree to the consent statement to continue" 
          : "Por favor acepte el consentimiento para continuar",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, "pediatricIntake"), {
        ...formData,
        timestamp: new Date(),
        language
      });

      toast({
        title: language === "en" ? "Form Submitted" : "Formulario Enviado",
        description: language === "en" 
          ? "Thank you for completing the intake form" 
          : "Gracias por completar el formulario"
      });

      sessionStorage.setItem('intakeId', docRef.id);
      navigate("/appointment");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "Failed to submit form. Please try again." 
          : "Error al enviar formulario. Por favor intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          {language === "en" ? "Pediatric Intake Form" : "Formulario de Admisión Pediátrica"}
        </h2>

        <div className="space-y-6">
          <BasicInfoSection 
            language={language}
            formData={formData}
            handleChange={handleChange}
          />

          <MedicalInfoSection 
            language={language}
            formData={formData}
            handleChange={handleChange}
            onVoiceInput={handleVoiceInput}
          />

          <SocialInfoSection 
            language={language}
            formData={formData}
            handleChange={handleChange}
          />

          <ConsentSection 
            language={language}
            checked={formData.consentToTreatment}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, consentToTreatment: checked }))
            }
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "en" ? "Submitting..." : "Enviando..."}
              </>
            ) : (
              language === "en" ? "Submit & Schedule Appointment" : "Enviar y Programar Cita"
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default PediatricIntakeForm;
