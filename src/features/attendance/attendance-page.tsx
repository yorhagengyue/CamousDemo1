import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAttendanceSession, useAttendanceSummary, useLeaveOverview, useMarkAttendance, useSubmitLeaveRequest } from "@/hooks/use-attendance";
import { useAuthStore } from "@/store/auth-store";
import type { AttendanceRecord, AttendanceStatus } from "@/types/attendance";

const ATTENDANCE_OPTIONS: AttendanceStatus[] = ["present", "absent", "late", "excused"];

export function AttendancePage() {
  const activeRole = useAuthStore((state) => state.user?.activeRole ?? "student");
  const summaryQuery = useAttendanceSummary({ enabled: ["teacher", "hod", "principal", "student"].includes(activeRole) });
  const leaveOverviewQuery = useLeaveOverview({ enabled: ["student", "teacher", "hod"].includes(activeRole) });
  const submitLeaveMutation = useSubmitLeaveRequest();
  const markAttendanceMutation = useMarkAttendance();

  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>(undefined);
  const sessionQuery = useAttendanceSession(selectedSessionId, { enabled: Boolean(selectedSessionId) });
  const [rosterState, setRosterState] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    if (!selectedSessionId && summaryQuery.data?.length) {
      setSelectedSessionId(summaryQuery.data[0].courseId);
    }
  }, [summaryQuery.data, selectedSessionId]);

  useEffect(() => {
    if (sessionQuery.data) {
      setRosterState(sessionQuery.data.roster);
    }
  }, [sessionQuery.data]);

  const handleRosterChange = (studentId: string, status: AttendanceStatus) => {
    setRosterState((prev) =>
      prev.map((record) => (record.studentId === studentId ? { ...record, status } : record))
    );
  };

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
    <Tabs defaultValue="summary">
      <TabsList className="mb-4">
        <TabsTrigger value="summary">Attendance Summary</TabsTrigger>
        <TabsTrigger value="session" disabled={!selectedSessionId}>
          Session Detail
        </TabsTrigger>
        <TabsTrigger value="leave">Leave Requests</TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Course Attendance</CardTitle>
            <CardDescription>Overview of attendance status by course.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead>Excused</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaryQuery.data?.map((summary) => (
                  <TableRow key={summary.courseId}>
                    <TableCell>{summary.courseTitle}</TableCell>
                    <TableCell>{summary.present}</TableCell>
                    <TableCell>{summary.absent}</TableCell>
                    <TableCell>{summary.late}</TableCell>
                    <TableCell>{summary.excused}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedSessionId(summary.courseId)}>
                        View latest session
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="session">
        <Card>
          <CardHeader>
            <CardTitle>{sessionQuery.data?.courseTitle ?? "Session"}</CardTitle>
            <CardDescription>
              {sessionQuery.data
                ? `${new Date(sessionQuery.data.date).toLocaleDateString()} ? ${sessionQuery.data.startTime} - ${sessionQuery.data.endTime}`
                : "Select a course from the summary to view its roster."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rosterState.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.studentName}</TableCell>
                    <TableCell>
                      <Select value={record.status} onValueChange={(value) => handleRosterChange(record.studentId, value as AttendanceStatus)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ATTENDANCE_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{record.notes ?? "¡ª"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              onClick={() =>
                selectedSessionId &&
                markAttendanceMutation.mutate({ sessionId: selectedSessionId, records: rosterState })
              }
              disabled={markAttendanceMutation.isPending || !selectedSessionId}
            >
              {markAttendanceMutation.isPending ? "Saving..." : "Submit attendance"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="leave" className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Submit Leave Request</CardTitle>
            <CardDescription>Students can file new leave requests here.</CardDescription>
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
        <Card>
          <CardHeader>
            <CardTitle>Leave History</CardTitle>
            <CardDescription>Recent leave requests and statuses.</CardDescription>
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
            )) ?? <p className="text-muted-foreground">No leave history available.</p>}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
