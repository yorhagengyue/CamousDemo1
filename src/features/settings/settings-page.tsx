import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { changeLocale } from "@/lib/i18n";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";

const LANGUAGES = ["en", "zh"] as const;

export function SettingsPage() {
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);
  const user = useAuthStore((state) => state.user);
  const updateLocale = useAuthStore((state) => state.updateLocale);
  const updateConsent = useAuthStore((state) => state.updateConsent);
  const [consentPresented, setConsentPresented] = useState(false);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Switch between light and dark appearance.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label htmlFor="theme-toggle">Dark mode</Label>
          <Switch
            id="theme-toggle"
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <CardDescription>Select interface language.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={user?.locale ?? "en"}
            onValueChange={(value) => {
              changeLocale(value as (typeof LANGUAGES)[number]);
              updateLocale(value as (typeof LANGUAGES)[number]);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((language) => (
                <SelectItem key={language} value={language}>
                  {language.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Reset demo data and clear local storage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">Use this if you want to restart the experience with fresh seed data.</p>
          <Button variant="destructive" onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}>
            Reset demo data
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Privacy Consent</CardTitle>
          <CardDescription>Manage the consent banner state used in the demo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Current status: {user?.consentAccepted ? "Accepted" : "Not accepted"}
          </p>
          <Button variant="outline" onClick={() => updateConsent(false)}>
            Reset consent
          </Button>
          <Button variant="ghost" onClick={() => setConsentPresented(true)}>
            Simulate consent prompt
          </Button>
          {consentPresented ? (
            <div className="rounded-md border border-muted-foreground/30 p-3 text-sm">
              <p className="font-medium text-foreground">Privacy Notice</p>
              <p className="text-muted-foreground">
                This simulated banner represents how consent is captured in the production flow.
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => updateConsent(true)}>
                  Accept
                </Button>
                <Button size="sm" variant="outline" onClick={() => setConsentPresented(false)}>
                  Dismiss
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}