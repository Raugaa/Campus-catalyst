import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export default function AdminDashboard() {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
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

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
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
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-500" />
                +8 new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowDown className="w-3 h-3 mr-1 text-red-500" />
                -5% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-500" />
                +3% from last year
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates across the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    type: "application",
                    message: "Sarah Johnson applied for Software Engineering Intern at TechCorp",
                    time: "2 minutes ago",
                    icon: <Users className="w-4 h-4 text-blue-500" />,
                  },
                  {
                    type: "company",
                    message: "DataSoft Solutions posted a new Data Science Intern position",
                    time: "15 minutes ago",
                    icon: <Building2 className="w-4 h-4 text-green-500" />,
                  },
                  {
                    type: "interview",
                    message: "Interview scheduled between Michael Chen and WebFlow Agency",
                    time: "1 hour ago",
                    icon: <Clock className="w-4 h-4 text-purple-500" />,
                  },
                  {
                    type: "placement",
                    message: "Emily Rodriguez accepted offer from Frontend Solutions Inc.",
                    time: "2 hours ago",
                    icon: <CheckCircle className="w-4 h-4 text-green-500" />,
                  },
                  {
                    type: "alert",
                    message: "Application deadline approaching for 5 positions",
                    time: "3 hours ago",
                    icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="mt-0.5">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent">
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            {/* Department-wise Placement Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Department-wise Placement Statistics</CardTitle>
                <CardDescription>Placement rates by academic department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { department: "Computer Science", placed: 145, total: 180, rate: 81 },
                  { department: "Electrical Engineering", placed: 89, total: 120, rate: 74 },
                  { department: "Mechanical Engineering", placed: 67, total: 95, rate: 71 },
                  { department: "Information Technology", placed: 78, total: 100, rate: 78 },
                  { department: "Electronics & Communication", placed: 56, total: 85, rate: 66 },
                ].map((dept, index) => (
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Actions</CardTitle>
                <CardDescription>Items requiring your attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="text-sm font-medium">Company Approvals</p>
                    <p className="text-xs text-muted-foreground">3 pending</p>
                  </div>
                  <Badge variant="destructive">3</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="text-sm font-medium">Job Post Reviews</p>
                    <p className="text-xs text-muted-foreground">7 pending</p>
                  </div>
                  <Badge variant="destructive">7</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="text-sm font-medium">Student Verifications</p>
                    <p className="text-xs text-muted-foreground">12 pending</p>
                  </div>
                  <Badge variant="destructive">12</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="text-sm font-medium">Faculty Approvals</p>
                    <p className="text-xs text-muted-foreground">5 pending</p>
                  </div>
                  <Badge variant="destructive">5</Badge>
                </div>
                <Button size="sm" className="w-full">
                  Review All
                </Button>
              </CardContent>
            </Card>

            {/* Top Companies */}
            <Card>
              <CardHeader>
                <CardTitle>Top Recruiting Companies</CardTitle>
                <CardDescription>Most active companies this semester</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
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
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
        <Card>
          <CardHeader>
            <CardTitle>Placement Trends</CardTitle>
            <CardDescription>Monthly placement statistics for the current academic year</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="internships">Internships</TabsTrigger>
                <TabsTrigger value="fulltime">Full-time</TabsTrigger>
                <TabsTrigger value="companies">Companies</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">456</div>
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
