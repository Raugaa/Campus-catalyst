"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Save, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

interface StudentFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  rollNumber: string
  department: string
  year: string
  semester: string
  cgpa: string
  tenthPercentage: string
  twelfthPercentage: string
  skills: string
  isActive: boolean
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  rollNumber?: string
  department?: string
  year?: string
  semester?: string
  cgpa?: string
  tenthPercentage?: string
  twelfthPercentage?: string
}

export default function EditStudentPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const studentId = params.id as string
  
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    rollNumber: "",
    department: "",
    year: "",
    semester: "",
    cgpa: "",
    tenthPercentage: "",
    twelfthPercentage: "",
    skills: "",
    isActive: true,
  })

  // Fetch student data
  const studentData = useQuery(api.queries.getStudentById, { 
    studentId: studentId as any 
  })
  
  // Update student mutation
  const updateStudent = useMutation(api.mutations.updateStudent)

  // Load student data into form when available
  useEffect(() => {
    if (studentData) {
      const nameParts = studentData.name?.split(' ') || ['', '']
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      setFormData({
        firstName,
        lastName,
        email: studentData.email || "",
        phone: studentData.phone || "",
        rollNumber: studentData.rollNumber || "",
        department: studentData.department || "",
        year: studentData.year || "",
        semester: studentData.semester as any || "",
        cgpa: studentData.cgpa?.toString() || "",
        tenthPercentage: studentData.tenthPercentage?.toString() || "",
        twelfthPercentage: studentData.twelfthPercentage?.toString() || "",
        skills: Array.isArray(studentData.skills) ? studentData.skills.join(', ') : (studentData.skills || ""),
        isActive: studentData.isActive ?? true,
      })
    }
  }, [studentData])

  const handleInputChange = (field: keyof StudentFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = "Roll number is required"
    }

    if (!formData.department) {
      newErrors.department = "Department is required"
    }

    if (!formData.year) {
      newErrors.year = "Year is required"
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (formData.cgpa && (isNaN(Number(formData.cgpa)) || Number(formData.cgpa) < 0 || Number(formData.cgpa) > 10)) {
      newErrors.cgpa = "CGPA must be a number between 0 and 10"
    }

    if (formData.tenthPercentage && (isNaN(Number(formData.tenthPercentage)) || Number(formData.tenthPercentage) < 0 || Number(formData.tenthPercentage) > 100)) {
      newErrors.tenthPercentage = "10th percentage must be between 0 and 100"
    }

    if (formData.twelfthPercentage && (isNaN(Number(formData.twelfthPercentage)) || Number(formData.twelfthPercentage) < 0 || Number(formData.twelfthPercentage) > 100)) {
      newErrors.twelfthPercentage = "12th percentage must be between 0 and 100"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0)

      console.log("Updating student with data:", {
        studentId: studentId,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim() || undefined,
        rollNumber: formData.rollNumber.trim(),
        department: formData.department,
        year: formData.year,
        semester: formData.semester ? Number(formData.semester) : undefined,
        cgpa: formData.cgpa ? Number(formData.cgpa) : undefined,
        tenthPercentage: formData.tenthPercentage ? Number(formData.tenthPercentage) : undefined,
        twelfthPercentage: formData.twelfthPercentage ? Number(formData.twelfthPercentage) : undefined,
        skills: skillsArray,
      });

      await updateStudent({
        studentId: studentId as any,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim() || undefined,
        rollNumber: formData.rollNumber.trim(),
        department: formData.department,
        year: formData.year,
        semester: formData.semester ? Number(formData.semester) : undefined,
        cgpa: formData.cgpa ? Number(formData.cgpa) : undefined,
        tenthPercentage: formData.tenthPercentage ? Number(formData.tenthPercentage) : undefined,
        twelfthPercentage: formData.twelfthPercentage ? Number(formData.twelfthPercentage) : undefined,
        skills: skillsArray,
        updatedAt: Date.now(),
      })

      toast({
        title: "Success",
        description: "Student information updated successfully.",
      })

      router.push(`/admin/students/${studentId}`)
    } catch (error) {
      console.error("Failed to update student:", error)
      toast({
        title: "Error",
        description: "Failed to update student information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const studentLoading = studentData === undefined

  if (studentLoading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading student details...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (!studentData) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
            <p className="text-muted-foreground mb-4">The student you're trying to edit doesn't exist.</p>
            <Button asChild>
              <Link href="/admin/students">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Students List
              </Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/admin/students/${studentId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              <Link href="/admin/students" className="hover:underline">Students</Link>
              {" / "}
              <Link href={`/admin/students/${studentId}`} className="hover:underline">{formData.firstName} {formData.lastName}</Link>
              {" / "}
              <span>Edit</span>
            </div>
            <h1 className="text-3xl font-bold">Edit Student Profile</h1>
            <p className="text-muted-foreground">Update student information and academic details</p>
          </div>
        </div>

        {/* Student Form */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Update the student's personal and academic details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Academic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number *</Label>
                  <Input 
                    id="rollNumber" 
                    value={formData.rollNumber}
                    onChange={(e) => handleInputChange("rollNumber", e.target.value)}
                    placeholder="Enter roll number"
                  />
                  {errors.rollNumber && <p className="text-sm text-destructive">{errors.rollNumber}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => handleInputChange("department", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Information Technology">Information Technology</SelectItem>
                      <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                      <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                      <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                      <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Academic Year *</Label>
                  <Select 
                    value={formData.year} 
                    onValueChange={(value) => handleInputChange("year", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Year">1st Year</SelectItem>
                      <SelectItem value="2nd Year">2nd Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
                      <SelectItem value="4th Year">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.year && <p className="text-sm text-destructive">{errors.year}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select 
                    value={formData.semester} 
                    onValueChange={(value) => handleInputChange("semester", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
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
                </div>
              </div>
            </div>

            {/* Academic Performance */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Academic Performance</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="cgpa">CGPA</Label>
                  <Input 
                    id="cgpa" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="10" 
                    value={formData.cgpa}
                    onChange={(e) => handleInputChange("cgpa", e.target.value)}
                    placeholder="Enter CGPA"
                  />
                  {errors.cgpa && <p className="text-sm text-destructive">{errors.cgpa}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tenthPercentage">10th Percentage</Label>
                  <Input 
                    id="tenthPercentage" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="100" 
                    value={formData.tenthPercentage}
                    onChange={(e) => handleInputChange("tenthPercentage", e.target.value)}
                    placeholder="Enter 10th percentage"
                  />
                  {errors.tenthPercentage && <p className="text-sm text-destructive">{errors.tenthPercentage}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twelfthPercentage">12th Percentage</Label>
                  <Input 
                    id="twelfthPercentage" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="100" 
                    value={formData.twelfthPercentage}
                    onChange={(e) => handleInputChange("twelfthPercentage", e.target.value)}
                    placeholder="Enter 12th percentage"
                  />
                  {errors.twelfthPercentage && <p className="text-sm text-destructive">{errors.twelfthPercentage}</p>}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-6">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Textarea 
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  placeholder="Enter skills separated by commas (e.g., JavaScript, React, Python)"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">Separate multiple skills with commas</p>
              </div>
            </div>

            {/* Status */}
            <div className="mt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked as boolean)}
                />
                <Label htmlFor="isActive" className="text-sm font-normal">
                  Student is active and can apply for opportunities
                </Label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" asChild disabled={isLoading}>
                <Link href={`/admin/students/${studentId}`}>Cancel</Link>
              </Button>
              <Button onClick={handleSaveChanges} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}