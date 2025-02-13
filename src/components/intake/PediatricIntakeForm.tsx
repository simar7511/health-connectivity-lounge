
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, InfoIcon, Globe } from "lucide-react";
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
    <div className="container mx-auto max-w-3xl p-6 space-y-6">
      <Alert className="bg-yellow-50 border-yellow-200 mb-6">
        <InfoIcon className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-sm text-yellow-800">
          {language === "en" 
            ? "🚨 This form is private and will NOT be shared with law enforcement or immigration authorities. This clinic provides care regardless of immigration status."
            : "🚨 Este formulario es privado y NO será compartido con la policía ni con autoridades de inmigración. Esta clínica brinda atención sin importar el estado migratorio."}
        </AlertDescription>
      </Alert>

      <div className="flex justify-end space-x-2 mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setLanguage("en")}
          className={language === "en" ? "bg-primary/10" : ""}
        >
          <Globe className="w-4 h-4 mr-2" />
          English
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setLanguage("es")}
          className={language === "es" ? "bg-primary/10" : ""}
        >
          <Globe className="w-4 h-4 mr-2" />
          Español
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            {language === "en" ? "🏥 Patient Intake Form" : "🏥 Formulario de Admisión del Paciente"}
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
                language === "en" ? "I Agree & Continue" : "Acepto y Continuar"
              )}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default PediatricIntakeForm;
