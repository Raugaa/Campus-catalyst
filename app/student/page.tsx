'use client'

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Briefcase,
  FileText,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Users,
  Building2,
  Calendar,
  ArrowRight,
  Bell,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/lib/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function StudentDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set())
  
  // Get user's first name for welcome message
  const userFirstName = user?.student?.firstName || "Student"

  // Mock data for interviews
  const interviews = [
    {
      id: 1,
      title: "UX/UI Design Interview",
      company: "TechSolutions",
      date: "Nov 8",
      time: "9:00 AM"
    }
  ]

  // Mock data for upcoming dates with events
  const eventDates = [8, 15, 22]

  // Handle job application
  const handleApply = (jobId: number) => {
    // Navigate to the job detail page
    router.push(`/student/opportunities/${jobId}`)
  }

  // Get current month and year
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' })
  const currentYear = currentDate.getFullYear()

  // Calendar days with events
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1)
  const events = {
    8: { type: 'interview', title: 'UX/UI Design Interview', company: 'TechSolutions' },
    15: { type: 'deadline', title: 'Application Deadline', company: 'Google' },
    22: { type: 'event', title: 'Career Fair', company: 'Campus Event' }
  }

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {userFirstName}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your applications</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/student/notifications">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Wider) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress and Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Progress and Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Profile Completion</span>
                    <span className="text-sm font-medium text-blue-600">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-3">Applications Overview:</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">12</p>
                      <p className="text-sm text-muted-foreground">Applied</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">4</p>
                      <p className="text-sm text-muted-foreground">Interviewing</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">1</p>
                      <p className="text-sm text-muted-foreground">Offers</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Inbox Card */}
            <Card>
              <CardHeader>
                <CardTitle>Company Inbox</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    id: 1,
                    company: "Google",
                    position: "Software Engineering Intern, Fall 2024",
                    location: "Mountain View, CA",
                    posted: "2 days ago",
                    match: "95% Match",
                    matchStyle: "bg-blue-100 text-blue-800"
                  },
                  {
                    id: 2,
                    company: "Microsoft",
                    position: "Product Manager Intern",
                    location: "Redmond, WA",
                    posted: "3 days ago",
                    match: "88% Match",
                    matchStyle: "bg-blue-500 text-white"
                  },
                  {
                    id: 3,
                    company: "Amazon",
                    position: "Data Scientist Intern",
                    location: "Seattle, WA",
                    posted: "4 days ago",
                    match: "85% Match",
                    matchStyle: "bg-blue-500 text-white"
                  },
                  {
                    id: 4,
                    company: "Salesforce",
                    position: "UX Designer Intern",
                    location: "San Francisco, CA",
                    posted: "5 days ago",
                    match: "81% Match",
                    matchStyle: "bg-blue-500 text-white"
                  },
                  {
                    id: 5,
                    company: "Netflix",
                    position: "Software Engineer Intern",
                    location: "Los Gatos, CA",
                    posted: "1 week ago",
                    match: "74% Match",
                    matchStyle: "bg-blue-100 text-blue-800"
                  }
                ].map((job, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={`/placeholder-40x40.png?height=40&width=40&text=${job.company[0]}`} />
                      <AvatarFallback className="bg-blue-100 text-blue-800">{job.company[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{job.position}</h4>
                      <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                      <p className="text-xs text-muted-foreground mt-1">{job.posted}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={job.matchStyle}>{job.match}</Badge>
                      {appliedJobs.has(job.id) ? (
                        <Badge variant="secondary">Applied</Badge>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleApply(job.id)}>
                          Apply here
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Application Tracker Card */}
            <Card>
              <CardHeader>
                <CardTitle>Application Tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    position: "Software Engineer Intern",
                    company: "Innovate Inc",
                    progress: 60,
                    status: "In Progress"
                  },
                  {
                    position: "Data Analyst Intern",
                    company: "QuantumLeap",
                    progress: 100,
                    status: "Offer Received"
                  }
                ].map((application, index) => (
                  <div key={index} className="space-y-3">
                    <div>
                      <h4 className="font-medium">{application.position}</h4>
                      <p className="text-sm text-muted-foreground">{application.company}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Applied</span>
                        <span>Screening</span>
                        <span>Interview</span>
                        <span>Offer</span>
                      </div>
                      <Progress value={application.progress} className="h-2" />
                      <div className="flex justify-between text-xs">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span className="text-blue-600 font-medium">{application.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Narrower) */}
          <div className="space-y-6">
            {/* Calendar and Interviews Card */}
            <Card>
              <CardHeader>
                <CardTitle>Calendar and Interviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-center mb-3">
                    <p className="text-sm font-medium">{currentMonth} {currentYear}</p>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    <span className="font-medium">Mo</span>
                    <span className="font-medium">Tu</span>
                    <span className="font-medium">We</span>
                    <span className="font-medium">Th</span>
                    <span className="font-medium">Fr</span>
                    <span className="font-medium">Sa</span>
                    <span className="font-medium">Su</span>
                    
                    {calendarDays.map(day => (
                      <span 
                        key={day}
                        className={`rounded-full w-6 h-6 flex items-center justify-center mx-auto cursor-pointer ${
                          selectedDate === day 
                            ? "bg-blue-500 text-white" 
                            : eventDates.includes(day) 
                              ? "bg-blue-100 text-blue-800 border border-blue-300" 
                              : "text-muted-foreground hover:bg-muted"
                        }`}
                        onClick={() => setSelectedDate(selectedDate === day ? null : day)}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {selectedDate && events[selectedDate as keyof typeof events] ? (
                    // Show events for the selected date
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">
                          {events[selectedDate as keyof typeof events].title}
                        </span>
                      </p>
                      <p className="text-sm text-blue-600">
                        {events[selectedDate as keyof typeof events].company}
                      </p>
                    </div>
                  ) : selectedDate ? (
                    // Show "No events" message when a date is selected but has no events
                    <p className="text-sm text-muted-foreground">No events scheduled for this date</p>
                  ) : interviews.length > 0 ? (
                    // Show upcoming interviews only when no date is selected and there are interviews
                    interviews.map((interview) => (
                      <div key={interview.id}>
                        <p className="text-sm"><span className="font-medium">Upcoming:</span> {interview.title}</p>
                        <p className="text-sm text-blue-600">{interview.date}, {interview.time} with {interview.company}</p>
                      </div>
                    ))
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* Skills Dashboard Card */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Python</span>
                      <span className="text-sm text-blue-600">Advanced</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">SQL</span>
                      <span className="text-sm text-blue-600">Intermediate</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Tableau</span>
                      <span className="text-sm text-blue-600">Beginner</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">In-demand skills:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Machine Learning</Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">AWS</Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">React</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}