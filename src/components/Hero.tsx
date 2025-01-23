import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-r from-primary to-blue-400 py-20 text-white animate-fadeIn">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">Your Health, Our Priority</h1>
          <p className="text-xl mb-8">
            Experience healthcare reimagined with our virtual clinic. Professional care from the comfort of your home.
          </p>
          <Button 
            onClick={() => navigate("/book")} 
            className="bg-secondary hover:bg-green-600 text-white px-8 py-6 text-lg rounded-full transition-all"
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};