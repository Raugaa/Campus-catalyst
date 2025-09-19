"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"

export default function SelectTestPage() {
  const { handleSubmit, setValue, watch, formState: { errors }, trigger } = useForm({
    defaultValues: {
      role: ""
    }
  })
  
  const watchedValues = watch()
  
  const onSubmit = (data: any) => {
    console.log("Submitted data:", data)
    alert(`Submitted: ${JSON.stringify(data, null, 2)}`)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Select Component Test</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              onValueChange={(value) => {
                console.log("Select value changed to:", value)
                setValue("role", value)
                trigger("role")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">Role is required</p>
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