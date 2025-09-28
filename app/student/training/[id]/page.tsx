"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  Calendar,
  Download,
  FileText,
  Award,
  CheckCircle,
  ChevronRight,
  Video,
  File,
  Book,
  Check,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

// Mock data for training courses
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
    description: "Master advanced React concepts including hooks, context, and performance optimization. This comprehensive course will take you from intermediate to advanced React developer.",
    longDescription: "This course is designed for developers who already have a basic understanding of React and want to take their skills to the next level. You'll learn advanced patterns, performance optimization techniques, and how to build scalable applications. The course includes hands-on projects and real-world examples.",
    skills: ["React", "Hooks", "Context API", "Performance", "Testing"],
    modules: [
      { id: 1, title: "Advanced Hooks", duration: "2 hours", lessons: 8 },
      { id: 2, title: "Context and State Management", duration: "3 hours", lessons: 12 },
      { id: 3, title: "Performance Optimization", duration: "2.5 hours", lessons: 10 },
      { id: 4, title: "Testing React Applications", duration: "3 hours", lessons: 12 },
      { id: 5, title: "Advanced Patterns", duration: "2 hours", lessons: 8 },
    ],
    instructor: {
      name: "Rajesh Kumar",
      title: "Senior Frontend Engineer at TCS",
      bio: "10+ years of experience in frontend development with expertise in React ecosystem.",
      avatar: "/placeholder-instructor.jpg",
    },
    prerequisites: ["Basic React knowledge", "JavaScript fundamentals", "HTML/CSS basics"],
    materials: [
      { name: "Course Slides", type: "PDF", size: "12 MB" },
      { name: "Exercise Files", type: "ZIP", size: "8 MB" },
      { name: "Cheat Sheet", type: "PDF", size: "2 MB" },
    ],
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
    longDescription: "This comprehensive course covers everything you need to know to start your journey in data science. From basic Python programming to advanced machine learning algorithms, you'll gain practical skills that are in high demand.",
    skills: ["Python", "Pandas", "Scikit-learn", "Matplotlib", "NumPy"],
    modules: [
      { id: 1, title: "Python for Data Science", duration: "3 hours", lessons: 12 },
      { id: 2, title: "Data Manipulation with Pandas", duration: "4 hours", lessons: 15 },
      { id: 3, title: "Data Visualization", duration: "3 hours", lessons: 10 },
      { id: 4, title: "Machine Learning Basics", duration: "5 hours", lessons: 20 },
      { id: 5, title: "Advanced ML Techniques", duration: "4 hours", lessons: 15 },
    ],
    instructor: {
      name: "Dr. Priya Sharma",
      title: "Data Science Lead at Infosys",
      bio: "PhD in Data Science with 8 years of industry experience. Specializes in machine learning and big data analytics.",
      avatar: "/placeholder-instructor.jpg",
    },
    prerequisites: ["Basic programming knowledge", "High school mathematics"],
    materials: [
      { name: "Course Notes", type: "PDF", size: "15 MB" },
      { name: "Datasets", type: "ZIP", size: "25 MB" },
      { name: "Jupyter Notebooks", type: "ZIP", size: "10 MB" },
    ],
    icon: "Database",
  },
]

