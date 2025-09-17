import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, CheckCircle, Clock, TrendingUp, BookOpen } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function FacultyDashboard() {
  const stats = [
    { title: "Total Mentees", value: "24", icon: Users, change: "+2 this month" },
    { title: "Pending Approvals", value: "8", icon: Clock, change: "3 urgent" },
    { title: "Approved Applications", value: "156", icon: CheckCircle, change: "+12 this week" },
    { title: "Active Internships", value: "18", icon: TrendingUp, change: "6 completing soon" },
  ]

  const pendingApprovals = [
    {
      id: 1,
      student: "Rahul Sharma",
      avatar: "/placeholder-40x40.png",
      company: "TechCorp Solutions",
      position: "Software Development Intern",
      appliedDate: "2024-01-15",
      priority: "high",
    },
    {
      id: 2,
      student: "Priya Patel",
      avatar: "/placeholder-40x40.png",
      company: "DataFlow Analytics",
      position: "Data Science Intern",
      appliedDate: "2024-01-14",
      priority: "medium",
    },
    {
      id: 3,
      student: "Arjun Kumar",
      avatar: "/placeholder-40x40.png",
      company: "CloudTech Systems",
      position: "DevOps Intern",
      appliedDate: "2024-01-13",
      priority: "high",
    },
  ]

  const recentActivity = [
    { action: "Approved application", student: "Sneha Reddy", company: "InnovateLabs", time: "2 hours ago" },
    { action: "Reviewed profile", student: "Vikram Singh", company: "TechStart", time: "4 hours ago" },
    { action: "Provided feedback", student: "Anita Joshi", company: "DevCorp", time: "1 day ago" },
    { action: "Approved application", student: "Rohit Gupta", company: "CodeCraft", time: "2 days ago" },
  ]

  return (
    <DashboardLayout userRole="faculty">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Faculty Dashboard</h1>
          <p className="text-muted-foreground">Manage your mentees and review applications</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Approvals
              </CardTitle>
              <CardDescription>Applications waiting for your approval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={approval.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {approval.student
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{approval.student}</p>
                      <p className="text-sm text-muted-foreground">{approval.position}</p>
                      <p className="text-xs text-muted-foreground">{approval.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={approval.priority === "high" ? "destructive" : "secondary"}>
                      {approval.priority}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/faculty/approvals">
                <Button variant="outline" className="w-full bg-transparent">
                  View All Approvals
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your recent mentoring activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.student} • {activity.company}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/faculty/mentees">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Manage Mentees
                </CardTitle>
                <CardDescription>View and manage your assigned students</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/faculty/approvals">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Review Applications
                </CardTitle>
                <CardDescription>Approve or reject student applications</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/faculty/reports">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Reports
                </CardTitle>
                <CardDescription>View mentee performance and progress</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
