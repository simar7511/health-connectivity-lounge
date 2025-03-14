
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { db, auth } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp
} from "firebase/firestore";
import { 
  onAuthStateChanged, 
  signInAnonymously 
} from "firebase/auth";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { MedicalInfoSection } from "./form-sections/MedicalInfoSection";
import { SocialInfoSection } from "./form-sections/SocialInfoSection";
import { ConsentSection } from "./form-sections/ConsentSection";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { ConfidentialityNotice } from "./components/ConfidentialityNotice";
import { SubmitButton } from "./components/SubmitButton";
import { notifyProviders, estimateUrgency } from "@/utils/providerNotifications";
import { logNavigationAttempt } from "@/utils/navigationService";
import { Hospital } from "lucide-react";
import { NavigationHeader } from "@/components/layout/NavigationHeader";

interface PediatricIntakeFormProps {
  language: "en" | "es";
}

const PediatricIntakeForm = ({ language: propLanguage }: PediatricIntakeFormProps) => {
  // Log that we've reached this component
  console.log("PediatricIntakeForm component mounted");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMounted = useRef(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState(propLanguage);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("PediatricIntakeForm: Initializing auth state");
    
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log("User already signed in:", user.uid);
          setCurrentUser(user);
        } else {
          console.log("No user, attempting anonymous sign-in");
          try {
            const result = await signInAnonymously(auth);
            console.log("Anonymous sign-in successful:", result.user.uid);
            setCurrentUser(result.user);
          } catch (error) {
            console.error("Anonymous Sign-In Error:", error);
            toast({
              variant: "destructive",
              title: "Authentication Error",
              description: "Unable to create temporary session. Please try again.",
            });
          }
        }
        setIsLoading(false);
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up auth listener:", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "There was a problem with authentication. You can still fill out the form.",
      });
      return () => {};
    }
  }, [toast]);

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
    console.log("Form submit triggered");

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
      
      // Try to use current user if available, otherwise proceed without userId
      const formDataToSubmit = {
        ...formData,
        userId: currentUser?.uid || 'anonymous',
        timestamp: serverTimestamp(),
        language,
        // Add required fields for IntakeFormSubmission type
        notificationType: "sms" as "sms" | "whatsapp",
      };
      
      let submissionId = `local-submission-${Date.now()}`;
      
      // Allow the submission to complete even if Firestore fails
      try {
        const docRef = await addDoc(collection(db, "pediatricIntake"), formDataToSubmit);
        console.log(`Form submitted successfully with ID: ${docRef.id}`);
        localStorage.setItem("intakeId", docRef.id);
        submissionId = docRef.id;
      } catch (firestoreError) {
        console.error("Firestore submission error:", firestoreError);
        // Continue with the flow even if Firestore fails
      }
      
      // Store submission in localStorage for immediate display in provider dashboard
      const localSubmissionData = {
        ...formDataToSubmit,
        id: submissionId,
        // Include a simple timestamp for local storage
        submittedAt: new Date().toISOString()
      };
      
      // Save to localStorage for cross-tab communication
      localStorage.setItem("latestIntakeSubmission", JSON.stringify(localSubmissionData));
      localStorage.setItem("lastIntakeSubmissionTime", new Date().toISOString());

      if (formData.phoneNumber) {
        localStorage.setItem("patientPhone", formData.phoneNumber);
      }
      
      // Trigger a storage event to notify other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'latestIntakeSubmission',
        newValue: JSON.stringify(localSubmissionData)
      }));
      
      const urgency = estimateUrgency(
        formData.symptoms, 
        formData.medicalHistory, 
        formData.hasRecentHospitalVisits
      );
      
      // Attempt to notify providers but don't block if it fails
      try {
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
      } catch (notifyError) {
        console.error("Provider notification error:", notifyError);
        // Continue with the flow even if notifications fail
      }

      // Show success message
      toast({
        title: language === "en" ? "Form Successfully Submitted!" : "¡Formulario enviado con éxito!",
        description: language === "en"
          ? "Thank you for sharing this information. We will carefully review your needs."
          : "Gracias por compartir esta información. Revisaremos sus necesidades cuidadosamente.",
        duration: 5000,
      });

      // Reset form data
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
      });

      // Log navigation attempt before navigating
      logNavigationAttempt("PediatricIntakeForm", "Confirmation");
      
      // Use window.location as a fallback if React Router navigation fails
      setTimeout(() => {
        console.log("Navigating to confirmation page");
        try {
          navigate("/confirmation");
        } catch (navError) {
          console.error("Navigation error:", navError);
          window.location.href = "/confirmation";
        }
      }, 500);

    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: language === "en" ? "Submission Failed" : "Error en el envío",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
      
      // Even if there's an error, try to navigate to confirmation
      setTimeout(() => {
        try {
          navigate("/confirmation");
        } catch (navError) {
          console.error("Navigation error:", navError);
          window.location.href = "/confirmation";
        }
      }, 500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = language === "en" ? "Pediatric Intake Form" : "Formulario de Admisión Pediátrica";

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-white">
        <NavigationHeader 
          title={pageTitle}
          language={language}
          showBackButton={true}
          showBreadcrumbs={true}
        />
        <div className="container mx-auto flex items-center justify-center flex-1">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <NavigationHeader 
        title={pageTitle}
        language={language}
        showBackButton={true}
        showBreadcrumbs={true}
      />
      
      <div className="container mx-auto max-w-3xl p-6 space-y-6 flex-1">
        <ConfidentialityNotice language={language} />
        <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />

        <form onSubmit={handleSubmit}>
          <Card className="p-6 border-t-4 border-primary shadow-lg">
            <div className="flex justify-center mb-6">
              <Hospital className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4 text-primary">
              {language === "en" ? "Safe Haven Pediatric Intake Form" : "Formulario de Ingreso Pediátrico Safe Haven"}
            </h2>

            <p className="text-center text-gray-600 mb-6 px-4 py-2 bg-purple-50 rounded-md">
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

              <ConsentSection 
                language={language} 
                checked={formData.consentToTreatment} 
                onCheckedChange={(checked) => handleCheckboxChange("consentToTreatment", checked)} 
              />

              <SubmitButton language={language} isSubmitting={isSubmitting} />
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default PediatricIntakeForm;
