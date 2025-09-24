"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Check, 
  X, 
  ChevronLeft,
  ChevronRight,
  Clock
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useState } from "react"

export default function PendingApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  
  // Mock data for pending applications
  const pendingApplications = [
    {
      id: 1,
      studentName: "Rahul Sharma",
      studentAvatar: "/placeholder-40x40.png",
      department: "Computer Science",
      year: "3rd Year",
      cgpa: 8.5,
      company: "TechCorp Solutions",
      position: "Software Engineering Intern",
      appliedDate: "2024-01-15",
      status: "Pending",
      priority: "high",
    },
    {
      id: 2,
      studentName: "Priya Patel",
      studentAvatar: "/placeholder-40x40.png",
      department: "Information Technology",
      year: "4th Year",
      cgpa: 9.1,
      company: "DataFlow Analytics",
      position: "Data Science Intern",
      appliedDate: "2024-01-14",
      status: "Pending",
      priority: "medium",
    },
    {
      id: 3,
      studentName: "Arjun Kumar",
      studentAvatar: "/placeholder-40x40.png",
      department: "Computer Science",
      year: "3rd Year",
      cgpa: 8.2,
      company: "CloudTech Systems",
      position: "DevOps Intern",
      appliedDate: "2024-01-13",
      status: "Pending",
      priority: "high",
    },
    {
      id: 4,
      studentName: "Sneha Reddy",
      studentAvatar: "/placeholder-40x40.png",
      department: "Electronics",
      year: "4th Year",
      cgpa: 8.8,
      company: "InnovateLabs",
      position: "Hardware Engineering Intern",
      appliedDate: "2024-01-12",
      status: "Pending",
      priority: "low",
    },
    {
      id: 5,
      studentName: "Vikram Singh",
      studentAvatar: "/placeholder-40x40.png",
      department: "Mechanical Engineering",
      year: "3rd Year",
      cgpa: 7.9,
      company: "AutoTech Industries",
      position: "Automotive Design Intern",
      appliedDate: "2024-01-11",
      status: "Pending",
      priority: "medium",
    },
  ]

  const handleApprove = (id: number) => {
    console.log(`Approved application ${id}`)
    // In a real app, this would make an API call to approve the application
  }

  const handleReject = (id: number) => {
    console.log(`Rejected application ${id}`)
    // In a real app, this would make an API call to reject the application
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredApplications = pendingApplications.filter(app => 
    app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout userRole="faculty">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="text-gray-600">Review and approve student internship applications</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search by student name, company, or position..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 bg-white">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Pending Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-gray-500">Awaiting review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Approval Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76%</div>
              <p className="text-xs text-gray-500">This semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                Avg. Review Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3 days</div>
              <p className="text-xs text-gray-500">Per application</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-500" />
              Pending Applications
            </CardTitle>
            <CardDescription>
              Review and take action on student internship applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div key={application.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={application.studentAvatar} />
                      <AvatarFallback>
                        {application.studentName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{application.studentName}</h3>
                        <Badge className={getPriorityColor(application.priority)}>
                          {application.priority} priority
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {application.department} • {application.year}
                        </span>
                        <span>•</span>
                        <span>CGPA: {application.cgpa}</span>
                      </div>
                      <div className="mt-2">
                        <p className="font-medium">{application.position}</p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {application.company}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Applied: {application.appliedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      onClick={() => handleApprove(application.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                      onClick={() => handleReject(application.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredApplications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p>No pending applications found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing 1 to 5 of 5 applications
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}