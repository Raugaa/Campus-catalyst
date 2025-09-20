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
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Company Engagement</CardTitle>
                  <CardDescription>Active companies and their hiring statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "TechCorp Inc.", positions: 25, applications: 180, hires: 18, responseRate: "85%" },
                      { name: "DataSoft Solutions", positions: 18, applications: 135, hires: 12, responseRate: "78%" },
                      { name: "CloudTech Systems", positions: 22, applications: 165, hires: 15, responseRate: "82%" },
                      { name: "WebFlow Agency", positions: 12, applications: 96, hires: 8, responseRate: "75%" },
                      { name: "AI Dynamics", positions: 15, applications: 112, hires: 6, responseRate: "70%" },
                    ].map((company, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {company.positions} positions • {company.hires} hires
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{company.responseRate}</p>
                          <p className="text-sm text-muted-foreground">Response Rate</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Company Categories</CardTitle>
                  <CardDescription>Distribution of companies by industry</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: "Technology", count: 24, percentage: 35 },
                      { category: "Finance", count: 12, percentage: 18 },
                      { category: "Healthcare", count: 8, percentage: 12 },
                      { category: "Manufacturing", count: 15, percentage: 22 },
                      { category: "Consulting", count: 9, percentage: 13 },
                    ].map((cat, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{cat.category}</span>
                          <span>{cat.count} companies</span>
                        </div>
                        <Progress value={cat.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Hiring Companies</CardTitle>
                <CardDescription>Companies with the highest number of student hires</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Company</th>
                        <th className="text-right py-2">Positions</th>
                        <th className="text-right py-2">Applications</th>
                        <th className="text-right py-2">Hires</th>
                        <th className="text-right py-2">Success Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "TechCorp Inc.", positions: 25, applications: 180, hires: 18 },
                        { name: "DataSoft Solutions", positions: 18, applications: 135, hires: 12 },
                        { name: "CloudTech Systems", positions: 22, applications: 165, hires: 15 },
                        { name: "WebFlow Agency", positions: 12, applications: 96, hires: 8 },
                        { name: "AI Dynamics", positions: 15, applications: 112, hires: 6 },
                      ].map((company, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3">{company.name}</td>
                          <td className="text-right py-3">{company.positions}</td>
                          <td className="text-right py-3">{company.applications}</td>
                          <td className="text-right py-3">{company.hires}</td>
                          <td className="text-right py-3 font-medium">
                            {((company.hires / company.applications) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Placement Trends Over Time</CardTitle>
                  <CardDescription>Quarterly placement statistics for the past year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { quarter: 'Q1 2023', placements: 180, applications: 420, rate: '42.9%' },
                      { quarter: 'Q2 2023', placements: 210, applications: 480, rate: '43.8%' },
                      { quarter: 'Q3 2023', placements: 195, applications: 450, rate: '43.3%' },
                      { quarter: 'Q4 2023', placements: 240, applications: 510, rate: '47.1%' },
                      { quarter: 'Q1 2024', placements: 225, applications: 490, rate: '45.9%' },
                      { quarter: 'Q2 2024', placements: 260, applications: 540, rate: '48.1%' },
                      { quarter: 'Q3 2024', placements: 275, applications: 580, rate: '47.4%' },
                      { quarter: 'Q4 2024', placements: 290, applications: 620, rate: '46.8%' },
                    ].map((data, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{data.quarter}</span>
                          <span>{data.placements} placed / {data.applications} applied ({data.rate})</span>
                        </div>
                        <div className="flex gap-2">
                          <div 
                            className="h-4 bg-blue-500 rounded" 
                            style={{ width: `${(data.placements / data.applications) * 100}%` }}
                          />
                          <div 
                            className="h-4 bg-gray-200 rounded flex-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Salary Trends</CardTitle>
                  <CardDescription>Average salary offers by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { department: 'Computer Science', avgSalary: 72000, maxSalary: 95000 },
                      { department: 'Electrical Engg.', avgSalary: 68000, maxSalary: 88000 },
                      { department: 'Mechanical Engg.', avgSalary: 65000, maxSalary: 82000 },
                      { department: 'Information Tech.', avgSalary: 69000, maxSalary: 90000 },
                      { department: 'Civil Engineering', avgSalary: 62000, maxSalary: 78000 },
                    ].map((data, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{data.department}</span>
                          <span>Avg: ${data.avgSalary.toLocaleString()} | Max: ${data.maxSalary.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <div 
                            className="h-4 bg-blue-500 rounded" 
                            style={{ width: `${(data.avgSalary / 100000) * 100}%` }}
                          />
                          <div 
                            className="h-4 bg-green-500 rounded" 
                            style={{ width: `${(data.maxSalary / 100000) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Internship vs Full-time</CardTitle>
                  <CardDescription>Placement type distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'Internships', count: 156 },
                      { type: 'Full-time', count: 78 },
                      { type: 'Part-time', count: 45 },
                    ].map((data, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{data.type}</span>
                          <span>{data.count} positions</span>
                        </div>
                        <div className="flex gap-2">
                          <div 
                            className="h-4 bg-purple-500 rounded" 
                            style={{ width: `${(data.count / 200) * 100}%` }}
                          />
                          <div 
                            className="h-4 bg-gray-200 rounded flex-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Application Trends</CardTitle>
                  <CardDescription>Student application patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { month: 'Jan', applications: 180 },
                      { month: 'Feb', applications: 210 },
                      { month: 'Mar', applications: 195 },
                      { month: 'Apr', applications: 240 },
                      { month: 'May', applications: 225 },
                      { month: 'Jun', applications: 260 },
                      { month: 'Jul', applications: 275 },
                      { month: 'Aug', applications: 290 },
                      { month: 'Sep', applications: 310 },
                      { month: 'Oct', applications: 330 },
                      { month: 'Nov', applications: 350 },
                      { month: 'Dec', applications: 380 },
                    ].map((data, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="w-12 text-sm text-muted-foreground">{data.month}</span>
                        <div className="flex-1 flex items-center gap-2">
                          <div 
                            className="h-2 bg-blue-500 rounded" 
                            style={{ width: `${(data.applications / 400) * 100}%` }}
                          />
                          <span className="text-sm w-10">{data.applications}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Placement locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { location: 'Mumbai', count: 45 },
                      { location: 'Bangalore', count: 38 },
                      { location: 'Delhi', count: 32 },
                      { location: 'Hyderabad', count: 28 },
                      { location: 'Chennai', count: 22 },
                      { location: 'Pune', count: 18 },
                      { location: 'Kolkata', count: 15 },
                    ].map((data, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{data.location}</span>
                          <span>{data.count} placements</span>
                        </div>
                        <div className="flex gap-2">
                          <div 
                            className="h-3 bg-green-500 rounded" 
                            style={{ width: `${(data.count / 50) * 100}%` }}
                          />
                          <div 
                            className="h-3 bg-gray-200 rounded flex-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Forecasting</CardTitle>
                <CardDescription>Predicted placement trends for next semester</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-500">82%</p>
                    <p className="text-sm text-muted-foreground">Predicted Placement Rate</p>
                    <p className="text-xs text-green-500 mt-1">↑ 3.5% from current</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-500">48 days</p>
                    <p className="text-sm text-muted-foreground">Avg. Time to Placement</p>
                    <p className="text-xs text-red-500 mt-1">↑ 6 days from current</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-500">$68K</p>
                    <p className="text-sm text-muted-foreground">Predicted Avg. Salary</p>
                    <p className="text-xs text-green-500 mt-1">↑ $3K from current</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Report Templates</CardTitle>
                  <CardDescription>Predefined reports for common use cases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Monthly Placement Summary", description: "Overview of placements for the month", lastGenerated: "2023-10-01" },
                      { name: "Department-wise Analysis", description: "Detailed breakdown by department", lastGenerated: "2023-09-28" },
                      { name: "Company Engagement Report", description: "Analysis of company interactions", lastGenerated: "2023-09-25" },
                      { name: "Student Performance Metrics", description: "Student application and placement data", lastGenerated: "2023-10-05" },
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Custom Reports</CardTitle>
                  <CardDescription>Create and schedule custom reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Create New Report</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Select data sources, filters, and format to generate a custom report.
                      </p>
                      <Button className="w-full">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Configure Report
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Scheduled Reports</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Reports automatically generated on a schedule.
                      </p>
                      <Button variant="outline" className="w-full">
                        Manage Schedules
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>Download raw data in various formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  {["CSV", "Excel", "PDF", "JSON"].map((format, index) => (
                    <Button key={index} variant="outline" className="h-20 flex flex-col gap-2">
                      <Download className="w-6 h-6" />
                      Export as {format}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
