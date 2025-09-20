"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { GraduationCap } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = searchParams.get('role') || ''
  
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyType: "",
  })
  const [role, setRole] = useState(initialRole)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole)
    }
  }, [initialRole])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "role") {
      setRole(value)
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address"
    if (!role) newErrors.role = "Please select a role"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match"
    
    // For company role, require company type
    if (role === "company" && !formData.companyType.trim()) {
      newErrors.companyType = "Company type is required"
    }
    
    return newErrors
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect based on role
      switch (role) {
        case "student":
          router.push("/student")
          break
        case "company":
          router.push("/company")
          break
        case "faculty":
          router.push("/faculty")
          break
        case "admin":
          router.push("/admin")
          break
        default:
          router.push("/")
      }
      
      toast.success("Account created successfully!")
    } catch (error) {
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/3 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/3 -left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-2xl relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md transform transition-transform duration-300 hover:scale-105">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold">Campus Portal</span>
        </div>

        <Card className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pt-6 pb-3">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">Create Your Account</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">Join the campus internship and placement ecosystem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  placeholder="Enter your full name" 
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="Enter your email address" 
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    placeholder="Create a password" 
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type="password" 
                    placeholder="Confirm your password" 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={role}
                  onValueChange={(value) => handleSelectChange("role", value)}
                >
                  <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="company">Company/Recruiter</SelectItem>
                    <SelectItem value="faculty">Faculty Mentor</SelectItem>
                    <SelectItem value="admin">Placement Cell Officer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}

              {/* Show company type field only for company role */}
              {role === "company" && (
                <div className="space-y-2">
                  <Label htmlFor="companyType">Type of Company</Label>
                  <Input 
                    id="companyType" 
                    name="companyType"
                    placeholder="Enter company type (e.g., IT, Finance, Consulting)" 
                    value={formData.companyType}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              {role === "company" && errors.companyType && (
                <p className="text-sm text-red-500">{errors.companyType}</p>
              )}

              <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}