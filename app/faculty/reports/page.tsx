"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Star, 
  Send, 
  FileText,
  User,
  CheckCircle,
  Clock
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useState } from "react"

export default function FacultyFeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null)
  const [feedbackText, setFeedbackText] = useState("")
  
  // Mock data for feedback requests
  const feedbackRequests = [
    {
      id: 1,
      studentName: "Rahul Sharma",
      studentAvatar: "/placeholder-40x40.png",
      department: "Computer Science",
      year: "3rd Year",
      company: "TechCorp Solutions",
      position: "Software Engineering Intern",
      startDate: "2024-06-01",
      endDate: "2024-12-01",
      status: "Pending",
      deadline: "2024-01-25",
      feedback: "Rahul has shown excellent problem-solving skills and is a quick learner. He adapts well to new technologies."
    },
    {
      id: 2,
      studentName: "Sneha Reddy",
      studentAvatar: "/placeholder-40x40.png",
      department: "Electronics",
      year: "4th Year",
      company: "InnovateLabs",
      position: "Hardware Engineering Intern",
      startDate: "2024-05-01",
      endDate: "2024-11-01",
      status: "Completed",
      deadline: "2024-01-28",
      feedback: "Sneha demonstrated exceptional technical skills and leadership qualities during her project work."
    },
  ]

  const handleSubmitFeedback = (id: number) => {
    console.log(`Submitted feedback for application ${id}: ${feedbackText}`)
    // In a real app, this would make an API call to submit the feedback
    setFeedbackText("")
    setSelectedFeedback(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800"
      case "Completed": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredRequests = feedbackRequests.filter(request => 
    request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout userRole="faculty">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Feedback</h1>
          <p className="text-gray-600">Provide feedback on student internship performance</p>
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
                <FileText className="h-4 w-4 text-blue-500" />
                Feedback Due
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-gray-500">Pending submissions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-gray-500">This semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                Avg. Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-1">
                4.3 
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500">Overall performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Requests List */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Feedback Requests
            </CardTitle>
            <CardDescription>
              Provide feedback on student internship performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={request.studentAvatar} />
                        <AvatarFallback>
                          {request.studentName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{request.studentName}</h3>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {request.department} • {request.year}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="font-medium">{request.position}</p>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {request.company}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {request.startDate} to {request.endDate}
                            </span>
                          </div>
                        </div>
                        {request.feedback && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-700">{request.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2 mt-4 sm:mt-0">
                      <div className="text-sm text-gray-600">
                        Deadline: {request.deadline}
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedFeedback(selectedFeedback === request.id ? null : request.id)}
                      >
                        {selectedFeedback === request.id ? "Cancel" : "Provide Feedback"}
                      </Button>
                    </div>
                  </div>
                  
                  {selectedFeedback === request.id && (
                    <div className="border-t p-4 bg-gray-50 rounded-b-lg">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Your Feedback
                          </label>
                          <Textarea 
                            placeholder="Provide detailed feedback on the student's performance, skills, and areas for improvement..."
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedFeedback(null)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => handleSubmitFeedback(request.id)}
                            disabled={!feedbackText.trim()}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Submit Feedback
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {filteredRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p>No feedback requests found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}