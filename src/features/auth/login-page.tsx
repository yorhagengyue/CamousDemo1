import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Fingerprint, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLE_DEFINITIONS } from "@/config/rbac";
import { useAuthStore } from "@/store/auth-store";
import type { UserRole } from "@/types/auth";

const MOCK_IDENTITIES = {
  google: {
    id: "user-google",
    displayName: "Alex Tan",
    email: "alex.tan@example.edu",
    avatarUrl: "https://i.pravatar.cc/128?img=12"
  },
  singpass: {
    id: "user-singpass",
    displayName: "³ÂÑ©",
    email: "chenxue@example.edu",
    avatarUrl: "https://i.pravatar.cc/128?img=48"
  }
} as const;

export function LoginPage() {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);
  const [provider, setProvider] = useState<keyof typeof MOCK_IDENTITIES>("google");
  const [role, setRole] = useState<UserRole>("student");

  const availableRoles = useMemo(() => ROLE_DEFINITIONS.map((definition) => definition.role), []);

  const handleLogin = () => {
    const identity = MOCK_IDENTITIES[provider];
    signIn({
      ...identity,
      roles: availableRoles,
      activeRole: role,
      locale: provider === "google" ? "en" : "zh",
      consentAccepted: false
    });
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Sign in to Digital Campus</CardTitle>
          <CardDescription>
            Choose an identity provider and the demo role you want to explore.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3">
            <span className="text-sm font-medium text-muted-foreground">Identity Provider</span>
            <div className="grid gap-2 md:grid-cols-2">
              <Button
                variant={provider === "google" ? "default" : "outline"}
                className="flex items-center justify-between"
                onClick={() => setProvider("google")}
              >
                <span>Google Workspace</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
              <Button
                variant={provider === "singpass" ? "default" : "outline"}
                className="flex items-center justify-between"
                onClick={() => setProvider("singpass")}
              >
                <span>Singpass</span>
                <Fingerprint className="h-4 w-4 opacity-60" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Active Role</span>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((availableRole) => (
                  <SelectItem key={availableRole} value={availableRole}>
                    {availableRole.charAt(0).toUpperCase() + availableRole.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            <ShieldCheck className="mb-2 h-5 w-5" />
            This is a front-end only demo. Authentication, API calls, and data are simulated in the
            browser using mock services.
          </div>

          <Button className="w-full" size="lg" onClick={handleLogin}>
            Continue as {role.charAt(0).toUpperCase() + role.slice(1)}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}