"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, User, Edit, Eye, Upload, UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import { useCallback, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useFaculty } from "@/lib/convex-hooks"
import { FacultyStatusToggle } from "@/components/admin/faculty-status-toggle"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@/lib/contexts/AuthContext"
import { toast } from "sonner"
import * as XLSX from 'xlsx'

interface UIFaculty {
  id: string
  name: string
  department: string
  email: string
  phone?: string
  employeeId?: string
  designation?: string
  assignedStudents: number
  status: "Active" | "Inactive" | "On Leave"
  isActive: boolean
}

export default function FacultyPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const q = searchParams.get('q') || ''
  const department = searchParams.get('department') || 'all'
  const status = searchParams.get('status') || 'all'

  // Excel upload states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const bulkCreateFaculty = useAction(api.actions.bulkCreateFaculty)

  // ✅ Local state for optimistic updates
  const [localFacultyStatus, setLocalFacultyStatus] = useState<Record<string, boolean>>({})

  // ✅ Create stable query params
  const queryParams = useMemo(() => ({
    q: q || undefined,
    department: department !== 'all' ? department : undefined,
    collegeId: user?.profile?.collegeId, // Filter by college
    take: 50,
    skip: 0,
  }), [q, department, user?.profile?.collegeId])

  // ✅ Use Convex hook
  const facultyData = useFaculty(queryParams)
  const loading = facultyData === undefined
  const error = facultyData === null ? "Failed to load faculty" : undefined

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
    toast.loading("Processing Excel file...", { id: "upload-faculty" })

    try {
      const data = await excelFile.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      if (jsonData.length === 0) {
        toast.error("Empty File", {
          description: "The Excel file appears to be empty or invalid.",
          id: "upload-faculty"
        })
        return
      }

      toast.loading(`Processing ${jsonData.length} faculty members...`, { id: "upload-faculty" })

      const facultyData = jsonData.map((row: any) => {
        if (!row.name || !row.email || !row.department) {
          throw new Error(`Missing required fields for: ${row.email || 'Unknown'}`)
        }

        const password = row.password || generateRandomPassword()

        return {
          email: row.email,
          password: password,
          name: row.name,
          department: row.department,
          designation: row.designation || "",
          phone: row.phone || "",
          canMentor: row.canMentor === "true" || row.canMentor === true || false,
          collegeId: user.profile.collegeId,
        }
      })

      const result = await bulkCreateFaculty({ facultyData })

      if (result.successCount > 0) {
        toast.success("Faculty Added Successfully!", {
          description: `${result.successCount} faculty members were created successfully.`,
          id: "upload-faculty"
        })

        if (result.createdFaculty && result.createdFaculty.length > 0) {
          const credentialsWs = XLSX.utils.json_to_sheet(result.createdFaculty)
          const credentialsWb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(credentialsWb, credentialsWs, "Faculty_Credentials")
          XLSX.writeFile(credentialsWb, "faculty_credentials.xlsx")
          
          toast.success("Credentials Downloaded", {
            description: "Login credentials file has been downloaded automatically."
          })
        }
      }

      if (result.errorCount > 0) {
        toast.warning("Some Faculty Failed", {
          description: `${result.errorCount} faculty members could not be created. Check console for details.`
        })
        
        if (result.errors) {
          console.error("Faculty creation errors:", result.errors)
        }
      }

      setIsAddDialogOpen(false)
      setExcelFile(null)
    } catch (error) {
      console.error("Excel upload error:", error)
      toast.error("Upload Failed", {
        description: error instanceof Error ? error.message : "Error processing Excel file. Please check the format.",
        id: "upload-faculty"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const template = [
      {
        name: "Dr. Jane Smith",
        email: "jane.smith@example.com",
        department: "Computer Science",
        designation: "Professor",
        phone: "9876543210",
        canMentor: true,
        password: "optional_password"
      }
    ]

    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Faculty")
    XLSX.writeFile(wb, "faculty_template.xlsx")
    
    toast.success("Template Downloaded", {
      description: "Faculty template has been downloaded successfully."
    })
  }

  // ✅ Normalize faculty data with local status overrides
  const faculty = useMemo(() => {
    if (!facultyData) return []
    
    let facultyArray = []
    if (Array.isArray(facultyData)) {
      facultyArray = facultyData
    } else if (facultyData.faculty && Array.isArray(facultyData.faculty)) {
      facultyArray = facultyData.faculty
    } else {
      console.log("Unexpected faculty data structure:", facultyData)
      return []
    }

    return facultyArray.map((f: any) => {
      // ✅ Use local status if available, otherwise use server status
      const currentStatus = localFacultyStatus[f.id] !== undefined 
        ? localFacultyStatus[f.id] 
        : f.isActive || false

      return {
        id: f.id || f._id,
        name: f.name || `${f.firstName || ''} ${f.lastName || ''}`.trim(),
        department: f.department,
        email: f.email,
        phone: f.phone,
        employeeId: f.employeeId,
        designation: f.designation,
        assignedStudents: f.menteeCount || 0,
        status: currentStatus ? 'Active' : 'Inactive', // ✅ Use computed status
        isActive: currentStatus, // ✅ Boolean status
      }
    })
  }, [facultyData, localFacultyStatus])

  // ✅ Client-side filtering
  const filteredFaculty = useMemo(() => {
    let filtered = faculty

    // Apply search filter
    if (q.trim()) {
      const searchTerm = q.toLowerCase().trim()
      filtered = filtered.filter(f => 
        f.name?.toLowerCase().includes(searchTerm) ||
        f.email?.toLowerCase().includes(searchTerm) ||
        f.employeeId?.toLowerCase().includes(searchTerm)
      )
    }

    // Apply department filter
    if (department !== 'all') {
      filtered = filtered.filter(f => f.department === department)
    }

    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter(f => f.status.toLowerCase().replace(' ', '-') === status)
    }

    return filtered
  }, [faculty, q, department, status])

  // ✅ Status change handler
  const handleStatusChange = useCallback((facultyId: string, newStatus: boolean) => {
    setLocalFacultyStatus(prev => ({
      ...prev,
      [facultyId]: newStatus
    }))
  }, [])

  // ✅ Stable callbacks
  const setParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/admin/faculty?${params.toString()}`)
  }, [searchParams, router])

  const getStatusVariant = useCallback((status: string) => {
    switch (status) {
      case "Active": return "default"
      case "On Leave": return "secondary"
      case "Inactive": return "outline"
      default: return "secondary"
    }
  }, [])

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Faculty Management</h1>
            <p className="text-muted-foreground">Manage faculty members and student assignments</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Faculty
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Faculty</DialogTitle>
                  <DialogDescription>
                    Choose how you want to add faculty to the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Button asChild className="w-full h-16 flex-col gap-2">
                    <Link href="/admin/faculty/new">
                      <UserPlus className="w-6 h-6" />
                      <span>Add Single Faculty</span>
                      <span className="text-xs text-muted-foreground">Fill out a form for one faculty member</span>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Faculty</p>
                  <p className="text-2xl font-bold">{filteredFaculty.length}</p>
                </div>
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Faculty</p>
                  <p className="text-2xl font-bold">{filteredFaculty.filter(f => f.status === 'Active').length}</p>
                </div>
                <User className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inactive Faculty</p>
                  <p className="text-2xl font-bold">{filteredFaculty.filter(f => f.status === 'Inactive').length}</p>
                </div>
                <User className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students Assigned</p>
                  <p className="text-2xl font-bold">{filteredFaculty.reduce((sum, f) => sum + f.assignedStudents, 0)}</p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or email"
                    className="pl-8"
                    defaultValue={q}
                    onKeyDown={(e) => { if (e.key === 'Enter') setParam('q', (e.target as HTMLInputElement).value) }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={(v) => setParam('department', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setParam('status', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setParam('q', '')
                    setParam('department', 'all')
                    setParam('status', 'all')
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Faculty List */}
        <div className="space-y-4">
          {loading && <div className="text-sm text-muted-foreground">Loading faculty...</div>}
          {error && <div className="text-sm text-destructive">{error}</div>}
          {!loading && !error && filteredFaculty.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No faculty members found.</p>
            </div>
          )}
          {!loading && !error && filteredFaculty.map((f) => (
            <Card key={f.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>{f.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{f.name}</h3>
                      </div>
                      <div className="grid gap-1 md:grid-cols-2 text-sm text-muted-foreground mb-3">
                        <div>{f.email}</div>
                        <div>{f.department}</div>
                        {f.employeeId && <div>ID: {f.employeeId}</div>}
                        {f.designation && <div>{f.designation}</div>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Assigned Students: {f.assignedStudents}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={getStatusVariant(f.status)}>
                      {f.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/faculty/${f.id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/faculty/${f.id}/assign`}>
                          <User className="w-4 h-4 mr-1" />
                          Assign
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/faculty/${f.id}/edit`}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
                {/* ✅ Status Toggle with optimistic updates */}
                <div className="mt-4">
                  <FacultyStatusToggle
                    facultyId={f.id}
                    currentStatus={f.isActive}
                    facultyName={f.name}
                    onStatusChange={(newStatus) => handleStatusChange(f.id, newStatus)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}