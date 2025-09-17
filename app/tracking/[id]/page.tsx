import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApplicationTimeline } from "@/components/tracking/application-timeline"
import {
  ArrowLeft,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  MessageSquare,
  Download,
} from "lucide-react"
import Link from "next/link"

export default function ApplicationTrackingPage({ params }: { params: { id: string } }) {
  // Mock data - in real app, fetch based on params.id
  const application = {
    id: params.id,
    position: "Software Development Intern",
    company: {
      name: "TechCorp Solutions",
      logo: "/placeholder-icon.png",
      location: "Bangalore, India",
    },
    student: {
      name: "Rahul Sharma",
      email: "rahul.sharma@college.edu",
      phone: "+91 98765 43210",
      avatar: "/placeholder-40x40.png",
      department: "Computer Science",
      year: "3rd Year",
    },
    details: {
      duration: "6 months",
      stipend: "₹25,000/month",
      startDate: "2024-02-01",
      appliedDate: "2024-01-15",
      deadline: "2024-01-20",
    },
    status: "Interview Scheduled",
    currentStage: "interview",
  }

  const timelineEvents = [
    {
      id: "1",
      status: "Applied",
      title: "Application Submitted",
      description: "Your application has been successfully submitted to TechCorp Solutions",
      date: "Jan 15, 2024",
      time: "10:30 AM",
      type: "success" as const,
      actor: "Rahul Sharma",
    },
    {
      id: "2",
      status: "Faculty Approved",
      title: "Faculty Mentor Approval",
      description: "Your faculty mentor has approved your application",
      date: "Jan 16, 2024",
      time: "2:15 PM",
      type: "success" as const,
      actor: "Dr. Priya Singh",
    },
    {
      id: "3",
      status: "Under Review",
      title: "Application Under Review",
      description: "Your application is being reviewed by the company's HR team",
      date: "Jan 17, 2024",
      time: "9:00 AM",
      type: "success" as const,
      actor: "TechCorp HR",
    },
    {
      id: "4",
      status: "Interview Scheduled",
      title: "Interview Scheduled",
      description: "Technical interview scheduled for January 22, 2024 at 3:00 PM",
      date: "Jan 18, 2024",
      time: "11:45 AM",
      type: "pending" as const,
      actor: "Sarah Johnson",
    },
    {
      id: "5",
      status: "Pending",
      title: "Interview Pending",
      description: "Waiting for interview to be conducted",
      date: "Jan 22, 2024",
      time: "3:00 PM",
      type: "pending" as const,
    },
  ]

  const documents = [
    { name: "Resume.pdf", size: "245 KB", uploadDate: "Jan 15, 2024" },
    { name: "Cover Letter.pdf", size: "128 KB", uploadDate: "Jan 15, 2024" },
    { name: "Transcript.pdf", size: "312 KB", uploadDate: "Jan 15, 2024" },
  ]

  const communications = [
    {
      id: "1",
      from: "Sarah Johnson (TechCorp HR)",
      subject: "Interview Confirmation",
      message:
        "Hi Rahul, Your technical interview has been scheduled for January 22, 2024 at 3:00 PM. Please join the meeting using the link provided.",
      date: "Jan 18, 2024",
      time: "11:45 AM",
    },
    {
      id: "2",
      from: "Dr. Priya Singh (Faculty Mentor)",
      subject: "Application Approved",
      message:
        "Your application for the TechCorp internship has been approved. Best of luck with the interview process!",
      date: "Jan 16, 2024",
      time: "2:15 PM",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/student/applications">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Application Tracking</h1>
          <p className="text-muted-foreground">Track your application progress in real-time</p>
        </div>
      </div>

      {/* Application Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={application.company.logo || "/placeholder.svg"} />
                <AvatarFallback>
                  {application.company.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{application.position}</CardTitle>
                <CardDescription className="text-lg">{application.company.name}</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {application.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{application.company.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{application.details.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{application.details.stipend}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Applied: {application.details.appliedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <div>
            <h3 className="text-lg font-semibold mb-4">Application Timeline</h3>
            <ApplicationTimeline events={timelineEvents} />
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Submitted Documents</CardTitle>
              <CardDescription>Documents you've submitted for this application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.size} • Uploaded on {doc.uploadDate}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications">
          <Card>
            <CardHeader>
              <CardTitle>Communications</CardTitle>
              <CardDescription>Messages and updates related to your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communications.map((comm) => (
                  <div key={comm.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{comm.subject}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {comm.date} at {comm.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">From: {comm.from}</p>
                    <p className="text-sm">{comm.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Student Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={application.student.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {application.student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{application.student.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {application.student.department} • {application.student.year}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{application.student.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{application.student.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={application.company.logo || "/placeholder.svg"} />
                    <AvatarFallback>
                      {application.company.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{application.company.name}</p>
                    <p className="text-sm text-muted-foreground">{application.company.location}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Position:</span>
                    <span className="text-sm font-medium">{application.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Duration:</span>
                    <span className="text-sm">{application.details.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Stipend:</span>
                    <span className="text-sm">{application.details.stipend}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Start Date:</span>
                    <span className="text-sm">{application.details.startDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
