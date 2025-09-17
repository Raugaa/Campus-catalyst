import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  MapPin,
  FileText,
  MessageSquare,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

export default function StudentApplications() {
  const applications = [
    {
      id: 1,
      position: "Software Engineering Intern",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      appliedDate: "Nov 28, 2024",
      status: "Interview Scheduled",
      statusColor: "bg-blue-500",
      progress: 75,
      nextStep: "Technical Interview - Dec 5, 2024 at 2:00 PM",
      timeline: [
        { step: "Applied", date: "Nov 28", completed: true },
        { step: "Resume Review", date: "Nov 30", completed: true },
        { step: "Phone Screen", date: "Dec 2", completed: true },
        { step: "Technical Interview", date: "Dec 5", completed: false, current: true },
        { step: "Final Interview", date: "TBD", completed: false },
        { step: "Decision", date: "TBD", completed: false },
      ],
    },
    {
      id: 2,
      position: "Data Science Intern",
      company: "DataSoft Solutions",
      location: "Remote",
      appliedDate: "Nov 25, 2024",
      status: "Under Review",
      statusColor: "bg-yellow-500",
      progress: 40,
      nextStep: "Waiting for initial review",
      timeline: [
        { step: "Applied", date: "Nov 25", completed: true },
        { step: "Resume Review", date: "In Progress", completed: false, current: true },
        { step: "Technical Assessment", date: "TBD", completed: false },
        { step: "Interview", date: "TBD", completed: false },
        { step: "Decision", date: "TBD", completed: false },
      ],
    },
    {
      id: 3,
      position: "Frontend Developer Intern",
      company: "WebFlow Agency",
      location: "New York, NY",
      appliedDate: "Nov 20, 2024",
      status: "Accepted",
      statusColor: "bg-green-500",
      progress: 100,
      nextStep: "Offer letter sent - Action required",
      timeline: [
        { step: "Applied", date: "Nov 20", completed: true },
        { step: "Resume Review", date: "Nov 22", completed: true },
        { step: "Technical Interview", date: "Nov 26", completed: true },
        { step: "Final Interview", date: "Nov 28", completed: true },
        { step: "Offer Extended", date: "Dec 1", completed: true },
      ],
    },
    {
      id: 4,
      position: "Backend Developer Intern",
      company: "CloudTech Systems",
      location: "Austin, TX",
      appliedDate: "Nov 15, 2024",
      status: "Rejected",
      statusColor: "bg-red-500",
      progress: 60,
      nextStep: "Application closed",
      timeline: [
        { step: "Applied", date: "Nov 15", completed: true },
        { step: "Resume Review", date: "Nov 18", completed: true },
        { step: "Phone Screen", date: "Nov 22", completed: true },
        { step: "Technical Interview", date: "Nov 25", completed: true },
        { step: "Decision", date: "Nov 30", completed: true, rejected: true },
      ],
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "Rejected":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "Interview Scheduled":
        return <Calendar className="w-4 h-4 text-blue-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Applications</h1>
            <p className="text-muted-foreground">Track your application progress and status</p>
          </div>
          <Button asChild>
            <Link href="/student/opportunities">Browse More Opportunities</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
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

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`/placeholder-icon.png?height=48&width=48&text=${application.company[0]}`} />
                        <AvatarFallback>{application.company[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{application.position}</h3>
                          {getStatusIcon(application.status)}
                        </div>
                        <p className="text-muted-foreground mb-2">{application.company}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {application.location}
                          </span>
                          <span>Applied {application.appliedDate}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="secondary" className="px-3 py-1">
                            <div className={`w-2 h-2 rounded-full ${application.statusColor} mr-2`} />
                            {application.status}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Progress:</span>
                            <Progress value={application.progress} className="w-20" />
                            <span>{application.progress}%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-muted-foreground">Next: {application.nextStep}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Application Timeline</h4>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {application.timeline.map((step, index) => (
                        <div key={index} className="flex items-center gap-2 min-w-fit">
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                step.completed
                                  ? step.rejected
                                    ? "bg-red-500 text-white"
                                    : "bg-green-500 text-white"
                                  : step.current
                                    ? "bg-blue-500 text-white"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {step.completed ? (
                                step.rejected ? (
                                  <XCircle className="w-4 h-4" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )
                              ) : (
                                index + 1
                              )}
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-medium">{step.step}</p>
                              <p className="text-xs text-muted-foreground">{step.date}</p>
                            </div>
                          </div>
                          {index < application.timeline.length - 1 && (
                            <div className="w-8 h-px bg-border mt-4 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">Last updated: {application.appliedDate}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {application.status === "Interview Scheduled" && <Button size="sm">Join Interview</Button>}
                      {application.status === "Accepted" && <Button size="sm">View Offer</Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Active applications will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Scheduled interviews will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="offers" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Job offers will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="closed" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Closed applications will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
