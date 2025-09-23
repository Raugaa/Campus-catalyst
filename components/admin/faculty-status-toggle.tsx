"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAdmin } from "@/lib/convex-hooks"
import { useState, useEffect } from "react"

interface FacultyStatusToggleProps {
  facultyId: string
  currentStatus: boolean
  facultyName: string
  onStatusChange?: (newStatus: boolean) => void
}

export function FacultyStatusToggle({ 
  facultyId, 
  currentStatus, 
  facultyName,
  onStatusChange 
}: FacultyStatusToggleProps) {
  const { toast } = useToast()
  const { updateFacultyStatusAction } = useAdmin()
  const [isLoading, setIsLoading] = useState(false)
  const [localStatus, setLocalStatus] = useState(currentStatus)

  // ✅ Update local status when prop changes
  useEffect(() => {
    setLocalStatus(currentStatus)
  }, [currentStatus])

  const handleStatusChange = async (newStatus: boolean) => {
    setIsLoading(true)
    
    // ✅ Optimistic update
    setLocalStatus(newStatus)
    
    try {
      await updateFacultyStatusAction({
        facultyId: facultyId as any,
        isActive: newStatus
      })

      toast({
        title: "Success!",
        description: `${facultyName} has been ${newStatus ? 'activated' : 'deactivated'}.`,
      })

      // ✅ Notify parent component
      onStatusChange?.(newStatus)
    } catch (error) {
      // ✅ Revert on error
      setLocalStatus(currentStatus)
      
      toast({
        title: "Error",
        description: "Failed to update faculty status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`faculty-status-${facultyId}`}
        checked={localStatus}
        onCheckedChange={handleStatusChange}
        disabled={isLoading}
      />
      <Label htmlFor={`faculty-status-${facultyId}`}>
        {localStatus ? "Active" : "Inactive"}
      </Label>
      {isLoading && (
        <span className="text-xs text-muted-foreground ml-2">Updating...</span>
      )}
    </div>
  )
}