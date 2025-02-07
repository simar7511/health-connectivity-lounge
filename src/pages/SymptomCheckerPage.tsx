import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SymptomCheckerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">🩺 Symptom Checker</h1>
      <p>Describe your symptoms, and we'll provide guidance.</p>
      <textarea className="w-full p-2 border rounded" placeholder="Type your symptoms here..."></textarea>
      <Button className="w-full py-6 bg-green-500 text-white">Check Symptoms</Button>
      <Button
        className="mt-4 w-full py-6 bg-gray-500 text-white"
        onClick={() => navigate("/patient/dashboard")}
      >
        Back to Dashboard
      </Button>
    </div>
  );
};

export default SymptomCheckerPage;
