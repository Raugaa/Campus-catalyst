"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  TrendingUp, 
  CheckCircle,
  Clock,
  XCircle,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Star,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useParams } from "next/navigation"

// Mock data for mentee details
const getMenteeDetails = (id: string) => {
  const mentees: Record<string, any> = {
    "1": {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.sharma@college.edu",
      phone: "+91 98765 43210",
      avatar: "/placeholder-40x40.png",
      department: "Computer Science",
      year: "3rd Year",
      cgpa: 8.5,
      status: "Active Internship",
      company: "TechCorp Solutions",
      role: "Software Engineering Intern",
      startDate: "2024-06-01",
      endDate: "2024-12-01",
      applications: 12,
      approved: 8,
      rejected: 2,
      pending: 2,
      progress: 75,
      skills: ["Python", "JavaScript", "React", "Node.js", "SQL"],
      feedback: [
        {
          id: 1,
          company: "TechCorp Solutions",
          date: "2024-07-15",
          rating: 4.5,
          comment: "Rahul has shown excellent problem-solving skills and is a quick learner. He adapts well to new technologies.",
          reviewer: "John Smith - Tech Lead"
        },
        {
          id: 2,
          company: "DataFlow Analytics",
          date: "2024-06-30",
          rating: 4.2,
          comment: "Strong technical foundation and good communication skills. Needs to work on time management.",
          reviewer: "Sarah Johnson - Project Manager"
        }
      ],
      placements: [
        {
          id: 1,
          company: "TechCorp Solutions",
          role: "Software Engineering Intern",
          status: "Active",
          startDate: "2024-06-01",
          endDate: "2024-12-01",
          attempts: 1
        },
        {
          id: 2,
          company: "DataFlow Analytics",
          role: "Data Science Intern",
          status: "Completed",
          startDate: "2024-01-01",
          endDate: "2024-06-01",
          attempts: 1
        },
        {
          id: 3,
          company: "CloudTech Systems",
          role: "DevOps Intern",
          status: "Rejected",
          startDate: "2023-12-01",
          endDate: "2024-03-01",
          attempts: 2
        }
      ]
    },
    "2": {
      id: 2,
      name: "Priya Patel",
      email: "priya.patel@college.edu",
      phone: "+91 98765 43211",
      avatar: "/placeholder-40x40.png",
      department: "Information Technology",
      year: "4th Year",
      cgpa: 9.1,
      status: "Seeking Internship",
      company: null,
      role: null,
      startDate: null,
      endDate: null,
      applications: 8,
      approved: 6,
      rejected: 1,
      pending: 1,
      progress: 60,
      skills: ["Java", "Spring Boot", "MySQL", "AWS", "Docker"],
      feedback: [
        {
          id: 1,
          company: "InnovateLabs",
          date: "2024-07-10",
          rating: 4.7,
          comment: "Priya demonstrated exceptional technical skills and leadership qualities during her project work.",
          reviewer: "Michael Brown - CTO"
        }
      ],
      placements: [
        {
          id: 1,
          company: "InnovateLabs",
          role: "Backend Developer",
          status: "Interview Scheduled",
          startDate: "2024-08-01",
          endDate: "2024-11-01",
          attempts: 1
        },
        {
          id: 2,
          company: "TechStart",
          role: "Full Stack Developer",
          status: "Rejected",
          startDate: "2024-05-01",
          endDate: "2024-08-01",
          attempts: 1
        }
      ]
    }
  }
  
  return mentees[id] || mentees["1"]
}

export default function MenteeDetailPage() {
  const params = useParams()
  const menteeId = params.id as string
  const mentee = getMenteeDetails(menteeId)
  
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "default"
      case "completed": return "secondary"
      case "rejected": return "destructive"
      case "interview scheduled": return "outline"
      default: return "secondary"
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "completed": return <Award className="h-4 w-4 text-blue-500" />
      case "rejected": return <XCircle className="h-4 w-4 text-red-500" />
      case "interview scheduled": return <Clock className="h-4 w-4 text-yellow-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <DashboardLayout userRole="faculty">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/faculty/mentees" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-2">
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Mentees
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Mentee Profile</h1>
            <p className="text-gray-600">Detailed report for {mentee.name}</p>
          </div>
          <Button onClick={() => window.location.href = `mailto:${mentee.email}`}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </div>

        {/* Student Overview */}
        <Card className="bg-white shadow-sm rounded-xl border border-gray-100">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={mentee.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {mentee.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Badge variant="secondary" className="text-sm">
                  {mentee.status}
                </Badge>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{mentee.name}</h3>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4" />
                      {mentee.department} • {mentee.year}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4" />
                      CGPA: {mentee.cgpa}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {mentee.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {mentee.phone}
                  </div>
                  {mentee.company && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      {mentee.role} at {mentee.company}
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Internship Progress</span>
                    <span>{mentee.progress}%</span>
                  </div>
                  <Progress value={mentee.progress} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mentee.applications}</div>
              <p className="text-xs text-muted-foreground">Total applications</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{mentee.approved}</div>
              <p className="text-xs text-muted-foreground">Successful applications</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{mentee.rejected}</div>
              <p className="text-xs text-muted-foreground">Rejected applications</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{mentee.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>
        </div>

        {/* Skills Section */}
        <Card className="bg-white shadow-sm rounded-xl border border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" />
              Skills & Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mentee.skills.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Placement History */}
        <Card className="bg-white shadow-sm rounded-xl border border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-500" />
              Placement History
            </CardTitle>
            <CardDescription>All internship attempts and current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mentee.placements.map((placement: any) => (
                <div key={placement.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      {getStatusIcon(placement.status)}
                    </div>
                    <div>
                      <h4 className="font-medium">{placement.role}</h4>
                      <p className="text-sm text-gray-600">{placement.company}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {placement.startDate} to {placement.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={getStatusVariant(placement.status)}>
                      {placement.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Attempt #{placement.attempts}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <Card className="bg-white shadow-sm rounded-xl border border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Company Feedback
            </CardTitle>
            <CardDescription>Reviews from employers and mentors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mentee.feedback.map((feedback: any) => (
                <div key={feedback.id} className="border-l-4 border-blue-500 pl-4 py-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{feedback.company}</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(feedback.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">{feedback.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{feedback.reviewer}</p>
                  <p className="text-sm mt-2">{feedback.comment}</p>
                  <p className="text-xs text-gray-500 mt-2">{feedback.date}</p>
                </div>
              ))}
              
              {mentee.feedback.length === 0 && (
                <p className="text-gray-500 text-center py-4">No feedback available yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}