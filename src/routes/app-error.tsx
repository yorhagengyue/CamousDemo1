import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AppErrorBoundary() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Something went wrong";

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>We hit a snag</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>{message}</p>
          <p>Try refreshing the page or head back to the dashboard.</p>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/">Go to dashboard</Link>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
