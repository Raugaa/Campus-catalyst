"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Save, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFacultyManagement } from "@/lib/convex-hooks"
import { useAuth } from "@/lib/contexts/AuthContext"

interface FacultyFormData {
  name: string
  email: string
  password: string
  phone: string
  department: string
  designation: string
  canMentor: boolean
  bio: string
}

export default function NewFacultyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { createFacultyAction } = useFacultyManagement()
  const { user } = useAuth()
  
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FacultyFormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    designation: "",
    canMentor: true,
    bio: ""
  })

  const [errors, setErrors] = useState<Partial<FacultyFormData>>({})

  // ✅ Get admin's college ID
  const adminCollegeId = user?.profile?.collegeId

  const handleInputChange = (field: keyof FacultyFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FacultyFormData> = {}

    if (!formData.name.trim()) newErrors.name = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.password.trim()) newErrors.password = "Password is required"
    if (!formData.department) newErrors.department = "Department is required"
    if (!formData.designation) newErrors.designation = "Designation is required"

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateFaculty = async () => {
    console.log("🔄 Starting faculty creation process...")
    
    if (!validateForm()) {
      console.log("❌ Form validation failed")
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      })
      return
    }

    if (!adminCollegeId) {
      console.log("❌ No college ID found for admin:", user)
      toast({
        title: "Error",
        description: "College information not found. Please contact support.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // ✅ Map form data to match Convex action schema exactly
      const facultyData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        name: formData.name.trim(),
        department: formData.department,
        designation: formData.designation || undefined,
        phone: formData.phone.trim() || undefined,
        canMentor: formData.canMentor,
        collegeId: adminCollegeId, // ✅ Use admin's college ID
        
      }

      console.log("📤 Creating faculty with data:", facultyData)
      
      const result = await createFacultyAction(facultyData)
      
      console.log("✅ Faculty creation result:", result)

      toast({
        title: "Success!",
        description: "Faculty member has been created successfully.",
      })

      router.push("/admin/faculty")
    } catch (error) {
      console.error("❌ Error creating faculty:", error)
      
      let errorMessage = "Failed to create faculty member. Please try again."
      
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

  // ✅ Show loading if no admin college ID yet
  if (!adminCollegeId) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Loading...</h2>
            <p className="text-muted-foreground">Getting your college information...</p>
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
            <Link href="/admin/faculty">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Faculty</h1>
            <p className="text-muted-foreground">Create a new faculty member profile for your college</p>
          </div>
        </div>

        {/* Faculty Form */}
        <Card>
          <CardHeader>
            <CardTitle>Faculty Information</CardTitle>
            <CardDescription>Enter the details for the new faculty member at your college</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input 
                  id="name" 
                  placeholder="Enter faculty member's full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
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
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label htmlFor="designation">Designation</Label>
                <Select value={formData.designation} onValueChange={(value) => handleInputChange("designation", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Head of Department">Head of Department</SelectItem>
                    <SelectItem value="Dean">Dean</SelectItem>
                    <SelectItem value="Lecturer">Lecturer</SelectItem>
                  </SelectContent>
                </Select>
                {errors.designation && <p className="text-sm text-destructive">{errors.designation}</p>}
              </div>
              
              {/* Mentoring Capability */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="canMentor"
                    checked={formData.canMentor}
                    onCheckedChange={(checked) => handleInputChange("canMentor", checked as boolean)}
                  />
                  <Label htmlFor="canMentor" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Can mentor students for internships and placements
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enable this option if the faculty member can be assigned as a mentor to guide students through their internship and placement journey.
                </p>
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="bio">Bio/Description</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Enter faculty member's bio, research interests, or description (optional)" 
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This information is optional and will be displayed on the faculty profile.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" asChild disabled={isLoading}>
                <Link href="/admin/faculty">Cancel</Link>
              </Button>
              <Button onClick={handleCreateFaculty} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Creating..." : "Create Faculty Member"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}