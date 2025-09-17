import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Search, Filter, Mail, Phone, MapPin } from "lucide-react"
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
      progress: 75,
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
      progress: 60,
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
      progress: 85,
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
      progress: 100,
    },
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
          <h1 className="text-3xl font-bold text-foreground">My Mentees</h1>
          <p className="text-muted-foreground">Manage and track your assigned students</p>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search mentees..." className="pl-10" />
          </div>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Mentees Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {mentees.map((mentee) => (
            <Card key={mentee.id} className="hover:shadow-lg transition-shadow">
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
                      <CardTitle className="text-lg">{mentee.name}</CardTitle>
                      <CardDescription>
                        {mentee.department} • {mentee.year}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(mentee.status)}>{mentee.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {mentee.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {mentee.phone}
                  </div>
                  {mentee.company && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {mentee.company}
                    </div>
                  )}
                </div>

                {/* Academic Info */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">CGPA: {mentee.cgpa}</span>
                  <span className="text-sm text-muted-foreground">
                    {mentee.approved}/{mentee.applications} applications approved
                  </span>
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
                    <Button variant="outline" className="w-full bg-transparent">
                      View Profile
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Mentees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 this semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">75% placement rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg CGPA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.4</div>
              <p className="text-xs text-muted-foreground">+0.2 from last sem</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">Application approval</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
