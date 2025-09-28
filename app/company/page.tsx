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
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText
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
import { useAuth } from "@/lib/contexts/AuthContext"

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

// Define the interview type
type Interview = {
  id: number;
  name: string;
  time: string;
  date: Date;
  position: string;
  college: string;
};

// Calendar component
const CalendarComponent = ({ 
  interviews, 
  selectedDate, 
  setSelectedDate,
  currentCalendarDate,
  setCurrentCalendarDate
}: {
  interviews: Interview[];
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  currentCalendarDate: Date;
  setCurrentCalendarDate: (date: Date) => void;
}) => {
  const [selectedUser, setSelectedUser] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState<number>(currentCalendarDate.getMonth())
  const [selectedYear, setSelectedYear] = useState<number>(currentCalendarDate.getFullYear())
  
  // Get unique users/students from interviews
  const uniqueUsers = Array.from(new Set(interviews.map(interview => interview.name)))
  
  // Generate a range of years (5 years before and after current year)
  const generateYearRange = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };
  
  const yearRange = generateYearRange();

  // Filter interviews based on selected user
  const filteredInterviews = selectedUser === 'all' 
    ? interviews 
    : interviews.filter(interview => interview.name === selectedUser)

  // Calendar functions
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(selectedYear, selectedMonth, 1);
  }

  const getLastDayOfMonth = (date: Date) => {
    return new Date(selectedYear, selectedMonth + 1, 0);
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }

  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long' });
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    let newMonth = selectedMonth - 1
    let newYear = selectedYear
    if (newMonth < 0) {
      newMonth = 11
      newYear = selectedYear - 1
    }
    setSelectedMonth(newMonth)
    setSelectedYear(newYear)
    setCurrentCalendarDate(new Date(newYear, newMonth, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    let newMonth = selectedMonth + 1
    let newYear = selectedYear
    if (newMonth > 11) {
      newMonth = 0
      newYear = selectedYear + 1
    }
    setSelectedMonth(newMonth)
    setSelectedYear(newYear)
    setCurrentCalendarDate(new Date(newYear, newMonth, 1))
  }

  // Get interviews for a specific date
  const getInterviewsForDate = (date: Date | null) => {
    if (!date) return [];
    return filteredInterviews.filter(interview => 
      interview.date.getDate() === date.getDate() &&
      interview.date.getMonth() === date.getMonth() &&
      interview.date.getFullYear() === date.getFullYear()
    );
  }

  // Check if two dates are the same day
  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  // Check if a date is today
  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  // Generate calendar days
  const firstDayOfMonth = getFirstDayOfMonth(currentCalendarDate);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = getDaysInMonth(currentCalendarDate);
  
  const calendarDays = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(selectedYear, selectedMonth, i));
  }

  // Get interviews for selected date
  const displayedInterviews = selectedDate ? getInterviewsForDate(selectedDate) : [];

  // Handle date selection
  const handleDateSelect = (day: Date | null) => {
    if (day === null) return;
    setSelectedDate(isSameDay(selectedDate, day) ? null : day);
  }

  // Handle month selection
  const handleMonthChange = (monthIndex: number) => {
    setSelectedMonth(monthIndex)
    setCurrentCalendarDate(new Date(selectedYear, monthIndex, 1))
  }

  // Handle year selection
  const handleYearChange = (year: string) => {
    const yearNum = parseInt(year)
    setSelectedYear(yearNum)
    setCurrentCalendarDate(new Date(yearNum, selectedMonth, 1))
  }

  return (
    <div>
      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex gap-2">
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {uniqueUsers.map((user, index) => (
                <SelectItem key={index} value={user}>{user}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedMonth.toString()} onValueChange={(value) => handleMonthChange(parseInt(value))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {yearRange.map((year: number, index: number) => (
              <SelectItem key={index} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
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
          <span className="font-medium">{getMonthName(firstDayOfMonth)} {selectedYear}</span>
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
          const dayInterviews = day !== null ? getInterviewsForDate(day) : [];
          const hasMultipleInterviews = dayInterviews.length > 1;
          
          return (
            <div 
              key={index} 
              className={`text-center text-sm p-2 rounded-full relative cursor-pointer transition-all duration-200 ${
                day === null ? 'invisible' : 
                isSameDay(selectedDate, day) ? 'bg-primary text-primary-foreground font-bold ring-2 ring-primary/30 scale-110' : 
                isToday(day) ? 'bg-muted font-semibold border-2 border-primary animate-pulse' :
                dayInterviews.length > 0 ? 'bg-blue-100 text-blue-800 font-medium hover:bg-blue-200' : 
                'text-muted-foreground hover:bg-muted'
              }`}
              onClick={() => handleDateSelect(day)}
            >
              {day ? day.getDate() : ""}
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
            ? `Interviews on ${getMonthName(selectedDate)} ${selectedDate.getDate()}` 
            : `Upcoming Interviews`}
        </h3>
        {displayedInterviews.length > 0 ? (
          <div className="space-y-3">
            {displayedInterviews.map((interview) => (
              <div key={interview.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${interview.name.charAt(0)}`} />
                  <AvatarFallback>{interview.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{interview.name}</p>
                  <p className="text-sm text-muted-foreground">{interview.position}</p>
                  <p className="text-xs text-primary">
                    {getMonthName(interview.date)} {interview.date.getDate()} at {interview.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : selectedDate ? (
          <p className="text-muted-foreground text-sm">
            No interviews scheduled for {getMonthName(selectedDate)} {selectedDate.getDate()}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredInterviews
              .filter(interview => interview.date >= new Date())
              .slice(0, 3)
              .map((interview) => (
                <div key={interview.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${interview.name.charAt(0)}`} />
                    <AvatarFallback>{interview.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{interview.name}</p>
                    <p className="text-sm text-muted-foreground">{interview.position}</p>
                    <p className="text-xs text-primary">
                      {getMonthName(interview.date)} {interview.date.getDate()} at {interview.time}
                    </p>
                  </div>
                </div>
              ))}
            {filteredInterviews.filter(interview => interview.date >= new Date()).length === 0 && (
              <p className="text-muted-foreground text-sm">No upcoming interviews</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Mock data for students
const mockStudents: Student[] = [
  { id: 1, name: 'Rahul Sharma', match: 95, progress: 'Applied', college: 'KJ Somaiya College of Engineering', position: 'Software Engineering Intern', year: 'TY', department: 'Computer Science' },
  { id: 2, name: 'Priya Patel', match: 88, progress: 'Interview', college: 'DY Patil Institute', position: 'Data Science Intern', year: 'LY', department: 'Data Science' },
  { id: 3, name: 'Amit Kumar', match: 92, progress: 'Approved', college: 'Veermata Jijabai Technological Institute', position: 'UX Designer', year: 'SY', department: 'Design' },
  { id: 4, name: 'Sneha Desai', match: 78, progress: 'Hired', college: 'KJ Somaiya College of Engineering', position: 'Marketing Intern', year: 'TY', department: 'Marketing' },
  { id: 5, name: 'Vikram Singh', match: 85, progress: 'Applied', college: 'DY Patil Institute', position: 'Backend Developer', year: 'LY', department: 'Computer Science' },
  { id: 6, name: 'Anjali Mehta', match: 90, progress: 'Interview', college: 'Veermata Jijabai Technological Institute', position: 'Business Analyst', year: 'SY', department: 'Business' },
  { id: 7, name: 'Rohan Gupta', match: 82, progress: 'Applied', college: 'College of Engineering', position: 'Frontend Developer', year: 'TY', department: 'Computer Science' },
  { id: 8, name: 'Neha Reddy', match: 89, progress: 'Interview', college: 'Business School', position: 'Financial Analyst', year: 'LY', department: 'Finance' }
];

// Mock data for interviews
const mockInterviews: Interview[] = [
  { 
    id: 1, 
    name: 'Rahul Sharma', 
    time: '10:00 AM - 10:30 AM', 
    date: new Date(2025, 8, 3),
    position: 'Software Engineer Intern',
    college: 'IIT Bombay'
  },
  { 
    id: 2, 
    name: 'Priya Patel', 
    time: '2:00 PM - 2:30 PM', 
    date: new Date(2025, 8, 3),
    position: 'Data Analyst Intern',
    college: 'IIT Delhi'
  },
  { 
    id: 3, 
    name: 'Amit Kumar', 
    time: '11:00 AM - 11:45 AM', 
    date: new Date(2025, 8, 15),
    position: 'UX Designer',
    college: 'NIT Trichy'
  },
  { 
    id: 4, 
    name: 'Sneha Desai', 
    time: '3:30 PM - 4:15 PM', 
    date: new Date(2025, 8, 18),
    position: 'Marketing Intern',
    college: 'IIM Ahmedabad'
  },
  { 
    id: 5, 
    name: 'Vikram Singh', 
    time: '9:00 AM - 9:30 AM', 
    date: new Date(2025, 8, 22),
    position: 'Backend Developer',
    college: 'IIT Madras'
  },
  { 
    id: 6, 
    name: 'Anjali Mehta', 
    time: '1:00 PM - 1:30 PM', 
    date: new Date(2025, 9, 5),
    position: 'Frontend Developer',
    college: 'BITS Pilani'
  },
  { 
    id: 7, 
    name: 'Rohan Gupta', 
    time: '10:30 AM - 11:00 AM', 
    date: new Date(2025, 9, 12),
    position: 'Data Scientist',
    college: 'IIT Kharagpur'
  },
  { 
    id: 8, 
    name: 'Neha Reddy', 
    time: '4:00 PM - 4:45 PM', 
    date: new Date(2025, 10, 8),
    position: 'Product Manager',
    college: 'IIM Bangalore'
  }
];

// Mock data for colleges
const mockConnectedColleges = [
  'KJ Somaiya College of Engineering', 
  'DY Patil Institute', 
  'Veermata Jijabai Technological Institute'
];

const mockPendingRequests = [
  'KJ Somaiya College of Engineering', 
  'DY Patil Institute', 
  'Veermata Jijabai Technological Institute'
];

export default function CompanyDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [connectedColleges, setConnectedColleges] = useState<string[]>(mockConnectedColleges);
  const [pendingRequests, setPendingRequests] = useState<string[]>(mockPendingRequests);
  
  // State for interview scheduling modal
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedInterviewDate, setSelectedInterviewDate] = useState<Date | null>(null);

  // Calendar state
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);

  // Filter state for college-wise applications
  const [filters, setFilters] = useState({
    college: 'all',
    year: 'all',
    department: 'all'
  });

  // Sample student data
  const [students, setStudents] = useState<Student[]>(mockStudents);

  const handleRejectCollege = (collegeName: string) => {
    setPendingRequests(pendingRequests.filter(college => college !== collegeName));
  }

  const handleAcceptCollege = (collegeName: string) => {
    setConnectedColleges([...connectedColleges, collegeName]);
    setPendingRequests(pendingRequests.filter(college => college !== collegeName));
  }

  const handleRemoveCollege = (collegeName: string) => {
    setConnectedColleges(connectedColleges.filter(college => college !== collegeName));
  }

  // Filter students based on selected filters
  const filteredStudents = students.filter(student => {
    if (filters.college !== 'all' && student.college !== filters.college) return false;
    if (filters.year !== 'all' && student.year !== filters.year) return false;
    if (filters.department !== 'all' && student.department !== filters.department) return false;
    return true;
  });

  // Get unique values for filter options
  const uniqueColleges = Array.from(new Set(students.map(s => s.college)));
  const uniqueYears = Array.from(new Set(students.map(s => s.year)));
  const uniqueDepartments = Array.from(new Set(students.map(s => s.department)));

  // Get count of new applications
  const newApplicationsCount = students.filter(s => s.progress === 'Applied').length;

  return (
    <DashboardLayout userRole="company">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.profile?.name || user?.email?.split('@')[0] || 'Employer'}!
            </h1>
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

        {/* Top Row of Cards (Overview Stats) */}
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

        {/* Middle Row of Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1))}
                    className="p-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span>{currentCalendarDate.toLocaleString('default', { month: 'long' })} {currentCalendarDate.getFullYear()}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1))}
                    className="p-1"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent 
                interviews={interviews}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                currentCalendarDate={currentCalendarDate}
                setCurrentCalendarDate={setCurrentCalendarDate}
              />
            </CardContent>
          </Card>

          {/* College Connections Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                College Connections
              </CardTitle>
              <CardDescription>Manage your college partnerships</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pending Requests */}
              {pendingRequests.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Pending Requests</h3>
                  <div className="space-y-3">
                    {pendingRequests.map((college, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{college}</span>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleRejectCollege(college)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleAcceptCollege(college)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected Colleges */}
              {connectedColleges.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Connected Colleges</h3>
                  <div className="space-y-3">
                    {connectedColleges.map((college, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{college}</span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleRemoveCollege(college)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Applications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              Applications
            </CardTitle>
            <CardDescription>Review and manage student applications</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-[200px]">
                <Select 
                  value={filters.college} 
                  onValueChange={(value) => setFilters({...filters, college: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by college" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Colleges</SelectItem>
                    {uniqueColleges.map((college, index) => (
                      <SelectItem key={index} value={college}>{college}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <Select 
                  value={filters.year} 
                  onValueChange={(value) => setFilters({...filters, year: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {uniqueYears.map((year, index) => (
                      <SelectItem key={index} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <Select 
                  value={filters.department} 
                  onValueChange={(value) => setFilters({...filters, department: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {uniqueDepartments.map((dept, index) => (
                      <SelectItem key={index} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Student Applications */}
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${student.name.charAt(0)}`} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{student.name}</h3>
                      <Badge variant="secondary">{student.match}% Match</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{student.position}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline">{student.college}</Badge>
                      <Badge variant="outline">{student.year}</Badge>
                      <Badge variant="outline">{student.department}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      className={
                        student.progress === 'Applied' ? 'bg-blue-100 text-blue-800' :
                        student.progress === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                        student.progress === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }
                    >
                      {student.progress}
                    </Badge>
                    <Button size="sm">View Profile</Button>
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