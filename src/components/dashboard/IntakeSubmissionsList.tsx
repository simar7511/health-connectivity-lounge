
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  DocumentData,
  Timestamp
} from "@/types/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { IntakeFormSubmission, IntakeSubmissionsListProps } from "./IntakeSubmissionsTypes";
import { IntakeSubmissionsCard } from "./IntakeSubmissionsCard";
import { getUrgencyLevel } from "./IntakeSubmissionUtils";

const translations = {
  en: {
    title: "Recent Intake Submissions",
    noSubmissions: "No intake forms have been submitted yet.",
    loading: "Loading intake submissions...",
  },
  es: {
    title: "Envíos de Admisión Recientes",
    noSubmissions: "Aún no se han enviado formularios de admisión.",
    loading: "Cargando envíos de admisión...",
  }
};

// Create proper Timestamp objects for mock data
const createMockTimestamp = (offsetDays = 0): Timestamp => {
  const date = new Date();
  if (offsetDays !== 0) {
    date.setDate(date.getDate() - offsetDays);
  }
  return {
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: 0,
    toDate: () => date,
    toMillis: () => date.getTime(),
    isEqual: () => false,
    toJSON: () => ({ seconds: Math.floor(date.getTime() / 1000), nanoseconds: 0 }),
    valueOf: () => `${Math.floor(date.getTime() / 1000)}.0`
  } as Timestamp;
};

// Mock data for when Firebase is unavailable
const mockSubmissions: IntakeFormSubmission[] = [
  {
    id: "mock-submission-1",
    childName: "Emma Rodriguez",
    parentName: "Maria Rodriguez",
    contactPhone: "+1234567890",
    age: 7,
    chiefComplaint: "Persistent cough and mild fever for 3 days",
    timestamp: createMockTimestamp(),
    notificationType: "sms",
    language: "es",
    dob: "2017-03-15",
    phoneNumber: "+1234567890",
    symptoms: "Persistent cough and mild fever for 3 days",
    medicalHistory: "Asthma",
    medicationsAndAllergies: "Inhaler as needed. Allergic to peanuts.",
    hasRecentHospitalVisits: false,
    hasInsurance: true,
    userId: "mock-user-1"
  },
  {
    id: "mock-submission-2",
    childName: "Aiden Smith",
    parentName: "John Smith",
    contactPhone: "+1987654321",
    age: 4,
    chiefComplaint: "Ear pain and difficulty sleeping",
    timestamp: createMockTimestamp(1), // 1 day ago
    notificationType: "whatsapp",
    language: "en",
    dob: "2019-08-22",
    phoneNumber: "+1987654321",
    symptoms: "Ear pain and difficulty sleeping",
    medicalHistory: "Recurring ear infections",
    medicationsAndAllergies: "No current medications. No known allergies.",
    hasRecentHospitalVisits: true,
    hospitalVisitLocation: "Memorial Children's Hospital",
    hasInsurance: true,
    userId: "mock-user-2"
  }
];

const IntakeSubmissionsList = ({ language }: IntakeSubmissionsListProps) => {
  const [submissions, setSubmissions] = useState<IntakeFormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // Make sure db is properly initialized 
      if (!db || typeof db['collection'] !== 'function') {
        console.log("Firebase db not properly initialized, using mock data");
        setSubmissions(mockSubmissions);
        setUsingMockData(true);
        setLoading(false);
        return () => {};
      }

      // Set up real-time listener for intake form submissions
      // Use bracket notation to access collection to prevent TypeScript errors
      // @ts-ignore - We're checking if this exists before using it
      const submissionsRef = collection(db, "pediatricIntake");
      const q = query(submissionsRef, orderBy("timestamp", "desc"));
      
      console.log("Setting up Firestore listener for pediatricIntake collection");
      
      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          console.log(`Received ${querySnapshot.size} documents from Firestore`);
          
          const submissionsData: IntakeFormSubmission[] = [];
          querySnapshot.forEach((doc) => {
            console.log(`Processing document: ${doc.id}`);
            const data = doc.data() as DocumentData;
            submissionsData.push({
              id: doc.id,
              ...data,
              timestamp: data.timestamp
            } as IntakeFormSubmission);
          });
          
          setSubmissions(submissionsData.length > 0 ? submissionsData : mockSubmissions);
          setUsingMockData(submissionsData.length === 0);
          setLoading(false);
          
          console.log(`Processed ${submissionsData.length} intake submissions`);
        }, 
        (error) => {
          console.error("Error fetching intake submissions:", error);
          // Use mock data on error
          setSubmissions(mockSubmissions);
          setUsingMockData(true);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up Firestore listener:", error);
      // Use mock data on error
      setSubmissions(mockSubmissions);
      setUsingMockData(true);
      setLoading(false);
      return () => {};
    }
  }, []);

  const handleViewDetails = (submission: IntakeFormSubmission) => {
    // Navigate to the patient's intake form
    navigate(`/patient/${submission.id}/intake`, { 
      state: { submission }
    });
  };

  const handleContactPatient = (submission: IntakeFormSubmission) => {
    // Open messaging interface or initiate contact
    console.log(`Contacting patient: ${submission.childName} via ${submission.notificationType}`);
    // This would connect to a messaging component in a real implementation
  };

  const content = translations[language];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
        {usingMockData && (
          <div className="text-xs text-amber-600 mt-1">
            {language === "en" ? "Using demo data" : "Usando datos de demostración"}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : submissions.length === 0 ? (
          <div>
            <p className="text-center py-8 text-muted-foreground">{content.noSubmissions}</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {submissions.map((submission) => {
                const urgency = getUrgencyLevel(submission);
                
                return (
                  <IntakeSubmissionsCard
                    key={submission.id}
                    submission={submission}
                    urgency={urgency}
                    handleViewDetails={handleViewDetails}
                    handleContactPatient={handleContactPatient}
                    language={language}
                  />
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default IntakeSubmissionsList;
