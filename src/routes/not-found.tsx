import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
      </div>
      <Button asChild>
        <Link to="/">Return to dashboard</Link>
      </Button>
    </div>
  );
}