export default function TrainingCourseDetail({ params }: { params: { id: string } }) {
  // Find the course based on the ID
  const courseId = parseInt(params.id)
  const course = trainingCourses.find(c => c.id === courseId)
  
  // State for enrollment status
  const [isEnrolled, setIsEnrolled] = useState(false)
  
  // Router for navigation
  const router = useRouter()
  
  // Get search params to check for enrollment request
  const searchParams = useSearchParams()
  const enrollRequested = searchParams.get('enroll') === 'true'
  
  // Check if already enrolled in localStorage
  useEffect(() => {
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]')
    const isCourseEnrolled = enrolledCourses.some((c: any) => c.id === courseId)
    if (isCourseEnrolled) {
      setIsEnrolled(true)
    }
    
    // If enrollment was requested, automatically enroll the user
    if (enrollRequested && !isEnrolled && !isCourseEnrolled) {
      handleEnroll()
    }
  }, [enrollRequested, courseId])

  // Handle enrollment
  const handleEnroll = () => {
    // In a real app, this would make an API call to enroll the student
    // For now, we'll just set the state to show the success message
    setIsEnrolled(true)
    
    // Save enrolled course to localStorage
    if (course) {
      const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]')
      const isAlreadyEnrolled = enrolledCourses.some((c: any) => c.id === course.id)
      
      if (!isAlreadyEnrolled) {
        const updatedEnrolledCourses = [...enrolledCourses, { ...course, progress: 0, lessons: "0/0 lessons" }]
        localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrolledCourses))
      }
    }
    
    // Redirect back to training page with success message after a short delay
    setTimeout(() => {
      router.push(`/student/training?enrolled=true&courseId=${courseId}`)
    }, 2000)
  }
  
  // If course not found, show a message
  if (!course) {
    return (
      <DashboardLayout userRole="student">
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
              <p className="text-muted-foreground mb-4">The training course you're looking for doesn't exist or has been removed.</p>
              <Button asChild>
                <Link href="/student/training">Browse All Courses</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        {/* Breadcrumb and Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/student/training" className="hover:text-foreground">Training</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground truncate">{course.title}</span>
          </div>
          <div className="flex gap-2">
            <Link href="/student">
              <Button variant="outline" className="flex items-center gap-2">
                <span>Back to Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Enrollment Success Message */}
        {isEnrolled && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800">Enrollment Successful!</h3>
              <p className="text-green-700 text-sm">
                You have been successfully enrolled in <span className="font-semibold">{course.title}</span>. 
                Redirecting to your courses page...
              </p>
            </div>
          </div>
        )}

        {/* Course Header */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-3">{course.domain}</Badge>
                    <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
                    <p className="text-muted-foreground mb-4">{course.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{course.rating}</span>
                        <span className="text-muted-foreground">({course.students} students)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={course.instructor.avatar} />
                        <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{course.instructor.name}</p>
                        <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {course.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:w-80">
                    <Card className="bg-muted">
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <h3 className="font-semibold mb-1">Enroll in this course</h3>
                          <p className="text-sm text-muted-foreground">Start learning today</p>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          {!isEnrolled ? (
                            <Button className="w-full" onClick={handleEnroll}>
                              <Play className="w-4 h-4 mr-2" />
                              Enroll Now
                            </Button>
                          ) : (
                            <Button className="w-full" disabled>
                              <Check className="w-4 h-4 mr-2" />
                              Already Enrolled
                            </Button>
                          )}
                          <Button variant="outline" className="w-full">
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Demo
                          </Button>
                        </div>
                        
                        <div className="text-center text-sm text-muted-foreground">
                          <p>Next cohort starts: Oct 15, 2025</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Course Description */}
            <Card>
              <CardHeader>
                <CardTitle>About this course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{course.longDescription}</p>
                
                <h3 className="font-semibold mb-2">Prerequisites</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
                
                <h3 className="font-semibold mb-2">What you'll learn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.skills.map((skill, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-primary mt-0.5" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Course Modules */}
            <Card>
              <CardHeader>
                <CardTitle>Course Modules</CardTitle>
                <CardDescription>{course.modules.length} modules • {course.modules.reduce((acc, module) => acc + parseFloat(module.duration), 0)} hours total</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.modules.map((module, index) => (
                  <div key={module.id} className="flex items-start gap-4 p-4 rounded-lg border">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{module.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          {module.lessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.duration}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={course.instructor.avatar} />
                    <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{course.instructor.name}</p>
                    <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                  </div>
                </div>
                <p className="text-sm">{course.instructor.bio}</p>
              </CardContent>
            </Card>
            
            {/* Course Materials */}
            <Card>
              <CardHeader>
                <CardTitle>Course Materials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {course.materials.map((material, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {material.type === "PDF" ? (
                        <FileText className="w-5 h-5 text-red-500" />
                      ) : (
                        <File className="w-5 h-5 text-blue-500" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{material.name}</p>
                        <p className="text-xs text-muted-foreground">{material.type} • {material.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Related Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Related Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trainingCourses
                  .filter(c => c.id !== course.id)
                  .slice(0, 2)
                  .map(relatedCourse => (
                    <div key={relatedCourse.id} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <h4 className="font-medium text-sm mb-1">{relatedCourse.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{relatedCourse.provider}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{relatedCourse.rating}</span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/student/training/${relatedCourse.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}