import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function UnauthorizedPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">403</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("states.unauthorized")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("actions.switchRole")} or {t("actions.signIn").toLowerCase()}.
        </p>
      </div>
      <Button asChild>
        <Link to="/">Go back</Link>
      </Button>
    </div>
  );
}