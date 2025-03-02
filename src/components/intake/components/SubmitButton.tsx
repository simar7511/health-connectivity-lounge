
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
      className="w-full py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold text-lg shadow-lg transition-all rounded-xl border border-primary/20" 
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
