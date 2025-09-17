import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Clock, CheckCircle, XCircle, Eye, Calendar, MapPin, DollarSign } from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function ApprovalsPage() {
  const pendingApprovals = [
    {
      id: 1,
      student: {
        name: "Rahul Sharma",
        email: "rahul.sharma@college.edu",
        avatar: "/placeholder-40x40.png",
        department: "Computer Science",
        year: "3rd Year",
        cgpa: 8.5,
      },
      application: {
        company: "TechCorp Solutions",
        position: "Software Development Intern",
        location: "Bangalore",
        duration: "6 months",
        stipend: "₹25,000/month",
        appliedDate: "2024-01-15",
        deadline: "2024-01-20",
      },
      priority: "high",
      daysLeft: 2,
    },
    {
      id: 2,
      student: {
        name: "Priya Patel",
        email: "priya.patel@college.edu",
        avatar: "/placeholder-40x40.png",
        department: "Information Technology",
        year: "4th Year",
        cgpa: 9.1,
      },
      application: {
        company: "DataFlow Analytics",
        position: "Data Science Intern",
        location: "Mumbai",
        duration: "4 months",
        stipend: "₹30,000/month",
        appliedDate: "2024-01-14",
        deadline: "2024-01-25",
      },
      priority: "medium",
      daysLeft: 7,
    },
    {
      id: 3,
      student: {
        name: "Arjun Kumar",
        email: "arjun.kumar@college.edu",
        avatar: "/placeholder-40x40.png",
        department: "Computer Science",
        year: "3rd Year",
        cgpa: 8.2,
      },
      application: {
        company: "CloudTech Systems",
        position: "DevOps Intern",
        location: "Hyderabad",
        duration: "5 months",
        stipend: "₹28,000/month",
        appliedDate: "2024-01-13",
        deadline: "2024-01-18",
      },
      priority: "high",
      daysLeft: 1,
    },
  ]

  const recentApprovals = [
    {
      id: 4,
      student: "Sneha Reddy",
      company: "InnovateLabs",
      position: "Frontend Developer Intern",
      status: "approved",
      date: "2024-01-12",
    },
    {
      id: 5,
      student: "Vikram Singh",
      company: "TechStart",
      position: "Backend Developer Intern",
      status: "approved",
      date: "2024-01-11",
    },
    {
      id: 6,
      student: "Anita Joshi",
      company: "DevCorp",
      position: "Full Stack Intern",
      status: "rejected",
      date: "2024-01-10",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <DashboardLayout userRole="faculty">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Application Approvals</h1>
          <p className="text-muted-foreground">Review and approve student internship applications</p>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({pendingApprovals.length})
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Recent Actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search applications..." className="pl-10" />
              </div>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Pending Applications */}
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <Card key={approval.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={approval.student.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {approval.student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{approval.student.name}</CardTitle>
                          <CardDescription>
                            {approval.student.department} • {approval.student.year} • CGPA: {approval.student.cgpa}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(approval.priority)}>{approval.priority} priority</Badge>
                        <Badge variant="outline">{approval.daysLeft} days left</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Application Details */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h4 className="font-semibold">{approval.application.position}</h4>
                        <p className="text-sm text-muted-foreground">{approval.application.company}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {approval.application.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {approval.application.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {approval.application.stipend}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Applied: </span>
                          {approval.application.appliedDate}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Deadline: </span>
                          {approval.application.deadline}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                      <Button className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Approval Actions</CardTitle>
                <CardDescription>Your recent approval and rejection decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApprovals.map((approval) => (
                    <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{approval.student}</p>
                        <p className="text-sm text-muted-foreground">
                          {approval.position} at {approval.company}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={approval.status === "approved" ? "default" : "destructive"}>
                          {approval.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{approval.date}</span>
                      </div>
                    </div>
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
