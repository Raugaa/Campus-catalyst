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
      icon: Code,
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
      icon: Database,
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
      icon: Palette,
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
      icon: Shield,
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
      icon: Network,
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
      icon: Laptop,
    },
  ]

  const domains = [
    { name: "All Domains", icon: BookOpen, count: 24 },
    { name: "Frontend Development", icon: Code, count: 5 },
    { name: "Backend Development", icon: Database, count: 4 },
    { name: "Data Science", icon: TrendingUp, count: 3 },
    { name: "Design", icon: Palette, count: 4 },
    { name: "Cybersecurity", icon: Shield, count: 3 },
    { name: "Cloud Computing", icon: Network, count: 5 },
  ]

  // Load enrolled courses from localStorage on component mount
  useEffect(() => {
    const savedEnrolledCourses = localStorage.getItem('enrolledCourses')
    if (savedEnrolledCourses) {
      setEnrolledCourses(JSON.parse(savedEnrolledCourses))
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
            const IconComponent = domain.icon
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
              const IconComponent = course.icon
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
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/student/training/${course.id}`}>Continue</Link>
                    </Button>
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
      </div>
    </DashboardLayout>
  )
}