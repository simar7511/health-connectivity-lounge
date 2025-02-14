import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, isValid } from "date-fns"; // ✅ Ensure correct date formatting
import { Button } from "@/components/ui/button";
import { CheckCircle, Clipboard } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const AppointmentConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const appointmentDetails = location.state || {}; // ✅ Ensure state exists
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!appointmentDetails.date || !appointmentDetails.time) {
      navigate("/appointment"); // ✅ Redirect to appointment if no data exists
    }
  }, [appointmentDetails, navigate]);

  let formattedDate = "Invalid Date";
  if (appointmentDetails.date) {
    const parsedDate = new Date(appointmentDetails.date);
    if (isValid(parsedDate)) {
      formattedDate = format(parsedDate, "PPP"); // Format only if valid
    }
  }

  // ✅ Copy meeting link to clipboard
  const handleCopyLink = () => {
    if (appointmentDetails.virtualLink) {
      navigator.clipboard.writeText(appointmentDetails.virtualLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card className="shadow-lg p-6">
        <CardHeader>
          <h1 className="text-3xl font-bold flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-7 w-7" />
            <span>Appointment Confirmed!</span>
          </h1>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-lg">Your appointment has been successfully scheduled!</p>

          {/* ✅ Show Appointment Details */}
          {appointmentDetails.date && appointmentDetails.time ? (
            <div className="bg-gray-100 p-4 rounded-md">
              <h2 className="font-semibold text-xl">Appointment Details</h2>
              <p className="mt-2">📅 <strong>Date:</strong> {formattedDate}</p>
              <p>⏰ <strong>Time:</strong> {appointmentDetails.time}</p>
              <p>🩺 <strong>Visit Type:</strong> {appointmentDetails.appointmentType}</p>

              {/* ✅ Show Virtual Meeting Link (Only for Virtual Visits) */}
              {appointmentDetails.appointmentType === "Virtual Visit" && appointmentDetails.virtualLink && (
                <div className="mt-4 bg-white p-3 border rounded-md flex items-center justify-between">
                  <span className="truncate text-blue-600">{appointmentDetails.virtualLink}</span>
                  <Button variant="outline" size="sm" onClick={handleCopyLink}>
                    <Clipboard className="h-4 w-4 mr-1" />
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-500">⚠️ Missing appointment details.</p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/")}>
            Return to Home
          </Button>
          <Button className="w-full bg-red-600 hover:bg-red-700" variant="outline" onClick={() => navigate("/appointment")}>
            Reschedule or Cancel Appointment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppointmentConfirmationPage;
