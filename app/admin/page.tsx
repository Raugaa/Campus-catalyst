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
} from "lucide-react"
import Link from "next/link"
import dynamic from 'next/dynamic'
import { useState } from 'react'

// Dynamically import Recharts components to avoid SSR issues
import RechartsComponent from '../../components/admin/recharts-component'

export default function AdminDashboard() {
  const [selectedYear, setSelectedYear] = useState<string>("ly")

  // Mock data that changes based on selected year
  const getDepartmentStats = () => {
    switch (selectedYear) {
      case "fy":
        return [
          { department: "Computer Science", placed: 35, total: 180, rate: 19 },
          { department: "Electrical Engineering", placed: 25, total: 120, rate: 21 },
          { department: "Mechanical Engineering", placed: 20, total: 95, rate: 21 },
          { department: "Information Technology", placed: 22, total: 100, rate: 22 },
          { department: "Electronics & Communication", placed: 15, total: 85, rate: 18 },
        ]
      case "sy":
        return [
          { department: "Computer Science", placed: 75, total: 180, rate: 42 },
          { department: "Electrical Engineering", placed: 55, total: 120, rate: 46 },
          { department: "Mechanical Engineering", placed: 45, total: 95, rate: 47 },
          { department: "Information Technology", placed: 50, total: 100, rate: 50 },
          { department: "Electronics & Communication", placed: 35, total: 85, rate: 41 },
        ]
      case "ty":
        return [
          { department: "Computer Science", placed: 110, total: 180, rate: 61 },
          { department: "Electrical Engineering", placed: 75, total: 120, rate: 63 },
          { department: "Mechanical Engineering", placed: 60, total: 95, rate: 63 },
          { department: "Information Technology", placed: 65, total: 100, rate: 65 },
          { department: "Electronics & Communication", placed: 45, total: 85, rate: 53 },
        ]
      case "ly":
      default:
        return [
          { department: "Computer Science", placed: 145, total: 180, rate: 81 },
          { department: "Electrical Engineering", placed: 89, total: 120, rate: 74 },
          { department: "Mechanical Engineering", placed: 67, total: 95, rate: 71 },
          { department: "Information Technology", placed: 78, total: 100, rate: 78 },
          { department: "Electronics & Communication", placed: 56, total: 85, rate: 66 },
        ]
    }
  }

  const getMetricsData = () => {
    switch (selectedYear) {
      case "fy":
        return {
          totalStudents: 1247,
          activeCompanies: 89,
          studentsPlaced: 215,
          studentsInInternship: 95,
        }
      case "sy":
        return {
          totalStudents: 1247,
          activeCompanies: 89,
          studentsPlaced: 365,
          studentsInInternship: 142,
        }
      case "ty":
        return {
          totalStudents: 1247,
          activeCompanies: 89,
          studentsPlaced: 415,
          studentsInInternship: 168,
        }
      case "ly":
      default:
        return {
          totalStudents: 1247,
          activeCompanies: 89,
          studentsPlaced: 435,
          studentsInInternship: 189,
        }
    }
  }

  const getBarChartData = () => {
    const departmentStats = getDepartmentStats()
    return departmentStats.map(dept => ({
      name: dept.department,
      placed: dept.placed,
      unplaced: dept.total - dept.placed
    }))
  }

  const departmentStats = getDepartmentStats()
  const metrics = getMetricsData()
  const barChartData = getBarChartData()

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
            <Button variant="outline" asChild>
              <Link href="/admin/analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/opportunities/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Opportunity
              </Link>
            </Button>
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
                <SelectItem value="fy">FY</SelectItem>
                <SelectItem value="sy">SY</SelectItem>
                <SelectItem value="ty">TY</SelectItem>
                <SelectItem value="ly">LY</SelectItem>
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
              <div className="text-2xl font-bold">{metrics.totalStudents}</div>
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
              <div className="text-2xl font-bold">{metrics.activeCompanies}</div>
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
              <div className="text-2xl font-bold">{metrics.studentsPlaced}</div>
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
              <div className="text-2xl font-bold">{metrics.studentsInInternship}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-500" />
                +22% from last year
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-4">
            {/* Placement Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Placed vs Unplaced Students</CardTitle>
                <CardDescription>Visualization of student placement status by department</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <RechartsComponent data={barChartData} />
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
                {departmentStats.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{dept.department}</span>
                      <span className="text-sm text-muted-foreground">
                        {dept.placed}/{dept.total} ({dept.rate}%)
                      </span>
                    </div>
                    <Progress value={dept.rate} className="h-2" />
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
                  { name: "TechCorp Inc.", positions: 12, logo: "TC" },
                  { name: "DataSoft Solutions", positions: 8, logo: "DS" },
                  { name: "WebFlow Agency", positions: 6, logo: "WA" },
                  { name: "CloudTech Systems", positions: 5, logo: "CS" },
                  { name: "AI Dynamics", positions: 4, logo: "AD" },
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
          </div>
        </div>

        {/* Placement Trends */}
        <Card className="mt-2">
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
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Internship placement data will be displayed here.</p>
                </div>
              </TabsContent>

              <TabsContent value="fulltime" className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Full-time placement data will be displayed here.</p>
                </div>
              </TabsContent>

              <TabsContent value="companies" className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Company partnership data will be displayed here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}