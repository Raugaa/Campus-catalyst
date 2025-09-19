"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"

export default function SimpleTestPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  
  const onSubmit = (data: any) => {
    console.log("Submitted data:", data)
    alert(`Submitted: ${JSON.stringify(data, null, 2)}`)
  }

  const watchedValues = watch()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Simple Form Test</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="Enter your name" 
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message as string}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message as string}</p>
            )}
          </div>
          
          <Button type="submit">Submit</Button>
        </form>
        
        <div className="p-4 bg-muted rounded">
          <h2 className="font-bold">Form Values:</h2>
          <pre className="text-sm">{JSON.stringify(watchedValues, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}