'use client'

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
} from "lucide-react"
import Link from "next/link"
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'

// Dynamically import Recharts components to avoid SSR issues
const RechartsComponent = dynamic(
  () => import('../../components/admin/recharts-component'),
  { ssr: false }
)

export default function AdminDashboard() {
  const [selectedYear, setSelectedYear] = useState<string>("ly")
  const [metrics, setMetrics] = useState<any | null>(null)
  const [departments, setDepartments] = useState<Array<{ name: string; total: number; placed: number; percentage: number }>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    // Pass the selected year as a query parameter
    fetch(`/api/admin/dashboard?year=${selectedYear}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load dashboard')
        return res.json()
      })
      .then((data) => {
        if (!isMounted) return
        setMetrics(data.metrics)
        setDepartments(data.departments || [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
    return () => { isMounted = false }
  }, [selectedYear]) // Add selectedYear to dependency array

  const barChartData = useMemo(() => {
    if (!departments?.length) return []
    return departments.map((dept) => ({
      name: dept.name,
      placed: dept.placed,
      unplaced: Math.max(dept.total - dept.placed, 0),
    }))
  }, [departments])

  const generateCSVReport = () => {
    console.log('Generating CSV report...')
  }

  const sendBulkEmail = () => {
    console.log('Sending bulk email...')
  }

  // Mock data for top opportunities
  const topOpportunities = [
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "TCS",
      applications: 45,
      status: "Active",
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "Infosys",
      applications: 32,
      status: "Active",
    },
    {
      id: 3,
      title: "Frontend Developer Intern",
      company: "Wipro",
      applications: 28,
      status: "Closing Soon",
    },
  ]

  // Mock data for placement trends
  const getPlacementTrendData = (tab: string) => {
    switch (tab) {
      case "internships":
        return [
          { month: "Jan", applications: 45, placements: 18 },
          { month: "Feb", applications: 52, placements: 22 },
          { month: "Mar", applications: 48, placements: 25 },
          { month: "Apr", applications: 61, placements: 30 },
          { month: "May", applications: 55, placements: 28 },
          { month: "Jun", applications: 67, placements: 35 },
        ]
      case "fulltime":
        return [
          { month: "Jan", applications: 22, placements: 12 },
          { month: "Feb", applications: 25, placements: 15 },
          { month: "Mar", applications: 28, placements: 18 },
          { month: "Apr", applications: 31, placements: 20 },
          { month: "May", applications: 29, placements: 19 },
          { month: "Jun", applications: 35, placements: 25 },
        ]
      case "companies":
        return [
          { month: "Jan", newCompanies: 5, activeCompanies: 42 },
          { month: "Feb", newCompanies: 7, activeCompanies: 49 },
          { month: "Mar", newCompanies: 6, activeCompanies: 55 },
          { month: "Apr", newCompanies: 8, activeCompanies: 63 },
          { month: "May", newCompanies: 4, activeCompanies: 67 },
          { month: "Jun", newCompanies: 9, activeCompanies: 76 },
        ]
      case "overview":
      default:
        return [
          { month: "Jan", total: 67, placed: 30 },
          { month: "Feb", total: 77, placed: 37 },
          { month: "Mar", total: 76, placed: 43 },
          { month: "Apr", total: 92, placed: 50 },
          { month: "May", total: 84, placed: 47 },
          { month: "Jun", total: 102, placed: 60 },
        ]
    }
  }

  // Fallback UI values while loading
  const safeMetrics = metrics ?? {
    totalStudents: 0,
    activeCompanies: 0,
    studentsPlaced: 0,
    studentsInInternship: 0,
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Placement Cell Dashboard</h1>
            <p className="text-muted-foreground">Overview of campus internship and placement activities</p>
          </div>
          <div className="flex gap-2">

          </div>
        </div>

        {/* Year Filter */}
        <div className="flex justify-start">
          <div className="w-40">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FY">FY</SelectItem>
                <SelectItem value="SY">SY</SelectItem>
                <SelectItem value="TY">TY</SelectItem>
                <SelectItem value="LY">LY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeMetrics.totalStudents}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-500" />
                +12% from last semester
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeMetrics.activeCompanies}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-500" />
                +8 new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students Placed</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeMetrics.studentsPlaced}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-500" />
                +15% from last semester
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students placed in internship</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeMetrics.studentsInInternship ?? 0}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-500" />
                +22% from last year
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left Column - Charts and Top Opportunities */}
          <div className="lg:col-span-2 space-y-4">
            {/* Placement Chart */}
            <Card className="h-[500px]">
              <CardHeader>
                <CardTitle>Placed vs Unplaced Students</CardTitle>
                <CardDescription>Visualization of student placement status by department</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 h-[calc(100%-60px)]">
                <RechartsComponent data={barChartData} />
              </CardContent>
            </Card>

            {/* Top Opportunities - Added below the graph */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Opportunities</CardTitle>
                    <CardDescription>Most popular internship opportunities</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {topOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{opportunity.title}</h4>
                      <p className="text-sm text-muted-foreground">{opportunity.company}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={opportunity.status === "Active" ? "default" : "destructive"}
                      >
                        {opportunity.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {opportunity.applications} apps
                      </span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/admin/opportunities">View All Opportunities</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Placement Trends */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Placement Trends</CardTitle>
                <CardDescription>Monthly placement statistics for the current academic year</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Tabs defaultValue="overview" className="space-y-3">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="internships">Internships</TabsTrigger>
                    <TabsTrigger value="fulltime">Full-time</TabsTrigger>
                    <TabsTrigger value="companies">Companies</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-3">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-primary">456</div>
                        <p className="text-sm text-muted-foreground">Total Applications</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-500">234</div>
                        <p className="text-sm text-muted-foreground">Successful Placements</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-purple-500">89</div>
                        <p className="text-sm text-muted-foreground">Partner Companies</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="internships" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-500">189</div>
                        <p className="text-sm text-muted-foreground">Internship Applications</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-500">124</div>
                        <p className="text-sm text-muted-foreground">Successful Placements</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-orange-500">65</div>
                        <p className="text-sm text-muted-foreground">Pending Interviews</p>
                      </div>
                    </div>
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Internship placement data shows a 15% increase from last semester.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="fulltime" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-500">78</div>
                        <p className="text-sm text-muted-foreground">Full-time Applications</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-500">52</div>
                        <p className="text-sm text-muted-foreground">Successful Placements</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-orange-500">26</div>
                        <p className="text-sm text-muted-foreground">Pending Interviews</p>
                      </div>
                    </div>
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Full-time placement data shows steady growth with a 8% increase from last year.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="companies" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-500">142</div>
                        <p className="text-sm text-muted-foreground">Total Companies</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-500">89</div>
                        <p className="text-sm text-muted-foreground">Active Partnerships</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-purple-500">23</div>
                        <p className="text-sm text-muted-foreground">New This Semester</p>
                      </div>
                    </div>
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Company partnership data shows strong growth with 3 new major tech partners.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4">
            {/* Department-wise Placement Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Department-wise Placement Statistics</CardTitle>
                <CardDescription>Placement rates by academic department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {departments.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{dept.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {dept.placed}/{dept.total} ({dept.percentage}%)
                      </span>
                    </div>
                    <Progress value={dept.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Companies */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Top Recruiting Companies</CardTitle>
                <CardDescription>Most active companies this semester</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: "TCS", positions: 12, logo: "TC" },
                  { name: "Infosys", positions: 8, logo: "IS" },
                  { name: "Wipro", positions: 6, logo: "WP" },
                  { name: "Tech Mahindra", positions: 5, logo: "TM" },
                  { name: "HCL Technologies", positions: 4, logo: "HCL" },
                ].map((company, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={`/placeholder-icon.png?height=32&width=32&text=${company.logo}`} />
                      <AvatarFallback className="text-xs">{company.logo}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{company.name}</p>
                      <p className="text-xs text-muted-foreground">{company.positions} positions</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href="/admin/companies">View All Companies</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Applications Today</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Interviews Scheduled</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Offers Extended</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Offers Accepted</span>
                  <span className="font-medium">3</span>
                </div>
              </CardContent>
            </Card>

            {/* Report Generation - Added to the sidebar */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Report Generation</CardTitle>
                <CardDescription>Export data and communicate with students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={generateCSVReport}
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Generate CSV Report
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={sendBulkEmail}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Bulk Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}