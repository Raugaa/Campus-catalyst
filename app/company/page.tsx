import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Briefcase, Users, TrendingUp, Calendar, Eye, UserCheck, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CompanyDashboard() {
  return (
    <DashboardLayout userRole="company">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, TechCorp!</h1>
            <p className="text-muted-foreground">Manage your internship postings and review applications</p>
          </div>
          <Button asChild>
            <Link href="/company/jobs/new">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Job Posts</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+23 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Next: Today 2PM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hire Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24%</div>
              <p className="text-xs text-muted-foreground">Above industry avg</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest applications to review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  name: "Sarah Johnson",
                  position: "Software Engineering Intern",
                  university: "UC Berkeley",
                  appliedDate: "2 hours ago",
                  status: "New",
                  statusColor: "bg-blue-500",
                  match: "95%",
                },
                {
                  name: "Michael Chen",
                  position: "Data Science Intern",
                  university: "Stanford University",
                  appliedDate: "5 hours ago",
                  status: "Reviewed",
                  statusColor: "bg-yellow-500",
                  match: "88%",
                },
                {
                  name: "Emily Rodriguez",
                  position: "Frontend Developer Intern",
                  university: "MIT",
                  appliedDate: "1 day ago",
                  status: "Interview Scheduled",
                  statusColor: "bg-green-500",
                  match: "92%",
                },
              ].map((application, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`/placeholder-40x40.png?height=40&width=40&text=${application.name[0]}`} />
                    <AvatarFallback>{application.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{application.name}</p>
                      <Badge variant="outline" className="text-xs text-green-600">
                        {application.match} match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{application.position}</p>
                    <p className="text-xs text-muted-foreground">{application.university}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">
                      <div className={`w-2 h-2 rounded-full ${application.statusColor} mr-1`} />
                      {application.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{application.appliedDate}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/company/applications">View All Applications</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Active Job Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Active Job Posts</CardTitle>
              <CardDescription>Your current open positions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Software Engineering Intern",
                  applications: 45,
                  views: 234,
                  deadline: "Dec 15, 2024",
                  status: "Active",
                },
                {
                  title: "Data Science Intern",
                  applications: 32,
                  views: 189,
                  deadline: "Dec 20, 2024",
                  status: "Active",
                },
                {
                  title: "Frontend Developer Intern",
                  applications: 28,
                  views: 156,
                  deadline: "Dec 10, 2024",
                  status: "Closing Soon",
                },
              ].map((job, index) => (
                <div key={index} className="p-3 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">Deadline: {job.deadline}</p>
                    </div>
                    <Badge variant={job.status === "Closing Soon" ? "destructive" : "secondary"} className="text-xs">
                      {job.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {job.applications} applications
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {job.views} views
                    </span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/company/jobs">Manage All Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Post New Job</p>
                  <p className="text-sm text-muted-foreground">Create a new internship posting</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/company/jobs/new">Create</Link>
                </Button>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Review Applications</p>
                  <p className="text-sm text-muted-foreground">12 pending reviews</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/company/applications">Review</Link>
                </Button>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Schedule Interviews</p>
                  <p className="text-sm text-muted-foreground">8 candidates waiting</p>
                </div>
                <Button size="sm" variant="outline">
                  Schedule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hiring Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Hiring Pipeline</CardTitle>
            <CardDescription>Overview of your recruitment process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              {[
                { stage: "Applied", count: 156, color: "bg-blue-500" },
                { stage: "Screening", count: 45, color: "bg-yellow-500" },
                { stage: "Interview", count: 12, color: "bg-purple-500" },
                { stage: "Final Round", count: 5, color: "bg-orange-500" },
                { stage: "Hired", count: 2, color: "bg-green-500" },
              ].map((stage, index) => (
                <div key={index} className="text-center">
                  <div className="mb-2">
                    <div
                      className={`w-12 h-12 ${stage.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                    >
                      <span className="text-white font-bold">{stage.count}</span>
                    </div>
                    <p className="font-medium">{stage.stage}</p>
                  </div>
                  {index < 4 && (
                    <div className="hidden md:block">
                      <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
