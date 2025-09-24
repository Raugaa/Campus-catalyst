"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search,
  X,
  Check,
  Filter,
  Users,
  Building,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Award
} from "lucide-react"
import { useState } from "react"

// Add Select components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Add Dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

// Define the college type
type College = {
  id: number
  name: string
  location: string
  students: number
  departments: number
  established: number
  connectionDate?: string
  requestDate?: string
}

// Define the student type
type Student = {
  id: number
  name: string
  department: string
  year: string
  email: string
  phone: string
  skills: string[]
  gpa: number
}

export default function CollegeManagement() {
  const [connectedColleges, setConnectedColleges] = useState<College[]>([
    { 
      id: 1, 
      name: 'KJ Somaiya College of Engineering', 
      location: 'Mumbai, Maharashtra', 
      students: 1240, 
      departments: 8,
      established: 1983,
      connectionDate: '2023-01-15'
    },
    { 
      id: 2, 
      name: 'Veermata Jijabai Technological Institute', 
      location: 'Mumbai, Maharashtra', 
      students: 2100, 
      departments: 12,
      established: 1887,
      connectionDate: '2023-02-20'
    }
  ])
  
  const [pendingRequests, setPendingRequests] = useState<College[]>([
    { 
      id: 3, 
      name: 'DY Patil Institute', 
      location: 'Pune, Maharashtra', 
      students: 850, 
      departments: 6,
      established: 1984,
      requestDate: '2023-05-10'
    },
    { 
      id: 4, 
      name: 'College of Engineering Pune', 
      location: 'Pune, Maharashtra', 
      students: 1800, 
      departments: 10,
      established: 1858,
      requestDate: '2023-05-18'
    }
  ])

  // Mock student data for each college
  const [collegeStudents] = useState<Record<number, Student[]>>({
    1: [
      { id: 101, name: 'Rahul Sharma', department: 'Computer Engineering', year: 'TY', email: 'rahul@kjSomaiya.edu', phone: '+91 98765 43210', skills: ['React', 'Node.js', 'Python'], gpa: 8.7 },
      { id: 102, name: 'Priya Patel', department: 'Electronics Engineering', year: 'SY', email: 'priya@kjSomaiya.edu', phone: '+91 98765 43211', skills: ['C++', 'Embedded Systems', 'IoT'], gpa: 8.2 },
      { id: 103, name: 'Amit Kumar', department: 'Information Technology', year: 'LY', email: 'amit@kjSomaiya.edu', phone: '+91 98765 43212', skills: ['Java', 'Spring Boot', 'MySQL'], gpa: 9.1 },
      { id: 104, name: 'Sneha Desai', department: 'Computer Engineering', year: 'TY', email: 'sneha@kjSomaiya.edu', phone: '+91 98765 43213', skills: ['React', 'Angular', 'TypeScript'], gpa: 8.9 },
    ],
    2: [
      { id: 201, name: 'Vikram Singh', department: 'Mechanical Engineering', year: 'LY', email: 'vikram@vjti.edu', phone: '+91 98765 43220', skills: ['AutoCAD', 'SolidWorks', 'Thermodynamics'], gpa: 8.5 },
      { id: 202, name: 'Neha Gupta', department: 'Civil Engineering', year: 'TY', email: 'neha@vjti.edu', phone: '+91 98765 43221', skills: ['Structural Analysis', 'AutoCAD', 'Project Management'], gpa: 8.8 },
      { id: 203, name: 'Rohit Mehta', department: 'Electrical Engineering', year: 'SY', email: 'rohit@vjti.edu', phone: '+91 98765 43222', skills: ['Power Systems', 'PLC', 'MATLAB'], gpa: 8.3 },
    ],
    3: [
      { id: 301, name: 'Anjali Rao', department: 'Computer Science', year: 'LY', email: 'anjali@dypatil.edu', phone: '+91 98765 43230', skills: ['Python', 'Machine Learning', 'Data Science'], gpa: 9.0 },
      { id: 302, name: 'Suresh Iyer', department: 'Information Technology', year: 'TY', email: 'suresh@dypatil.edu', phone: '+91 98765 43231', skills: ['React', 'Node.js', 'MongoDB'], gpa: 8.6 },
    ],
    4: [
      { id: 401, name: 'Pooja Kulkarni', department: 'Electronics & Telecommunication', year: 'SY', email: 'pooja@coep.edu', phone: '+91 98765 43240', skills: ['Digital Signal Processing', 'VLSI', 'Embedded C'], gpa: 8.4 },
      { id: 402, name: 'Manoj Reddy', department: 'Mechanical Engineering', year: 'LY', email: 'manoj@coep.edu', phone: '+91 98765 43241', skills: ['CAD', 'CAM', 'Manufacturing Processes'], gpa: 8.1 },
      { id: 403, name: 'Kavita Nair', department: 'Chemical Engineering', year: 'TY', email: 'kavita@coep.edu', phone: '+91 98765 43242', skills: ['Process Design', 'Chemical Reaction Engineering', 'MATLAB'], gpa: 8.9 },
    ]
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const [studentSearchTerm, setStudentSearchTerm] = useState("")
  const [yearFilter, setYearFilter] = useState("all")
  const [branchFilter, setBranchFilter] = useState("all")

  // State for confirmation dialogs
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<{action: 'remove' | 'reject', collegeId: number} | null>(null)

  const handleRejectCollege = (collegeId: number) => {
    setPendingAction({ action: 'reject', collegeId })
    setShowRejectDialog(true)
  }

  const handleAcceptCollege = (collegeId: number) => {
    const collegeToAccept = pendingRequests.find(college => college.id === collegeId)
    if (collegeToAccept) {
      // Add connection date when accepting
      const connectedCollege = {
        ...collegeToAccept,
        connectionDate: new Date().toISOString().split('T')[0],
        requestDate: undefined
      }
      setConnectedColleges([...connectedColleges, connectedCollege])
      setPendingRequests(pendingRequests.filter(college => college.id !== collegeId))
    }
  }

  const handleRemoveCollege = (collegeId: number) => {
    setPendingAction({ action: 'remove', collegeId })
    setShowRemoveDialog(true)
  }

  const handleViewStudents = (college: College) => {
    setSelectedCollege(college)
  }

  const handleBackToColleges = () => {
    setSelectedCollege(null)
    setStudentSearchTerm("")
    setYearFilter("all")
    setBranchFilter("all")
  }

  const filteredConnectedColleges = connectedColleges.filter(college => 
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === "all" || (filter === "recent" && college.connectionDate && new Date(college.connectionDate) > new Date(Date.now() - 30*24*60*60*1000)))
  )

  const filteredPendingRequests = pendingRequests.filter(college => 
    college.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get unique years and branches for filtering
  const getUniqueYears = () => {
    if (!selectedCollege) return []
    const students = collegeStudents[selectedCollege.id] || []
    const years = [...new Set(students.map(student => student.year))]
    return years.sort()
  }

  const getUniqueBranches = () => {
    if (!selectedCollege) return []
    const students = collegeStudents[selectedCollege.id] || []
    const branches = [...new Set(students.map(student => student.department))]
    return branches.sort()
  }

  // Filter students based on search term and filters
  const filteredStudents = selectedCollege 
    ? (collegeStudents[selectedCollege.id] || []).filter(student => 
        (student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        student.department.toLowerCase().includes(studentSearchTerm.toLowerCase())) &&
        (yearFilter === "all" || student.year === yearFilter) &&
        (branchFilter === "all" || student.department === branchFilter)
      )
    : []

  const confirmAction = () => {
    if (!pendingAction) return

    if (pendingAction.action === 'reject') {
      setPendingRequests(pendingRequests.filter(college => college.id !== pendingAction.collegeId))
    } else if (pendingAction.action === 'remove') {
      setConnectedColleges(connectedColleges.filter(college => college.id !== pendingAction.collegeId))
    }

    setPendingAction(null)
    setShowRemoveDialog(false)
    setShowRejectDialog(false)
  }

  const cancelAction = () => {
    setPendingAction(null)
    setShowRemoveDialog(false)
    setShowRejectDialog(false)
  }

  // If viewing students, show student list
  if (selectedCollege) {
    const uniqueYears = getUniqueYears()
    const uniqueBranches = getUniqueBranches()

    return (
      <DashboardLayout userRole="company">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" onClick={handleBackToColleges} className="mb-2">
                ← Back to Colleges
              </Button>
              <h1 className="text-3xl font-bold">{selectedCollege.name}</h1>
              <p className="text-muted-foreground">Students from this college</p>
            </div>
          </div>

          {/* Student Search and Filters */}
          <Card className="shadow-sm border border-muted">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search students..." 
                    className="pl-10 focus-visible:ring-2 focus-visible:ring-primary" 
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Filter by Year</label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="focus:ring-2 focus:ring-primary">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {uniqueYears.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Filter by Branch</label>
                  <Select value={branchFilter} onValueChange={setBranchFilter}>
                    <SelectTrigger className="focus:ring-2 focus:ring-primary">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {uniqueBranches.map(branch => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student List */}
          <Card className="shadow-sm border border-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Student Directory
              </CardTitle>
              <CardDescription>
                {filteredStudents.length} students from {selectedCollege.name}
                {yearFilter !== "all" && ` • Year: ${yearFilter}`}
                {branchFilter !== "all" && ` • Branch: ${branchFilter}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredStudents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStudents.map((student) => (
                    <Card key={student.id} className="hover:shadow-md transition-all duration-300 hover:border-primary/30">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                            <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${student.name.charAt(0)}`} />
                            <AvatarFallback className="font-medium">{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">{student.department}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Year</span>
                            <Badge variant="secondary" className="text-xs">
                              {student.year}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">GPA</span>
                            <span className="text-sm font-medium">{student.gpa}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground mb-2">Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {student.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-muted">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 hover:bg-primary/5">
                              View Profile
                            </Button>
                            <Button size="sm" className="flex-1">
                              Contact
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No students found</h3>
                  <p className="text-muted-foreground">
                    {studentSearchTerm || yearFilter !== "all" || branchFilter !== "all" 
                      ? "No students match your search or filters" 
                      : "No students available from this college"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  // Otherwise show college management
  return (
    <DashboardLayout userRole="company">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">College Management</h1>
            <p className="text-muted-foreground">Manage your college partnerships and connections</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-sm border border-muted">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search colleges..." 
                  className="pl-10 focus-visible:ring-2 focus-visible:ring-primary" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={filter === "all" ? "default" : "outline"} 
                  onClick={() => setFilter("all")}
                  className={filter === "all" ? "shadow-sm" : ""}
                >
                  All Colleges
                </Button>
                <Button 
                  variant={filter === "recent" ? "default" : "outline"} 
                  onClick={() => setFilter("recent")}
                  className={filter === "recent" ? "shadow-sm" : ""}
                >
                  Recently Added
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connected Colleges Section */}
        <Card className="shadow-sm border border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Connected Colleges
            </CardTitle>
            <CardDescription>
              Colleges you are currently partnered with
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredConnectedColleges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredConnectedColleges.map((college) => (
                  <Card key={college.id} className="hover:shadow-md transition-all duration-300 hover:border-primary/30">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{college.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{college.location}</span>
                          </div>
                        </div>
                        <Badge variant="secondary">Connected</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Students</p>
                          <p className="font-medium">{college.students}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Departments</p>
                          <p className="font-medium">{college.departments}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Established</p>
                          <p className="font-medium">{college.established}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Connected On</p>
                          <p className="font-medium">
                            {college.connectionDate ? new Date(college.connectionDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 hover:bg-primary/5"
                          onClick={() => handleViewStudents(college)}
                        >
                          View Students
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveCollege(college.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Building className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No connected colleges found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "No colleges match your search" : "You haven't connected with any colleges yet"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Requests Section */}
        <Card className="shadow-sm border border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Pending Requests
            </CardTitle>
            <CardDescription>
              Colleges that have requested to partner with you
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPendingRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPendingRequests.map((college) => (
                  <Card key={college.id} className="border-yellow-200 hover:shadow-md transition-all duration-300 hover:border-yellow-300">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{college.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{college.location}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                          Pending
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Students</p>
                          <p className="font-medium">{college.students}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Departments</p>
                          <p className="font-medium">{college.departments}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Established</p>
                          <p className="font-medium">{college.established}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Requested On</p>
                          <p className="font-medium">
                            {college.requestDate ? new Date(college.requestDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleAcceptCollege(college.id)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRejectCollege(college.id)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <GraduationCap className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No pending requests</h3>
                <p className="text-muted-foreground">
                  There are no pending college partnership requests at this time
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* College Statistics */}
        <Card className="shadow-sm border border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Partnership Statistics
            </CardTitle>
            <CardDescription>
              Overview of your college partnerships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-3xl font-bold text-blue-600">{connectedColleges.length}</div>
                <div className="text-sm text-muted-foreground mt-1">Connected Colleges</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</div>
                <div className="text-sm text-muted-foreground mt-1">Pending Requests</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="text-3xl font-bold text-green-600">
                  {connectedColleges.reduce((total, college) => total + college.students, 0)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Total Students</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Remove College Confirmation Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove College Partnership</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this college from your partnerships? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelAction}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmAction}>
              Remove College
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject College Confirmation Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject College Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this college's partnership request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelAction}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmAction}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
