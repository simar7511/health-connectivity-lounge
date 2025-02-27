import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { MedicalInfoSection } from "./form-sections/MedicalInfoSection";
import { SocialInfoSection } from "./form-sections/SocialInfoSection";
import { ConsentSection } from "./form-sections/ConsentSection";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { ConfidentialityNotice } from "./components/ConfidentialityNotice";
import { SubmitButton } from "./components/SubmitButton";
import { sendIntakeFormConfirmation, sendIntakeFormWhatsAppConfirmation } from "@/utils/twilioService";
import { notifyProviders, estimateUrgency } from "@/utils/providerNotifications";
import { SmsMessageList } from "@/components/SmsMessageList";
import { WhatsAppMessageList } from "@/components/WhatsAppMessageList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PediatricIntakeFormProps {
  language: "en" | "es";
}

const PediatricIntakeForm = ({ language: propLanguage }: PediatricIntakeFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMounted = useRef(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState(propLanguage);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [notificationType, setNotificationType] = useState<"sms" | "whatsapp">("sms");
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        try {
          const result = await signInAnonymously(auth);
          setCurrentUser(result.user);
        } catch (error) {
          console.error("Anonymous Sign-In Error:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const [formData, setFormData] = useState(() => ({
    childName: "",
    dob: "",
    languagePreference: "",
    phoneNumber: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    symptoms: "",
    medicalHistory: "",
    medicationsAndAllergies: "",
    hasRecentHospitalVisits: null,
    hospitalVisitLocation: "",
    hasInsurance: null,
    otherConcerns: "",
    consentToTreatment: false,
    notificationType: "sms",
  }));

  useEffect(() => {
    const savedLanguage = sessionStorage.getItem("preferredLanguage") as "en" | "es" | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      notificationType
    }));
  }, [notificationType]);

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

  const handleRadioChange = (name: string, value: boolean | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    if (!currentUser) {
      toast({
        title: language === "en" ? "Authentication Required" : "Autenticación Requerida",
        description: language === "en"
          ? "You must be signed in to submit this form."
          : "Debe iniciar sesión para enviar este formulario.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.consentToTreatment) {
      toast({
        title: language === "en" ? "Consent Required" : "Se requiere consentimiento",
        description: language === "en"
          ? "Please agree to the consent statement to continue."
          : "Por favor, acepte la declaración de consentimiento para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting intake form to Firestore - pediatricIntake collection");
      
      const docRef = await addDoc(collection(db, "pediatricIntake"), {
        ...formData,
        userId: currentUser.uid,
        timestamp: serverTimestamp(),
        language,
      });

      console.log(`Form submitted successfully with ID: ${docRef.id}`);

      toast({
        title: language === "en" ? "Form Successfully Submitted!" : "¡Formulario enviado con éxito!",
        description: language === "en"
          ? "Thank you for sharing this information. We will carefully review your needs."
          : "Gracias por compartir esta información. Revisaremos sus necesidades cuidadosamente.",
        duration: 5000,
      });

      localStorage.setItem("intakeId", docRef.id);
      
      localStorage.setItem("lastIntakeSubmissionTime", new Date().toISOString());

      if (formData.phoneNumber) {
        if (notificationType === "sms") {
          await sendIntakeFormConfirmation(formData.phoneNumber, language);
        } else {
          await sendIntakeFormWhatsAppConfirmation(formData.phoneNumber, language);
        }
      }
      
      const urgency = estimateUrgency(
        formData.symptoms, 
        formData.medicalHistory, 
        formData.hasRecentHospitalVisits
      );
      
      const providerPhones = localStorage.getItem("providerNotificationPhones");
      if (providerPhones) {
        await notifyProviders({
          patientName: formData.childName,
          symptoms: formData.symptoms,
          urgency,
          contactPhone: formData.phoneNumber,
          language
        });
      }

      setFormData({
        childName: "",
        dob: "",
        languagePreference: "",
        phoneNumber: "",
        emergencyContactName: "",
        emergencyContactRelation: "",
        symptoms: "",
        medicalHistory: "",
        medicationsAndAllergies: "",
        hasRecentHospitalVisits: null, 
        hospitalVisitLocation: "",
        hasInsurance: null, 
        otherConcerns: "",
        consentToTreatment: false,
        notificationType: "sms",
      });

      navigate("/confirmation");

    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: language === "en" ? "Submission Failed" : "Error en el envío",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const translations = {
    en: {
      notificationMethod: "Notification Method",
      smsOption: "SMS",
      whatsappOption: "WhatsApp"
    },
    es: {
      notificationMethod: "Método de Notificación",
      smsOption: "SMS",
      whatsappOption: "WhatsApp"
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-6 space-y-6">
      <ConfidentialityNotice language={language} />
      <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            {language === "en" ? "🏥 Pediatric Intake Form" : "🏥 Formulario de Ingreso Pediátrico"}
          </h2>

          <p className="text-center text-gray-600">
            {language === "en"
              ? "We provide free and compassionate pediatric care, regardless of immigration or insurance status."
              : "Brindamos atención pediátrica gratuita y compasiva, sin importar el estado migratorio o de seguro."
            }
          </p>

          <div className="space-y-8">
            <BasicInfoSection 
              language={language} 
              formData={formData} 
              handleChange={handleChange} 
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
              onVoiceInput={handleVoiceInput} 
            />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {language === "en" ? "Notification Method" : "Método de Notificación"}
              </h3>
              <Tabs 
                defaultValue="sms" 
                value={notificationType}
                onValueChange={(value) => setNotificationType(value as "sms" | "whatsapp")}
                className="w-full"
              >
                <TabsList className="w-full">
                  <TabsTrigger value="sms" className="flex-1">
                    {language === "en" ? "SMS" : "SMS"}
                  </TabsTrigger>
                  <TabsTrigger value="whatsapp" className="flex-1">
                    {language === "en" ? "WhatsApp" : "WhatsApp"}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ConsentSection 
              language={language} 
              checked={formData.consentToTreatment} 
              onCheckedChange={(checked) => handleCheckboxChange("consentToTreatment", checked)} 
            />

            <SubmitButton language={language} isSubmitting={isSubmitting} />
          </div>
        </Card>
      </form>

      <div className="space-y-4">
        <SmsMessageList />
        <WhatsAppMessageList />
      </div>
    </div>
  );
};

export default PediatricIntakeForm;
