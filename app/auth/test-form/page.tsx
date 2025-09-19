"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const testSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["student", "company", "faculty", "admin"]),
})

type TestFormValues = z.infer<typeof testSchema>

export default function TestFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
  })

  const onSubmit = (data: TestFormValues) => {
    console.log("Form submitted with data:", data)
    alert("Form submitted successfully! Check console for data.")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Form Test Page</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password" 
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              onValueChange={(value) => setValue("role", value as any)}
              value={watch("role")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>
          
          <Button type="submit">Submit</Button>
        </form>
        
        <div className="mt-4 p-4 bg-muted rounded">
          <h2 className="font-bold">Form State:</h2>
          <p>Email: {watch("email") || "Not entered"}</p>
          <p>Password: {watch("password") ? "••••••" : "Not entered"}</p>
          <p>Role: {watch("role") || "Not selected"}</p>
        </div>
      </div>
    </div>
  )
}