
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-20 bg-gradient-to-br from-primary/5 to-background overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Quality Care for Every Child
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Regardless of insurance or immigration status, we provide comprehensive pediatric care to all children in our community.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/pediatric-intake")}
              className="bg-gradient-to-r from-primary to-purple-600 text-white shadow-md hover:shadow-lg transition-all"
            >
              Complete Intake Form
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/ai-chat")}
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary font-medium"
            >
              Ask Our AI Health Assistant
            </Button>
          </div>
          <div className="mt-4">
            <Button 
              variant="link"
              onClick={() => navigate("/free-clinic")}
              className="text-primary/90 hover:text-primary font-medium"
            >
              Find Free Clinics Near You
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5"></div>
    </section>
  );
};
