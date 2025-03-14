
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
import { Dialog } from "@/components/ui/dialog";
import { IntakeFormSubmission, IntakeSubmissionsListProps } from "./IntakeSubmissionsTypes";
import { IntakeSubmissionsCard } from "./IntakeSubmissionsCard";
import { IntakeSubmissionsDetails } from "./IntakeSubmissionsDetails";
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

// Create proper Timestamp objects for local storage data
const createTimestamp = (offsetDays = 0): Timestamp => {
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

const IntakeSubmissionsList = ({ language }: IntakeSubmissionsListProps) => {
  const [submissions, setSubmissions] = useState<IntakeFormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedSubmission, setSelectedSubmission] = useState<IntakeFormSubmission | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Check for local storage submissions on mount and when new submissions arrive
  useEffect(() => {
    try {
      // First check if there's a recent submission in localStorage
      const latestSubmission = localStorage.getItem("latestIntakeSubmission");
      
      // Make sure db is properly initialized 
      if (!db || typeof db['collection'] !== 'function') {
        console.log("Firebase db not properly initialized, checking for local submissions");
        
        // If there's a recent local submission, use it
        if (latestSubmission) {
          try {
            const parsedSubmission = JSON.parse(latestSubmission);
            setSubmissions([
              {
                ...parsedSubmission,
                id: parsedSubmission.id || `local-submission-${Date.now()}`,
                timestamp: createTimestamp() // Make sure it's the most recent
              }
            ]);
          } catch (parseError) {
            console.error("Error parsing local submission:", parseError);
            setSubmissions([]);
          }
        } else {
          setSubmissions([]);
        }
        
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
          
          // If no Firestore data but we have local data, use it
          if (submissionsData.length === 0 && latestSubmission) {
            try {
              const parsedSubmission = JSON.parse(latestSubmission);
              setSubmissions([
                {
                  ...parsedSubmission,
                  id: parsedSubmission.id || `local-submission-${Date.now()}`,
                  timestamp: createTimestamp() // Make sure it's the most recent
                }
              ]);
            } catch (parseError) {
              console.error("Error parsing local submission:", parseError);
              setSubmissions([]);
            }
          } else {
            setSubmissions(submissionsData);
          }
          
          setLoading(false);
          console.log(`Processed ${submissionsData.length} intake submissions`);
        }, 
        (error) => {
          console.error("Error fetching intake submissions:", error);
          
          // Use local submission on error if available
          if (latestSubmission) {
            try {
              const parsedSubmission = JSON.parse(latestSubmission);
              setSubmissions([
                {
                  ...parsedSubmission,
                  id: parsedSubmission.id || `local-submission-${Date.now()}`,
                  timestamp: createTimestamp()
                }
              ]);
            } catch (parseError) {
              console.error("Error parsing local submission:", parseError);
              setSubmissions([]);
            }
          } else {
            setSubmissions([]);
          }
          
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up Firestore listener:", error);
      
      // Use local submission on error if available
      const latestSubmission = localStorage.getItem("latestIntakeSubmission");
      if (latestSubmission) {
        try {
          const parsedSubmission = JSON.parse(latestSubmission);
          setSubmissions([
            {
              ...parsedSubmission,
              id: parsedSubmission.id || `local-submission-${Date.now()}`,
              timestamp: createTimestamp()
            }
          ]);
        } catch (parseError) {
          console.error("Error parsing local submission:", parseError);
          setSubmissions([]);
        }
      } else {
        setSubmissions([]);
      }
      
      setLoading(false);
      return () => {};
    }
  }, []);

  // Handle new submissions coming from local storage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "latestIntakeSubmission" && e.newValue) {
        try {
          const newSubmission = JSON.parse(e.newValue);
          
          setSubmissions(prev => {
            // Check if this submission is already in the list by matching some unique properties
            const exists = prev.some(sub => 
              sub.childName === newSubmission.childName && 
              sub.phoneNumber === newSubmission.phoneNumber &&
              sub.symptoms === newSubmission.symptoms
            );
            
            if (exists) return prev;
            
            // Add the new submission at the top with a timestamp
            return [
              {
                ...newSubmission,
                id: newSubmission.id || `local-submission-${Date.now()}`,
                timestamp: createTimestamp() // Make sure it's the most recent
              },
              ...prev
            ];
          });
        } catch (error) {
          console.error("Error handling storage event:", error);
        }
      }
    };
    
    // Listen for storage events (works across tabs)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleViewDetails = (submission: IntakeFormSubmission) => {
    // Set the selected submission and open the details dialog
    setSelectedSubmission(submission);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const handleContactPatient = (submission: IntakeFormSubmission) => {
    // Open messaging interface or initiate contact
    console.log(`Contacting patient: ${submission.childName} via ${submission.notificationType}`);
    // This would connect to a messaging component in a real implementation
    setIsDetailsOpen(false); // Close the details dialog
    navigate(`/chat/${submission.id}`, { 
      state: { patientInfo: submission }
    });
  };

  const content = translations[language];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
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
          <>
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

            {/* Details Dialog */}
            {selectedSubmission && (
              <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <IntakeSubmissionsDetails
                  submission={selectedSubmission}
                  urgency={getUrgencyLevel(selectedSubmission)}
                  handleContactPatient={handleContactPatient}
                  closeDetails={handleCloseDetails}
                  language={language}
                />
              </Dialog>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default IntakeSubmissionsList;
