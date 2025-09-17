import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, GraduationCap, Download, Calendar, ArrowUp, ArrowDown } from "lucide-react"

export default function AdminAnalytics() {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive insights into placement activities and trends</p>
          </div>
          <div className="flex gap-2">
            <Select>
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
            <Button variant="outline">
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
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.5%</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-500" />
                +5.2% from last semester
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time to Placement</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42 days</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowDown className="w-3 h-3 mr-1 text-green-500" />
                -8 days from last semester
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Application Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.3%</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-500" />
                +2.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Salary Offered</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$65K</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-500" />
                +$3K from last year
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Placement Statistics</CardTitle>
                  <CardDescription>Current semester placement overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Students Placed</span>
                      <span className="text-sm text-muted-foreground">234 / 298 (78.5%)</span>
                    </div>
                    <Progress value={78.5} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Internships</span>
                      <span className="text-sm text-muted-foreground">156 / 200 (78%)</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Full-time Positions</span>
                      <span className="text-sm text-muted-foreground">78 / 98 (79.6%)</span>
                    </div>
                    <Progress value={79.6} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Application Metrics</CardTitle>
                  <CardDescription>Student application activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 grid-cols-2">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">2,456</div>
                      <p className="text-sm text-muted-foreground">Total Applications</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-green-500">598</div>
                      <p className="text-sm text-muted-foreground">Successful Applications</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-500">8.2</div>
                      <p className="text-sm text-muted-foreground">Avg. Applications/Student</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-500">24.3%</div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Companies</CardTitle>
                <CardDescription>Companies with highest hiring rates this semester</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "TechCorp Inc.", hires: 18, applications: 67, rate: 26.9 },
                    { name: "DataSoft Solutions", hires: 12, applications: 45, rate: 26.7 },
                    { name: "CloudTech Systems", hires: 15, applications: 58, rate: 25.9 },
                    { name: "WebFlow Agency", hires: 8, applications: 32, rate: 25.0 },
                    { name: "AI Dynamics", hires: 6, applications: 28, rate: 21.4 },
                  ].map((company, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{company.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {company.hires} hires from {company.applications} applications
                        </p>
                      </div>
                      <Badge variant="secondary">{company.rate}% success rate</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments */}
          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department-wise Performance</CardTitle>
                <CardDescription>Placement statistics by academic department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      name: "Computer Science",
                      students: 180,
                      placed: 145,
                      rate: 80.6,
                      avgSalary: "$72K",
                      topCompanies: ["TechCorp", "DataSoft", "CloudTech"],
                    },
                    {
                      name: "Electrical Engineering",
                      students: 120,
                      placed: 89,
                      rate: 74.2,
                      avgSalary: "$68K",
                      topCompanies: ["PowerTech", "CircuitCorp", "ElectroSoft"],
                    },
                    {
                      name: "Mechanical Engineering",
                      students: 95,
                      placed: 67,
                      rate: 70.5,
                      avgSalary: "$65K",
                      topCompanies: ["MechCorp", "AutoTech", "ManufacturePro"],
                    },
                    {
                      name: "Information Technology",
                      students: 100,
                      placed: 78,
                      rate: 78.0,
                      avgSalary: "$69K",
                      topCompanies: ["InfoSys", "TechSolutions", "DataFlow"],
                    },
                  ].map((dept, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{dept.name}</h4>
                        <Badge variant="outline">{dept.rate}% placed</Badge>
                      </div>
                      <div className="grid gap-4 md:grid-cols-4 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Students</p>
                          <p className="font-medium">{dept.students}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Students Placed</p>
                          <p className="font-medium">{dept.placed}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg. Salary</p>
                          <p className="font-medium">{dept.avgSalary}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Top Companies</p>
                          <p className="font-medium text-xs">{dept.topCompanies.join(", ")}</p>
                        </div>
                      </div>
                      <Progress value={dept.rate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Companies */}
          <TabsContent value="companies" className="space-y-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Company analytics will be displayed here.</p>
            </div>
          </TabsContent>

          {/* Trends */}
          <TabsContent value="trends" className="space-y-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Placement trends and forecasts will be displayed here.</p>
            </div>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports" className="space-y-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Detailed reports and exports will be available here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
