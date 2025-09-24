import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { 
  Download, 
  FileText, 
  TrendingUp, 
  Calendar, 
  Users,
  BarChart3,
  RefreshCw,
  Filter,
  Eye
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricGrid } from "@/features/dashboard/components/metric-grid";
import { usePrincipalDashboard } from "@/hooks/use-dashboard-data";
import type { PrincipalDashboardFilters } from "@/lib/services/dashboard-service";

const YEARS = ["2023/24", "2024/25"];
const TERMS = ["Term 1", "Term 2", "Term 3", "Term 4"];
const GRADES = ["All", "Sec 1", "Sec 2", "Sec 3", "Sec 4"];

export function ReportsPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<PrincipalDashboardFilters>({});
  const [selectedReport, setSelectedReport] = useState<string>("overview");
  const reportQuery = usePrincipalDashboard(filters);
  const data = reportQuery.data;

  const handleExportReport = (format: string) => {
    alert(`Exporting ${selectedReport} report as ${format}. This would generate and download the report file.`);
  };

  const handleScheduleReport = () => {
    alert("Schedule Report: Configure automated report generation and delivery settings.");
  };

  const handleRefreshData = () => {
    reportQuery.refetch();
  };

  const reportTypes = [
    { id: "overview", label: "Executive Overview", icon: BarChart3 },
    { id: "academic", label: "Academic Performance", icon: TrendingUp },
    { id: "attendance", label: "Attendance Analysis", icon: Calendar },
    { id: "engagement", label: "Student Engagement", icon: Users }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {t("reports.academic")} Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for institutional decision making
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefreshData} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("actions.refresh")}
          </Button>
          <Button onClick={handleScheduleReport} variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button onClick={() => handleExportReport("PDF")} size="sm">
            <Download className="mr-2 h-4 w-4" />
            {t("actions.export")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Select
            value={filters.academicYear ?? YEARS[0]}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, academicYear: value }))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.term ?? TERMS[0]} onValueChange={(value) => setFilters((prev) => ({ ...prev, term: value }))}>
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
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, grade: value === "All" ? undefined : value }))
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Grade Level" />
            </SelectTrigger>
            <SelectContent>
              {GRADES.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => alert("Advanced filters: Date ranges, departments, custom criteria")}>
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
        </CardContent>
      </Card>

      <Tabs value={selectedReport} onValueChange={setSelectedReport}>
        <TabsList>
          {reportTypes.map((report) => (
            <TabsTrigger key={report.id} value={report.id} className="flex items-center gap-2">
              <report.icon className="h-4 w-4" />
              {report.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Metrics */}
          {data?.kpis && <MetricGrid title="Key Performance Indicators" metrics={data.kpis} columns={4} />}

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Attendance Trend</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleExportReport("attendance-trend")}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.attendanceSeries ?? []}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={40} />
                    <Tooltip formatter={(value: number) => [`${value}%`, "Attendance"] as [string, string]} />
                    <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Student Engagement</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleExportReport("engagement-trend")}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.engagementSeries ?? []}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={40} />
                    <Tooltip formatter={(value: number) => [`${value}`, "Daily Active Users"] as [string, string]} />
                    <Bar dataKey="dau" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Health Indicators */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Health Indicators</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => alert("Configure alert thresholds and monitoring settings")}>
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleExportReport("health-indicators")}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {data?.healthIndicators?.map((indicator) => (
                <div key={indicator.id} className="group rounded-lg border border-border/50 p-4 hover:border-border hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{indicator.label}</p>
                    <Badge 
                      variant={
                        indicator.status === "good" ? "success" : 
                        indicator.status === "warning" ? "warning" : "destructive"
                      }
                    >
                      {indicator.status}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold mb-1">{indicator.value}</p>
                  {indicator.description && (
                    <p className="text-xs text-muted-foreground">{indicator.description}</p>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 w-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => alert(`Detailed analysis for ${indicator.label}: View historical trends, contributing factors, and recommendations.`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </div>
              )) ?? (
                <div className="col-span-3 flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-sm">No health indicators data available for the selected filters.</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={handleRefreshData}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Data
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Overall GPA</span>
                </div>
                <div className="text-2xl font-bold">3.84</div>
                <div className="text-xs text-muted-foreground">+0.12 from last term</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Students Above 3.5</span>
                </div>
                <div className="text-2xl font-bold">82%</div>
                <div className="text-xs text-muted-foreground">Academic excellence</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Course Completion</span>
                </div>
                <div className="text-2xl font-bold">94%</div>
                <div className="text-xs text-muted-foreground">On-time completion rate</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Academic Performance Reports</h3>
              <p className="text-muted-foreground mb-4">
                Detailed academic analytics including grade distributions, subject performance, and student progress tracking.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => handleExportReport("academic-summary")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Summary
                </Button>
                <Button variant="outline" onClick={() => alert("Grade Distribution: View detailed grade breakdowns by subject and class")}>
                  View Grade Distribution
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Attendance Analytics</h3>
              <p className="text-muted-foreground mb-4">
                Comprehensive attendance tracking, patterns analysis, and early intervention alerts.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => handleExportReport("attendance-detailed")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Attendance Data
                </Button>
                <Button variant="outline" onClick={() => alert("Attendance Patterns: Analyze trends, identify at-risk students, and generate intervention reports")}>
                  Analyze Patterns
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Engagement Metrics</h3>
              <p className="text-muted-foreground mb-4">
                Student participation rates, digital platform usage, and learning activity analysis.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => handleExportReport("engagement-report")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Engagement Data
                </Button>
                <Button variant="outline" onClick={() => alert("Engagement Insights: Deep dive into student interaction patterns and platform usage statistics")}>
                  View Insights
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}