"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { User, Edit, Mail, Phone, UserMinus, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useMemo } from "react"
import { useStudents, useFacultyManagement, useFaculty } from "@/lib/convex-hooks"
import { FacultyStatusToggle } from "@/components/admin/faculty-status-toggle"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function FacultyDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const facultyId = params.id as string
  
  const [isRemoving, setIsRemoving] = useState<string | null>(null)
  const [localFacultyStatus, setLocalFacultyStatus] = useState<boolean | null>(null)

  // ✅ Use the dedicated query for faculty details
  const facultyData = useQuery(api.queries.getFacultyById, { 
    facultyId: facultyId as any 
  })
  const facultyLoading = facultyData === undefined

  // ✅ Handle faculty data with local status override
  const faculty = useMemo(() => {
    if (!facultyData) return null
    
    const facultyInfo = facultyData
    const currentStatus = localFacultyStatus !== null ? localFacultyStatus : facultyInfo.isActive

    return {
      id: facultyInfo._id,
      name: facultyInfo.name,
      email: facultyInfo.email,
      phone: facultyInfo.phone,
      department: facultyInfo.department,
      designation: facultyInfo.designation,
      canMentor: facultyInfo.canMentor,
      status: currentStatus ? "Active" : "Inactive",
      isActive: currentStatus,
      bio: facultyInfo.bio, // ✅ Add bio field
      userId: facultyInfo.userId, // ✅ Add userId for reference
    }
  }, [facultyData, localFacultyStatus])

  // ✅ Use mentees from the faculty data
  const assignedStudents = useMemo(() => {
    if (!facultyData?.mentees) return []
    
    return facultyData.mentees.map((mentee: any) => ({
      id: mentee._id,
      name: mentee.name || `${mentee.firstName || ''} ${mentee.lastName || ''}`.trim() || 'Unknown Student',
      rollNumber: mentee.rollNumber || 'N/A',
      email: mentee.email || 'N/A',
      year: mentee.year || 'N/A',
      department: mentee.department || 'N/A',
      cgpa: mentee.cgpa || 0,
      status: mentee.status || 'Active',
    }))
  }, [facultyData])

  const handleRemoveAssignment = async (studentId: string, studentName: string) => {
    setIsRemoving(studentId)

    try {
      // TODO: Implement unassign mentor functionality
      // await assignMentor({ 
      //   studentIds: [studentId], 
      //   mentorId: undefined 
      // })

      toast({
        title: "Success!",
        description: `${studentName} has been unassigned successfully.`,
      })
      
      // ✅ Optional: Refresh data or update local state
      // You might want to refetch the faculty data here
      
    } catch (error) {
      console.error("Error removing assignment:", error)
      toast({
        title: "Error",
        description: `Failed to remove assignment for ${studentName}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsRemoving(null)
    }
  }

  // ✅ Handle faculty status change
  const handleFacultyStatusChange = (newStatus: boolean) => {
    setLocalFacultyStatus(newStatus)
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

  if (!faculty) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Faculty Not Found</h2>
            <p className="text-muted-foreground mb-4">The faculty member you're looking for doesn't exist.</p>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin/faculty">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{faculty.name}</h1>
              <p className="text-muted-foreground">Faculty member details and assigned students</p>
            </div>
          </div>
          <Button asChild>
            <Link href={`/admin/faculty/${facultyId}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>

        {/* Faculty Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Faculty Profile</CardTitle>
            <CardDescription>Personal and professional information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl">
                  {faculty.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium text-muted-foreground">Full Name</h3>
                  <p>{faculty.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Department</h3>
                  <p>{faculty.department}</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Email</h3>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {faculty.email}
                  </p>
                </div>
                {faculty.phone && (
                  <div>
                    <h3 className="font-medium text-muted-foreground">Phone</h3>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {faculty.phone}
                    </p>
                  </div>
                )}
                {faculty.designation && (
                  <div>
                    <h3 className="font-medium text-muted-foreground">Designation</h3>
                    <p>{faculty.designation}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-muted-foreground">Can Mentor</h3>
                  <Badge variant={faculty.canMentor ? "default" : "secondary"}>
                    {faculty.canMentor ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Status</h3>
                  <Badge variant={faculty.isActive ? "default" : "secondary"}>
                    {faculty.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Assigned Students</h3>
                  <p>{facultyData?.menteeCount || 0} students</p>
                </div>
              </div>
            </div>
            {faculty.bio && (
              <div className="mt-6">
                <h3 className="font-medium text-muted-foreground mb-2">Bio</h3>
                <p className="text-sm">{faculty.bio}</p>
              </div>
            )}
            
            {/* ✅ Faculty Status Toggle */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-muted-foreground mb-2">Account Status</h3>
              <FacultyStatusToggle
                facultyId={faculty.id}
                currentStatus={faculty.isActive}
                facultyName={faculty.name}
                onStatusChange={handleFacultyStatusChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Assigned Students */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Students</CardTitle>
            <CardDescription>Students currently assigned to this faculty member</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <p className="text-muted-foreground">
                Showing {assignedStudents.length} assigned students
              </p>
              {faculty.canMentor && faculty.isActive && (
                <Button asChild>
                  <Link href={`/admin/faculty/${facultyId}/assign`}>
                    <User className="w-4 h-4 mr-2" />
                    Assign More Students
                  </Link>
                </Button>
              )}
            </div>
            
            {assignedStudents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No students assigned yet.</p>
                {faculty.canMentor && faculty.isActive && (
                  <Button className="mt-4" asChild>
                    <Link href={`/admin/faculty/${facultyId}/assign`}>
                      <User className="w-4 h-4 mr-2" />
                      Assign Students
                    </Link>
                  </Button>
                )}
              </div>
            )}
            
            <div className="space-y-4">
              {assignedStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{student.name?.split(' ').map((n: string) => n[0]).join('') || 'S'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{student.name || 'Unknown Student'}</h4>
                      <p className="text-sm text-muted-foreground">
                        Roll No: {student.rollNumber} • Year: {student.year} • CGPA: {student.cgpa || 'N/A'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Department: {student.department} • Email: {student.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                      {student.status}
                    </Badge>
                    
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/students/${student.id}`}>
                        View Profile
                      </Link>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={isRemoving === student.id}
                          className={isRemoving === student.id ? "opacity-50" : ""}
                        >
                          {isRemoving === student.id ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <UserMinus className="w-4 h-4 mr-1" />
                          )}
                          {isRemoving === student.id ? "Removing..." : "Remove"}
                        </Button>
                      </AlertDialogTrigger>
                      {/* ✅ Only show dialog if not currently removing */}
                      {isRemoving !== student.id && (
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Student Assignment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove <strong>{student.name || 'this student'}</strong> from {faculty?.name}'s mentorship? 
                              This action can be undone by reassigning the student later.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleRemoveAssignment(student.id, student.name || 'Unknown Student')}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remove Assignment
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      )}
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}