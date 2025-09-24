import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTeachers } from "@/hooks/use-profiles";

const DEPARTMENT_OPTIONS = ["All", "Science", "Mathematics", "Languages", "Humanities", "Arts"];

export function TeacherListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string>("All");
  const [page, setPage] = useState(1);

  const teachersQuery = useTeachers({
    search: search || undefined,
    department: department !== "All" ? department : undefined,
    page,
    pageSize: 10
  });

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Teacher Directory</CardTitle>
          <p className="text-sm text-muted-foreground">View teaching allocations and contact information.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name"
              className="w-64 pl-9"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={department}
            onValueChange={(value) => {
              setDepartment(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachersQuery.data?.data.map((teacher) => (
              <TableRow key={teacher.id} className="cursor-pointer" onClick={() => navigate(`/teachers/${teacher.id}`)}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{teacher.displayName}</span>
                    <span className="text-xs text-muted-foreground">{teacher.email}</span>
                  </div>
                </TableCell>
                <TableCell>{teacher.department}</TableCell>
                <TableCell>{teacher.subjects.join(", ")}</TableCell>
                <TableCell>{teacher.yearsOfExperience} yrs</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {teacher.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">Page {page}</span>
          <Button
            variant="ghost"
            size="sm"
            disabled={(teachersQuery.data?.data.length ?? 0) < 10}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}