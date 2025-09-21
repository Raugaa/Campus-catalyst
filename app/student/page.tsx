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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Calendar component
const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Events data - in a real app, this would come from an API
  const events = [
    { date: new Date(2025, 8, 15), type: 'interview', title: 'UX/UI Design Interview', company: 'TCS', time: '10:00 AM - 10:30 AM' },
    { date: new Date(2025, 8, 22), type: 'deadline', title: 'Application Deadline', company: 'Google', time: '11:59 PM' },
    { date: new Date(2025, 8, 28), type: 'event', title: 'Career Fair', company: 'Campus Event', time: '2:00 PM - 5:00 PM' },
    { date: new Date(2025, 9, 5), type: 'interview', title: 'Backend Developer Interview', company: 'Infosys', time: '9:00 AM - 9:45 AM' },
    { date: new Date(2025, 9, 12), type: 'deadline', title: 'Application Deadline', company: 'Microsoft', time: '11:59 PM' },
    { date: new Date(2025, 10, 3), type: 'interview', title: 'Data Science Interview', company: 'Wipro', time: '1:00 PM - 1:30 PM' },
    { date: new Date(2025, 10, 18), type: 'event', title: 'Workshop on Resume Building', company: 'Career Services', time: '4:00 PM - 6:00 PM' },
    { date: new Date(2025, 11, 1), type: 'deadline', title: 'Internship Application Deadline', company: 'Various Companies', time: '11:59 PM' },
  ]

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  
  // Get the last day of the month
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  
  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  
  // Get the number of days in the month
  const daysInMonth = lastDayOfMonth.getDate()
  
  // Get the month name
  const monthName = currentDate.toLocaleString('default', { month: 'long' })
  
  // Get the year
  const year = currentDate.getFullYear()

  // Helper function to get month name (to match company calendar)
  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long' });
  }

  // Function to get events for a specific date
  const getEventsForDate = (date: Date | null) => {
    if (!date) return []
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    )
  }

  // Function to check if a date has events
  const hasEvents = (date: Date | null) => {
    if (!date) return false
    return events.some(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    )
  }

  // Function to go to the previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Function to go to the next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Function to check if two dates are the same day
  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  // Check if a date is today
  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  // Generate calendar days
  const calendarDays = []
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null)
  }
  
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
  }

  // Get events for selected date
  const displayedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  // Handle date selection
  const handleDateSelect = (day: Date | null) => {
    if (day === null) return
    setSelectedDate(isSameDay(selectedDate, day) ? null : day)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToPreviousMonth}
            className="p-1"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span>{getMonthName(currentDate)} {currentDate.getFullYear()}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToNextMonth}
            className="p-1"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Calendar className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="grid grid-cols-7 gap-1 mb-3">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => {
          const dayEvents = day !== null ? getEventsForDate(day) : []
          const hasMultipleEvents = dayEvents.length > 1
          
          return (
            <div 
              key={index} 
              className={`text-center text-sm p-2 rounded-full relative cursor-pointer transition-all duration-200 ${
                day === null ? 'invisible' : 
                isSameDay(selectedDate, day) ? 'bg-primary text-primary-foreground font-bold ring-2 ring-primary/30 scale-110' : 
                isToday(day) ? 'bg-muted font-semibold border-2 border-primary animate-pulse' :
                dayEvents.length > 0 ? 'bg-blue-100 text-blue-800 font-medium hover:bg-blue-200' : 
                'text-muted-foreground hover:bg-muted'
              }`}
              onClick={() => handleDateSelect(day)}
            >
              {day ? day.getDate() : ""}
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                  {hasMultipleEvents ? (
                    <div className="flex">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full -ml-0.5"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full -ml-0.5"></div>
                    </div>
                  ) : (
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          {selectedDate 
            ? `Events on ${getMonthName(selectedDate)} ${selectedDate.getDate()}` 
            : `Upcoming Events`}
        </h3>
        {displayedEvents.length > 0 ? (
          <div className="space-y-3">
            {displayedEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${event.company.charAt(0)}`} />
                  <AvatarFallback>{event.company.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.company}</p>
                  <p className="text-xs text-primary">
                    {getMonthName(event.date)} {event.date.getDate()} at {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : selectedDate ? (
          <p className="text-muted-foreground text-sm">
            No events scheduled for {getMonthName(selectedDate)} {selectedDate.getDate()}
          </p>
        ) : (
          <div className="space-y-3">
            {events
              .filter(event => event.date >= new Date())
              .slice(0, 3)
              .map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${event.company.charAt(0)}`} />
                    <AvatarFallback>{event.company.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.company}</p>
                    <p className="text-xs text-primary">
                      {getMonthName(event.date)} {event.date.getDate()} at {event.time}
                    </p>
                  </div>
                </div>
              ))}
            {events.filter(event => event.date >= new Date()).length === 0 && (
              <p className="text-muted-foreground text-sm">No upcoming events</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  const router = useRouter()
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set())
  
  // Mock user data
  const user = {
    student: {
      firstName: "Rahul"
    }
  }
  
  // Get user's first name for welcome message
  const userFirstName = user?.student?.firstName || "Rahul"

  // Mock data for interviews
  const interviews = [
    {
      id: 1,
      title: "UX/UI Design Interview",
      company: "TCS",
      date: "Nov 8",
      time: "9:00 AM"
    }
  ]

  // Handle job application
  const handleApply = (jobId: number) => {
    // Navigate to the job detail page
    router.push(`/student/opportunities/${jobId}`)
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
                    location: "Bangalore, India",
                    posted: "2 days ago",
                    match: "95% Match",
                    matchStyle: "bg-blue-100 text-blue-800"
                  },
                  {
                    id: 2,
                    company: "Microsoft",
                    position: "Product Manager Intern",
                    location: "Hyderabad, India",
                    posted: "3 days ago",
                    match: "88% Match",
                    matchStyle: "bg-blue-500 text-white"
                  },
                  {
                    id: 3,
                    company: "Amazon",
                    position: "Data Scientist Intern",
                    location: "Chennai, India",
                    posted: "4 days ago",
                    match: "85% Match",
                    matchStyle: "bg-blue-500 text-white"
                  },
                  {
                    id: 4,
                    company: "TCS",
                    position: "Software Developer Intern",
                    location: "Mumbai, India",
                    posted: "5 days ago",
                    match: "92% Match",
                    matchStyle: "bg-blue-500 text-white"
                  },
                  {
                    id: 5,
                    company: "Infosys",
                    position: "System Engineer Intern",
                    location: "Pune, India",
                    posted: "1 week ago",
                    match: "89% Match",
                    matchStyle: "bg-blue-500 text-white"
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
                    company: "Infosys",
                    progress: 60,
                    status: "In Progress"
                  },
                  {
                    position: "Data Analyst Intern",
                    company: "Wipro",
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
                <CalendarComponent />
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