import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Briefcase,
  FileText,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Users,
  Building2,
  Calendar,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, John!</h1>
            <p className="text-muted-foreground">Here's what's happening with your applications</p>
          </div>
          <Button asChild>
            <Link href="/student/opportunities">
              Browse Opportunities <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications Sent</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Next: Tomorrow 2PM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <Progress value={85} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67%</div>
              <p className="text-xs text-muted-foreground">8 of 12 applications</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest application submissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  company: "TechCorp Inc.",
                  position: "Software Engineering Intern",
                  status: "Under Review",
                  date: "2 days ago",
                  statusColor: "bg-yellow-500",
                },
                {
                  company: "DataSoft Solutions",
                  position: "Data Science Intern",
                  status: "Interview Scheduled",
                  date: "5 days ago",
                  statusColor: "bg-blue-500",
                },
                {
                  company: "WebFlow Agency",
                  position: "Frontend Developer Intern",
                  status: "Accepted",
                  date: "1 week ago",
                  statusColor: "bg-green-500",
                },
              ].map((application, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`/placeholder-40x40.png?height=40&width=40&text=${application.company[0]}`} />
                    <AvatarFallback>{application.company[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{application.position}</p>
                    <p className="text-sm text-muted-foreground">{application.company}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">
                      <div className={`w-2 h-2 rounded-full ${application.statusColor} mr-1`} />
                      {application.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{application.date}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/student/applications">View All Applications</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recommended Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
              <CardDescription>Opportunities matching your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  company: "InnovateLab",
                  position: "Full Stack Developer Intern",
                  location: "Remote",
                  type: "Internship",
                  match: "95%",
                },
                {
                  company: "CloudTech Systems",
                  position: "DevOps Engineering Intern",
                  location: "San Francisco, CA",
                  type: "Internship",
                  match: "88%",
                },
                {
                  company: "AI Dynamics",
                  position: "Machine Learning Intern",
                  location: "New York, NY",
                  type: "Internship",
                  match: "82%",
                },
              ].map((opportunity, index) => (
                <div key={index} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{opportunity.position}</h4>
                      <p className="text-sm text-muted-foreground">{opportunity.company}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      {opportunity.match} match
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {opportunity.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {opportunity.type}
                    </span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/student/opportunities">Browse All Opportunities</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Complete these tasks to improve your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Update Resume</p>
                  <p className="text-sm text-muted-foreground">Last updated 2 weeks ago</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/student/profile">Update</Link>
                </Button>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Add Skills</p>
                  <p className="text-sm text-muted-foreground">5 skills added</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/student/profile">Add More</Link>
                </Button>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Verify Email</p>
                  <p className="text-sm text-muted-foreground">Verification pending</p>
                </div>
                <Button size="sm" variant="outline">
                  Verify
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
