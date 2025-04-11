import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import Logo from "@/components/logo";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleGoHome = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-muted">
      <div className="w-full max-w-md flex flex-col gap-8 items-center text-center">
        <Logo />
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <h2 className="text-2xl font-semibold">Page not found</h2>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. The page might have been removed, 
            renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <Button 
            variant="default" 
            className="flex-1 gap-2" 
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 gap-2" 
            onClick={handleGoHome}
          >
            <Search className="w-4 h-4" />
            Go Home
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          If you believe this is an error, please contact support.
        </div>
      </div>
    </div>
  );
};

export default NotFound;
