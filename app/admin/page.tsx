"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Plus,
  Mail,
  FileDown,
  DollarSign,
  Target,
  Award,
  GraduationCap,
  ChevronUp,
  ChevronDown,
  MessageCircle,
  Eye,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
// Dynamically import chart components
const DepartmentStackedBarChart = dynamic(
  () =>
    import("@/components/admin/recharts-component").then((mod: any) => ({
      default: mod.DepartmentStackedBarChart,
    })),
  { ssr: false }
);

const DepartmentCTCChart = dynamic(
  () =>
    import("@/components/admin/recharts-component").then((mod: any) => ({
      default: mod.DepartmentCTCChart,
    })),
  { ssr: false }
);

export default function AdminDashboard() {
  const { user, refreshProfile } = useAuth();
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [metrics, setMetrics] = useState<any | null>(null);
  const [departments, setDepartments] = useState<
    Array<{
      name: string;
      total: number;
      placed: number;
      percentage: number;
      code: string;
    }>
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  // CSV Report Dialog State
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportOptions, setReportOptions] = useState({
    // Student Status Filters - simplified to only placement status
    studentStatus: "both", // "placed", "not-placed", "both"

    // Filters
    filterByYear: selectedYear,
    filterByDepartment: "All",

    // Privacy Options
    includeContactInfo: false,
    includePersonalInfo: true,

    // Placement Details (for placed students)
    includeCompanyDetails: true,
    includePackageDetails: true,
    includeRoleDetails: true,
    includeLocationDetails: true,
  });

  // Get collegeId from the correct location
  const collegeId = user?.collegeId || user?.profile?.collegeId;

  // Fetch CSV report data using the new comprehensive query
  const csvReportData = useQuery(
    api.queries.getCSVReportData,
    collegeId
      ? {
          collegeId: collegeId as any,
          ...reportOptions,
        }
      : "skip"
  );

  // Fetch real data from Convex
  const analyticsData = useQuery(
    api.queries.getAdminAnalytics,
    collegeId ? { collegeId: collegeId as any, year: selectedYear } : "skip"
  );

  console.log("Analytics data:", analyticsData);
  const departmentData = useQuery(
    api.queries.getDepartmentAnalytics,
    collegeId ? { collegeId: collegeId as any, year: selectedYear } : "skip"
  );

  const topCompaniesData = useQuery(
    api.queries.getTopRecruitingCompanies,
    collegeId ? { collegeId: collegeId as any, limit: 5 } : "skip"
  );

  const topOpportunitiesData = useQuery(
    api.queries.getTopOpportunities,
    collegeId ? { collegeId: collegeId as any, limit: 3 } : "skip"
  );

  const quickStatsData = useQuery(
    api.queries.getQuickStats,
    collegeId ? { collegeId: collegeId as any } : "skip"
  );

  // NEW: CTC and Offers Analytics
  const ctcAnalyticsData = useQuery(
    api.queries.getCTCAnalytics,
    collegeId ? { collegeId: collegeId as any, year: selectedYear } : "skip"
  );

  const departmentCTCData = useQuery(
    api.queries.getDepartmentWiseCTCAnalytics,
    collegeId ? { collegeId: collegeId as any, year: selectedYear } : "skip"
  );

  // Recent students for dashboard
  const recentStudentsData = useQuery(
    api.queries.getStudents,
    collegeId
      ? {
          collegeId: collegeId as any,
          take: 5,
          skip: 0,
        }
      : "skip"
  );
  // Update metrics and departments when data loads
  useEffect(() => {
    console.log("Analytics data received:", analyticsData);
    if (analyticsData) {
      setMetrics({
        totalStudents: analyticsData.totalStudents || 0,
        activeCompanies: analyticsData.verifiedCompanies || 0,
        studentsPlaced: analyticsData.studentsPlaced || 0,
        studentsInInternship: analyticsData.studentsInInternship || 0,
      });
    }
  }, [analyticsData]);

  // Update metrics and departments when data loads
  useEffect(() => {
    console.log("Department data received:", departmentData);
    if (departmentData) {
      setDepartments(
        departmentData.map((dept) => ({
          name: dept.name,
          code: dept.code || dept.name.substring(0, 3).toUpperCase(),
          total: dept.total,
          placed: dept.placed,
          percentage: dept.percentage,
        }))
      );
    }
  }, [departmentData]);

  const barChartData = useMemo(() => {
    if (!departments?.length) return [];
    return departments.map((dept) => ({
      name: dept.name,
      students: dept.total,
      placed: dept.placed,
      rate: dept.percentage,
    }));
  }, [departments]);

  // Set loading state
  useEffect(() => {
    setLoading(!analyticsData || !departmentData);
  }, [analyticsData, departmentData]);

  // Compute data for charts
  const departmentChartData = useMemo(() => {
    if (!departments?.length) return [];
    return departments.map((d) => ({
      label: d.code,
      name: d.name,
      placed: Number(d.placed) || 0,
      unplaced: Math.max(0, Number(d.total || 0) - Number(d.placed || 0)),
    }));
  }, [departments]);

  const departmentCTCChartData = useMemo(() => {
    if (!departmentCTCData?.length) return [];
    return departmentCTCData.map((d) => ({
      code: d.code,
      department: d.department,
      avgPackage: d.averagePackage || 0,
      highestPackage: d.highestPackage || 0,
      placementPercentage: d.placementPerApplication || 0,
    }));
  }, [departmentCTCData]);

  const generateCSVReport = async () => {
    try {
      if (!csvReportData) {
        console.error("No CSV report data available");
        return;
      }

      const reportData: any[] = [];

      // Students Data with enhanced filtering
      if (csvReportData.students) {
        csvReportData.students.forEach((student: any) => {
          // Apply student status filter
          const shouldIncludeStudent =
            reportOptions.studentStatus === "both" ||
            (reportOptions.studentStatus === "placed" && student.isPlaced) ||
            (reportOptions.studentStatus === "not-placed" && !student.isPlaced);

          if (!shouldIncludeStudent) return;

          const baseStudentRow: any = {
            Name: student.fullName,
            "Roll Number": student.rollNumber,
            Department: student.department,
            Year: student.year,
            CGPA: student.cgpa || "N/A",
            "10th Percentage": student.tenthPercentage || "N/A",
            "12th Percentage": student.twelfthPercentage || "N/A",
            Status: student.isPlaced ? "Placed" : "Not Placed",
            "Total Applications": student.applications || 0,
            "Total Offers": student.totalOffers || 0,
          };

          // Add contact info if requested
          if (reportOptions.includeContactInfo) {
            baseStudentRow.Email = student.email || "N/A";
            baseStudentRow.Phone = student.phone || "N/A";
          }

          // Add skills if personal info is requested
          if (reportOptions.includePersonalInfo) {
            baseStudentRow.Skills = Array.isArray(student.skills)
              ? student.skills.join(", ")
              : "N/A";
          }

          // Handle placement details for placed students
          if (student.isPlaced && student.placementDetails?.length > 0) {
            student.placementDetails.forEach((placement: any) => {
              const placementRow = { ...baseStudentRow };

              // Add placement details based on options
              if (reportOptions.includeCompanyDetails) {
                placementRow["Company Name"] = placement.companyName || "N/A";
              }
              if (reportOptions.includePackageDetails) {
                placementRow["Package (LPA)"] = placement.package || "N/A";
              }
              if (reportOptions.includeRoleDetails) {
                placementRow.Role = placement.role || "N/A";
              }
              if (reportOptions.includeLocationDetails) {
                placementRow.Location = placement.location || "N/A";
              }

              reportData.push(placementRow);
            });
          } else {
            // For non-placed students, only add empty placement columns if they're requested
            if (reportOptions.includeCompanyDetails) {
              baseStudentRow["Company Name"] = "";
            }
            if (reportOptions.includePackageDetails) {
              baseStudentRow["Package (LPA)"] = "";
            }
            if (reportOptions.includeRoleDetails) {
              baseStudentRow.Role = "";
            }
            if (reportOptions.includeLocationDetails) {
              baseStudentRow.Location = "";
            }
            reportData.push(baseStudentRow);
          }
        });
      }

      // Generate CSV
      if (reportData.length === 0) {
        alert("No data available for the selected filters.");
        return;
      }

      const headers = Object.keys(reportData[0]);
      const csvContent = [
        headers.join(","),
        ...reportData.map((row: any) =>
          headers
            .map((header) => {
              const value = row[header] || "";
              return typeof value === "string" && value.includes(",")
                ? `"${value}"`
                : value;
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);

      // Generate filename based on report type and filters
      const reportType = "student";
      const statusFilter =
        reportOptions.studentStatus !== "both"
          ? `_${reportOptions.studentStatus}`
          : "";
      const yearFilter =
        reportOptions.filterByYear !== "All"
          ? `_${reportOptions.filterByYear.replace(" ", "")}`
          : "";
      const deptFilter =
        reportOptions.filterByDepartment !== "All"
          ? `_${reportOptions.filterByDepartment.replace(" ", "")}`
          : "";

      link.setAttribute(
        "download",
        `${reportType}_placement_report${statusFilter}${yearFilter}${deptFilter}_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsReportDialogOpen(false);
    } catch (error) {
      console.error("Error generating CSV report:", error);
      alert("Error generating report. Please try again.");
    }
  };

  const sendBulkEmail = () => {
    console.log("Sending bulk email...");
  };

  // Show loading state if no collegeId
  if (!collegeId) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">
            College ID not found. Please contact support.
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Dynamic top opportunities with fallback - use fallback if data is undefined, null, or empty array
  const topOpportunities =
    topOpportunitiesData && topOpportunitiesData.length > 0
      ? topOpportunitiesData
      : [
          {
            id: 1,
            title: "Software Engineering Intern",
            company: "TechCorp",
            applications: 45,
            status: "Active" as const,
          },
          {
            id: 2,
            title: "Data Analyst",
            company: "DataInc",
            applications: 32,
            status: "Active" as const,
          },
        ];

  // Enhanced SafeMetrics with backend data
  const safeMetrics = {
    totalStudents: metrics?.totalStudents || 0,
    activeCompanies: metrics?.activeCompanies || 0,
    studentsPlaced: metrics?.studentsPlaced || 0,
    studentsInInternship: metrics?.studentsInInternship || 0,
    newCompanies: metrics?.newCompanies || 0,
  };

  // Mock companies fallback - use fallback if data is undefined, null, or empty array
  const topCompanies =
    topCompaniesData && topCompaniesData.length > 0
      ? topCompaniesData
      : ["No Companies Found"]
  console.log("Top companies data structure:", topCompaniesData);
  console.log("Final topCompanies array:", topCompanies);

  // Dynamic quick stats with fallback
  const quickStats = quickStatsData || {
    totalApplications: 23,
    pendingApplications: 8,
    totalStudents: 5,
    placedStudents: 3,
  };

  // CTC and Offers data with fallbacks
  const ctcStats = ctcAnalyticsData || {
    totalOffers: 0,
    averagePackage: 0,
    highestPackage: 0,
    lowestPackage: 0,
    below5LPA: 0,
    between5to10LPA: 0,
    between0LPA15LPA: 0,
    between15LPAand20LPA: 0,
    above20LPA: 0,
  };

  const departmentCTCStats = departmentCTCData || [];
  const offersStats = {
    totalApplications: analyticsData?.totalApplications || 0,
    totalOffers: ctcAnalyticsData?.totalOffers || 0,
    internshipOffers: Math.floor((ctcAnalyticsData?.totalOffers || 0) * 0.6), // Estimate
    jobOffers: Math.floor((ctcAnalyticsData?.totalOffers || 0) * 0.4), // Estimate
    overallConversionRate: analyticsData?.applicationSuccessRate || 0,
  };

  // Format currency helper
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage students, companies, and track placement progress
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Years</SelectItem>
                <SelectItem value="First Year">First Year</SelectItem>
                <SelectItem value="Second Year">Second Year</SelectItem>
                <SelectItem value="Third Year">Third Year</SelectItem>
                <SelectItem value="Final Year">Final Year</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Dialog
                open={isReportDialogOpen}
                onOpenChange={setIsReportDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <FileDown className="w-4 h-4 mr-2" />
                    Generate CSV Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Generate CSV Report</DialogTitle>
                    <DialogDescription>
                      Generate a student placement report with filtering options
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Student Status Filter */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Student Status</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="both-students"
                            name="studentStatus"
                            value="both"
                            checked={reportOptions.studentStatus === "both"}
                            onChange={(e) =>
                              setReportOptions((prev) => ({
                                ...prev,
                                studentStatus: e.target.value,
                              }))
                            }
                            className="w-4 h-4"
                          />
                          <Label htmlFor="both-students">All Students</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="placed-students"
                            name="studentStatus"
                            value="placed"
                            checked={reportOptions.studentStatus === "placed"}
                            onChange={(e) =>
                              setReportOptions((prev) => ({
                                ...prev,
                                studentStatus: e.target.value,
                              }))
                            }
                            className="w-4 h-4"
                          />
                          <Label htmlFor="placed-students">
                            Placed Students
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="not-placed-students"
                            name="studentStatus"
                            value="not-placed"
                            checked={
                              reportOptions.studentStatus === "not-placed"
                            }
                            onChange={(e) =>
                              setReportOptions((prev) => ({
                                ...prev,
                                studentStatus: e.target.value,
                              }))
                            }
                            className="w-4 h-4"
                          />
                          <Label htmlFor="not-placed-students">
                            Not Placed Students
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Filters</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="yearFilter">Academic Year</Label>
                          <Select
                            value={reportOptions.filterByYear}
                            onValueChange={(value) =>
                              setReportOptions((prev) => ({
                                ...prev,
                                filterByYear: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">All Years</SelectItem>
                              <SelectItem value="First Year">
                                First Year
                              </SelectItem>
                              <SelectItem value="Second Year">
                                Second Year
                              </SelectItem>
                              <SelectItem value="Third Year">
                                Third Year
                              </SelectItem>
                              <SelectItem value="Final Year">
                                Final Year
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="departmentFilter">Department</Label>
                          <Select
                            value={reportOptions.filterByDepartment}
                            onValueChange={(value) =>
                              setReportOptions((prev) => ({
                                ...prev,
                                filterByDepartment: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">
                                All Departments
                              </SelectItem>
                              {departments.map((dept) => (
                                <SelectItem key={dept.name} value={dept.name}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Privacy Options */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Additional Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="contactInfo"
                            checked={reportOptions.includeContactInfo}
                            onCheckedChange={(checked) =>
                              setReportOptions((prev) => ({
                                ...prev,
                                includeContactInfo: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="contactInfo">
                            Include Contact Information (Email, Phone)
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="personalInfo"
                            checked={reportOptions.includePersonalInfo}
                            onCheckedChange={(checked) =>
                              setReportOptions((prev) => ({
                                ...prev,
                                includePersonalInfo: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="personalInfo">
                            Include Academic Records (10th, 12th, Skills)
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Placement Details (only show for placed students or all students) */}
                    {(reportOptions.studentStatus === "placed" ||
                      reportOptions.studentStatus === "both") && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Placement Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="companyDetails"
                              checked={reportOptions.includeCompanyDetails}
                              onCheckedChange={(checked) =>
                                setReportOptions((prev) => ({
                                  ...prev,
                                  includeCompanyDetails: checked as boolean,
                                }))
                              }
                            />
                            <Label htmlFor="companyDetails">Company Name</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="packageDetails"
                              checked={reportOptions.includePackageDetails}
                              onCheckedChange={(checked) =>
                                setReportOptions((prev) => ({
                                  ...prev,
                                  includePackageDetails: checked as boolean,
                                }))
                              }
                            />
                            <Label htmlFor="packageDetails">
                              Package (CTC)
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="roleDetails"
                              checked={reportOptions.includeRoleDetails}
                              onCheckedChange={(checked) =>
                                setReportOptions((prev) => ({
                                  ...prev,
                                  includeRoleDetails: checked as boolean,
                                }))
                              }
                            />
                            <Label htmlFor="roleDetails">Job Role/Title</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="locationDetails"
                              checked={reportOptions.includeLocationDetails}
                              onCheckedChange={(checked) =>
                                setReportOptions((prev) => ({
                                  ...prev,
                                  includeLocationDetails: checked as boolean,
                                }))
                              }
                            />
                            <Label htmlFor="locationDetails">
                              Job Location
                            </Label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsReportDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={generateCSVReport}>
                        <FileDown className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={sendBulkEmail}>
                <Mail className="w-4 h-4 mr-2" />
                Send Bulk Email
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {safeMetrics.totalStudents}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-500" />
                {analyticsData?.totalStudents && "+12%"} from last year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Companies
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {safeMetrics.activeCompanies}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-500" />+{8} new this
                month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Students Placed
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {safeMetrics.studentsPlaced}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-500" />
                {analyticsData?.placementRate?.toFixed(1) || "0"}% placement
                rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Salary Trends
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(ctcAnalyticsData?.highestPackage || 0)}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                Average: {formatCurrency(ctcAnalyticsData?.averagePackage || 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Internships
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {safeMetrics.studentsInInternship}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-500" />
                {analyticsData?.studentsInInternship || 0} active internships
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-2 md:grid-cols-3">
          {/* Left Column - Main Dashboard */}
          <div className="md:col-span-2 space-y-2">
            {/* Enhanced Department Analytics - Side by Side Charts */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Department Performance - 100% Stacked Bar Chart */}
              <Card>
                <CardContent>
                  {departments.length > 0 && (
                    <div className="h-80">
                      <DepartmentStackedBarChart data={departmentChartData} />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Department CTC Statistics - Lollipop + Line Chart */}
              <Card>
                <CardContent>
                  {departmentCTCChartData.length > 0 && (
                    <div className="h-80">
                      <DepartmentCTCChart data={departmentCTCChartData} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Top Opportunities */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Top Opportunities</CardTitle>
                <CardDescription>
                  Most applied opportunities this month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topOpportunities.map((opportunity: any) => (
                  <div
                    key={opportunity.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{opportunity.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {opportunity.company}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {opportunity.applications} apps
                        </Badge>
                        <Badge
                          variant={
                            opportunity.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {opportunity.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4">
            {/* CTC Range Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Package Distribution</CardTitle>
                <CardDescription>Salary breakdown by ranges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(ctcStats.averagePackage || 0)}
                    </div>
                    <div className="text-sm text-green-800">
                      Average Package
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(ctcStats.highestPackage || 0)}
                    </div>
                    <div className="text-sm text-blue-800">Highest Package</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Below ₹5 LPA</span>
                    <Badge variant="outline">{ctcStats.below5LPA || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">₹5-10 LPA</span>
                    <Badge variant="outline">
                      {ctcStats.between5to10LPA || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">₹10-15 LPA</span>
                    <Badge variant="outline">
                      {ctcStats.between0LPA15LPA || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">₹15-20 LPA</span>
                    <Badge variant="outline">
                      {ctcStats.between15LPAand20LPA || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Above ₹20 LPA</span>
                    <Badge variant="outline">{ctcStats.above20LPA || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Recruiting Companies */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Top Recruiting Companies</CardTitle>
                <CardDescription>
                  Companies hiring most students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topCompanies.slice(0, 5).map((company: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-bold">
                        {typeof company.logo === "string"
                          ? company.logo
                          : typeof company.name === "string"
                          ? company.name?.charAt(0)
                          : "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {typeof company.name === "string"
                          ? company.name
                          : typeof company.name === "object" &&
                            company.name?.name
                          ? company.name.name
                          : "Unknown Company"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {company.hires || company.positions} positions
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Today's Activity</CardTitle>
                <CardDescription>
                  Quick overview of today's metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Applications
                  </span>
                  <span className="font-medium">
                    {quickStats.totalApplications}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Pending Applications
                  </span>
                  <span className="font-medium">
                    {quickStats.pendingApplications}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Students Placed
                  </span>
                  <span className="font-medium">
                    {quickStats.placedStudents}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Students
                  </span>
                  <span className="font-medium">
                    {quickStats.totalStudents}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
