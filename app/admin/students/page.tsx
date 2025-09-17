import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
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
  Eye,
  Edit,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  GraduationCap,
  Mail,
  Phone,
} from "lucide-react"

export default function AdminStudents() {
  const students = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@berkeley.edu",
      phone: "+1 (555) 123-4567",
      university: "UC Berkeley",
      department: "Computer Science",
      year: "Senior",
      gpa: "3.8",
      status: "Active",
      applications: 5,
      interviews: 2,
      offers: 1,
      skills: ["React", "Node.js", "Python", "Machine Learning"],
      lastActive: "2 hours ago",
      profileCompletion: 95,
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@stanford.edu",
      phone: "+1 (555) 234-5678",
      university: "Stanford University",
      department: "Data Science",
      year: "Junior",
      gpa: "3.9",
      status: "Active",
      applications: 8,
      interviews: 3,
      offers: 2,
      skills: ["Python", "R", "SQL", "TensorFlow"],
      lastActive: "1 day ago",
      profileCompletion: 88,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.r@mit.edu",
      phone: "+1 (555) 345-6789",
      university: "MIT",
      department: "Electrical Engineering",
      year: "Senior",
      gpa: "3.7",
      status: "Placed",
      applications: 6,
      interviews: 4,
      offers: 3,
      skills: ["JavaScript", "React", "CSS", "Figma"],
      lastActive: "3 days ago",
      profileCompletion: 92,
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@cmu.edu",
      phone: "+1 (555) 456-7890",
      university: "Carnegie Mellon",
      department: "Computer Science",
      year: "Junior",
      gpa: "3.6",
      status: "Inactive",
      applications: 3,
      interviews: 1,
      offers: 0,
      skills: ["Java", "Spring", "MySQL", "Docker"],
      lastActive: "1 week ago",
      profileCompletion: 65,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Placed":
        return "bg-blue-500"
      case "Inactive":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "Placed":
        return <GraduationCap className="w-4 h-4 text-blue-500" />
      case "Inactive":
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
      default:
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Student Management</h1>
            <p className="text-muted-foreground">Manage student profiles and track placement progress</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
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
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
                <GraduationCap className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                  <p className="text-2xl font-bold">1,089</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Placed Students</p>
                  <p className="text-2xl font-bold">234</p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Applications</p>
                  <p className="text-2xl font-bold">5.2</p>
                </div>
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
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
                  <Input placeholder="Search students..." className="pl-10" />
                </div>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="ee">Electrical Engineering</SelectItem>
                    <SelectItem value="me">Mechanical Engineering</SelectItem>
                    <SelectItem value="it">Information Technology</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="placed">Placed</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Students</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="placed">Placed</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {students.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`/placeholder-40x40.png?height=48&width=48&text=${student.name[0]}`} />
                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{student.name}</h3>
                          {getStatusIcon(student.status)}
                        </div>
                        <div className="grid gap-1 md:grid-cols-2 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {student.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {student.phone}
                          </div>
                          <div>{student.university}</div>
                          <div>
                            {student.department} • {student.year}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>GPA: {student.gpa}</span>
                          <span>{student.applications} applications</span>
                          <span>{student.interviews} interviews</span>
                          <span>{student.offers} offers</span>
                          <span>Profile: {student.profileCompletion}%</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {student.skills.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {student.skills.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{student.skills.length - 4} more
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Last active: {student.lastActive}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="px-3 py-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(student.status)} mr-2`} />
                      {student.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      {student.status === "Inactive" && <Button size="sm">Activate</Button>}
                      {student.status === "Active" && (
                        <Button size="sm" variant="outline">
                          Deactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Active students will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="placed" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Placed students will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Inactive students will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Students pending approval will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
