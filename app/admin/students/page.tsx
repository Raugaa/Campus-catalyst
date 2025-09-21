"use client"

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
  Download,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  GraduationCap,
  Mail,
  Phone,
  Plus,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useMemo } from "react"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface Student {
  id: number
  name: string
  email: string
  phone: string
  university: string
  department: string
  year: string
  gpa: string
  status: "Active" | "Placed" | "Inactive"
  applications: number
  interviews: number
  offers: number
  skills: string[]
  lastActive: string
  profileCompletion: number
  username?: string
  password?: string
}

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.sharma@iitb.ac.in",
      phone: "+91 98765 43210",
      university: "IIT Bombay",
      department: "Computer Science",
      year: "Senior",
      gpa: "8.5",
      status: "Active",
      applications: 5,
      interviews: 2,
      offers: 1,
      skills: ["React", "Node.js", "Python", "Machine Learning"],
      lastActive: "2 hours ago",
      profileCompletion: 95,
      username: "rahul_sharma",
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya.patel@iitd.ac.in",
      phone: "+91 98765 43211",
      university: "IIT Delhi",
      department: "Data Science",
      year: "Junior",
      gpa: "8.9",
      status: "Active",
      applications: 8,
      interviews: 3,
      offers: 2,
      skills: ["Python", "R", "SQL", "TensorFlow"],
      lastActive: "1 day ago",
      profileCompletion: 88,
      username: "priya_patel",
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit.kumar@iitm.ac.in",
      phone: "+91 98765 43212",
      university: "IIT Madras",
      department: "Electrical Engineering",
      year: "Senior",
      gpa: "8.2",
      status: "Placed",
      applications: 6,
      interviews: 4,
      offers: 3,
      skills: ["JavaScript", "React", "CSS", "Figma"],
      lastActive: "3 days ago",
      profileCompletion: 92,
      username: "amit_kumar",
    },
    {
      id: 4,
      name: "Sneha Desai",
      email: "sneha.desai@bitspilani.ac.in",
      phone: "+91 98765 43213",
      university: "BITS Pilani",
      department: "Computer Science",
      year: "Junior",
      gpa: "8.7",
      status: "Inactive",
      applications: 3,
      interviews: 1,
      offers: 0,
      skills: ["Java", "Spring", "MySQL", "Docker"],
      lastActive: "1 week ago",
      profileCompletion: 65,
      username: "sneha_desai",
    },
  ])

  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [deactivatingStudent, setDeactivatingStudent] = useState<Student | null>(null)
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")

  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.skills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      
      const matchesDepartment = 
        departmentFilter === "all" || 
        student.department.toLowerCase().includes(departmentFilter.toLowerCase())
      
      const matchesStatus = 
        statusFilter === "all" || 
        student.status.toLowerCase() === statusFilter.toLowerCase()
      
      const matchesYear = 
        yearFilter === "all" || 
        student.year.toLowerCase() === yearFilter.toLowerCase()
      
      return matchesSearch && matchesDepartment && matchesStatus && matchesYear
    })
  }, [students, searchTerm, departmentFilter, statusFilter, yearFilter])

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

  const handleViewStudent = (student: Student) => {
    setViewingStudent(student)
    setIsViewDialogOpen(true)
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student)
    setIsEditDialogOpen(true)
  }

  const handleSaveStudent = () => {
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s))
      setIsEditDialogOpen(false)
      setEditingStudent(null)
    }
  }

  const handleDeactivateStudent = (student: Student) => {
    setDeactivatingStudent(student)
    setIsDeactivateDialogOpen(true)
  }

  const confirmDeactivateStudent = () => {
    if (deactivatingStudent) {
      setStudents(students.map(s => 
        s.id === deactivatingStudent.id 
          ? { ...s, status: "Inactive" } 
          : s
      ))
      setIsDeactivateDialogOpen(false)
      setDeactivatingStudent(null)
    }
  }

  const handleActivateStudent = (studentId: number) => {
    setStudents(students.map(s => 
      s.id === studentId 
        ? { ...s, status: "Active" } 
        : s
    ))
  }

  const updateEditingStudent = (field: keyof Student, value: any) => {
    if (editingStudent) {
      setEditingStudent({ ...editingStudent, [field]: value })
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
            <Button asChild>
              <Link href="/admin/students/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Link>
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
                  <Input 
                    placeholder="Search students..." 
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Placed">Placed</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="Freshman">Freshman</SelectItem>
                    <SelectItem value="Sophomore">Sophomore</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
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
            {filteredStudents.map((student) => (
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
                          <div>Username: {student.username || "Not set"}</div>
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewStudent(student)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEditStudent(student)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>

                      {student.status === "Inactive" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleActivateStudent(student.id)}
                        >
                          Activate
                        </Button>
                      )}
                      {student.status === "Active" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeactivateStudent(student)}
                        >
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
            {filteredStudents.filter(student => student.status === "Active").length > 0 ? (
              filteredStudents.filter(student => student.status === "Active").map((student) => (
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
                            <div>Username: {student.username || "Not set"}</div>
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewStudent(student)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Profile
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditStudent(student)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeactivateStudent(student)}
                        >
                          Deactivate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active students found.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="placed" className="space-y-4">
            {filteredStudents.filter(student => student.status === "Placed").length > 0 ? (
              filteredStudents.filter(student => student.status === "Placed").map((student) => (
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
                            <div>Username: {student.username || "Not set"}</div>
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewStudent(student)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Profile
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditStudent(student)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No placed students found.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            {filteredStudents.filter(student => student.status === "Inactive").length > 0 ? (
              filteredStudents.filter(student => student.status === "Inactive").map((student) => (
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
                            <div>Username: {student.username || "Not set"}</div>
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewStudent(student)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Profile
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleActivateStudent(student.id)}
                        >
                          Activate
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditStudent(student)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No inactive students found.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Students pending approval will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Student Profile Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
            <DialogDescription>
              Detailed information for {viewingStudent?.name}
            </DialogDescription>
          </DialogHeader>
          {viewingStudent && (
            <div className="space-y-6 py-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={`/placeholder-40x40.png?height=96&width=96&text=${viewingStudent.name[0]}`} />
                    <AvatarFallback className="text-2xl">{viewingStudent.name[0]}</AvatarFallback>
                  </Avatar>
                  <Badge variant="secondary" className="px-3 py-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(viewingStudent.status)} mr-2`} />
                    {viewingStudent.status}
                  </Badge>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">{viewingStudent.name}</h3>
                    <p className="text-muted-foreground">{viewingStudent.university}</p>
                  </div>
                  
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm">{viewingStudent.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm">{viewingStudent.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Username</Label>
                      <p className="text-sm">{viewingStudent.username || "Not set"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Department</Label>
                      <p className="text-sm">{viewingStudent.department}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Year</Label>
                      <p className="text-sm">{viewingStudent.year}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">GPA</Label>
                      <p className="text-sm">{viewingStudent.gpa}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Profile Completion</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={viewingStudent.profileCompletion} className="w-full" />
                      <span className="text-sm font-medium">{viewingStudent.profileCompletion}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingStudent.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{viewingStudent.applications}</p>
                        <p className="text-sm text-muted-foreground">Applications</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{viewingStudent.interviews}</p>
                        <p className="text-sm text-muted-foreground">Interviews</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{viewingStudent.offers}</p>
                        <p className="text-sm text-muted-foreground">Offers</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">Activity</h4>
                  <p className="text-sm text-muted-foreground">Last active: {viewingStudent.lastActive}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Student Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student Profile</DialogTitle>
            <DialogDescription>
              Update information for {editingStudent?.name}
            </DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <div className="space-y-6 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editingStudent.name}
                    onChange={(e) => updateEditingStudent("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => updateEditingStudent("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={editingStudent.username || ""}
                    onChange={(e) => updateEditingStudent("username", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password to change"
                    onChange={(e) => updateEditingStudent("password", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={editingStudent.phone}
                    onChange={(e) => updateEditingStudent("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    value={editingStudent.university}
                    onChange={(e) => updateEditingStudent("university", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={editingStudent.department}
                    onChange={(e) => updateEditingStudent("department", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select
                    value={editingStudent.year}
                    onValueChange={(value) => updateEditingStudent("year", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Freshman">Freshman</SelectItem>
                      <SelectItem value="Sophomore">Sophomore</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    value={editingStudent.gpa}
                    onChange={(e) => updateEditingStudent("gpa", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editingStudent.status}
                    onValueChange={(value: "Active" | "Placed" | "Inactive") => 
                      updateEditingStudent("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Placed">Placed</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Textarea
                  id="skills"
                  value={editingStudent.skills.join(", ")}
                  onChange={(e) => updateEditingStudent("skills", e.target.value.split(",").map(s => s.trim()))}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveStudent}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Deactivate Student Dialog */}
      <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate {deactivatingStudent?.name}'s account? 
              This will prevent them from accessing the platform.
            </DialogDescription>
          </DialogHeader>
          {deactivatingStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch id="notify-student" defaultChecked />
                <Label htmlFor="notify-student">Notify student via email</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeactivateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmDeactivateStudent}
                >
                  Deactivate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}