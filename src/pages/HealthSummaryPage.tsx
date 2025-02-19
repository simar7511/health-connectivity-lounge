
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, AlertTriangle, CheckCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Severity = "mild" | "moderate" | "severe";
type TimeFilter = "7days" | "30days" | "90days" | "all";

interface SymptomLog {
  timestamp: string;
  symptom: string;
  severity: Severity;
  description: string;
  relatedCondition?: string;
}

interface IntakeData {
  symptoms: string;
  medicalHistory: string;
  medicationsAndAllergies: string;
  hasRecentHospitalVisits: boolean;
  hospitalVisitLocation?: string;
}

const mockIntakeData: IntakeData = {
  symptoms: "Frequent headaches and dizziness",
  medicalHistory: "Previous gestational hypertension",
  medicationsAndAllergies: "Taking prenatal vitamins, No known allergies",
  hasRecentHospitalVisits: true,
  hospitalVisitLocation: "Memorial Hospital"
};

const mockSymptomLogs: SymptomLog[] = [
  {
    timestamp: "2024-03-20T09:30:00",
    symptom: "Headache",
    severity: "moderate",
    description: "Persistent headache with visual disturbances",
    relatedCondition: "Gestational Hypertension"
  },
  {
    timestamp: "2024-03-19T15:45:00",
    symptom: "Swelling",
    severity: "mild",
    description: "Slight ankle swelling"
  },
  {
    timestamp: "2024-03-18T11:20:00",
    symptom: "Dizziness",
    severity: "severe",
    description: "Severe dizziness upon standing",
    relatedCondition: "Gestational Hypertension"
  }
];

export default function HealthSummaryPage() {
  const { toast } = useToast();
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("7days");
  const [providerNote, setProviderNote] = useState("");

  const getSeverityColor = (severity: Severity) => {
    return {
      severe: "bg-red-500",
      moderate: "bg-orange-500",
      mild: "bg-green-500"
    }[severity];
  };

  const getAlertIcon = (severity: Severity) => {
    switch (severity) {
      case "severe":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "moderate":
        return <Activity className="h-5 w-5 text-orange-500" />;
      case "mild":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const sendNoteToPatient = () => {
    if (providerNote.trim()) {
      toast({
        title: "Note Sent",
        description: "Message has been sent to the patient via secure messaging.",
      });
      setProviderNote("");
    }
  };

  const filteredLogs = mockSymptomLogs
    .filter(log => severityFilter === "all" || log.severity === severityFilter)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Intake Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Current Symptoms</h3>
              <p className="text-gray-600">{mockIntakeData.symptoms}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Medical History</h3>
              <p className="text-gray-600">{mockIntakeData.medicalHistory}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Medications & Allergies</h3>
              <p className="text-gray-600">{mockIntakeData.medicationsAndAllergies}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Recent Hospital Visits</h3>
              <p className="text-gray-600">
                {mockIntakeData.hasRecentHospitalVisits ? 
                  `Yes - ${mockIntakeData.hospitalVisitLocation}` : 
                  "No recent hospital visits"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Reported Symptoms</CardTitle>
          <div className="flex items-center gap-4">
            <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={(value: any) => setSeverityFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log, index) => (
              <Alert key={index} className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <AlertTitle className="flex items-center gap-2">
                      {getAlertIcon(log.severity)}
                      {log.symptom}
                      <Badge className={`${getSeverityColor(log.severity)} text-white`}>
                        {log.severity}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription>
                      <p className="mt-1">{log.description}</p>
                      {log.relatedCondition && (
                        <Badge variant="outline" className="mt-2">
                          Related: {log.relatedCondition}
                        </Badge>
                      )}
                    </AlertDescription>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </Alert>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Send Message to Patient
            </h3>
            <Textarea
              value={providerNote}
              onChange={(e) => setProviderNote(e.target.value)}
              placeholder="Write a message to the patient regarding their symptoms..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setProviderNote("")}>
                Clear
              </Button>
              <Button onClick={sendNoteToPatient}>
                Send Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
