import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, User, Save } from "lucide-react"
import Link from "next/link"

export default function AssignStudentsPage() {
  // Mock student data
  const students = [
    {
      id: 1,
      name: "Sarah Johnson",
      rollNo: "CS2023001",
      batch: "Batch 5",
      year: "LY",
      department: "Computer Science",
      cgpa: 8.7,
      status: "Active"
    },
    {
      id: 2,
      name: "Michael Chen",
      rollNo: "EE2023002",
      batch: "Batch 5",
      year: "LY",
      department: "Electrical Engineering",
      cgpa: 8.2,
      status: "Active"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rollNo: "ME2023003",
      batch: "Batch 5",
      year: "TY",
      department: "Mechanical Engineering",
      cgpa: 7.9,
      status: "Active"
    },
    {
      id: 4,
      name: "David Kim",
      rollNo: "IT2023004",
      batch: "Batch 5",
      year: "SY",
      department: "Information Technology",
      cgpa: 8.5,
      status: "Active"
    },
    {
      id: 5,
      name: "Priya Sharma",
      rollNo: "ECE2023005",
      batch: "Batch 5",
      year: "FY",
      department: "Electronics & Communication",
      cgpa: 8.1,
      status: "Active"
    }
  ]

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Assign Students</h1>
            <p className="text-muted-foreground">Assign students to faculty member: Dr. Sarah Johnson</p>
          </div>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Assignments
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Students</CardTitle>
            <CardDescription>Filter students by various criteria</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or roll no"
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch">Batch</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="batch-1">Batch 1</SelectItem>
                  <SelectItem value="batch-2">Batch 2</SelectItem>
                  <SelectItem value="batch-3">Batch 3</SelectItem>
                  <SelectItem value="batch-4">Batch 4</SelectItem>
                  <SelectItem value="batch-5">Batch 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fy">FY</SelectItem>
                  <SelectItem value="sy">SY</SelectItem>
                  <SelectItem value="ty">TY</SelectItem>
                  <SelectItem value="ly">LY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="ee">Electrical Engineering</SelectItem>
                  <SelectItem value="me">Mechanical Engineering</SelectItem>
                  <SelectItem value="it">Information Technology</SelectItem>
                  <SelectItem value="ece">Electronics & Communication</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Apply Filters</Button>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Students</h2>
            <p className="text-muted-foreground">5 students selected</p>
          </div>
          
          {students.map((student) => (
            <Card key={student.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{student.name}</h3>
                      </div>
                      <div className="grid gap-1 md:grid-cols-3 text-sm text-muted-foreground mb-3">
                        <div>Roll No: {student.rollNo}</div>
                        <div>Batch: {student.batch}</div>
                        <div>Year: {student.year}</div>
                        <div>Department: {student.department}</div>
                        <div>CGPA: {student.cgpa}</div>
                        <div>Status: 
                          <Badge variant="secondary" className="ml-1">
                            {student.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-1" />
                      Assign
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}