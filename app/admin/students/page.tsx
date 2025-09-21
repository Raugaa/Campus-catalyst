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
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  GraduationCap,
  Mail,
  Phone,
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

export default function AdminStudents() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const tab = (searchParams.get('tab') || 'all') as 'all'|'active'|'placed'|'inactive'|'pending'
  const q = searchParams.get('q') || ''
  const dept = searchParams.get('department') || 'all'
  const year = searchParams.get('year') || 'all'

  const statusFilter = useMemo(() => {
    if (tab === 'active') return 'unplaced'
    if (tab === 'placed') return 'placed'
    if (tab === 'inactive') return 'inactive'
    return undefined
  }, [tab])

  const queryParams = useMemo(() => ({
    q: q || undefined,
    department: dept !== 'all' ? dept : undefined,
    year: year !== 'all' ? year : undefined,
    status: statusFilter,
    take: 20,
    skip: 0,
  }), [q, dept, year, statusFilter])

  const studentsData = useStudents(queryParams)
  const loading = studentsData === undefined
  const error = studentsData === null ? "Failed to load students" : undefined

  const students = useMemo(() => {
    if (!studentsData?.students) return []
    return studentsData.students.map((s: any) => ({
      id: s.id,
      name: s.name,
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
      lastActive: undefined,
      profileCompletion: Math.floor(Math.random() * 100), // Mock data
    }))
  }, [studentsData])

  const total = studentsData?.total ?? 0

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') params.set(key, value)
    else params.delete(key)
    if (key !== 'tab') params.set('tab', tab)
    router.push(`/admin/students?${params.toString()}`)
  }

  const setTab = (value: string) => {
    setParam('tab', value)
  }

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

  // editing/view dialogs state preserved
  const [student, setStudents] = useState<any[]>([])
  const [editingStudent, setEditingStudent] = useState<any | null>(null)
  const [viewingStudent, setViewingStudent] = useState<any | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [deactivatingStudent, setDeactivatingStudent] = useState<any | null>(null)
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)

  const handleViewStudent = (student: any) => {
    setViewingStudent(student)
    setIsViewDialogOpen(true)
  }

  const handleEditStudent = (student: any) => {
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

  const handleDeactivateStudent = (student: any) => {
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

  const handleActivateStudent = (studentId: string) => {
    setStudents(students.map(s => 
      s.id === studentId 
        ? { ...s, status: "Active" } 
        : s
    ))
  }

  const updateEditingStudent = (field: keyof any, value: any) => {
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

        {/* Stats (static for now) */}
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
            <TabsTrigger value="all">All Students</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="placed">Placed</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading && (
              <div className="text-sm text-muted-foreground">Loading students...</div>
            )}
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
            {!loading && !error && student.map((s) => (
              <Card key={s.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`/placeholder-40x40.png?height=48&width=48&text=${s.name[0]}`} />
                        <AvatarFallback>{s.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{s.name}</h3>
                          {getStatusIcon(s.status)}
                        </div>
                        <div className="grid gap-1 md:grid-cols-2 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {s.email}
                          </div>
                          {s.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {s.phone}
                            </div>
                          )}
                          <div>{s.department}</div>
                          <div>
                            {s.year}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          {s.cgpa && <span>CGPA: {s.cgpa}</span>}
                          <span>{s.applications} applications</span>
                          <span>{s.interviews} interviews</span>
                          <span>{s.offers} offers</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {s.skills.slice(0, 4).map((skill : any) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {s.skills.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{s.skills.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="px-3 py-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(s.status)} mr-2`} />
                      {s.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewStudent(s)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Student Profile</DialogTitle>
                            <DialogDescription>
                              Detailed information for {s.name}
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
                                    <p className="text-muted-foreground">{viewingStudent.department}</p>
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
                                      <Label className="text-sm font-medium">Department</Label>
                                      <p className="text-sm">{viewingStudent.department}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Year</Label>
                                      <p className="text-sm">{viewingStudent.year}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">CGPA</Label>
                                      <p className="text-sm">{String(viewingStudent.cgpa ?? '')}</p>
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
                                    {viewingStudent.skills.map((skill : any) => (
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
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditStudent(student)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Student Profile</DialogTitle>
                            <DialogDescription>
                              Update information for {s.name}
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
                                  <Label htmlFor="phone">Phone Number</Label>
                                  <Input
                                    id="phone"
                                    value={editingStudent.phone}
                                    onChange={(e) => updateEditingStudent("phone", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="department2">Department</Label>
                                  <Input
                                    id="department2"
                                    value={editingStudent.department}
                                    onChange={(e) => updateEditingStudent("department", e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
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
                                <div className="space-y-2">
                                  <Label htmlFor="cgpa">CGPA</Label>
                                  <Input
                                    id="cgpa"
                                    value={String(editingStudent.cgpa ?? '')}
                                    onChange={(e) => updateEditingStudent("cgpa", e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
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

                      {s.status === "Inactive" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleActivateStudent(s.id)}
                        >
                          Activate
                        </Button>
                      )}
                      {s.status === "Active" && (
                        <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDeactivateStudent(s)}
                            >
                              Deactivate
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Deactivate Student</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to deactivate {s.name}'s account? 
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
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* The other tabs keep placeholder text for now */}
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