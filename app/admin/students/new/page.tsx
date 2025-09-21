import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewStudentPage() {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/students">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Student</h1>
            <p className="text-muted-foreground">Create a new student profile with login credentials</p>
          </div>
        </div>

        {/* Student Form */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Enter the details for the new student including login credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" placeholder="Enter student's full name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input id="username" placeholder="Enter a unique username" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="Enter official email address" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" placeholder="Enter a strong password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="Enter contact number" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="university">University *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iitb">IIT Bombay</SelectItem>
                    <SelectItem value="iitd">IIT Delhi</SelectItem>
                    <SelectItem value="iitm">IIT Madras</SelectItem>
                    <SelectItem value="iitkgp">IIT Kharagpur</SelectItem>
                    <SelectItem value="iitk">IIT Kanpur</SelectItem>
                    <SelectItem value="bitspilani">BITS Pilani</SelectItem>
                    <SelectItem value="dtu">Delhi Technological University</SelectItem>
                    <SelectItem value="nsut">Netaji Subhas University of Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
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
                <Label htmlFor="year">Year *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freshman">Freshman (1st Year)</SelectItem>
                    <SelectItem value="sophomore">Sophomore (2nd Year)</SelectItem>
                    <SelectItem value="junior">Junior (3rd Year)</SelectItem>
                    <SelectItem value="senior">Senior (4th Year)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gpa">Current GPA</Label>
                <Input id="gpa" type="number" step="0.01" min="0" max="10" placeholder="Enter current GPA" />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input id="skills" placeholder="e.g., React, Node.js, Python, Machine Learning" />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="bio">Bio/Description</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Enter student's bio or description" 
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" asChild>
                <Link href="/admin/students">Cancel</Link>
              </Button>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Create Student Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}