"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStudents } from "@/lib/convex-hooks"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/contexts/AuthContext"

interface StudentFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  rollNumber: string
  phone: string
  department: string
  year: string
  semester: string
  cgpa: string
  skills: string
  bio: string
}

export default function NewStudentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { createStudentAction } = useStudents({}) // ✅ Fix: Don't pass empty object
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    rollNumber: "",
    department: "",
    year: "",
    semester: "",
    cgpa: "",
    skills: "",
    bio: ""
  })

  const [errors, setErrors] = useState<Partial<StudentFormData>>({})

  const handleInputChange = (field: keyof StudentFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<StudentFormData> = {}

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.password.trim()) newErrors.password = "Password is required"
    if (!formData.rollNumber.trim()) newErrors.rollNumber = "Roll number is required"
    if (!formData.department) newErrors.department = "Department is required"
    if (!formData.year) newErrors.year = "Year is required"
    if (!formData.semester) newErrors.semester = "Semester is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // CGPA validation
    if (formData.cgpa && (isNaN(Number(formData.cgpa)) || Number(formData.cgpa) < 0 || Number(formData.cgpa) > 10)) {
      newErrors.cgpa = "CGPA must be between 0 and 10"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateStudent = async () => {
    if (!validateForm()) {
      console.log("Validation failed", errors)
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      })
      return
    }

    if (!user?.profile.collegeId) {
      console.error("College ID not found for current user")
      toast({
        title: "Error",
        description: "College information not found. Please try again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    console.log("Creating student with data:", formData)

    try {
      // Parse skills into array
      const skillsArray = formData.skills
        .split(",")
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0)

      // ✅ Map form data to match Convex action schema
      const studentData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        rollNumber: formData.rollNumber.trim(),
        phone: formData.phone.trim() || undefined,
        department: formData.department,
        year: formData.year,
        semester: Number(formData.semester),
        cgpa: formData.cgpa ? Number(formData.cgpa) : undefined,
        skills: skillsArray.length > 0 ? skillsArray : undefined,
        collegeId: user.profile.collegeId,
        mentorId: undefined, // Optional field
      }
      
      // ✅ Check if createStudentAction exists
      if (!createStudentAction) {
        throw new Error("Create student action is not available")
      }
      
      const result = await createStudentAction(studentData)
      

      toast({
        title: "Success!",
        description: "Student profile has been created successfully.",
      })

      // Redirect to students list
      router.push("/admin/students")
    } catch (error) {
      console.error("Error creating student:", error)
      
      let errorMessage = "Failed to create student profile. Please try again."
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName" 
                  placeholder="Enter student's first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName" 
                  placeholder="Enter student's last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="Enter official email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number *</Label>
                <Input 
                  id="rollNumber" 
                  type="text" 
                  placeholder="Enter roll number"
                  value={formData.rollNumber}
                  onChange={(e) => handleInputChange("rollNumber", e.target.value)}
                />
                {errors.rollNumber && <p className="text-sm text-destructive">{errors.rollNumber}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="Enter contact number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => handleInputChange("department", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* ✅ Remove any empty value SelectItems */}
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Select 
                  value={formData.year} 
                  onValueChange={(value) => handleInputChange("year", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* ✅ Ensure all values are non-empty */}
                    <SelectItem value="FY">FY (1st Year)</SelectItem>
                    <SelectItem value="SY">SY (2nd Year)</SelectItem>
                    <SelectItem value="TY">TY (3rd Year)</SelectItem>
                    <SelectItem value="LY">LY (4th Year)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.year && <p className="text-sm text-destructive">{errors.year}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select 
                  value={formData.semester} 
                  onValueChange={(value) => handleInputChange("semester", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* ✅ Ensure all values are non-empty */}
                    <SelectItem value="1">1st Semester</SelectItem>
                    <SelectItem value="2">2nd Semester</SelectItem>
                    <SelectItem value="3">3rd Semester</SelectItem>
                    <SelectItem value="4">4th Semester</SelectItem>
                    <SelectItem value="5">5th Semester</SelectItem>
                    <SelectItem value="6">6th Semester</SelectItem>
                    <SelectItem value="7">7th Semester</SelectItem>
                    <SelectItem value="8">8th Semester</SelectItem>
                  </SelectContent>
                </Select>
                {errors.semester && <p className="text-sm text-destructive">{errors.semester}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cgpa">Current CGPA</Label>
                <Input 
                  id="cgpa" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="10" 
                  placeholder="Enter current CGPA"
                  value={formData.cgpa}
                  onChange={(e) => handleInputChange("cgpa", e.target.value)}
                />
                {errors.cgpa && <p className="text-sm text-destructive">{errors.cgpa}</p>}
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input 
                  id="skills" 
                  placeholder="e.g., React, Node.js, Python, Machine Learning"
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                />
              </div>

             
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="bio">Bio/Description</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Enter student's bio or description (optional)" 
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This information is optional and will be displayed on the student's profile.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" asChild disabled={isLoading}>
                <Link href="/admin/students">Cancel</Link>
              </Button>
              <Button onClick={handleCreateStudent} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Creating..." : "Create Student Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}