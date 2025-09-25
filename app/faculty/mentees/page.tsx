import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Search, Filter, Mail, Phone, MapPin, TrendingUp, FileText, CheckCircle, XCircle, Clock, User } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function MenteesPage() {
  const mentees = [
    {
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
      applications: 12,
      approved: 8,
      rejected: 2,
      pending: 2,
      progress: 75,
      skills: ["Python", "React", "Node.js"]
    },
    {
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
      applications: 8,
      approved: 6,
      rejected: 1,
      pending: 1,
      progress: 60,
      skills: ["Java", "Spring Boot", "MySQL"]
    },
    {
      id: 3,
      name: "Arjun Kumar",
      email: "arjun.kumar@college.edu",
      phone: "+91 98765 43212",
      avatar: "/placeholder-40x40.png",
      department: "Computer Science",
      year: "3rd Year",
      cgpa: 8.2,
      status: "Interview Scheduled",
      company: "CloudTech Systems",
      applications: 15,
      approved: 10,
      rejected: 3,
      pending: 2,
      progress: 85,
      skills: ["Python", "Django", "AWS"]
    },
    {
      id: 4,
      name: "Sneha Reddy",
      email: "sneha.reddy@college.edu",
      phone: "+91 98765 43213",
      avatar: "/placeholder-40x40.png",
      department: "Electronics",
      year: "4th Year",
      cgpa: 8.8,
      status: "Completed Internship",
      company: "InnovateLabs",
      applications: 6,
      approved: 5,
      rejected: 0,
      pending: 1,
      progress: 100,
      skills: ["Embedded C", "IoT", "MATLAB"]
    },
    {
      id: 5,
      name: "Vikram Singh",
      email: "vikram.singh@college.edu",
      phone: "+91 98765 43214",
      avatar: "/placeholder-40x40.png",
      department: "Mechanical Engineering",
      year: "3rd Year",
      cgpa: 7.9,
      status: "Active Internship",
      company: "AutoTech Industries",
      applications: 9,
      approved: 7,
      rejected: 1,
      pending: 1,
      progress: 70,
      skills: ["AutoCAD", "SolidWorks", "Thermodynamics"]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active Internship":
        return "default"
      case "Seeking Internship":
        return "secondary"
      case "Interview Scheduled":
        return "outline"
      case "Completed Internship":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <DashboardLayout userRole="faculty">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Mentees</h1>
          <p className="text-gray-600">Manage and track your assigned students</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search mentees by name, department, or company..." className="pl-10" />
          </div>
          <Button variant="outline" className="flex items-center gap-2 bg-white">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                Total Mentees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-gray-500">Assigned by placement cell</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Active Internships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-gray-500">Currently working</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                Avg Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10</div>
              <p className="text-xs text-gray-500">Per student</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-500" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76%</div>
              <p className="text-xs text-gray-500">Application approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Mentees Grid */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {mentees.map((mentee) => (
            <Card key={mentee.id} className="hover:shadow-lg transition-shadow border border-gray-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mentee.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {mentee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-semibold">{mentee.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>{mentee.department}</span>
                        <span>•</span>
                        <span>{mentee.year}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          CGPA: {mentee.cgpa}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(mentee.status)} className="whitespace-nowrap">
                    {mentee.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
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
                      <MapPin className="h-4 w-4" />
                      {mentee.company}
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {mentee.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {mentee.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{mentee.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Application Stats */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-700">{mentee.applications}</div>
                    <div className="text-xs text-gray-600">Applied</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-700">{mentee.approved}</div>
                    <div className="text-xs text-gray-600">Approved</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <div className="font-semibold text-red-700">{mentee.rejected}</div>
                    <div className="text-xs text-gray-600">Rejected</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded-lg">
                    <div className="font-semibold text-yellow-700">{mentee.pending}</div>
                    <div className="text-xs text-gray-600">Pending</div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Internship Progress</span>
                    <span>{mentee.progress}%</span>
                  </div>
                  <Progress value={mentee.progress} className="h-2" />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/faculty/mentees/${mentee.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-white hover:bg-gray-50">
                      View Full Report
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" className="bg-white hover:bg-gray-50">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="bg-white hover:bg-gray-50">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}