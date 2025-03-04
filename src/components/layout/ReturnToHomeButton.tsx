
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ReturnToHomeButtonProps extends ButtonProps {
  language?: "en" | "es";
}

export const ReturnToHomeButton: React.FC<ReturnToHomeButtonProps> = ({ 
  language = "en", 
  className,
  ...props 
}) => {
  const navigate = useNavigate();
  
  return (
    <Button
      onClick={() => navigate("/")}
      className={cn("flex items-center justify-center gap-2", className)}
      {...props}
    >
      <Home className="h-4 w-4" />
      {language === "en" ? "Return to Home" : "Volver al Inicio"}
    </Button>
  );
};
