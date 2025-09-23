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
  Upload,
  UserPlus,
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
import { useCallback, useEffect, useMemo, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { useSearchParams, useRouter } from "next/navigation"
import { useStudents } from "@/lib/convex-hooks"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@/lib/contexts/AuthContext"
import { toast } from "sonner"
import Link from "next/link"
import * as XLSX from 'xlsx'

export default function AdminStudents() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()

  const tab = (searchParams.get('tab') || 'all') as 'all'|'active'|'placed'|'inactive'|'pending'
  const q = searchParams.get('q') || ''
  const dept = searchParams.get('department') || 'all'
  const year = searchParams.get('year') || 'all'

  // Excel upload states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const bulkCreateStudents = useAction(api.actions.bulkCreateStudents)

  // ✅ Create stable query params to prevent infinite re-renders
  const queryParams = useMemo(() => {
    const statusFilter = (() => {
      if (tab === 'active') return 'unplaced'
      if (tab === 'placed') return 'placed'
      if (tab === 'inactive') return 'inactive'
      return undefined
    })()

    return {
      q: q || undefined,
      department: dept !== 'all' ? dept : undefined,
      year: year !== 'all' ? year : undefined,
      status: statusFilter,
      collegeId: user?.profile?.collegeId, // Filter by college
      take: 100,
      skip: 0,
    }
  }, [q, dept, year, tab, user?.profile?.collegeId])

  // ✅ Call query only once with stable params
  const studentsData = useStudents(queryParams)

  const loading = studentsData === undefined
  const error = studentsData === null ? "Failed to load students" : undefined

  // ✅ Normalize the data structure once
  const students = useMemo(() => {
    if (!studentsData) return []
    
    // Handle the nested structure you're getting
    let studentArray = []
    if (Array.isArray(studentsData)) {
      studentArray = studentsData
    } else if (studentsData.student && Array.isArray(studentsData.student)) {
      studentArray = studentsData.student
    } else {
      console.log("Unexpected data structure:", studentsData)
      return []
    }

    return studentArray.map((s: any) => ({
      id: s.id || s._id,
      name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim(),
      email: s.email,
      phone: s.phone,
      department: s.department,
      year: s.year,
      cgpa: s.cgpa,
      status: s.isPlaced ? 'Placed' : (s.status === 'Active' ? 'Active' : 'Inactive'),
      applications: s.recentApplications?.length ?? 0,
      interviews: 0,
      offers: s.placement ? 1 : 0,
      skills: s.skills ?? [],
      lastActive: s.lastActive || "2024-01-15",
      profileCompletion: Math.floor(Math.random() * 100), // Mock data
      username: s.username || s.rollNumber,
      gpa: s.cgpa || "N/A",
    }))
  }, [studentsData])

  // Excel upload functions
  const generateRandomPassword = () => {
    const length = 8
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return password
  }

  const handleExcelUpload = async () => {
    if (!excelFile) {
      toast.error("No File Selected", {
        description: "Please select an Excel file to upload."
      })
      return
    }

    if (!user?.profile?.collegeId) {
      toast.error("Authentication Error", {
        description: "Could not determine your college. Please try again."
      })
      return
    }

    setIsUploading(true)
    toast.loading("Processing Excel file...", { id: "upload-students" })

    try {
      const data = await excelFile.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      if (jsonData.length === 0) {
        toast.error("Empty File", {
          description: "The Excel file appears to be empty or invalid.",
          id: "upload-students"
        })
        return
      }

      toast.loading(`Processing ${jsonData.length} students...`, { id: "upload-students" })

      const studentsData = jsonData.map((row: any) => {
        if (!row.firstName || !row.lastName || !row.email || !row.rollNumber) {
          throw new Error(`Missing required fields for: ${row.email || 'Unknown'}`)
        }

        const password = row.password || generateRandomPassword()

        return {
          email: row.email,
          password: password,
          firstName: row.firstName,
          lastName: row.lastName,
          rollNumber: row.rollNumber,
          phone: row.phone || "",
          department: row.department || "Not Specified",
          year: row.year || "FY",
          semester: row.semester ? parseInt(row.semester) : 1,
          cgpa: row.cgpa ? parseFloat(row.cgpa) : undefined,
          skills: row.skills ? row.skills.split(',').map((s: string) => s.trim()) : [],
          resumeUrl: row.resumeUrl || "",
          collegeId: user.profile.collegeId,
        }
      })

      const result = await bulkCreateStudents({ studentsData })

      if (result.successCount > 0) {
        toast.success("Students Added Successfully!", {
          description: `${result.successCount} students were created successfully.`,
          id: "upload-students"
        })

        if (result.createdStudents && result.createdStudents.length > 0) {
          const credentialsWs = XLSX.utils.json_to_sheet(result.createdStudents)
          const credentialsWb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(credentialsWb, credentialsWs, "Student_Credentials")
          XLSX.writeFile(credentialsWb, "student_credentials.xlsx")
          
          toast.success("Credentials Downloaded", {
            description: "Login credentials file has been downloaded automatically."
          })
        }
      }

      if (result.errorCount > 0) {
        toast.warning("Some Students Failed", {
          description: `${result.errorCount} students could not be created. Check console for details.`
        })
        
        if (result.errors) {
          console.error("Student creation errors:", result.errors)
        }
      }

      setIsAddDialogOpen(false)
      setExcelFile(null)
    } catch (error) {
      console.error("Excel upload error:", error)
      toast.error("Upload Failed", {
        description: error instanceof Error ? error.message : "Error processing Excel file. Please check the format.",
        id: "upload-students"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const template = [
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        rollNumber: "2021001",
        department: "Computer Science",
        year: "TY",
        semester: 5,
        cgpa: 8.5,
        phone: "9876543210",
        skills: "JavaScript, React, Node.js",
        resumeUrl: "",
        password: "optional_password"
      }
    ]

    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Students")
    XLSX.writeFile(wb, "student_template.xlsx")
    
    toast.success("Template Downloaded", {
      description: "Student template has been downloaded successfully."
    })
  }

  // ✅ Client-side filtering
  const filteredStudents = useMemo(() => {
    let filtered = students

    if (q.trim()) {
      const searchTerm = q.toLowerCase().trim()
      filtered = filtered.filter(student => 
        student.name?.toLowerCase().includes(searchTerm) ||
        student.email?.toLowerCase().includes(searchTerm) ||
        student.department?.toLowerCase().includes(searchTerm)
      )
    }

    if (dept !== 'all') {
      filtered = filtered.filter(student => student.department === dept)
    }

    if (year !== 'all') {
      filtered = filtered.filter(student => student.year === year)
    }

    return filtered
  }, [students, q, dept, year])

  // ✅ Filter by tab status on client side
  const displayStudents = useMemo(() => {
    if (tab === 'active') return filteredStudents.filter(s => s.status === 'Active')
    if (tab === 'placed') return filteredStudents.filter(s => s.status === 'Placed')
    if (tab === 'inactive') return filteredStudents.filter(s => s.status === 'Inactive')
    return filteredStudents
  }, [filteredStudents, tab])

  const total = filteredStudents.length

  // ✅ State management for dialogs
  const [editingStudent, setEditingStudent] = useState<any | null>(null)
  const [viewingStudent, setViewingStudent] = useState<any | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [deactivatingStudent, setDeactivatingStudent] = useState<any | null>(null)
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)

  // ✅ Stable callbacks
  const setParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') params.set(key, value)
    else params.delete(key)
    if (key !== 'tab') params.set('tab', tab)
    router.push(`/admin/students?${params.toString()}`)
  }, [searchParams, tab, router])

  const setTab = useCallback((value: string) => {
    setParam('tab', value)
  }, [setParam])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Active": return "bg-green-500"
      case "Placed": return "bg-blue-500"
      case "Inactive": return "bg-gray-500"
      default: return "bg-gray-500"
    }
  }, [])

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "Active": return <CheckCircle className="w-4 h-4 text-green-500" />
      case "Placed": return <GraduationCap className="w-4 h-4 text-blue-500" />
      case "Inactive": return <AlertTriangle className="w-4 h-4 text-gray-500" />
      default: return <XCircle className="w-4 h-4 text-red-500" />
    }
  }, [])

  const handleViewStudent = useCallback((student: any) => {
    setViewingStudent(student)
    setIsViewDialogOpen(true)
  }, [])

  const handleEditStudent = useCallback((student: any) => {
    setEditingStudent(student)
    setIsEditDialogOpen(true)
  }, [])

  const handleSaveStudent = useCallback(() => {
    setIsEditDialogOpen(false)
    setEditingStudent(null)
  }, [])

  
  const handleDeactivateStudent = useCallback((student: any) => {
    setDeactivatingStudent(student)
    studentsData.updateStudentStatusAction({studentId: student.id, isActive: false})
    setIsDeactivateDialogOpen(true)
  }, [])

  const confirmDeactivateStudent = useCallback(() => {
    // Handle deactivate logic here
    setIsDeactivateDialogOpen(false)
    setDeactivatingStudent(null)
  }, [])

  const handleActivateStudent = useCallback((studentId: string) => {
    studentsData.updateStudentStatusAction({studentId, isActive: true})
  }, [])

  const updateEditingStudent = useCallback((field: string, value: any) => {
    if (editingStudent) {
      setEditingStudent(prev => ({ ...prev, [field]: value }))
    }
  }, [editingStudent])

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
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Students</DialogTitle>
                  <DialogDescription>
                    Choose how you want to add students to the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Button asChild className="w-full h-16 flex-col gap-2">
                    <Link href="/admin/students/new">
                      <UserPlus className="w-6 h-6" />
                      <span>Add Single Student</span>
                      <span className="text-xs text-muted-foreground">Fill out a form for one student</span>
                    </Link>
                  </Button>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      <Label htmlFor="excel-upload" className="text-base font-medium">
                        Upload Excel File
                      </Label>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={downloadTemplate}
                      className="w-full text-sm"
                    >
                      Download Template
                    </Button>
                    
                    <Input
                      id="excel-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                      className="file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-medium"
                    />
                    
                    {excelFile && (
                      <div className="text-sm text-muted-foreground">
                        Selected: {excelFile.name}
                      </div>
                    )}
                    
                    <Button 
                      onClick={handleExcelUpload} 
                      className="w-full" 
                      disabled={!excelFile || isUploading || !user?.profile?.collegeId}
                    >
                      {isUploading ? "Processing..." : "Upload and Process Excel"}
                    </Button>
                    
                    <p className="text-xs text-muted-foreground">
                      Random passwords will be generated if not provided. A credentials file will be downloaded.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{total}</p>
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
                  <p className="text-2xl font-bold">{filteredStudents.filter(s => s.status === 'Active').length}</p>
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
                  <p className="text-2xl font-bold">{filteredStudents.filter(s => s.status === 'Placed').length}</p>
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
                  <p className="text-2xl font-bold">
                    {filteredStudents.length > 0 ? 
                      (filteredStudents.reduce((sum, s) => sum + (s.applications || 0), 0) / filteredStudents.length).toFixed(1) : 
                      '0'
                    }
                  </p>
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
                    defaultValue={q}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setParam('q', (e.target as HTMLInputElement).value)
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select defaultValue={dept} onValueChange={(v) => setParam('department', v)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue={year} onValueChange={(v) => setParam('year', v)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="FY">FY</SelectItem>
                    <SelectItem value="SY">SY</SelectItem>
                    <SelectItem value="TY">TY</SelectItem>
                    <SelectItem value="LY">LY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue={tab} value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Students ({filteredStudents.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({filteredStudents.filter(s => s.status === 'Active').length})</TabsTrigger>
            <TabsTrigger value="placed">Placed ({filteredStudents.filter(s => s.status === 'Placed').length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({filteredStudents.filter(s => s.status === 'Inactive').length})</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading && <div className="text-sm text-muted-foreground">Loading students...</div>}
            {error && <div className="text-sm text-destructive">{error}</div>}
            {!loading && !error && displayStudents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No students found.</p>
              </div>
            )}
            {!loading && !error && displayStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`/placeholder-40x40.png?height=48&width=48&text=${student.name?.[0] || 'S'}`} />
                        <AvatarFallback>{student.name?.[0] || 'S'}</AvatarFallback>
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
                          {student.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {student.phone}
                            </div>
                          )}
                          <div>{student.department}</div>
                          <div>{student.year}</div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          {student.cgpa && <span>CGPA: {student.cgpa}</span>}
                          <span>{student.applications} applications</span>
                          <span>{student.interviews} interviews</span>
                          <span>{student.offers} offers</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {student.skills?.slice(0, 4).map((skill: any, index: number) => (
                            <Badge key={`${skill}-${index}`} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {student.skills?.length > 4 && (
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
                      {student.status === "Inactive" ? (
                        <Button 
                          size="sm" 
                          onClick={() => handleActivateStudent(student.id)}
                        >
                          Activate
                        </Button>
                      ) : (
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
            {displayStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`/placeholder-40x40.png?height=48&width=48&text=${student.name?.[0] || 'S'}`} />
                        <AvatarFallback>{student.name?.[0] || 'S'}</AvatarFallback>
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
                          {student.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {student.phone}
                            </div>
                          )}
                          <div>{student.department}</div>
                          <div>{student.year}</div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          {student.cgpa && <span>CGPA: {student.cgpa}</span>}
                          <span>{student.applications} applications</span>
                          <span>{student.interviews} interviews</span>
                          <span>{student.offers} offers</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {student.skills?.slice(0, 4).map((skill: any, index: number) => (
                            <Badge key={`${skill}-${index}`} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {student.skills?.length > 4 && (
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
                      {student.status === "Inactive" ? (
                        <Button 
                          size="sm" 
                          onClick={() => handleActivateStudent(student.id)}
                        >
                          Activate
                        </Button>
                      ) : (
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

          <TabsContent value="placed" className="space-y-4">
            {displayStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`/placeholder-40x40.png?height=48&width=48&text=${student.name?.[0] || 'S'}`} />
                        <AvatarFallback>{student.name?.[0] || 'S'}</AvatarFallback>
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
                          {student.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {student.phone}
                            </div>
                          )}
                          <div>{student.department}</div>
                          <div>{student.year}</div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          {student.cgpa && <span>CGPA: {student.cgpa}</span>}
                          <span>{student.applications} applications</span>
                          <span>{student.interviews} interviews</span>
                          <span>{student.offers} offers</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {student.skills?.slice(0, 4).map((skill: any, index: number) => (
                            <Badge key={`${skill}-${index}`} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {student.skills?.length > 4 && (
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
                      {student.status === "Inactive" ? (
                        <Button 
                          size="sm" 
                          onClick={() => handleActivateStudent(student.id)}
                        >
                          Activate
                        </Button>
                      ) : (
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

          <TabsContent value="inactive" className="space-y-4">
            {displayStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`/placeholder-40x40.png?height=48&width=48&text=${student.name?.[0] || 'S'}`} />
                        <AvatarFallback>{student.name?.[0] || 'S'}</AvatarFallback>
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
                          {student.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {student.phone}
                            </div>
                          )}
                          <div>{student.department}</div>
                          <div>{student.year}</div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          {student.cgpa && <span>CGPA: {student.cgpa}</span>}
                          <span>{student.applications} applications</span>
                          <span>{student.interviews} interviews</span>
                          <span>{student.offers} offers</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {student.skills?.slice(0, 4).map((skill: any, index: number) => (
                            <Badge key={`${skill}-${index}`} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {student.skills?.length > 4 && (
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
                      {student.status === "Inactive" ? (
                        <Button 
                          size="sm" 
                          onClick={() => handleActivateStudent(student.id)}
                        >
                          Activate
                        </Button>
                      ) : (
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
                    <AvatarImage src={`/placeholder-40x40.png?height=96&width=96&text=${viewingStudent.name?.[0] || 'S'}`} />
                    <AvatarFallback className="text-2xl">{viewingStudent.name?.[0] || 'S'}</AvatarFallback>
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
                      <p className="text-sm">{viewingStudent.phone || "Not provided"}</p>
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
                    {viewingStudent.skills?.map((skill: any, index: number) => (
                      <Badge key={`${skill}-${index}`} variant="secondary">
                        {skill}
                      </Badge>
                    )) || <p className="text-sm text-muted-foreground">No skills listed</p>}
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{viewingStudent.applications || 0}</p>
                        <p className="text-sm text-muted-foreground">Applications</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{viewingStudent.interviews || 0}</p>
                        <p className="text-sm text-muted-foreground">Interviews</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{viewingStudent.offers || 0}</p>
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
                    value={editingStudent.name || ""}
                    onChange={(e) => updateEditingStudent("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingStudent.email || ""}
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
                    value={editingStudent.phone || ""}
                    onChange={(e) => updateEditingStudent("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    value={editingStudent.university || ""}
                    onChange={(e) => updateEditingStudent("university", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={editingStudent.department || ""}
                    onChange={(e) => updateEditingStudent("department", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select
                    value={editingStudent.year || ""}
                    onValueChange={(value) => updateEditingStudent("year", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FY">FY</SelectItem>
                      <SelectItem value="SY">SY</SelectItem>
                      <SelectItem value="TY">TY</SelectItem>
                      <SelectItem value="LY">LY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    value={editingStudent.gpa || ""}
                    onChange={(e) => updateEditingStudent("gpa", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editingStudent.status || "Active"}
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
                  value={editingStudent.skills?.join(", ") || ""}
                  onChange={(e) => updateEditingStudent("skills", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
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