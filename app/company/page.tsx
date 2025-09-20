"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Briefcase, 
  Users, 
  Calendar, 
  CheckCircle, 
  Bell, 
  Search,
  Plus,
  X,
  Check,
  MoreHorizontal,
  Filter
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Define the student type
type Student = {
  id: number;
  name: string;
  match: number;
  progress: string;
  college: string;
  position: string;
  year: string;
  department: string;
};

export default function CompanyDashboard() {
  const router = useRouter();
  const [connectedColleges, setConnectedColleges] = useState([
    'KJ Somaiya College of Engineering', 
    'DY Patil Institute', 
    'Veermata Jijabai Technological Institute'
  ])
  
  const [pendingRequests, setPendingRequests] = useState([
    'KJ Somaiya College of Engineering', 
    'DY Patil Institute', 
    'Veermata Jijabai Technological Institute'
  ])

  // State for interview scheduling modal
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedInterviewDate, setSelectedInterviewDate] = useState<number | null>(null);

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [interviews, setInterviews] = useState([
    { 
      id: 1, 
      name: 'Ethan Carter', 
      time: '10:00 AM - 10:30 AM', 
      date: 3,
      position: 'Software Engineer Intern',
      college: 'MIT'
    },
    { 
      id: 2, 
      name: 'Olivia Bennett', 
      time: '2:00 PM - 2:30 PM', 
      date: 3,
      position: 'Data Analyst Intern',
      college: 'Stanford'
    },
    { 
      id: 3, 
      name: 'Liam Harper', 
      time: '11:00 AM - 11:45 AM', 
      date: 15,
      position: 'UX Designer',
      college: 'Harvard'
    },
    { 
      id: 4, 
      name: 'Ava Foster', 
      time: '3:30 PM - 4:15 PM', 
      date: 18,
      position: 'Marketing Intern',
      college: 'Yale'
    },
    { 
      id: 5, 
      name: 'Noah Patel', 
      time: '9:00 AM - 9:30 AM', 
      date: 22,
      position: 'Backend Developer',
      college: 'IIT Bombay'
    }
  ])

  // Filter state for college-wise applications
  const [filters, setFilters] = useState({
    college: 'all',
    year: 'all',
    department: 'all'
  })

  // Sample student data
  const [students, setStudents] = useState([
    { id: 1, name: 'Ethan Carter', match: 95, progress: 'Applied', college: 'KJ Somaiya College of Engineering', position: 'Software Engineering Intern', year: 'TY', department: 'Computer Science' },
    { id: 2, name: 'Olivia Bennett', match: 88, progress: 'Interview', college: 'DY Patil Institute', position: 'Data Science Intern', year: 'LY', department: 'Data Science' },
    { id: 3, name: 'Liam Harper', match: 92, progress: 'Approved', college: 'Veermata Jijabai Technological Institute', position: 'UX Designer', year: 'SY', department: 'Design' },
    { id: 4, name: 'Ava Foster', match: 78, progress: 'Hired', college: 'KJ Somaiya College of Engineering', position: 'Marketing Intern', year: 'TY', department: 'Marketing' },
    { id: 5, name: 'Noah Patel', match: 85, progress: 'Applied', college: 'DY Patil Institute', position: 'Backend Developer', year: 'LY', department: 'Computer Science' },
    { id: 6, name: 'Emma Johnson', match: 90, progress: 'Interview', college: 'Veermata Jijabai Technological Institute', position: 'Business Analyst', year: 'SY', department: 'Business' },
    { id: 7, name: 'James Wilson', match: 82, progress: 'Applied', college: 'College of Engineering', position: 'Frontend Developer', year: 'TY', department: 'Computer Science' },
    { id: 8, name: 'Sophia Garcia', match: 89, progress: 'Interview', college: 'Business School', position: 'Financial Analyst', year: 'LY', department: 'Finance' }
  ])

  const handleRejectCollege = (collegeName: string) => {
    setPendingRequests(pendingRequests.filter(college => college !== collegeName))
  }

  const handleAcceptCollege = (collegeName: string) => {
    setConnectedColleges([...connectedColleges, collegeName])
    setPendingRequests(pendingRequests.filter(college => college !== collegeName))
  }

  const handleRemoveCollege = (collegeName: string) => {
    setConnectedColleges(connectedColleges.filter(college => college !== collegeName))
  }

  // Get current date for dynamic calendar
  const today = new Date()
  const currentMonth = today.toLocaleString('default', { month: 'long' })
  const currentYear = today.getFullYear()
  const currentDate = today.getDate()

  // Generate calendar days
  const firstDayOfMonth = new Date(currentYear, today.getMonth(), 1).getDay()
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate()
  
  const calendarDays = []
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  // Get interviews for selected date or today
  const displayedInterviews = selectedDate 
    ? interviews.filter(interview => interview.date === selectedDate)
    : interviews.filter(interview => interview.date === currentDate)

  // Handle date selection
  const handleDateSelect = (day: number | null) => {
    if (day === null) return
    setSelectedDate(day === selectedDate ? null : day)
  }

  // Filter students based on selected filters
  const filteredStudents = students.filter(student => {
    if (filters.college !== 'all' && student.college !== filters.college) return false
    if (filters.year !== 'all' && student.year !== filters.year) return false
    if (filters.department !== 'all' && student.department !== filters.department) return false
    return true
  })

  // Get unique values for filter options
  const uniqueColleges = Array.from(new Set(students.map(s => s.college)))
  const uniqueYears = Array.from(new Set(students.map(s => s.year)))
  const uniqueDepartments = Array.from(new Set(students.map(s => s.department)))

  // Get count of new applications
  const newApplicationsCount = students.filter(s => s.progress === 'Applied').length

  return (
    <DashboardLayout userRole="company">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Employer Dashboard</h1>
            <p className="text-muted-foreground">Manage your internship postings and review applications</p>
          </div>
          <Link href="/company/notifications">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              {newApplicationsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {newApplicationsCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>

        {/* Top Row of Cards (Overview Stats) - No gradients as requested */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Postings</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">+5 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Placed Students</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">+3 from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Middle Row of Cards - No job posting section as requested */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>{currentMonth} {currentYear}</span>
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-3">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, index) => {
                  const dayInterviews = day !== null ? interviews.filter(interview => interview.date === day) : [];
                  const hasMultipleInterviews = dayInterviews.length > 1;
                  
                  return (
                    <div 
                      key={index} 
                      className={`text-center text-sm p-2 rounded-full relative cursor-pointer transition-all duration-200 ${
                        day === null ? 'invisible' : 
                        day === selectedDate ? 'bg-primary text-primary-foreground font-bold ring-2 ring-primary/30 scale-110' : 
                        day === currentDate ? 'bg-muted font-semibold border-2 border-primary animate-pulse' :
                        dayInterviews.length > 0 ? 'bg-blue-100 text-blue-800 font-medium hover:bg-blue-200' : 
                        'text-muted-foreground hover:bg-muted'
                      }`}
                      onClick={() => handleDateSelect(day)}
                    >
                      {day}
                      {dayInterviews.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                          {hasMultipleInterviews ? (
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
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  {selectedDate 
                    ? `Interviews on ${currentMonth} ${selectedDate}` 
                    : `Interviews Today (${currentMonth} ${currentDate})`}: 
                </h3>
                {displayedInterviews.length > 0 ? (
                  <div className="space-y-3">
                    {displayedInterviews.map((interview) => (
                      <div key={interview.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${interview.name.charAt(0)}`} />
                          <AvatarFallback>{interview.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{interview.name}</p>
                          <p className="text-sm text-muted-foreground">{interview.position}</p>
                          <p className="text-xs text-primary">{interview.time}</p>
                        </div>
                        <Button size="sm" variant="outline">Join</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {selectedDate 
                      ? `No interviews scheduled for ${currentMonth} ${selectedDate}` 
                      : 'No interviews scheduled for today'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* College Management Card */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>College Management</span>
                <Search className="w-5 h-5 text-muted-foreground" />
              </CardTitle>
              <CardDescription>Manage your college partnerships</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search for colleges..." className="pl-10 h-10" />
              </div>
              
              <div className="flex-1 flex flex-col">
                {/* Removed Connected Colleges section as per user request */}
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">Pending Requests</h3>
                    <Badge variant="outline">{pendingRequests.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {pendingRequests.length > 0 ? (
                      pendingRequests.map((college, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                          <span className="text-sm font-medium">{college}</span>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleAcceptCollege(college)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRejectCollege(college)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No pending requests</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section (College-Wise Application Management) */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>College-Wise Application Management</CardTitle>
                <CardDescription>Review and manage student applications by college</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={filters.college} onValueChange={(value) => setFilters({...filters, college: value})}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="College" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Colleges</SelectItem>
                    {uniqueColleges.map(college => (
                      <SelectItem key={college} value={college}>{college}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {uniqueYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filters.department} onValueChange={(value) => setFilters({...filters, department: value})}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {uniqueDepartments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm" onClick={() => setFilters({college: 'all', year: 'all', department: 'all'})}>
                  <Filter className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-4 text-left">STUDENT</th>
                    <th className="p-4 text-left">BEST MATCH</th>
                    <th className="p-4 text-left">PROGRESS</th>
                    <th className="p-4 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${student.name.charAt(0)}`} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.college}</p>
                            <p className="text-xs text-muted-foreground">{student.position}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-muted rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${student.match}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{student.match}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant="secondary" 
                          className={
                            student.progress === 'Applied' ? 'bg-blue-100 text-blue-800' :
                            student.progress === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                            student.progress === 'Approved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {student.progress}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {student.progress === 'Applied' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                asChild
                              >
                                <Link href={`/company/students/${student.id}`}>
                                  View Profile
                                </Link>
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => {
                                  // Open calendar for scheduling interview
                                  console.log(`Scheduling interview for ${student.name}`);
                                  setSelectedStudent(student);
                                  setIsSchedulingModalOpen(true);
                                }}
                              >
                                Schedule Interview
                              </Button>
                            </>
                          )}
                          {student.progress === 'Interview' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  // Send offer
                                  console.log(`Sending offer to ${student.name}`);
                                  // Update student progress in real app
                                  setStudents(students.map(s => 
                                    s.id === student.id ? {...s, progress: 'Approved'} : s
                                  ));
                                }}
                              >
                                Offer
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  // Reject application
                                  console.log(`Rejecting application for ${student.name}`);
                                  // Update student progress in real app
                                  setStudents(students.map(s => 
                                    s.id === student.id ? {...s, progress: 'Rejected'} : s
                                  ));
                                }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {student.progress === 'Approved' && (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => {
                                // Send final offer
                                console.log(`Sending final offer to ${student.name}`);
                                // Update student progress in real app
                                setStudents(students.map(s => 
                                  s.id === student.id ? {...s, progress: 'Hired'} : s
                                ));
                              }}
                            >
                              Send Offer
                            </Button>
                          )}
                          {student.progress === 'Hired' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // View hiring details
                                console.log(`Viewing hiring details for ${student.name}`);
                                // In a real app, this would show hiring details
                              }}
                            >
                              View Details
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              // Show more options
                              console.log(`Showing more options for ${student.name}`);
                            }}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Interview Scheduling Modal */}
      <Dialog open={isSchedulingModalOpen} onOpenChange={setIsSchedulingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${selectedStudent.name.charAt(0)}`} />
                  <AvatarFallback>{selectedStudent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedStudent.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedStudent.position}</p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">{currentMonth} {currentYear}</h3>
                <div className="grid grid-cols-7 gap-1">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-1">
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((day, index) => (
                    <div 
                      key={index} 
                      className={`text-center text-sm p-1 rounded-full cursor-pointer ${
                        day === null ? 'invisible' : 
                        day === selectedInterviewDate ? 'bg-primary text-primary-foreground' : 
                        'text-muted-foreground hover:bg-muted'
                      }`}
                      onClick={() => day !== null && setSelectedInterviewDate(day)}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedInterviewDate && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Available Time Slots</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'].map((time) => (
                      <Button 
                        key={time} 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Add interview to calendar
                          const newInterview = {
                            id: interviews.length + 1,
                            name: selectedStudent.name,
                            time: `${time} - ${calculateEndTime(time)}`,
                            date: selectedInterviewDate,
                            position: selectedStudent.position,
                            college: selectedStudent.college
                          };
                          setInterviews([...interviews, newInterview]);
                          setStudents(students.map(s => 
                            s.id === selectedStudent.id ? {...s, progress: 'Interview'} : s
                          ));
                          setIsSchedulingModalOpen(false);
                          setSelectedInterviewDate(null);
                          console.log(`Interview scheduled for ${selectedStudent.name} on ${currentMonth} ${selectedInterviewDate} at ${time}`);
                        }}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsSchedulingModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

// Helper function to calculate end time
function calculateEndTime(startTime: string): string {
  // Simple implementation - add 30 minutes
  const [time, period] = startTime.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let newHours = hours;
  let newMinutes = minutes + 30;
  let newPeriod = period;
  
  if (newMinutes >= 60) {
    newMinutes -= 60;
    newHours += 1;
    
    if (newHours === 12) {
      newPeriod = period === 'AM' ? 'PM' : 'AM';
    } else if (newHours > 12) {
      newHours -= 12;
      newPeriod = period === 'AM' ? 'PM' : 'AM';
    }
  }
  
  return `${newHours}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`;
}