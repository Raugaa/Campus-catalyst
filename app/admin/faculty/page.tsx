import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, User } from "lucide-react"
import Link from "next/link"

export default function FacultyPage() {
  // Mock faculty data
  const facultyData = [
    {
      id: 1,
      name: "Dr. Rahul Verma",
      department: "Computer Science",
      email: "r.verma@iitb.ac.in",
      assignedStudents: 45,
      status: "Active"
    },
    {
      id: 2,
      name: "Prof. Priya Patel",
      department: "Electrical Engineering",
      email: "p.patel@iitd.ac.in",
      assignedStudents: 38,
      status: "Active"
    },
    {
      id: 3,
      name: "Dr. Amit Kumar",
      department: "Mechanical Engineering",
      email: "a.kumar@iitm.ac.in",
      assignedStudents: 42,
      status: "On Leave"
    },
    {
      id: 4,
      name: "Prof. Sneha Desai",
      department: "Information Technology",
      email: "s.desai@bitspilani.ac.in",
      assignedStudents: 35,
      status: "Active"
    },
    {
      id: 5,
      name: "Dr. Vikram Singh",
      department: "Electronics & Communication",
      email: "v.singh@iitkgp.ac.in",
      assignedStudents: 40,
      status: "Active"
    }
  ]

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Faculty Management</h1>
            <p className="text-muted-foreground">Manage faculty members and student assignments</p>
          </div>
          <Button asChild>
            <Link href="/admin/faculty/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Faculty
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter faculty by various criteria</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email"
                  className="pl-8"
                />
              </div>
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
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Apply Filters</Button>
            </div>
          </CardContent>
        </Card>

        {/* Faculty List */}
        <div className="space-y-4">
          {facultyData.map((faculty) => (
            <Card key={faculty.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>{faculty.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{faculty.name}</h3>
                      </div>
                      <div className="grid gap-1 md:grid-cols-2 text-sm text-muted-foreground mb-3">
                        <div>{faculty.email}</div>
                        <div>{faculty.department}</div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Assigned Students: {faculty.assignedStudents}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={faculty.status === "Active" ? "default" : "secondary"}>
                      {faculty.status}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/faculty/${faculty.id}/assign`}>
                        <User className="w-4 h-4 mr-1" />
                        Assign Students
                      </Link>
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