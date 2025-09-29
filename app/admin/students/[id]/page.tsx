"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { User, Edit, Mail, Phone, ArrowLeft, Loader2, GraduationCap, Building, Calendar, Award, FileText } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
export default function StudentDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const studentId = params.id as string

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };
  
  const [localStudentStatus, setLocalStudentStatus] = useState<boolean | null>(null)

  // ✅ Use the dedicated query for student details
  const studentData = useQuery(api.queries.getStudentById, { 
    studentId: studentId as any 
  })
  const studentLoading = studentData === undefined

  // ✅ Handle student data with proper field mapping from database schema
  const student = useMemo(() => {
    if (!studentData) return null
    
    const studentInfo = studentData
    const currentStatus = localStudentStatus !== null ? localStudentStatus : studentInfo.isActive

    return {
      id: studentInfo._id,
      name: studentInfo.name || `${studentInfo.firstName || ''} ${studentInfo.lastName || ''}`.trim() || 'Unknown Student',
      firstName: studentInfo.firstName,
      lastName: studentInfo.lastName,
      email: studentInfo.email,
      phone: studentInfo.phone,
      department: studentInfo.department,
      branchName: studentInfo.branchName || studentInfo.department, // From branch lookup
      branchCode: studentInfo.branchCode, // From branch lookup
      year: studentInfo.year,
      semester: studentInfo.semester,
      rollNumber: studentInfo.rollNumber,
      cgpa: studentInfo.cgpa,
      tenthPercentage: studentInfo.tenthPercentage,
      twelfthPercentage: studentInfo.twelfthPercentage,
      status: studentInfo.isPlaced ? 'Placed' : (currentStatus ? "Active" : "Inactive"),
      isActive: currentStatus,
      isPlaced: studentInfo.isPlaced,
      skills: studentInfo.skills || [],
      resumeUrl: studentInfo.resumeUrl,
      bio: studentInfo.bio,
      userId: studentInfo.userId,
      mentorName: studentInfo.mentor, // From mentor lookup
      collegeName: studentInfo.collegeName, // From college lookup
      companyName: studentInfo.companyName, // From placement lookup
    }
  }, [studentData, localStudentStatus])

  // ✅ Use applications from the student data with proper field mapping
  const applications = useMemo(() => {
    if (!studentData?.applications) return []
    
    return studentData.applications.map((app: any) => ({
      id: app._id,
      companyName: studentData.companyName || "N/A" ,
      position: app.opportunity?.title || 'Unknown Position',
      status: app.status || 'PENDING',
      appliedAt: app.appliedAt || app._creationTime,
      type: app.opportunity?.type || 'internship',
      coverLetter: app.coverLetter,
      mentorApproved: app.mentorApproved,
      adminApproved: app.adminApproved,
      mentorRemarks: app.mentorRemarks,
      adminRemarks: app.adminRemarks,
    }))
  }, [studentData])

  // ✅ Use placements from the student data with proper field mapping
  const placements = useMemo(() => {
    if (!studentData?.placements) return []
    
    return studentData.placements.map((placement: any) => ({
      id: placement._id,
      companyName: studentData.companyName || "N/A" ,
      jobTitle: placement.jobTitle,
      salary: placement.salary,
      joinDate: placement.joinDate,
      location: placement.location,
      workMode: placement.workMode,
      status: placement.status,
      offerLetter: placement.offerLetter,
    }))
  }, [studentData])

  // ✅ Use internships from the student data with proper field mapping
  const internships = useMemo(() => {
    if (!studentData?.internships) return []
    
    return studentData.internships.map((internship: any) => ({
      id: internship._id,
      companyName: internship.companyName || 'Unknown Company',
      startDate: internship.startDate,
      endDate: internship.endDate,
      status: internship.status,
      stipend: internship.stipend,
      companyMentor: internship.companyMentor,
      rating: internship.rating,
      feedback: internship.feedback,
      certificate: internship.certificate,
    }))
  }, [studentData])

  if (studentLoading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!student) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-muted-foreground">Student Not Found</h2>
            <p className="text-muted-foreground mt-2">The requested student could not be found.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/students">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Students
              </Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500"
      case "Placed": return "bg-blue-500"
      case "Inactive": return "bg-gray-500"
      default: return "bg-gray-500"
    }
  }

  const getApplicationStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "SELECTED": 
      case "OFFER_ACCEPTED": return "default"
      case "PENDING": 
      case "MENTOR_REVIEW":
      case "ADMIN_REVIEW":
      case "SUBMITTED": return "secondary"
      case "REJECTED": 
      case "OFFER_DECLINED": return "destructive"
      case "SHORTLISTED": return "outline"
      default: return "outline"
    }
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        {/* Professional Header */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/students">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-gray-200 dark:border-gray-700">
                <AvatarFallback className="text-xl font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {student.name?.split(' ').map((n: string) => n[0]).join('') || 'S'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">{student.rollNumber} • {student.branchName || student.department}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(student.status)} mr-2`} />
              {student.status}
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/students/${student.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email Address</p>
                    <p className="text-base flex items-center gap-2 font-medium">
                      <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      {student.email || 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone Number</p>
                    <p className="text-base flex items-center gap-2 font-medium">
                      <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      {student.phone || 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Branch</p>
                    <p className="text-base flex items-center gap-2 font-medium">
                      <Building className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      {student.branchName || student.department || 'N/A'}
                      {student.branchCode && (
                        <Badge variant="outline" className="ml-2 font-mono">{student.branchCode}</Badge>
                      )}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Academic Year</p>
                    <p className="text-base flex items-center gap-2 font-medium">
                      <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      Year {student.year || 'N/A'} - Semester {student.semester || 'N/A'}
                    </p>
                  </div>
                  {student.collegeName && (
                    <div className="md:col-span-2 space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">College</p>
                      <p className="text-base font-medium">{student.collegeName}</p>
                    </div>
                  )}
                  {student.mentorName && (
                    <div className="md:col-span-2 space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Faculty Mentor</p>
                      <p className="text-base font-medium">{student.mentorName}</p>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {student.bio && (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-lg font-semibold mb-3">About</h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{student.bio}</p>
                  </div>
                )}

                {/* Skills */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-lg font-semibold mb-3">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {student.skills?.length > 0 ? (
                      student.skills.map((skill: string, index: number) => (
                        <Badge key={`${skill}-${index}`} variant="secondary" className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">No skills listed</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  Academic Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Current CGPA</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{student.cgpa || 'N/A'}</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">10th Grade</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{student.tenthPercentage ? `${student.tenthPercentage}%` : 'N/A'}</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">12th Grade</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{student.twelfthPercentage ? `${student.twelfthPercentage}%` : 'N/A'}</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Resume</p>
                  {student.resumeUrl ? (
                    <Button variant="outline" size="sm" asChild>
                      <a href={student.resumeUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-2" />
                        View Resume
                      </a>
                    </Button>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">No resume uploaded</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Applications */}
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-lg">Recent Applications</CardTitle>
                <CardDescription>
                  Job and internship applications
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.slice(0, 3).map((app: any) => (
                      <div key={app.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{app.position}</h4>
                            <Badge variant={getApplicationStatusVariant(app.status)} className="text-xs">
                              {app.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{app.companyName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Applied: {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                          <div className="flex gap-1 mt-2">
                            {app.mentorApproved !== undefined && (
                              <Badge variant={app.mentorApproved ? "default" : "destructive"} className="text-xs">
                                Mentor: {app.mentorApproved ? "✓" : "✗"}
                              </Badge>
                            )}
                            {app.adminApproved !== undefined && (
                              <Badge variant={app.adminApproved ? "default" : "destructive"} className="text-xs">
                                Admin: {app.adminApproved ? "✓" : "✗"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {applications.length > 3 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-2">
                        +{applications.length - 3} more applications
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No applications found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Internships */}
            {internships.length > 0 && (
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                  <CardTitle className="text-lg">Internships</CardTitle>
                  <CardDescription>
                    Current and past internships
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {internships.map((internship: any) => (
                      <div key={internship.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{internship.companyName}</h4>
                            <Badge variant="default" className="text-xs">{internship.status}</Badge>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {new Date(internship.startDate).toLocaleDateString()} - {new Date(internship.endDate).toLocaleDateString()}
                          </p>
                          {internship.stipend && (
                            <p className="text-sm font-semibold text-green-600">₹{internship.stipend}</p>
                          )}
                          {internship.rating && (
                            <div className="flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              <span className="text-xs">{internship.rating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Placements */}
            {placements.length > 0 && (
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                  <CardTitle className="text-lg">Placements</CardTitle>
                  <CardDescription>
                    Job placements and offers
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {placements.map((placement: any) => (
                      <div key={placement.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{placement.jobTitle}</h4>
                            <Badge variant="default" className="text-xs">{placement.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{placement.companyName}</p>
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(placement.salary)} pa
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {placement.location} • {placement.workMode}
                          </p>
                          {placement.offerLetter && (
                            <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
                              <a href={placement.offerLetter} target="_blank" rel="noopener noreferrer">
                                <FileText className="w-3 h-3 mr-1" />
                                View Offer Letter
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}