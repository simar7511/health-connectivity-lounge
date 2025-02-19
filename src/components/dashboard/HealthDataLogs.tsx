
import { useState } from "react";
import { Patient } from "@/types/patient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Activity, AlertTriangle, CheckCircle, FileText, Filter, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HealthDataLogsProps {
  patient: Patient;
}

type Severity = "mild" | "moderate" | "severe";
type TimeFilter = "7days" | "30days" | "90days" | "all";

interface SymptomLog {
  timestamp: string;
  symptom: string;
  severity: Severity;
  description: string;
  relatedCondition?: string;
  bp?: number[];
  glucose?: number;
}

const mockSymptomLogs: SymptomLog[] = [
  {
    timestamp: "2024-03-20T09:30:00",
    symptom: "Headache",
    severity: "moderate",
    description: "Persistent headache with visual disturbances",
    relatedCondition: "Gestational Hypertension",
    bp: [140, 90]
  },
  {
    timestamp: "2024-03-19T15:45:00",
    symptom: "Swelling",
    severity: "mild",
    description: "Slight ankle swelling",
    bp: [135, 88]
  },
  {
    timestamp: "2024-03-18T11:20:00",
    symptom: "Dizziness",
    severity: "severe",
    description: "Severe dizziness upon standing",
    relatedCondition: "Gestational Hypertension",
    bp: [150, 95]
  }
];

export const HealthDataLogs = ({ patient }: HealthDataLogsProps) => {
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

  const filteredLogs = mockSymptomLogs
    .filter(log => severityFilter === "all" || log.severity === severityFilter)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const addProviderNote = () => {
    if (providerNote.trim()) {
      toast({
        title: "Note Added",
        description: "Provider note has been saved successfully.",
      });
      setProviderNote("");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Health Data Logs</CardTitle>
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
          {/* Trends Graph */}
          <div className="h-[200px] mb-6">
            <ChartContainer config={{
              line1: { theme: { light: "#ef4444", dark: "#ef4444" } },
              line2: { theme: { light: "#84cc16", dark: "#84cc16" } },
            }}>
              <LineChart data={mockSymptomLogs.map(log => ({
                date: new Date(log.timestamp).toLocaleDateString(),
                systolic: log.bp ? log.bp[0] : null,
                diastolic: log.bp ? log.bp[1] : null,
              }))}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip />
                <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic BP" />
                <Line type="monotone" dataKey="diastolic" stroke="#84cc16" name="Diastolic BP" />
              </LineChart>
            </ChartContainer>
          </div>

          {/* Symptom Timeline */}
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
                      {log.bp && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          BP: {log.bp[0]}/{log.bp[1]} mmHg
                        </p>
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

          {/* Provider Notes Section */}
          <div className="mt-6 space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Add Provider Note
            </h3>
            <Textarea
              value={providerNote}
              onChange={(e) => setProviderNote(e.target.value)}
              placeholder="Add observations, follow-up actions, or treatment adjustments..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setProviderNote("")}>
                Clear
              </Button>
              <Button onClick={addProviderNote}>
                Save Note
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
