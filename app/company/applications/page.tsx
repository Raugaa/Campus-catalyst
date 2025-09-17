import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Download,
  Star,
  MessageSquare,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
} from "lucide-react"

export default function CompanyApplications() {
  const applications = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@berkeley.edu",
      position: "Software Engineering Intern",
      university: "UC Berkeley",
      gpa: "3.8",
      appliedDate: "2 hours ago",
      status: "New",
      statusColor: "bg-blue-500",
      match: "95%",
      skills: ["React", "Node.js", "JavaScript", "Python"],
      experience: "2 previous internships",
      avatar: "SJ",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@stanford.edu",
      position: "Data Science Intern",
      university: "Stanford University",
      gpa: "3.9",
      appliedDate: "5 hours ago",
      status: "Reviewed",
      statusColor: "bg-yellow-500",
      match: "88%",
      skills: ["Python", "Machine Learning", "SQL", "R"],
      experience: "Research assistant",
      avatar: "MC",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.r@mit.edu",
      position: "Frontend Developer Intern",
      university: "MIT",
      gpa: "3.7",
      appliedDate: "1 day ago",
      status: "Interview Scheduled",
      statusColor: "bg-green-500",
      match: "92%",
      skills: ["React", "TypeScript", "CSS", "Figma"],
      experience: "Freelance projects",
      avatar: "ER",
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@cmu.edu",
      position: "Software Engineering Intern",
      university: "Carnegie Mellon",
      gpa: "3.6",
      appliedDate: "2 days ago",
      status: "Rejected",
      statusColor: "bg-red-500",
      match: "76%",
      skills: ["Java", "Spring", "MySQL", "Docker"],
      experience: "1 internship",
      avatar: "DK",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Interview Scheduled":
        return <Calendar className="w-4 h-4 text-green-500" />
      case "Rejected":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "Reviewed":
        return <Eye className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <DashboardLayout userRole="company">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Applications</h1>
            <p className="text-muted-foreground">Review and manage candidate applications</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+23 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24%</div>
              <p className="text-xs text-muted-foreground">Above average</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search applications..." className="pl-10" />
                </div>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    <SelectItem value="swe">Software Engineering</SelectItem>
                    <SelectItem value="ds">Data Science</SelectItem>
                    <SelectItem value="fe">Frontend Developer</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
            <TabsTrigger value="interview">Interview</TabsTrigger>
            <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`/placeholder-40x40.png?height=48&width=48&text=${application.avatar}`} />
                        <AvatarFallback>{application.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{application.name}</h3>
                          {getStatusIcon(application.status)}
                          <Badge variant="outline" className="text-green-600 text-xs">
                            {application.match} match
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{application.email}</p>
                        <p className="text-sm text-muted-foreground mb-2">Applied for: {application.position}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>{application.university}</span>
                          <span>GPA: {application.gpa}</span>
                          <span>{application.experience}</span>
                          <span>Applied {application.appliedDate}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {application.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="px-3 py-1">
                        <div className={`w-2 h-2 rounded-full ${application.statusColor} mr-2`} />
                        {application.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-1" />
                        View Resume
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {application.status === "New" && (
                        <>
                          <Button size="sm" variant="outline">
                            Schedule Interview
                          </Button>
                          <Button size="sm">Review Application</Button>
                        </>
                      )}
                      {application.status === "Reviewed" && (
                        <>
                          <Button size="sm" variant="outline">
                            Reject
                          </Button>
                          <Button size="sm">Schedule Interview</Button>
                        </>
                      )}
                      {application.status === "Interview Scheduled" && (
                        <Button size="sm" variant="outline">
                          View Interview Details
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">New applications will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="reviewed" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Reviewed applications will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="interview" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Applications with scheduled interviews will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="shortlisted" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Shortlisted applications will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
