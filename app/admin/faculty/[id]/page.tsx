import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Edit, Mail, Phone, Building2 } from "lucide-react"
import Link from "next/link"

export default function FacultyDetailPage() {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dr. Sarah Johnson</h1>
            <p className="text-muted-foreground">Faculty member details and assigned students</p>
          </div>
          <Button asChild>
            <Link href="/admin/faculty/1/edit">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>

        {/* Faculty Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Faculty Profile</CardTitle>
            <CardDescription>Personal and professional information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl">SJ</AvatarFallback>
              </Avatar>
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium text-muted-foreground">Full Name</h3>
                  <p>Dr. Sarah Johnson</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Department</h3>
                  <p>Computer Science</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Email</h3>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    s.johnson@university.edu
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Phone</h3>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    +1 (555) 123-4567
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Employee ID</h3>
                  <p>EMP001</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Designation</h3>
                  <p>Associate Professor</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Status</h3>
                  <Badge variant="default">Active</Badge>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Assigned Students</h3>
                  <p>45 students</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Students */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Students</CardTitle>
            <CardDescription>Students currently assigned to this faculty member</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <p className="text-muted-foreground">Showing 10 of 45 assigned students</p>
              <Button asChild>
                <Link href="/admin/faculty/1/assign">
                  <User className="w-4 h-4 mr-2" />
                  Assign More Students
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 1, name: "Alice Johnson", rollNo: "CS2023001", year: "LY", cgpa: 8.7 },
                { id: 2, name: "Bob Smith", rollNo: "CS2023002", year: "TY", cgpa: 8.2 },
                { id: 3, name: "Charlie Brown", rollNo: "CS2023003", year: "SY", cgpa: 7.9 },
                { id: 4, name: "Diana Prince", rollNo: "CS2023004", year: "FY", cgpa: 8.5 },
                { id: 5, name: "Edward Norton", rollNo: "CS2023005", year: "LY", cgpa: 8.1 },
              ].map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Roll No: {student.rollNo} • Year: {student.year} • CGPA: {student.cgpa}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/students/${student.id}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}