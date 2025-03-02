
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  language: "en" | "es";
  isSubmitting: boolean;
}

export const SubmitButton = ({ language, isSubmitting }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full py-6 bg-primary hover:bg-primary/90 text-white font-medium text-lg shadow-md transition-all" 
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {language === "en" ? "Submitting..." : "Enviando..."}
        </>
      ) : (
        language === "en" ? "I Agree & Continue" : "Acepto y Continuar"
      )}
    </Button>
  );
};
