
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppointmentsList } from "./dashboard/AppointmentsList";
import { MessagingInbox } from "./dashboard/MessagingInbox";
import { HealthDataLogs } from "./dashboard/HealthDataLogs";
import IntakeSubmissionsList from "./dashboard/IntakeSubmissionsList";
import { Patient } from "@/types/patient";
import { ProviderHeader } from "./layout/ProviderHeader";
import { ProviderFooter } from "./layout/ProviderFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp 
} from "@/types/firebase";

interface ProviderDashboardProps {
  language: "en" | "es";
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Maria Garcia",
    language: "es",
    nextAppointment: "2025-02-10T10:00:00",
    reasonForVisit: "Prenatal checkup - 28 weeks",
    demographics: {
      age: 28,
      preferredLanguage: "es",
      insuranceStatus: "uninsured",
    },
    vitals: {
      bp: [120, 122, 118, 121],
      glucose: [95, 98, 92, 96],
      weight: [65, 65.5, 66, 66.2],
      fetalMovements: [10, 12, 8, 15],
    },
    risks: ["High blood pressure", "Gestational diabetes risk"],
    recentSymptoms: ["Mild headache", "Swollen ankles"],
  },
];

const translations = {
  en: {
    dashboard: "Provider Dashboard",
    translate: "Translate",
    translatedTo: "Translated to Spanish",
    intakeTab: "Intake Forms",
    appointmentsTab: "Appointments",
    healthDataTab: "Health Data",
    newSubmissionsAlert: "New Intake Form Submission!",
    newSubmissionsMessage: "You have received new intake form submissions that need your attention.",
    viewAll: "View All",
    lastUpdated: "Last updated",
  },
  es: {
    dashboard: "Panel del Proveedor",
    translate: "Traducir",
    translatedTo: "Traducido al inglés",
    intakeTab: "Formularios de Admisión",
    appointmentsTab: "Citas",
    healthDataTab: "Datos de Salud",
    newSubmissionsAlert: "¡Nuevo Envío de Formulario de Admisión!",
    newSubmissionsMessage: "Ha recibido nuevos envíos de formularios de admisión que requieren su atención.",
    viewAll: "Ver Todos",
    lastUpdated: "Última actualización",
  }
};

const ProviderDashboard = ({ language }: ProviderDashboardProps) => {
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [activeTab, setActiveTab] = useState("intake");
  const [hasNewSubmissions, setHasNewSubmissions] = useState(false);
  const [lastCheckedTimestamp, setLastCheckedTimestamp] = useState<Timestamp | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    if (!lastCheckedTimestamp) {
      const storedTimestamp = localStorage.getItem("lastCheckedIntakeTimestamp");
      if (storedTimestamp) {
        setLastCheckedTimestamp(Timestamp.fromMillis(parseInt(storedTimestamp)));
      } else {
        const now = Timestamp.now();
        setLastCheckedTimestamp(now);
        localStorage.setItem("lastCheckedIntakeTimestamp", now.toMillis().toString());
      }
    }

    const checkForNewSubmissions = async () => {
      try {
        if (!lastCheckedTimestamp) return;
        
        const submissionsRef = collection(db, "pediatricIntake");
        const q = query(
          submissionsRef,
          where("timestamp", ">", lastCheckedTimestamp),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setHasNewSubmissions(true);
          toast({
            title: translations[currentLanguage].newSubmissionsAlert,
            description: translations[currentLanguage].newSubmissionsMessage,
            duration: 5000,
          });
        }
        
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error checking for new submissions:", error);
      }
    };
    
    checkForNewSubmissions();
    
    const intervalId = setInterval(checkForNewSubmissions, 60000);
    
    return () => clearInterval(intervalId);
  }, [lastCheckedTimestamp, currentLanguage, toast]);

  const handleTranslate = () => {
    setCurrentLanguage((prev) => (prev === "en" ? "es" : "en"));
    toast({
      title: translations[currentLanguage].translatedTo,
    });
  };

  const handleViewIntakeForms = () => {
    setActiveTab("intake");
    const now = Timestamp.now();
    setLastCheckedTimestamp(now);
    localStorage.setItem("lastCheckedIntakeTimestamp", now.toMillis().toString());
    setHasNewSubmissions(false);
  };

  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString(currentLanguage === "en" ? "en-US" : "es-ES", {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ProviderHeader 
        language={currentLanguage}
        onLanguageChange={handleTranslate}
      />

      <main className="flex-1 container mx-auto p-6 space-y-6">
        {hasNewSubmissions && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">
              {translations[currentLanguage].newSubmissionsAlert}
            </AlertTitle>
            <AlertDescription className="text-blue-700">
              {translations[currentLanguage].newSubmissionsMessage}
              <button
                onClick={handleViewIntakeForms}
                className="ml-2 underline text-blue-600 hover:text-blue-800"
              >
                {translations[currentLanguage].viewAll}
              </button>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center">
          <Tabs 
            defaultValue="intake" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="intake">
                  {translations[currentLanguage].intakeTab}
                  {hasNewSubmissions && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      !
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="appointments">{translations[currentLanguage].appointmentsTab}</TabsTrigger>
                <TabsTrigger value="health-data">{translations[currentLanguage].healthDataTab}</TabsTrigger>
              </TabsList>
              
              <div className="text-sm text-muted-foreground">
                {translations[currentLanguage].lastUpdated}: {formatLastUpdated()}
              </div>
            </div>

            <TabsContent value="intake" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <IntakeSubmissionsList language={currentLanguage} />
                </div>

                <div className="lg:col-span-4">
                  <MessagingInbox
                    language={currentLanguage}
                    onStartChat={() => {}}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <AppointmentsList
                    language={currentLanguage}
                    patients={mockPatients}
                  />
                </div>

                <div className="lg:col-span-4">
                  <MessagingInbox
                    language={currentLanguage}
                    onStartChat={() => {}}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="health-data">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <HealthDataLogs patient={mockPatients[0]} />
                </div>

                <div className="lg:col-span-4">
                  <MessagingInbox
                    language={currentLanguage}
                    onStartChat={() => {}}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <ProviderFooter language={currentLanguage} />
    </div>
  );
};

export default ProviderDashboard;
