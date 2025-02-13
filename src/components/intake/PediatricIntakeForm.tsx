
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
    // Basic Info
    childName: "",
    dob: "",
    languagePreference: "",
    needsInterpreter: false,
    phoneNumber: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    
    // Medical Info
    reasonForVisit: "",
    medicalHistory: "",
    medicationsAndAllergies: "",
    hasRecentHospitalVisits: false,
    hospitalVisitLocation: "",
    
    // Social Info
    hasInsurance: false,
    wantsLowCostInfo: false,
    needsTransportation: false,
    needsChildcare: false,
    otherConcerns: "",
    
    // Consent
    consentToTreatment: false,
  });

  useEffect(() => {
    const savedLanguage = sessionStorage.getItem('preferredLanguage') as "en" | "es" | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleVoiceInput = (field: string, input: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: input,
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
    <form onSubmit={handleSubmit} className="container mx-auto max-w-3xl p-6 space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          {language === "en" ? "Pediatric Intake Form" : "Formulario de Admisión Pediátrica"}
        </h2>

        <div className="space-y-8">
          <BasicInfoSection 
            language={language}
            formData={formData}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
          />

          <MedicalInfoSection 
            language={language}
            formData={formData}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
            onVoiceInput={handleVoiceInput}
          />

          <SocialInfoSection 
            language={language}
            formData={formData}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
          />

          <ConsentSection 
            language={language}
            checked={formData.consentToTreatment}
            onCheckedChange={(checked) => handleCheckboxChange("consentToTreatment", checked)}
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
