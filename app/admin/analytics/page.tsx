"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  ArrowUp, 
  ArrowDown,
  Target,
  Award,
  Clock
} from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@/lib/contexts/AuthContext"
import { useMemo, useState } from "react"
import dynamic from 'next/dynamic'

// Dynamically import chart components to avoid SSR issues
const SalaryTrendsChart = dynamic(
  () => import('@/components/admin/charts/salary-trends-chart').then(mod => ({ default: mod.SalaryTrendsChart })),
  { ssr: false }
)

const ApplicationTrendsChart = dynamic(
  () => import('@/components/admin/charts/application-trends-chart').then(mod => ({ default: mod.ApplicationTrendsChart })),
  { ssr: false }
)

export default function AdminAnalytics() {
  const { user } = useAuth()
  const [timePeriod, setTimePeriod] = useState("semester")
  
  // Get all analytics data from database
  const analyticsData = useQuery(api.queries.getAdminAnalytics, {
    collegeId: user?.profile?.collegeId,
  })

  const departmentData = useQuery(api.queries.getDepartmentAnalytics, {
    collegeId: user?.profile?.collegeId,
  })

  const topCompanies = useQuery(api.queries.getTopRecruitingCompanies, {
    collegeId: user?.profile?.collegeId,
    limit: 5,
  })

  const industryDistribution = useQuery(api.queries.getIndustryDistribution, {
    collegeId: user?.profile?.collegeId,
  })

  const applicationTrends = useQuery(api.queries.getApplicationTrends, {
    collegeId: user?.profile?.collegeId,
  })

  const salaryTrends = useQuery(api.queries.getSalaryTrends, {
    collegeId: user?.profile?.collegeId,
  })

  const loading = !analyticsData || !departmentData || !topCompanies || !industryDistribution

  // Calculate derived metrics
  const metrics = useMemo(() => {
    if (!analyticsData) return null

    const placementRate = analyticsData.totalStudents > 0 
      ? (analyticsData.studentsPlaced / analyticsData.totalStudents) * 100 
      : 0

    const internshipRate = analyticsData.totalStudents > 0
      ? (analyticsData.studentsInInternship / analyticsData.totalStudents) * 100
      : 0

    const applicationSuccessRate = analyticsData.totalApplications > 0
      ? ((analyticsData.studentsPlaced / analyticsData.totalApplications) * 100)
      : 0

    const avgApplicationsPerStudent = analyticsData.totalStudents > 0 
      ? analyticsData.totalApplications / analyticsData.totalStudents
      : 0

    return {
      placementRate: placementRate.toFixed(1),
      internshipRate: internshipRate.toFixed(1),
      applicationSuccessRate: applicationSuccessRate.toFixed(1),
      avgApplicationsPerStudent: avgApplicationsPerStudent.toFixed(1),
    }
  }, [analyticsData])

  const handleExportReport = () => {
    // Implement export functionality
    console.log("Exporting report...")
  }

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading analytics...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Real-time insights from your placement database</p>
          </div>
          <div className="flex gap-2">
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="semester">This Semester</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.placementRate}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{analyticsData?.studentsPlaced}/{analyticsData?.totalStudents} students</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Internship Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.internshipRate}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{analyticsData?.studentsInInternship} active internships</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.applicationSuccessRate}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>Applications to placements ratio</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Applications</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.avgApplicationsPerStudent}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>Per student average</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Overall Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Overall Statistics</CardTitle>
                  <CardDescription>Complete breakdown from database</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{analyticsData?.totalStudents}</div>
                      <div className="text-sm text-blue-800">Total Students</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{analyticsData?.studentsPlaced}</div>
                      <div className="text-sm text-green-800">Students Placed</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Placements</span>
                        <span className="text-sm">{metrics?.placementRate}%</span>
                      </div>
                      <Progress value={parseFloat(metrics?.placementRate || "0")} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Internships</span>
                        <span className="text-sm">{metrics?.internshipRate}%</span>
                      </div>
                      <Progress value={parseFloat(metrics?.internshipRate || "0")} className="bg-blue-100" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Metrics</CardTitle>
                  <CardDescription>Real student application data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold">{analyticsData?.totalApplications}</div>
                      <div className="text-xs text-muted-foreground">Total Applications</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">{analyticsData?.pendingApplications}</div>
                      <div className="text-xs text-muted-foreground">Pending Review</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">{metrics?.avgApplicationsPerStudent}</div>
                      <div className="text-xs text-muted-foreground">Avg per Student</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Success Rate</span>
                      <Badge variant="outline">{metrics?.applicationSuccessRate}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Opportunities</span>
                      <Badge variant="secondary">{analyticsData?.activeOpportunities}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Faculty Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Faculty Management</CardTitle>
                  <CardDescription>Real faculty statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{analyticsData?.totalFaculty}</div>
                      <div className="text-sm text-muted-foreground">Total Faculty</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{analyticsData?.activeFaculty}</div>
                      <div className="text-sm text-muted-foreground">Active Faculty</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Student-Faculty Ratio</span>
                      <span className="text-sm font-medium">
                        {analyticsData?.totalFaculty ? 
                          Math.round(analyticsData.totalStudents / analyticsData.totalFaculty) : 0}:1
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Internships</span>
                      <span className="text-sm font-medium">{analyticsData?.totalInternships}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Partnerships */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Partnerships</CardTitle>
                  <CardDescription>Real industry collaboration data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{analyticsData?.activeCompanies}</div>
                      <div className="text-sm text-muted-foreground">Active Partners</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{analyticsData?.pendingCompanies}</div>
                      <div className="text-sm text-muted-foreground">Pending Approval</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Verification Rate</span>
                      <span className="text-sm">
                        {analyticsData?.totalCompanies ? 
                          ((analyticsData.activeCompanies / analyticsData.totalCompanies) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <Progress value={
                      analyticsData?.totalCompanies ? 
                        (analyticsData.activeCompanies / analyticsData.totalCompanies) * 100 : 0
                    } />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <CardTitle>Department-wise Performance</CardTitle>
                <CardDescription>Real placement statistics by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentData?.map((dept) => (
                    <div key={dept.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{dept.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{dept.students} students</span>
                          <span>{dept.placed} placed</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold">{dept.rate.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">placement rate</div>
                        </div>
                        <div className="w-24">
                          <Progress value={dept.rate} />
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-4 text-muted-foreground">
                      No department data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Recruiting Companies</CardTitle>
                  <CardDescription>Real companies with highest hiring from your database</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topCompanies?.map((company, index) => (
                      <div key={company.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium">{company.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{company.hires}</div>
                          <div className="text-xs text-muted-foreground">hires</div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-4 text-muted-foreground">
                        No company data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Industry Distribution</CardTitle>
                  <CardDescription>Real placement data by industry sectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {industryDistribution?.map((industry) => (
                      <div key={industry.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{industry.name}</span>
                          <span>{industry.percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={industry.percentage} />
                      </div>
                    )) || (
                      <div className="text-center py-4 text-muted-foreground">
                        No industry data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <div className="grid gap-6">
              {/* Chart visualizations */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Salary Trends Over Time
                    </CardTitle>
                    <CardDescription>Yearly salary progression from placement data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SalaryTrendsChart data={salaryTrends || []} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Application Trends
                    </CardTitle>
                    <CardDescription>Monthly application vs success statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ApplicationTrendsChart data={applicationTrends || []} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}