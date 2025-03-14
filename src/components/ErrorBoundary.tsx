
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle, ArrowLeft } from "lucide-react";

export function ErrorBoundary() {
  const error = useRouteError();
  
  let errorMessage: string;
  let errorStatus: number | string = "Error";

  if (isRouteErrorResponse(error)) {
    // This is a route error
    errorMessage = error.data?.message || error.statusText || "An unexpected error occurred";
    errorStatus = error.status;
  } else if (error instanceof Error) {
    // This is a JavaScript error
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    // This is a string error
    errorMessage = error;
  } else {
    // This is an unknown error
    errorMessage = "An unknown error occurred";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {errorStatus} Error
          </h1>
          <p className="mt-4 text-gray-600">{errorMessage}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            
            <Button asChild className="flex items-center gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
