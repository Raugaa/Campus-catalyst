"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/contexts/AuthContext"
import { GraduationCap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = searchParams.get('role') || 'company' // lock to company

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    website: "",
    industry: "",
    size: "",
    description: "",
  })
  const [role, setRole] = useState(initialRole)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Always keep role as company for self-registration
    setRole("company")
  }, [initialRole])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      const { [name]: _, ...rest } = errors
      setErrors(rest)
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      const { [name]: _, ...rest } = errors
      setErrors(rest)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Company name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    return newErrors
  }

  const { registerCompany } = useAuth()

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
      await registerCompany(formData)
      toast.success("Registration successful! Please wait for admin verification.")
      router.push("/auth/login?role=company")
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(error instanceof Error ? error.message : "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/3 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/3 -left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-2xl relative z-10">
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-white p-2 rounded-full shadow-md">
            <Image
              src="/assets/Logo.png"
              width={48}
              height={48}
              alt="Campus Catalyst Logo"
              className="rounded-full"
            />
          </div>
          <span className="text-2xl font-semibold">Campus Catalyst</span>
        </div>

        <Card className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pt-6 pb-3">
            <CardTitle className="text-xl font-bold">Register Your Company</CardTitle>
            <CardDescription>Join the campus internship and placement ecosystem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" name="name" placeholder="Acme Corp"
                    value={formData.name} onChange={handleInputChange} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" placeholder="Bengaluru, IN / Remote"
                    value={formData.location} onChange={handleInputChange} />
                  {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Official Email</Label>
                  <Input id="email" name="email" type="email" placeholder="hr@company.com"
                    value={formData.email} onChange={handleInputChange} />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website (optional)</Label>
                  <Input id="website" name="website" placeholder="https://company.com"
                    value={formData.website} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" placeholder="Create a password"
                    value={formData.password} onChange={handleInputChange} />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm password"
                    value={formData.confirmPassword} onChange={handleInputChange} />
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry (optional)</Label>
                  <Input id="industry" name="industry" placeholder="Software / Manufacturing"
                    value={formData.industry} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label>Company Size (optional)</Label>
                  <Select value={formData.size} onValueChange={(v) => handleSelectChange("size", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STARTUP">Startup</SelectItem>
                      <SelectItem value="SMALL">Small</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LARGE">Large</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea id="description" name="description" placeholder="What does your company do?"
                  value={formData.description} onChange={handleInputChange} />
              </div>

              <Button className="w-full mt-2" type="submit" disabled={isLoading}>
                {isLoading ? "Redirecting to WorkOS..." : "Continue with WorkOS"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login?role=company" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}