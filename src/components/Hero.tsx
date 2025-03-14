
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollText, MapPin } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-20 bg-gradient-to-br from-primary/5 to-background overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm font-medium text-muted-foreground">Adams County, Washington</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Quality Pediatric Care for Rural Families
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Safe Haven Virtual Pediatric Clinic provides comprehensive healthcare for children and adolescents in rural Washington, regardless of insurance or immigration status.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/pediatric-intake")}
              className="bg-gradient-to-r from-primary to-purple-600 text-white shadow-md hover:shadow-lg transition-all"
            >
              Complete Pediatric Intake Form
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/ai-chat")}
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary font-medium"
            >
              Bilingual AI Health Assistant
            </Button>
          </div>
          <div className="mt-8 flex flex-col items-center">
            <Button 
              variant="link"
              onClick={() => navigate("/free-clinic")}
              className="text-primary/90 hover:text-primary font-medium"
            >
              Find Free Rural Clinics Near You
            </Button>
            <Button 
              variant="secondary"
              onClick={() => navigate("/terms-of-service")}
              className="mt-4 flex items-center gap-2 text-sm px-6"
            >
              <ScrollText className="h-4 w-4" />
              Terms of Service
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5"></div>
    </section>
  );
};
