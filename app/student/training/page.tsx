"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  Calendar,
  TrendingUp,
  Laptop,
  Database,
  Palette,
  Shield,
  Network,
  Code,
  Check,
  Download,
  Award,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function StudentTraining() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [activeDomain, setActiveDomain] = useState("All Domains")
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [completedCourses, setCompletedCourses] = useState<any[]>([])
  
  // Get search params to check for enrollment success
  const searchParams = useSearchParams()
  const enrollmentSuccess = searchParams.get('enrolled') === 'true'
  const enrolledCourseId = searchParams.get('courseId')

  const trainingCourses = [
    {
      id: 1,
      title: "Advanced React Development",
      provider: "TechSkills Academy",
      domain: "Frontend Development",
      duration: "8 weeks",
      students: 1240,
      rating: 4.8,
      level: "Intermediate",
      description: "Master advanced React concepts including hooks, context, and performance optimization.",
      skills: ["React", "Hooks", "Context API", "Performance"],
      icon: "Code",
    },
    {
      id: 2,
      title: "Data Science with Python",
      provider: "DataMasters Institute",
      domain: "Data Science",
      duration: "12 weeks",
      students: 980,
      rating: 4.9,
      level: "Beginner",
      description: "Learn data analysis, visualization, and machine learning with Python.",
      skills: ["Python", "Pandas", "Scikit-learn", "Matplotlib"],
      icon: "Database",
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      provider: "CreativeDesign School",
      domain: "Design",
      duration: "6 weeks",
      students: 1520,
      rating: 4.7,
      level: "Beginner",
      description: "Master the principles of user interface and user experience design.",
      skills: ["Figma", "Prototyping", "User Research", "Wireframing"],
      icon: "Palette",
    },
    {
      id: 4,
      title: "Cybersecurity Essentials",
      provider: "SecureNet Training",
      domain: "Cybersecurity",
      duration: "10 weeks",
      students: 870,
      rating: 4.9,
      level: "Intermediate",
      description: "Learn fundamental cybersecurity concepts and best practices.",
      skills: ["Network Security", "Encryption", "Risk Management", "Compliance"],
      icon: "Shield",
    },
    {
      id: 5,
      title: "Cloud Infrastructure with AWS",
      provider: "CloudExperts",
      domain: "Cloud Computing",
      duration: "9 weeks",
      students: 1100,
      rating: 4.8,
      level: "Advanced",
      description: "Master AWS services and cloud architecture design.",
      skills: ["EC2", "S3", "Lambda", "CloudFormation"],
      icon: "Network",
    },
    {
      id: 6,
      title: "Full Stack Development with Node.js",
      provider: "WebDev Masters",
      domain: "Backend Development",
      duration: "14 weeks",
      students: 1350,
      rating: 4.7,
      level: "Intermediate",
      description: "Build complete web applications with Node.js, Express, and MongoDB.",
      skills: ["Node.js", "Express", "MongoDB", "REST API"],
      icon: "Laptop",
    },
  ]

  const domains = [
    { name: "All Domains", icon: "BookOpen", count: 24 },
    { name: "Frontend Development", icon: "Code", count: 5 },
    { name: "Backend Development", icon: "Database", count: 4 },
    { name: "Data Science", icon: "TrendingUp", count: 3 },
    { name: "Design", icon: "Palette", count: 4 },
    { name: "Cybersecurity", icon: "Shield", count: 3 },
    { name: "Cloud Computing", icon: "Network", count: 5 },
  ]

  // Load enrolled courses from localStorage on component mount
  useEffect(() => {
    const savedEnrolledCourses = localStorage.getItem('enrolledCourses')
    if (savedEnrolledCourses) {
      const parsedCourses = JSON.parse(savedEnrolledCourses)
      // When retrieving from localStorage, we need to ensure the icon is stored as a string
      const coursesWithIconNames = parsedCourses.map((course: any) => ({
        ...course,
        icon: typeof course.icon === 'object' ? course.icon.name : course.icon
      }))
      setEnrolledCourses(coursesWithIconNames)
    }
    
    // Load completed courses from localStorage
    const savedCompletedCourses = localStorage.getItem('completedCourses')
    if (savedCompletedCourses) {
      const parsedCourses = JSON.parse(savedCompletedCourses)
      // When retrieving from localStorage, we need to ensure the icon is stored as a string
      const coursesWithIconNames = parsedCourses.map((course: any) => ({
        ...course,
        icon: typeof course.icon === 'object' ? course.icon.name : course.icon
      }))
      setCompletedCourses(coursesWithIconNames)
    }
    
    // If we just enrolled in a course, add it to enrolled courses
    if (enrollmentSuccess && enrolledCourseId) {
      const courseId = parseInt(enrolledCourseId)
      const course = trainingCourses.find(c => c.id === courseId)
      if (course && !enrolledCourses.some((c: any) => c.id === courseId)) {
        const newEnrolledCourses = [...enrolledCourses, { ...course, progress: 0, lessons: "0/0 lessons" }]
        setEnrolledCourses(newEnrolledCourses)
        localStorage.setItem('enrolledCourses', JSON.stringify(newEnrolledCourses))
      }
    }
  }, [enrollmentSuccess, enrolledCourseId])

  // Filter courses based on search, domain, and level
  const filteredCourses = useMemo(() => {
    return trainingCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    
      const matchesDomain = selectedDomain === "all" || course.domain === selectedDomain
      const matchesLevel = selectedLevel === "all" || course.level.toLowerCase() === selectedLevel
      const matchesActiveDomain = activeDomain === "All Domains" || course.domain === activeDomain
    
      return matchesSearch && matchesDomain && matchesLevel && matchesActiveDomain
    })
  }, [trainingCourses, searchQuery, selectedDomain, selectedLevel, activeDomain])

  // Handle domain card click
  const handleDomainClick = (domainName: string) => {
    setActiveDomain(domainName)
  }

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "BookOpen": return BookOpen;
      case "Code": return Code;
      case "Database": return Database;
      case "TrendingUp": return TrendingUp;
      case "Palette": return Palette;
      case "Shield": return Shield;
      case "Network": return Network;
      case "Laptop": return Laptop;
      case "Calendar": return Calendar;
      case "Clock": return Clock;
      case "Users": return Users;
      case "Star": return Star;
      case "Play": return Play;
      case "Check": return Check;
      case "Download": return Download;
      case "Award": return Award;
      case "FileText": return FileText;
      default: return BookOpen;
    }
  }

  // Handle course completion
  const completeCourse = (courseId: number) => {
    const course = trainingCourses.find(c => c.id === courseId)
    if (course) {
      // Remove from enrolled courses
      const updatedEnrolledCourses = enrolledCourses.filter((c: any) => c.id !== courseId)
      setEnrolledCourses(updatedEnrolledCourses)
      localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrolledCourses))
    
      // Add to completed courses with current date
      const completedCourse = { 
        ...course, 
        completionDate: new Date().toISOString(),
        completedDate: new Date() // Adding a more readable date
      }
      const newCompletedCourses = [...completedCourses, completedCourse]
      setCompletedCourses(newCompletedCourses)
      localStorage.setItem('completedCourses', JSON.stringify(newCompletedCourses))
    
      // Show success message
      alert(`Congratulations! You've completed "${course.title}". Your certificate is ready for download.`)
    }
  }

  // Simulate completing a course for demo purposes
  const simulateCompletion = (courseId: number) => {
    // Set progress to 100% for the course
    const updatedEnrolledCourses = enrolledCourses.map((course: any) => {
      if (course.id === courseId) {
        return { ...course, progress: 100, lessons: "All lessons" }
      }
      return course
    })
    setEnrolledCourses(updatedEnrolledCourses)
    localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrolledCourses))
  
    // Complete the course after a short delay
    setTimeout(() => {
      completeCourse(courseId)
    }, 1000)
  }

  // Mark a course as completed
  const markAsCompleted = (courseId: number) => {
    const course = trainingCourses.find(c => c.id === courseId)
    if (course) {
      // Remove from enrolled courses
      const updatedEnrolledCourses = enrolledCourses.filter((c: any) => c.id !== courseId)
      setEnrolledCourses(updatedEnrolledCourses)
      localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrolledCourses))
    
      // Add to completed courses with current date
      const completedCourse = { 
        ...course, 
        completionDate: new Date().toISOString(),
        completedDate: new Date()
      }
      const newCompletedCourses = [...completedCourses, completedCourse]
      setCompletedCourses(newCompletedCourses)
      localStorage.setItem('completedCourses', JSON.stringify(newCompletedCourses))
    
      // Show success message
      alert(`Congratulations! You've completed "${course.title}". Your certificate is ready for download.`)
    }
  }

  // Handle certificate download
  const downloadCertificate = (course: any) => {
    // Create a more professional certificate template as HTML
    const certificateHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate of Completion - ${course.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@300;400;500&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Roboto', sans-serif;
              background: #f8f9fa;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              padding: 20px;
            }
            
            .certificate-container {
              width: 100%;
              max-width: 800px;
              background: white;
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              overflow: hidden;
              position: relative;
              background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
            }
            
            .certificate-watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: 120px;
              font-weight: bold;
              color: rgba(26, 86, 219, 0.05);
              z-index: 0;
              pointer-events: none;
            }
            
            .certificate-header {
              background: linear-gradient(135deg, #1a56db 0%, #0e2e6d 100%);
              color: white;
              text-align: center;
              padding: 40px 20px;
              position: relative;
              z-index: 1;
            }
            
            .certificate-logo {
              position: absolute;
              top: 20px;
              left: 20px;
              font-size: 24px;
              font-weight: bold;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .logo-icon {
              width: 40px;
              height: 40px;
              background: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #1a56db;
              font-weight: bold;
            }
            
            .certificate-title {
              font-family: 'Playfair Display', serif;
              font-size: 48px;
              margin-bottom: 10px;
              letter-spacing: 2px;
            }
            
            .certificate-subtitle {
              font-size: 20px;
              font-weight: 300;
              max-width: 600px;
              margin: 0 auto 30px;
              line-height: 1.6;
            }
            
            .certificate-divider {
              width: 100px;
              height: 2px;
              background: #gold;
              margin: 0 auto 30px;
            }
            
            .certificate-body {
              padding: 50px 40px;
              text-align: center;
              position: relative;
              z-index: 1;
            }
            
            .award-text {
              font-size: 22px;
              color: #333;
              margin-bottom: 30px;
            }
            
            .recipient-name {
              font-family: 'Playfair Display', serif;
              font-size: 42px;
              color: #1a56db;
              margin: 30px 0;
              padding: 15px;
              border-bottom: 2px solid #eee;
            }
            
            .course-info {
              font-size: 18px;
              color: #555;
              margin: 25px 0;
              line-height: 1.8;
            }
            
            .course-title {
              font-weight: 500;
              color: #1a56db;
              font-size: 22px;
              display: block;
              margin: 10px 0;
            }
            
            .completion-date {
              font-size: 18px;
              color: #666;
              margin: 30px 0;
            }
            
            .certificate-footer {
              display: flex;
              justify-content: space-around;
              margin: 50px 0 30px;
              padding: 0 20px;
            }
            
            .signature-box {
              text-align: center;
              width: 200px;
            }
            
            .signature-line {
              width: 100%;
              border-top: 1px solid #ccc;
              padding-top: 10px;
              margin-top: 60px;
              color: #777;
              font-size: 14px;
            }
            
            .certificate-id {
              position: absolute;
              bottom: 20px;
              right: 20px;
              font-size: 12px;
              color: #999;
            }
            
            .certificate-seal {
              position: absolute;
              bottom: 30px;
              left: 50%;
              transform: translateX(-50%);
              width: 80px;
              height: 80px;
              border: 3px solid #1a56db;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              color: #1a56db;
              font-size: 12px;
              text-align: center;
            }
            
            .verification-text {
              margin-top: 40px;
              font-size: 14px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="certificate-watermark">CERTIFIED</div>
            <div class="certificate-header">
              <div class="certificate-logo">
                <div class="logo-icon">CC</div>
                Campus Connect
              </div>
              <h1 class="certificate-title">CERTIFICATE OF COMPLETION</h1>
              <p class="certificate-subtitle">This certificate is proudly presented to</p>
              <div class="certificate-divider"></div>
            </div>
            
            <div class="certificate-body">
              <p class="award-text">In recognition of successfully completing the training program</p>
              
              <div class="recipient-name">Student Name</div>
              
              <div class="course-info">
                for the course<br/>
                <span class="course-title">${course.title}</span>
                offered by <strong>${course.provider}</strong><br/>
                with a duration of <strong>${course.duration}</strong>
              </div>
              
              <p class="completion-date">
                Completed on: <strong>${new Date(course.completionDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</strong>
              </p>
              
              <div class="certificate-footer">
                <div class="signature-box">
                  <div class="signature-line">Authorized Signature</div>
                </div>
                <div class="signature-box">
                  <div class="signature-line">Date</div>
                </div>
              </div>
              
              <p class="verification-text">
                This certificate can be verified at: campusconnect.edu/verify/${course.id}-${Date.now().toString().slice(-6)}
              </p>
            </div>
            
            <div class="certificate-id">ID: CC-${course.id}-${Date.now().toString().slice(-6)}</div>
            <div class="certificate-seal">OFFICIAL</div>
          </div>
        </body>
      </html>
    `;
    
    // Create a Blob with the HTML content
    const blob = new Blob([certificateHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate-${course.title.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        {/* Enrollment Success Message */}
        {enrollmentSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800">Enrollment Successful!</h3>
              <p className="text-green-700 text-sm">
                You have been successfully enrolled in the course. You can access it from your enrolled courses.
              </p>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Industry Training Courses</h1>
            <p className="text-muted-foreground">Enhance your skills with industry-recognized training programs</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="Search training courses..." 
                    className="pl-10" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Domains</SelectItem>
                    <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                    <SelectItem value="Backend Development">Backend Development</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Domain Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {domains.map((domain, index) => {
            const IconComponent = getIconComponent(domain.icon);
            return (
              <Card 
                key={index} 
                className={`hover:shadow-md transition-shadow cursor-pointer ${activeDomain === domain.name ? 'ring-2 ring-primary' : ''}`}
                onClick={() => handleDomainClick(domain.name)}
              >
                <CardContent className="p-4 text-center">
                  <IconComponent className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-medium text-sm mb-1">{domain.name}</h3>
                  <p className="text-xs text-muted-foreground">{domain.count} courses</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recommended Courses</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Most Popular</Button>
              <Button variant="outline" size="sm">Highest Rated</Button>
              <Button variant="outline" size="sm">Newest</Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredCourses.map((course) => {
              const IconComponent = getIconComponent(course.icon);
              return (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{course.provider}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{course.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.students} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </span>
                    </div>
                    <p className="text-sm mb-4">{course.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{course.domain}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/student/training/${course.id}`}>
                            <Play className="w-4 h-4 mr-1" />
                            Preview
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/student/training/${course.id}?enroll=true`}>Enroll Now</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          {filteredCourses.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No courses found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Progress Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Learning Progress</CardTitle>
            <CardDescription>Continue your journey with these ongoing courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course: any, index: number) => (
                <div key={index} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">{course.provider}</p>
                    </div>
                    <span className="text-sm font-medium">{course.progress || 0}%</span>
                  </div>
                  <div className="mb-2">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{course.lessons || "0/0 lessons"} completed</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/student/training/${course.id}`}>Continue</Link>
                      </Button>
                      {(course.progress >= 100 || course.lessons === "All lessons") ? (
                        <Button 
                          size="sm" 
                          onClick={() => markAsCompleted(course.id)} 
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Mark as Completed
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => simulateCompletion(course.id)}
                          variant="secondary"
                        >
                          Simulate Completion
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Enroll in a course to start tracking your progress.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Courses Section */}
        <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50/50 to-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-green-600" />
              <CardTitle className="text-xl">Completed Courses</CardTitle>
            </div>
            <CardDescription>Earned certificates for your successful course completions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedCourses.length > 0 ? (
              completedCourses.map((course: any, index: number) => {
                const IconComponent = getIconComponent(course.icon);
                return (
                  <div key={index} className="p-5 rounded-xl border border-green-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <IconComponent className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{course.title}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <span>{course.provider}</span>
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1 text-sm">
                        <Check className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Completed: {new Date(course.completionDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.domain}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.skills.slice(0, 4).map((skill: string, skillIndex: number) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                          {skill}
                        </Badge>
                      ))}
                      {course.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                          +{course.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-green-100">
                      <div className="text-sm text-green-700 font-medium flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Certificate Ready for Download
                      </div>
                      <Button 
                        onClick={() => downloadCertificate(course)} 
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Certificate
                      </Button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <Award className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Completed Courses Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  Complete your enrolled courses to earn certificates and showcase your achievements.
                </p>
                <Button asChild>
                  <Link href="#courses">Browse Courses</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}