import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Download, Upload, Filter, RefreshCw, Eye, Edit } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useStudents } from "@/hooks/use-profiles";

const GRADE_OPTIONS = ["All", "Sec 1", "Sec 2", "Sec 3", "Sec 4"];
const STATUS_OPTIONS = ["All", "Active", "Inactive", "Graduated"];

export function StudentListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [page, setPage] = useState(1);

  const studentsQuery = useStudents({
    search: search || undefined,
    grade: grade !== "All" ? grade : undefined,
    page,
    pageSize: 10
  });

  const handleExportData = () => {
    alert("Export functionality: Download student data as CSV/Excel file");
  };

  const handleImportData = () => {
    alert("Import functionality: Upload bulk student data from file");
  };

  const handleAddStudent = () => {
    alert("Add Student: Open registration form for new student");
  };

  const handleRefresh = () => {
    studentsQuery.refetch();
  };

  const handleBulkAction = (action: string) => {
    alert(`Bulk ${action}: Perform action on selected students`);
  };

  const handleEditStudent = (student: any) => {
    alert(`Edit Student: Open edit form for ${student.displayName}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {t("students.profile")} Directory
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage and view comprehensive student information and records
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleAddStudent} size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              {t("actions.add")} Student
            </Button>
            <Button onClick={handleExportData} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {t("actions.export")}
            </Button>
            <Button onClick={handleImportData} variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              {t("actions.import")}
            </Button>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("actions.refresh")}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Filters Section */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or email"
                className="w-64 pl-9"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={grade}
              onValueChange={(value) => {
                setGrade(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Grade level" />
              </SelectTrigger>
              <SelectContent>
                {GRADE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => alert("Advanced filters coming soon!")}>
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          <Separator />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-3">
              <div className="text-2xl font-bold">1,234</div>
              <div className="text-xs text-muted-foreground">Total Students</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-2xl font-bold">1,180</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-2xl font-bold">45</div>
              <div className="text-xs text-muted-foreground">New This Month</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-2xl font-bold">94.2%</div>
              <div className="text-xs text-muted-foreground">Avg Attendance</div>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Bulk Actions:</span>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction("email")}>
              Send Email
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction("export")}>
              Export Selected
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction("update")}>
              Update Status
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <input type="checkbox" className="rounded" />
                </TableHead>
                <TableHead>Student Information</TableHead>
                <TableHead>Grade & Class</TableHead>
                <TableHead>Advisor</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsQuery.data?.data.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/50">
                  <TableCell>
                    <input type="checkbox" className="rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                        {student.displayName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{student.displayName}</span>
                        <span className="text-xs text-muted-foreground">{student.email}</span>
                        <span className="text-xs text-muted-foreground">ID: {student.studentNumber}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{student.gradeLevel ?? "—"}</span>
                      <span className="text-xs text-muted-foreground">Class A</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.advisorName ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        (student.attendanceRate ?? 0) >= 90 ? 'text-green-600' : 
                        (student.attendanceRate ?? 0) >= 75 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {student.attendanceRate ? `${Math.round(student.attendanceRate)}%` : "—"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/students/${student.id}`)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditStudent(student)}
                        title="Edit Student"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, studentsQuery.data?.total ?? 0)} of {studentsQuery.data?.total ?? 0} results
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                disabled={page === 1} 
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">Page {page}</span>
              <Button
                variant="ghost"
                size="sm"
                disabled={(studentsQuery.data?.data.length ?? 0) < 10}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}