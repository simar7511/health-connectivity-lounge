
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  className?: string;
  language?: "en" | "es";
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className, language = "en" }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Map paths to readable names
  const getReadableName = (path: string): string => {
    const pathMap: Record<string, { en: string; es: string }> = {
      "patient": { en: "Patient", es: "Paciente" },
      "provider": { en: "Provider", es: "Proveedor" },
      "login": { en: "Login", es: "Iniciar sesión" },
      "dashboard": { en: "Dashboard", es: "Panel" },
      "appointment": { en: "Appointment", es: "Cita" },
      "appointment-confirmation": { en: "Confirmation", es: "Confirmación" },
      "pediatric-intake": { en: "Pediatric Intake", es: "Admisión Pediátrica" },
      "confirmation": { en: "Confirmation", es: "Confirmación" },
      "transportation": { en: "Transportation", es: "Transporte" },
      "free-clinic": { en: "Find a Clinic", es: "Encontrar una Clínica" },
      "chat": { en: "Chat", es: "Chat" },
      "ai-chat": { en: "Health Assistant", es: "Asistente de Salud" },
    };

    return pathMap[path] ? pathMap[path][language] : path.charAt(0).toUpperCase() + path.slice(1);
  };

  // Build the breadcrumbs path array with accumulated paths
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    return {
      name: getReadableName(segment),
      path,
    };
  });

  if (pathSegments.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumbs" className={cn("text-sm", className)}>
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link 
            to="/" 
            className="text-muted-foreground hover:text-foreground flex items-center"
            aria-label={language === "en" ? "Home" : "Inicio"}
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
          <ChevronRight className="h-3.5 w-3.5 mx-1 text-muted-foreground" />
        </li>
        
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium" aria-current="page">
                {breadcrumb.name}
              </span>
            ) : (
              <>
                <Link 
                  to={breadcrumb.path} 
                  className="text-muted-foreground hover:text-foreground"
                >
                  {breadcrumb.name}
                </Link>
                <ChevronRight className="h-3.5 w-3.5 mx-1 text-muted-foreground" />
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
