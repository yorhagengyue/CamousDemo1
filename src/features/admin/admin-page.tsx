import { useState } from "react";
import { Plus, Unlink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAdminOverview,
  useAuditLogs,
  useIdentityBindings,
  useLinkIdentity,
  useUnlinkIdentity
} from "@/hooks/use-admin";

export function AdminPage() {
  const overviewQuery = useAdminOverview();
  const bindingsQuery = useIdentityBindings();
  const auditsQuery = useAuditLogs();
  const linkIdentityMutation = useLinkIdentity();
  const unlinkIdentityMutation = useUnlinkIdentity();
  const [provider, setProvider] = useState("google");

  const handleLinkIdentity = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    linkIdentityMutation.mutate({
      provider: formData.get("provider") as "google" | "singpass",
      externalId: formData.get("externalId") as string,
      userId: formData.get("userId") as string
    });
    event.currentTarget.reset();
  };

  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="bindings">Identity Bindings</TabsTrigger>
        <TabsTrigger value="audits">Audit Log</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
            <CardDescription>User provisioning snapshot.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Total users</span>
              <span className="font-medium">{overviewQuery.data?.totalUsers ?? "¡ª"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Active bindings</span>
              <span className="font-medium">{overviewQuery.data?.activeBindings ?? "¡ª"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pending approvals</span>
              <span className="font-medium">{overviewQuery.data?.pendingApprovals ?? "¡ª"}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {overviewQuery.data?.roleDistribution.map((role) => (
              <Badge key={role.role} variant="outline">
                {role.role} ? {role.count}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="bindings" className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Link Identity</CardTitle>
            <CardDescription>Associate external identities with platform accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleLinkIdentity}>
              <select
                name="provider"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={provider}
                onChange={(event) => setProvider(event.target.value)}
              >
                <option value="google">Google Workspace</option>
                <option value="singpass">Singpass</option>
              </select>
              <Input name="externalId" placeholder="External ID" required />
              <Input name="userId" placeholder="Internal user ID" required />
              <Button type="submit" disabled={linkIdentityMutation.isPending}>
                {linkIdentityMutation.isPending ? "Linking..." : <><Plus className="mr-2 h-4 w-4" /> Link identity</>}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Bindings</CardTitle>
            <CardDescription>Current identity provider associations.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72">
              <div className="space-y-3 text-sm">
                {bindingsQuery.data?.map((binding) => (
                  <div key={binding.id} className="rounded-md border border-muted-foreground/30 p-3">
                    <p className="font-medium text-foreground">{binding.provider.toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">External ID: {binding.externalId}</p>
                    <p className="text-xs text-muted-foreground">Linked at {new Date(binding.linkedAt).toLocaleString()}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-2 text-destructive"
                      onClick={() => unlinkIdentityMutation.mutate(binding.id)}
                    >
                      <Unlink className="mr-2 h-4 w-4" /> Unlink
                    </Button>
                  </div>
                )) ?? <p className="text-muted-foreground">No identity bindings configured.</p>}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="audits">
        <Card>
          <CardHeader>
            <CardTitle>Audit Trail</CardTitle>
            <CardDescription>Recent administrative events.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-3 text-sm">
                {auditsQuery.data?.map((entry) => (
                  <div key={entry.id} className="rounded-md border border-muted-foreground/30 p-3">
                    <p className="font-medium text-foreground">{entry.actorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.action} ? {entry.entity} ? {new Date(entry.timestamp).toLocaleString()}
                    </p>
                    <Separator className="my-2" />
                    <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
                      {JSON.stringify(entry.metadata, null, 2)}
                    </pre>
                  </div>
                )) ?? <p className="text-muted-foreground">No audit events recorded.</p>}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}