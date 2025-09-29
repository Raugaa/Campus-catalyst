"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useStudents } from "@/lib/convex-hooks";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,

  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Mail,
  Phone,
  User,
  GraduationCap,
  Award,
  MapPin,
  Calendar,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Plus,
  UserPlus,
  Upload,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as XLSX from 'xlsx'
import Link from "next/link";

export default function AdminStudents() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState(""); // Added searchInput state
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [placementFilter, setPlacementFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const bulkCreateStudents = useAction(api.actions.bulkCreateStudents)

  const itemsPerPage = 20;
  const router = useRouter(); // useRouter hook

  // Add mutations for student status management
  const updateStudentStatus = useMutation(api.mutations.updateStudentStatus);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 600); // 1000ms delay
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Create stable query params for college-specific students
  const queryParams = useMemo(() => ({
    q: searchTerm || undefined,
    department: departmentFilter !== 'all' ? departmentFilter : undefined,
    year: yearFilter !== 'all' ? yearFilter : undefined,
    collegeId: user?.profile?.collegeId, // Filter by college
    take: 1000,
    skip: 0,
  }), [searchTerm, departmentFilter, yearFilter, user?.profile?.collegeId]);

  // Fetch students data using the proper hook
  const studentsHook = useStudents(queryParams);
  const studentsData = studentsHook?.student;

  // Normalize the data structure
  const students = useMemo(() => {
    if (!studentsData) return []
    
    let studentArray = []
    if (Array.isArray(studentsData)) {
      studentArray = studentsData
    } else if (studentsData.students && Array.isArray(studentsData.students)) {
      studentArray = studentsData.students
    } else {
      console.log("Unexpected data structure:", studentsData)
      return []
    }

    return studentArray.map((s: any) => ({
      id: s.id || s._id,
      name: `${s.firstName || ''} ${s.lastName || ''}`.trim(),
      email: s.user?.email || s.email,
      phone: s.phone,
      rollNumber: s.rollNumber,
      department: s.department,
      year: s.year,
      cgpa: s.cgpa,
      tenthPercentage: s.tenthPercentage,
      twelfthPercentage: s.twelfthPercentage,
      status: s.isPlaced ? 'Placed' : 'Active',
      applications: s.recentApplications?.length ?? 0,
      offers: s.placement ? 1 : 0,
      skills: s.skills ?? [],
      isPlaced: s.isPlaced,
    }))
  }, [studentsData])

  // Filter and search students
  const filteredStudents = useMemo(() => {
    return students.filter((student: any) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        departmentFilter === "all" || student.department === departmentFilter;
      const matchesYear = yearFilter === "all" || student.year === yearFilter;
      const matchesPlacement =
        placementFilter === "all" ||
        (placementFilter === "placed" && student.isPlaced) ||
        (placementFilter === "unplaced" && !student.isPlaced);

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesYear &&
        matchesPlacement
      );
    });
  }, [students, searchTerm, departmentFilter, yearFilter, placementFilter]);

  // Pagination
  console.log("Filtered Students:", filteredStudents);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  console.log("Paginated Students:", paginatedStudents);

  // Get unique departments and years for filters
  const departments = useMemo(() => {
    const uniqueDepts = [...new Set(students.map((s: any) => s.department))];
    return uniqueDepts;
  }, [students]);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(students.map((s: any) => s.year))];
    return uniqueYears.sort();
  }, [students]);

  // Student action handlers
  const handleViewStudent = (student: any) => {
    console.log("Navigating to view student:", student.id);
    router.push(`/admin/students/${student.id}`);
  };

  const handleEditStudent = (student: any) => {
    console.log("Navigating to edit student:", student.id);
    router.push(`/admin/students/${student.id}/edit`);
  };

  const loading = studentsData === undefined;

  if (!studentsData) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Student Management
            </h1>
            <p className="text-muted-foreground">
              Manage and monitor all students in your college
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
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

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentsData.students.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Placed Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentsData.students.filter((s) => s.isPlaced).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentsData.students.length > 0
                  ? Math.round(
                      (studentsData.students.filter((s) => s.isPlaced).length /
                        studentsData.students.length) *
                        100
                    )
                  : 0}
                %
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredStudents.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
            <CardDescription>Filter and search through student records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5 items-end">
              <div className="relative min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                  className="pl-10"
                />
              </div>

              <div className="min-w-0">
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-0">
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-0">
                <Select
                  value={placementFilter}
                  onValueChange={setPlacementFilter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Placement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="placed">Placed</SelectItem>
                    <SelectItem value="unplaced">Unplaced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-0">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchInput("");
                    setSearchTerm("");
                    setDepartmentFilter("all");
                    setYearFilter("all");
                    setPlacementFilter("all");
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Students ({filteredStudents.length})</CardTitle>
            <CardDescription>
              Showing {paginatedStudents.length} of {filteredStudents.length} students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>CGPA</TableHead>
                    <TableHead>10th %</TableHead>
                    <TableHead>12th %</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[200px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student: any) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700">
                              {student.name?.[0] || 'S'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">
                              {student.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="font-mono text-sm">
                        {student.rollNumber}
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">{student.department}</div>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">
                          {student.year}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            (student.cgpa || 0) >= 8
                              ? "default"
                              : (student.cgpa || 0) >= 7
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {student.cgpa ? student.cgpa.toFixed(2) : "N/A"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {student.tenthPercentage ? `${student.tenthPercentage}%` : 'N/A'}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {student.twelfthPercentage ? `${student.twelfthPercentage}%` : 'N/A'}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-3 w-3 mr-1" />
                            {student.phone}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant={student.isPlaced ? "default" : "secondary"}>
                          {student.isPlaced ? "Placed" : "Active"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              console.log("View clicked:", student);
                              handleViewStudent(student);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              console.log("Edit clicked:", student);
                              handleEditStudent(student);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              console.log("Email clicked:", student.email);
                              window.open(`mailto:${student.email}`);
                            }}
                          >
                            <Mail className="w-4 h-4 mr-1" />
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
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button" // Ensure it's a button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button" // Ensure it's a button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
