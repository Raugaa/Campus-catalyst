"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const testSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type TestFormValues = z.infer<typeof testSchema>

export default function ValidationTestPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })
  
  const watchedValues = watch()
  
  const onSubmit = (data: TestFormValues) => {
    console.log("Submitted data:", data)
    alert(`Submitted: ${JSON.stringify(data, null, 2)}`)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Zod Validation Test</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="Enter your name" 
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          
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
          
          <Button type="submit">Submit</Button>
        </form>
        
        <div className="p-4 bg-muted rounded">
          <h2 className="font-bold">Form Values:</h2>
          <pre className="text-sm">{JSON.stringify(watchedValues, null, 2)}</pre>
          <h2 className="font-bold mt-4">Errors:</h2>
          <pre className="text-sm text-red-500">{JSON.stringify(errors, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}