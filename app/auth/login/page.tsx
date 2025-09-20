"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role') || ''
  
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [role, setRole] = useState(roleParam)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Set role based on URL parameter
  useEffect(() => {
    if (roleParam) setRole(roleParam)
  }, [roleParam])

  // Role display names
  const roleDisplayNames: Record<string, string> = {
    student: "Student",
    company: "Company/Recruiter",
    faculty: "Faculty Mentor",
    admin: "Placement Cell Officer"
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (errors[name]) {
      const { [name]: _, ...rest } = errors
      setErrors(rest)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim().toLowerCase(), password: formData.password }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || "Login failed")
        setIsLoading(false)
        return
      }

      const roleFromApi = String(data?.user?.role || '').toUpperCase()
      switch (roleFromApi) {
        case "STUDENT":
          router.push("/student")
          break
        case "FACULTY":
          router.push("/faculty")
          break
        case "ADMIN":
          router.push("/admin")
          break
        case "COMPANY":
          router.push("/company")
          break
        default:
          router.push("/")
      }

      toast.success("Login successful!")
    } catch (error) {
      toast.error("Login failed. Please check your credentials.")
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
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md transform transition-transform duration-300 hover:scale-105">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold">Campus Portal</span>
        </div>

        <Card className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pt-6 pb-3">
            <CardTitle className="text-xl font-bold">
              Welcome Back{role ? `, ${roleDisplayNames[role] || 'User'}` : ''}
            </CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  placeholder="Enter your password" 
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            <div className="text-center text-sm">
              <Link href="/auth/forgot-password" className="text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/register?role=company" className="text-primary hover:underline">
                Register your company
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}