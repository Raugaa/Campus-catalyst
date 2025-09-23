"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Users, UserPlus, UserMinus, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMentorAssignment } from "@/lib/convex-hooks"
import { useToast } from "@/components/ui/use-toast"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@/lib/contexts/AuthContext"

interface AssignMentorPageProps {
  params: {
    id: string
  }
}

export default function AssignMentorPage({ params }: AssignMentorPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const { assignMentor } = useMentorAssignment({ facultyId: params.id })
  
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [yearFilter, setYearFilter] = useState("")
  
  // Get faculty document (contains collegeId)
  const facultyDoc = useQuery(api.queries.getCollegeIdByFacultyId, { 
    facultyId: params.id as any
  })

  // Prefer faculty's collegeId; fall back to admin's profile collegeId
  const resolvedCollegeId = facultyDoc?.collegeId || user?.profile?.collegeId

  // Fetch faculty list (with mentees) scoped to the resolved college
  const facultyList = useQuery(
    api.queries.getFaculty, 
    resolvedCollegeId ? {
      collegeId: resolvedCollegeId as any,
      q: undefined,
      department: undefined,
      skip: 0,
      take: 100,
    } : "skip"
  ) || []

  // Find this mentor in the list (includes mentees)
  const facultyData = facultyList.find((f: any) => f.id === params.id)

  // Normalize filters
  const yearMap: Record<string, string> = {
    FY: "First Year",
    SY: "Second Year",
    TY: "Third Year",
    LY: "Final Year",
  }
  const normalizedDepartment =
    departmentFilter && departmentFilter !== "all" ? departmentFilter : undefined
  const normalizedYear =
    yearFilter && yearFilter !== "all" ? (yearMap[yearFilter] ?? yearFilter) : undefined

  // Get unassigned students - NOTE: this query returns an object { students, pagination, ... }
  const unassigned = useQuery(
    api.queries.getUnassignedStudents,
    resolvedCollegeId ? {
      collegeId: resolvedCollegeId as any,
      department: normalizedDepartment,
      year: normalizedYear,
      q: searchQuery || undefined, 
      skip: 0,
      take: 100,
    } : "skip"
  )
  const unassignedStudents = unassigned?.students ?? []

  const handleStudentSelect = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId])
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(unassignedStudents.map((s: any) => s._id))
    } else {
      setSelectedStudents([])
    }
  }

  const handleAssignStudents = async () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No Students Selected",
        description: "Please select at least one student to assign.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await assignMentor({
        studentIds: selectedStudents as any,
        mentorId: params.id as any
      })

      toast({
        title: "Success!",
        description: `${selectedStudents.length} student(s) assigned to ${facultyData?.name} successfully.`,
      })

      setSelectedStudents([])
      router.push(`/admin/faculty/${params.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign students. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnassignStudent = async (studentId: string) => {
    setIsLoading(true)
    try {
      await assignMentor({
        studentIds: [studentId] as any,
        mentorId: undefined,
      })

      toast({
        title: "Success!",
        description: "Student unassigned successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unassign student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Wait until we have user + resolvedCollegeId + facultyData
  if (!user || !resolvedCollegeId || !facultyData) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading faculty and student data...</span>
        </div>
      </DashboardLayout>
    )
  }

  // Safe access to mentees
  const mentees = facultyData.mentees || []
  const menteeCount = facultyData.menteeCount || mentees.length || 0

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/admin/faculty/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Assign Students to Mentor</h1>
            <p className="text-muted-foreground">
              Assign students to {facultyData.name} ({facultyData.department})
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Current Mentees */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current Mentees ({menteeCount})
              </CardTitle>
              <CardDescription>
                Students currently assigned to this mentor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mentees.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No students assigned yet
                  </p>
                ) : (
                  mentees.map((student: any) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.rollNumber} • {student.year} • {student.department}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Active</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnassignStudent(student.id)}
                          disabled={isLoading}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Assign New Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Assign New Students
              </CardTitle>
              <CardDescription>
                Select unassigned students from your college to assign as mentees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Students</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or roll number"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Information Technology">Information Technology</SelectItem>
                      <SelectItem value="Electronics Engineering">Electronics Engineering</SelectItem>
                      <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                      <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="FY">FY (1st Year)</SelectItem>
                      <SelectItem value="SY">SY (2nd Year)</SelectItem>
                      <SelectItem value="TY">TY (3rd Year)</SelectItem>
                      <SelectItem value="LY">LY (4th Year)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Select All */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="selectAll"
                  checked={selectedStudents.length === unassignedStudents.length && unassignedStudents.length > 0}
                  onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                />
                <Label htmlFor="selectAll">
                  Select All ({unassignedStudents.length} students from your college)
                </Label>
              </div>

              {/* Students List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {unassignedStudents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No unassigned students found in your college
                  </p>
                ) : (
                  unassignedStudents.map((student: any) => (
                    <div key={student._id} className="flex items-center space-x-2 p-2 border rounded">
                      <Checkbox
                        id={student._id}
                        checked={selectedStudents.includes(student._id)}
                        onCheckedChange={(checked) => handleStudentSelect(student._id, checked as boolean)}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{student.firstName} {student.lastName}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.rollNumber} • {student.year} • {student.department}
                        </p>
                      </div>
                      <Badge variant="outline">Available</Badge>
                    </div>
                  ))
                )}
              </div>

              {/* Assign Button */}
              <Button 
                onClick={handleAssignStudents}
                disabled={selectedStudents.length === 0 || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                Assign {selectedStudents.length} Student(s)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}