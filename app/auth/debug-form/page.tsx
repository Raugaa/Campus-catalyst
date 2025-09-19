"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { GraduationCap } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const debugSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.enum(["student", "company", "faculty", "admin"], {
    required_error: "Please select a role",
  }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  organization: z.string().min(1, { message: "Organization/College is required" }),
  bio: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type DebugFormValues = z.infer<typeof debugSchema>

export default function DebugFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger,
    getValues,
  } = useForm<DebugFormValues>({
    resolver: zodResolver(debugSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: undefined,
      password: "",
      confirmPassword: "",
      organization: "",
      bio: "",
    },
  })

  // Watch all form values
  const formValues = watch()
  
  const onSubmit = async (data: DebugFormValues) => {
    console.log("Form submitted with data:", data)
    console.log("Form values at submit time:", getValues())
    alert(`Form submitted!\nCheck console for data.\n\nData: ${JSON.stringify(data, null, 2)}`)
  }

  const handleDebugSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Debug submit triggered")
    console.log("Current form values:", getValues())
    console.log("Form errors:", errors)
    
    // Manually trigger validation
    const isValid = await trigger()
    console.log("Form is valid:", isValid)
    
    if (isValid) {
      handleSubmit(onSubmit)()
    } else {
      console.log("Form has errors, not submitting")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold">Debug Form</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Debug Registration Form</CardTitle>
            <CardDescription>Testing form values and validation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleDebugSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Enter your first name" 
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Enter your last name" 
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email address" 
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  onValueChange={(value) => {
                    console.log("Role changed to:", value)
                    setValue("role", value as any)
                    // Trigger validation for the role field
                    trigger("role")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="company">Company/Recruiter</SelectItem>
                    <SelectItem value="faculty">Faculty Mentor</SelectItem>
                    <SelectItem value="admin">Placement Cell Officer</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Create a password" 
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Confirm your password" 
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization/College</Label>
                <Input 
                  id="organization" 
                  placeholder="Enter your college or company name" 
                  {...register("organization")}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500">{errors.organization.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us a bit about yourself..." 
                  rows={3} 
                  {...register("bio")}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Debug Submit"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    console.log("Current form values:", getValues())
                    console.log("Watched values:", formValues)
                    alert(`Check console for form values\nCurrent values: ${JSON.stringify(getValues(), null, 2)}`)
                  }}
                >
                  Log Values
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => trigger()}
                >
                  Validate Form
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-muted rounded">
              <h3 className="font-bold mb-2">Form State (Live):</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(formValues, null, 2)}
              </pre>
              <h3 className="font-bold mb-2 mt-4">Form Errors:</h3>
              <pre className="text-xs overflow-auto text-red-500">
                {JSON.stringify(errors, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}