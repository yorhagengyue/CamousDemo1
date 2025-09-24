import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricGrid } from "@/features/dashboard/components/metric-grid";
import type { PrincipalDashboardPayload } from "@/types/dashboard";
import type { PrincipalDashboardFilters } from "@/lib/services/dashboard-service";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface PrincipalDashboardProps {
  data: PrincipalDashboardPayload;
  filters: PrincipalDashboardFilters;
  onFiltersChange: (filters: PrincipalDashboardFilters) => void;
}

const ACADEMIC_YEARS = ["2023/24", "2024/25"];
const TERMS = ["Term 1", "Term 2", "Term 3", "Term 4"];
const GRADES = ["All", "Sec 1", "Sec 2", "Sec 3", "Sec 4"];

export function PrincipalDashboard({ data, filters, onFiltersChange }: PrincipalDashboardProps) {
  const attendanceChartData = useMemo(() => data.attendanceSeries, [data.attendanceSeries]);
  const engagementChartData = useMemo(() => data.engagementSeries, [data.engagementSeries]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <Select
          value={filters.academicYear ?? ACADEMIC_YEARS[0]}
          onValueChange={(value) => onFiltersChange({ ...filters, academicYear: value })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Academic year" />
          </SelectTrigger>
          <SelectContent>
            {ACADEMIC_YEARS.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.term ?? TERMS[0]} onValueChange={(value) => onFiltersChange({ ...filters, term: value })}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Term" />
          </SelectTrigger>
          <SelectContent>
            {TERMS.map((term) => (
              <SelectItem key={term} value={term}>
                {term}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.grade ?? GRADES[0]}
          onValueChange={(value) => onFiltersChange({ ...filters, grade: value === "All" ? undefined : value })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            {GRADES.map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <MetricGrid metrics={data.kpis} columns={4} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip formatter={(value: number) => [`${value}%`, "Rate"] as [string, string]} />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daily Active Users</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementChartData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={40} />
                <Tooltip formatter={(value: number) => [`${value} users`, "DAU"] as [string, string]} />
                <Line type="monotone" dataKey="dau" stroke="hsl(var(--secondary-foreground))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Health Indicators</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {data.healthIndicators.map((indicator) => (
            <div key={indicator.id} className="rounded-lg border border-dashed border-muted-foreground/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{indicator.label}</span>
                <span className="text-lg font-semibold">{indicator.value}</span>
              </div>
              <p className="text-xs text-muted-foreground">Status: {indicator.status}</p>
              {indicator.description ? (
                <p className="mt-1 text-xs text-muted-foreground">{indicator.description}</p>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}