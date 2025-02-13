
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  language: "en" | "es";
  isSubmitting: boolean;
}

export const SubmitButton = ({ language, isSubmitting }: SubmitButtonProps) => {
  return (
    <Button type="submit" className="w-full" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {language === "en" ? "Submitting..." : "Enviando..."}
        </>
      ) : (
        language === "en" ? "I Agree & Continue" : "Acepto y Continuar"
      )}
    </Button>
  );
};
