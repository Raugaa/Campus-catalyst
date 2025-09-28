"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Search, 
  Plus, 
  User, 
  Edit, 
  Eye, 
  Upload, 
  UserPlus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import { useCallback, useMemo, useState, useEffect } from "react"
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
  const [searchQuery, setSearchQuery] = useState(q); // Local state for search input

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15) // Show 15 faculty per page

  // Excel upload states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const bulkCreateFaculty = useAction(api.actions.bulkCreateFaculty)

  // Local state for optimistic updates
  const [localFacultyStatus, setLocalFacultyStatus] = useState<Record<string, boolean>>({})

  // Remove the debounce effect that's causing reloads
  // Comment out or remove this useEffect:
  /*
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setParam('q', searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  */

  // Add this new debounce effect instead
  const [debouncedSearch, setDebouncedSearch] = useState(q);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 600);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Create stable query params
  const queryParams = useMemo(() => ({
    q: debouncedSearch || undefined,
    department: department !== 'all' ? department : undefined,
    collegeId: user?.profile?.collegeId,
    take: 200, // Load more for client-side pagination
    skip: 0,
  }), [debouncedSearch, department, user?.profile?.collegeId])

  // Use Convex hook
  const facultyData = useFaculty(queryParams)
  const loading = facultyData === undefined
  const error = facultyData === null ? "Failed to load faculty" : undefined

  // Helper functions
  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === 'all' || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/admin/faculty?${params.toString()}`)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default'
      case 'Inactive': return 'secondary'
      case 'On Leave': return 'outline'
      default: return 'outline'
    }
  }

  // Excel functions
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
        description: "Unable to determine your college. Please contact support."
      })
      return
    }

    setIsUploading(true)

    try {
      const data = await excelFile.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      console.log("Parsed Excel data:", jsonData)

      const facultyData = jsonData.map((row: any) => {
        if (!row.email || !row.name || !row.department) {
          throw new Error(`Missing required fields for: ${row.email || 'Unknown'}`)
        }

        const password = row.password || generateRandomPassword()

        return {
          email: row.email,
          password: password,
          firstName: row.firstName,
          lastName: row.lastName,
          department: row.department,
          designation: row.designation || "",
          phone: row.phone || "",
          canMentor: row.canMentor === "true" || row.canMentor === true || false,
          collegeId: user.profile.collegeId,
        }
      })

      const result = await bulkCreateFaculty({ facultyDatas: facultyData })

      if (result.successCount > 0) {
        toast.success("Faculty Added Successfully!", {
          description: `${result.successCount} faculty members were created successfully.`,
          id: "upload-faculty"
        })

        if (result.createdFaculty && result.createdFaculty.length > 0) {
          const credentialsWs = XLSX.utils.json_to_sheet(result.createdFaculty)
          const credentialsWb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(credentialsWb, credentialsWs, "Faculty Credentials")
          XLSX.writeFile(credentialsWb, "faculty_credentials.xlsx")

          toast.success("Credentials Downloaded!", {
            description: "Faculty login credentials have been downloaded as an Excel file.",
            id: "download-credentials"
          })
        }

        setExcelFile(null)
        setIsAddDialogOpen(false)
      }

      if (result.errorCount > 0) {
        toast.error(`Some Faculty Failed`, {
          description: `${result.errorCount} faculty could not be created. Please check the data and try again.`,
          id: "upload-error"
        })
      }

    } catch (error: any) {
      console.error("Excel upload error:", error)
      toast.error("Upload Failed", {
        description: error.message || "Failed to upload faculty. Please check the file format.",
        id: "upload-error"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const template = [
      {
        email: "faculty@college.edu",
        firstName: "Dr.",
        lastName: "John",
        department: "Computer Science Engineering",
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

  // Process faculty data
  const faculty: UIFaculty[] = useMemo(() => {
    if (!facultyData) return []
    
    // The faculty hook returns a single faculty object, not an array
    const facultyArray = Array.isArray(facultyData) ? facultyData : [facultyData]

    return facultyArray.map((f: any) => {
      const currentStatus = localFacultyStatus[f.id || f._id] !== undefined 
        ? localFacultyStatus[f.id || f._id] 
        : f.isActive || false

      return {
        id: f.id || f._id,
        name: f.name,
        department: f.department,
        email: f.email,
        phone: f.phone,
        employeeId: f.employeeId,
        designation: f.designation,
        assignedStudents: f.mentees?.length || 0,
        status: currentStatus ? 'Active' : 'Inactive',
        isActive: currentStatus,
      }
    })
  }, [facultyData, localFacultyStatus])

  // Client-side filtering
  const filteredFaculty = useMemo(() => {
    let filtered = faculty

    if (debouncedSearch.trim()) {
      const searchTerm = debouncedSearch.toLowerCase().trim()
      filtered = filtered.filter(f => 
        f.name?.toLowerCase().includes(searchTerm) ||
        f.email?.toLowerCase().includes(searchTerm) ||
        f.employeeId?.toLowerCase().includes(searchTerm)
      )
    }

    if (department !== 'all') {
      filtered = filtered.filter(f => f.department === department)
    }

    if (status !== 'all') {
      filtered = filtered.filter(f => f.status.toLowerCase().replace(' ', '-') === status)
    }

    return filtered
  }, [faculty, debouncedSearch, department, status])

  // Pagination
  const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage)
  const paginatedFaculty = filteredFaculty.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Status change handler
  const handleStatusChange = useCallback((facultyId: string, newStatus: boolean) => {
    setLocalFacultyStatus(prev => ({
      ...prev,
      [facultyId]: newStatus
    }))
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
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Selected: {excelFile.name}
                        </p>
                        <Button 
                          onClick={handleExcelUpload} 
                          disabled={isUploading}
                          className="w-full"
                        >
                          {isUploading ? "Uploading..." : "Upload Faculty"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
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
            <div className="grid gap-4 md:grid-cols-4 items-end">
              <div className="space-y-2 min-w-0">
                <Label htmlFor="search">Search Faculty</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2 min-w-0">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={(value) => setParam('department', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Computer Science Engineering">Computer Science</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Electronics and Computer Science Engineering">EXTC</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical</SelectItem>
                    <SelectItem value="Civil Engineering">Civil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 min-w-0">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setParam('status', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 min-w-0">
                <Label className="invisible">Clear</Label>
                <Button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setParam('q', '');
                    setParam('department', 'all');
                    setParam('status', 'all');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Faculty Table */}
        <Card>
          <CardContent className="pt-6">
            {loading && <div className="text-sm text-muted-foreground">Loading faculty...</div>}
            {error && <div className="text-sm text-destructive">{error}</div>}
            {!loading && !error && filteredFaculty.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No faculty members found.</p>
              </div>
            )}
            {!loading && !error && filteredFaculty.length > 0 && (
              <>
                {/* Table */}
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Faculty</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right w-[240px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedFaculty.map((f, index) => (
                        <TableRow key={f.id}>
                          <TableCell className="font-medium">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>{f.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{f.name}</p>
                                {f.employeeId && (
                                  <p className="text-sm text-muted-foreground">ID: {f.employeeId}</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm">{f.email}</p>
                              {f.phone && (
                                <p className="text-sm text-muted-foreground">{f.phone}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm font-medium">{f.department}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {f.designation || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {f.assignedStudents} students
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant={getStatusVariant(f.status)}>
                                {f.status}
                              </Badge>
                              <FacultyStatusToggle
                                facultyId={f.id}
                                currentStatus={f.isActive}
                                facultyName={f.name}
                                onStatusChange={(newStatus) => handleStatusChange(f.id, newStatus)}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  console.log("View faculty:", f);
                                  router.push(`/admin/faculty/${f.id}`);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  console.log("Edit faculty:", f);
                                  router.push(`/admin/faculty/${f.id}/edit`);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  console.log("Assign students:", f);
                                  router.push(`/admin/faculty/${f.id}/assign`);
                                }}
                              >
                                <User className="w-4 h-4 mr-1" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredFaculty.length)} of {filteredFaculty.length} faculty
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button" // Ensure it's a button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <Button
                        type="button" // Ensure it's a button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}