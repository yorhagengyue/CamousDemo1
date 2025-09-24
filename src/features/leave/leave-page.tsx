import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useLeaveOverview, useSubmitLeaveRequest, useUpdateLeaveStatus } from "@/hooks/use-attendance";

export function LeavePage() {
  const activeRole = useAuthStore((state) => state.user?.activeRole ?? "student");
  const leaveOverviewQuery = useLeaveOverview();
  const submitLeaveMutation = useSubmitLeaveRequest();
  const updateLeaveMutation = useUpdateLeaveStatus();

  const handleSubmitLeave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    submitLeaveMutation.mutate({
      requesterId: "me",
      requesterName: "Current User",
      type: formData.get("type") as "medical" | "personal" | "school",
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      comments: (formData.get("comments") as string) ?? ""
    });
    event.currentTarget.reset();
  };

  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="submit">Submit Request</TabsTrigger>
        {activeRole !== "student" ? <TabsTrigger value="approvals">Approvals</TabsTrigger> : null}
      </TabsList>

      <TabsContent value="overview" className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Requests</CardTitle>
            <CardDescription>Requests awaiting decision.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {leaveOverviewQuery.data?.activeRequests.length ? (
              leaveOverviewQuery.data.activeRequests.map((request) => (
                <div key={request.id} className="rounded-md border border-muted-foreground/30 p-3">
                  <p className="font-medium text-foreground">{request.type} leave</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Status: {request.status}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No active requests.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>Previously submitted requests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {leaveOverviewQuery.data?.history.map((request) => (
              <div key={request.id} className="rounded-md border border-muted-foreground/30 p-3">
                <p className="font-medium text-foreground">{request.type} leave</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">Status: {request.status}</p>
              </div>
            )) ?? <p className="text-muted-foreground">No history available.</p>}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="submit">
        <Card>
          <CardHeader>
            <CardTitle>Submit Leave Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleSubmitLeave}>
              <select name="type" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="medical">Medical</option>
                <option value="personal">Personal</option>
                <option value="school">School</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" name="startDate" required />
                <Input type="date" name="endDate" required />
              </div>
              <Textarea name="comments" placeholder="Reason or supporting notes" rows={4} />
              <Button type="submit" disabled={submitLeaveMutation.isPending}>
                {submitLeaveMutation.isPending ? "Submitting..." : "Submit request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      {activeRole !== "student" ? (
        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Requests waiting for your decision.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {leaveOverviewQuery.data?.approvalsQueue.length ? (
                leaveOverviewQuery.data.approvalsQueue.map((request) => (
                  <div key={request.id} className="rounded-md border border-muted-foreground/30 p-3">
                    <p className="font-medium text-foreground">{request.requesterName}</p>
                    <p className="text-xs text-muted-foreground">
                      {request.type} ? {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateLeaveMutation.mutate({ id: request.id, status: "approved" })}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateLeaveMutation.mutate({ id: request.id, status: "rejected" })}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No pending approvals.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      ) : null}
    </Tabs>
  );
}