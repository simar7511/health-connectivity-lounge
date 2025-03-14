
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  DocumentData 
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

const IntakeSubmissionsList = ({ language }: IntakeSubmissionsListProps) => {
  const [submissions, setSubmissions] = useState<IntakeFormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up real-time listener for intake form submissions
    const q = query(collection(db, "pediatricIntake"), orderBy("timestamp", "desc"));
    
    console.log("Setting up Firestore listener for pediatricIntake collection");
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
      
      setSubmissions(submissionsData);
      setLoading(false);
      
      console.log(`Processed ${submissionsData.length} intake submissions`);
    }, (error) => {
      console.error("Error fetching intake submissions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
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
            <p className="text-center text-sm text-muted-foreground">
              Looking for collection: pediatricIntake
            </p>
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
