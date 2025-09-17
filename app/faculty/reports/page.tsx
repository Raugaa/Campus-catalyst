import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TrendingUp, Users, Award, Calendar, Download, Filter } from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function ReportsPage() {
  const performanceData = [
    {
      id: 1,
      student: "Rahul Sharma",
      avatar: "/placeholder-40x40.png",
      company: "TechCorp Solutions",
      position: "Software Development Intern",
      duration: "6 months",
      performance: 92,
      feedback: "Excellent technical skills and great team collaboration",
      status: "Completed",
      completionDate: "2024-01-15",
    },
    {
      id: 2,
      student: "Priya Patel",
      avatar: "/placeholder-40x40.png",
      company: "DataFlow Analytics",
      position: "Data Science Intern",
      duration: "4 months",
      performance: 88,
      feedback: "Strong analytical skills, needs improvement in presentation",
      status: "Active",
      completionDate: null,
    },
    {
      id: 3,
      student: "Arjun Kumar",
      avatar: "/placeholder-40x40.png",
      company: "CloudTech Systems",
      position: "DevOps Intern",
      duration: "5 months",
      performance: 85,
      feedback: "Good technical understanding, proactive learner",
      status: "Active",
      completionDate: null,
    },
  ]

  const departmentStats = [
    { department: "Computer Science", students: 15, placed: 12, rate: 80 },
    { department: "Information Technology", students: 8, placed: 7, rate: 87.5 },
    { department: "Electronics", students: 6, placed: 5, rate: 83.3 },
  ]

  return (
    <DashboardLayout userRole="faculty">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Performance Reports</h1>
            <p className="text-muted-foreground">Track mentee performance and internship outcomes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mentees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Across all departments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">88.3%</div>
              <p className="text-xs text-muted-foreground">+5.2% from last semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-muted-foreground">23/24 completed successfully</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">Currently ongoing</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="individual" className="space-y-6">
          <TabsList>
            <TabsTrigger value="individual">Individual Performance</TabsTrigger>
            <TabsTrigger value="department">Department Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-6">
            <div className="space-y-4">
              {performanceData.map((student) => (
                <Card key={student.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={student.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {student.student
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{student.student}</CardTitle>
                          <CardDescription>
                            {student.position} at {student.company}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={student.status === "Completed" ? "default" : "secondary"}>{student.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Performance Score</span>
                          <span className="font-medium">{student.performance}%</span>
                        </div>
                        <Progress value={student.performance} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Duration: {student.duration}</p>
                        {student.completionDate && (
                          <p className="text-sm text-muted-foreground">Completed: {student.completionDate}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Supervisor Feedback:</p>
                      <p className="text-sm text-muted-foreground">{student.feedback}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="department" className="space-y-6">
            <div className="grid gap-4">
              {departmentStats.map((dept) => (
                <Card key={dept.department}>
                  <CardHeader>
                    <CardTitle>{dept.department}</CardTitle>
                    <CardDescription>Placement statistics and performance overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{dept.students}</div>
                        <p className="text-sm text-muted-foreground">Total Students</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{dept.placed}</div>
                        <p className="text-sm text-muted-foreground">Placed</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{dept.rate}%</div>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Placement Progress</span>
                        <span>{dept.rate}%</span>
                      </div>
                      <Progress value={dept.rate} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
