"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Save, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useFacultyManagement } from "@/lib/convex-hooks"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

interface FacultyFormData {
  name: string
  email: string
  department: string
  phone: string
  designation: string
  canMentor: boolean
}

interface FormErrors {
  [key: string]: string
}

export default function EditFacultyPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { updateFaculty } = useFacultyManagement()
  const facultyId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FacultyFormData>({
    name: "",
    email: "",
    department: "",
    phone: "",
    designation: "",
    canMentor: true,
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // ✅ Fetch faculty data
  const facultyData = useQuery(api.queries.getFacultyById, { 
    facultyId: facultyId as any 
  })
  const facultyLoading = facultyData === undefined

  // ✅ Populate form when data loads
  useEffect(() => {
    if (facultyData?.faculty) {
      const faculty = facultyData.faculty
      setFormData({
        name: faculty.name || "",
        email: faculty.email || "",
        department: faculty.department || "",
        phone: faculty.phone || "",
        designation: faculty.designation || "",
        canMentor: faculty.canMentor ?? true,
      })
    }
  }, [facultyData])

  const handleInputChange = (field: keyof FacultyFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.department) {
      newErrors.department = "Department is required"
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number"
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
      await updateFaculty({
        facultyId: facultyId as any,
        name: formData.name.trim(),
        department: formData.department,
        phone: formData.phone.trim() || undefined,
        designation: formData.designation || undefined,
        canMentor: formData.canMentor,
        updatedAt: Date.now(),
      })

      // ✅ Also update user email if changed
      if (facultyData?.faculty?.email !== formData.email.trim().toLowerCase()) {
        // You'll need to add this mutation
        await updateFaculty({
          facultyId: facultyId as any,
          email: formData.email.trim().toLowerCase(),
          updatedAt: Date.now(),
        })
      }

      toast({
        title: "Success!",
        description: "Faculty profile has been updated successfully.",
      })

      router.push(`/admin/faculty/${facultyId}`)
    } catch (error) {
      console.error("Error updating faculty:", error)
      toast({
        title: "Error",
        description: "Failed to update faculty profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (facultyLoading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading faculty details...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (!facultyData?.faculty) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Faculty Not Found</h2>
            <p className="text-muted-foreground mb-4">The faculty member you're trying to edit doesn't exist.</p>
            <Button asChild>
              <Link href="/admin/faculty">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Faculty List
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
            <Link href={`/admin/faculty/${facultyId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              <Link href="/admin/faculty" className="hover:underline">Faculty</Link>
              {" / "}
              <Link href={`/admin/faculty/${facultyId}`} className="hover:underline">{formData.name}</Link>
              {" / "}
              <span>Edit</span>
            </div>
            <h1 className="text-3xl font-bold">Edit Faculty Profile</h1>
            <p className="text-muted-foreground">Update faculty member information</p>
          </div>
        </div>

        {/* Faculty Form */}
        <Card>
          <CardHeader>
            <CardTitle>Faculty Information</CardTitle>
            <CardDescription>Edit the details for faculty member: {formData.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
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
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Select 
                  value={formData.designation} 
                  onValueChange={(value) => handleInputChange("designation", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Head of Department">Head of Department</SelectItem>
                    <SelectItem value="Dean">Dean</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="canMentor">Mentoring Availability</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="canMentor"
                    checked={formData.canMentor}
                    onCheckedChange={(checked) => handleInputChange("canMentor", checked as boolean)}
                  />
                  <Label htmlFor="canMentor" className="text-sm font-normal">
                    This faculty member can mentor students
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" asChild disabled={isLoading}>
                <Link href={`/admin/faculty/${facultyId}`}>Cancel</Link>
              </Button>
              <Button onClick={handleSaveChanges} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}