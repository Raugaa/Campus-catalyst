"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  Link as LinkIcon,
  File,
  Video,
} from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"

export default function AdminTraining() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)

  // Form state for adding/editing courses
  const [courseForm, setCourseForm] = useState({
    title: "",
    provider: "",
    domain: "Frontend Development",
    duration: "",
    level: "Beginner",
    description: "",
    skills: "",
    icon: "BookOpen",
    videos: [{ title: "", url: "" }],
    resources: [{ title: "", url: "" }],
    prerequisites: "",
    learningOutcomes: "",
  })

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
      videos: [
        { title: "Introduction to Advanced React", url: "https://example.com/video1" },
        { title: "Understanding Hooks", url: "https://example.com/video2" }
      ],
      resources: [
        { title: "React Documentation", url: "https://reactjs.org/docs/getting-started.html" },
        { title: "Advanced React Patterns", url: "https://example.com/resource1" }
      ],
      prerequisites: "Basic knowledge of React and JavaScript",
      learningOutcomes: "Master hooks, context API, and performance optimization techniques"
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
      videos: [
        { title: "Introduction to Data Science", url: "https://example.com/video3" },
        { title: "Python for Data Analysis", url: "https://example.com/video4" }
      ],
      resources: [
        { title: "Python Data Science Handbook", url: "https://example.com/resource2" }
      ],
      prerequisites: "Basic programming knowledge",
      learningOutcomes: "Analyze data, create visualizations, and build machine learning models"
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
      videos: [
        { title: "Introduction to UI/UX", url: "https://example.com/video5" }
      ],
      resources: [
        { title: "Design Thinking Process", url: "https://example.com/resource3" }
      ],
      prerequisites: "None",
      learningOutcomes: "Create user-centered designs and prototypes"
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
      videos: [
        { title: "Network Security Basics", url: "https://example.com/video6" }
      ],
      resources: [
        { title: "Cybersecurity Framework", url: "https://example.com/resource4" }
      ],
      prerequisites: "Basic IT knowledge",
      learningOutcomes: "Implement security measures and understand compliance requirements"
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
      videos: [
        { title: "AWS Core Services", url: "https://example.com/video7" },
        { title: "Cloud Architecture", url: "https://example.com/video8" }
      ],
      resources: [
        { title: "AWS Documentation", url: "https://aws.amazon.com/documentation/" },
        { title: "Cloud Design Patterns", url: "https://example.com/resource5" }
      ],
      prerequisites: "Networking and system administration basics",
      learningOutcomes: "Design and deploy scalable cloud solutions"
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
      videos: [
        { title: "Node.js Fundamentals", url: "https://example.com/video9" },
        { title: "Building REST APIs", url: "https://example.com/video10" }
      ],
      resources: [
        { title: "Node.js Official Guide", url: "https://nodejs.org/en/docs/guides/" },
        { title: "Express Documentation", url: "https://expressjs.com/" }
      ],
      prerequisites: "JavaScript and basic web development knowledge",
      learningOutcomes: "Develop and deploy full-stack web applications"
    },
  ]

  const domains = [
    { name: "Frontend Development", icon: "Code", count: 5 },
    { name: "Backend Development", icon: "Database", count: 4 },
    { name: "Data Science", icon: "TrendingUp", count: 3 },
    { name: "Design", icon: "Palette", count: 4 },
    { name: "Cybersecurity", icon: "Shield", count: 3 },
    { name: "Cloud Computing", icon: "Network", count: 5 },
  ]

  // Filter courses based on search, domain, and level
  const filteredCourses = useMemo(() => {
    return trainingCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    
      const matchesDomain = selectedDomain === "all" || course.domain === selectedDomain
      const matchesLevel = selectedLevel === "all" || course.level.toLowerCase() === selectedLevel
    
      return matchesSearch && matchesDomain && matchesLevel
    })
  }, [trainingCourses, searchQuery, selectedDomain, selectedLevel])

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
      case "Eye": return Eye;
      case "Edit": return Edit;
      case "Trash2": return Trash2;
      case "Upload": return Upload;
      case "Video": return Video;
      case "File": return File;
      case "LinkIcon": return LinkIcon;
      default: return BookOpen;
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCourseForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setCourseForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle video input changes
  const handleVideoChange = (index: number, field: string, value: string) => {
    const newVideos = [...courseForm.videos]
    newVideos[index] = { ...newVideos[index], [field]: value }
    setCourseForm(prev => ({ ...prev, videos: newVideos }))
  }

  // Add a new video field
  const addVideoField = () => {
    setCourseForm(prev => ({
      ...prev,
      videos: [...prev.videos, { title: "", url: "" }]
    }))
  }

  // Remove a video field
  const removeVideoField = (index: number) => {
    if (courseForm.videos.length > 1) {
      const newVideos = [...courseForm.videos]
      newVideos.splice(index, 1)
      setCourseForm(prev => ({ ...prev, videos: newVideos }))
    }
  }

  // Handle resource input changes
  const handleResourceChange = (index: number, field: string, value: string) => {
    const newResources = [...courseForm.resources]
    newResources[index] = { ...newResources[index], [field]: value }
    setCourseForm(prev => ({ ...prev, resources: newResources }))
  }

  // Add a new resource field
  const addResourceField = () => {
    setCourseForm(prev => ({
      ...prev,
      resources: [...prev.resources, { title: "", url: "" }]
    }))
  }

  // Remove a resource field
  const removeResourceField = (index: number) => {
    if (courseForm.resources.length > 1) {
      const newResources = [...courseForm.resources]
      newResources.splice(index, 1)
      setCourseForm(prev => ({ ...prev, resources: newResources }))
    }
  }

  // Handle form submission for adding a course
  const handleAddCourse = () => {
    // In a real app, this would make an API call to add the course
    console.log("Adding course:", courseForm)
    // Reset form and close dialog
    setCourseForm({
      title: "",
      provider: "",
      domain: "Frontend Development",
      duration: "",
      level: "Beginner",
      description: "",
      skills: "",
      icon: "BookOpen",
      videos: [{ title: "", url: "" }],
      resources: [{ title: "", url: "" }],
      prerequisites: "",
      learningOutcomes: "",
    })
    setIsAddDialogOpen(false)
  }

  // Handle form submission for editing a course
  const handleEditCourse = () => {
    // In a real app, this would make an API call to update the course
    console.log("Editing course:", editingCourse, courseForm)
    // Reset form and close dialog
    setCourseForm({
      title: "",
      provider: "",
      domain: "Frontend Development",
      duration: "",
      level: "Beginner",
      description: "",
      skills: "",
      icon: "BookOpen",
      videos: [{ title: "", url: "" }],
      resources: [{ title: "", url: "" }],
      prerequisites: "",
      learningOutcomes: "",
    })
    setIsEditDialogOpen(false)
    setEditingCourse(null)
  }

  // Open edit dialog with course data
  const openEditDialog = (course: any) => {
    setEditingCourse(course)
    setCourseForm({
      title: course.title,
      provider: course.provider,
      domain: course.domain,
      duration: course.duration,
      level: course.level,
      description: course.description,
      skills: course.skills.join(", "),
      icon: course.icon,
      videos: course.videos || [{ title: "", url: "" }],
      resources: course.resources || [{ title: "", url: "" }],
      prerequisites: course.prerequisites || "",
      learningOutcomes: course.learningOutcomes || "",
    })
    setIsEditDialogOpen(true)
  }

  // Delete a course
  const deleteCourse = (courseId: number) => {
    // In a real app, this would make an API call to delete the course
    console.log("Deleting course:", courseId)
    alert(`Course with ID ${courseId} would be deleted in a real application`)
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Training Management</h1>
            <p className="text-muted-foreground">Manage industry training courses for students</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin">
              <Button variant="outline" className="flex items-center gap-2">
                <span>Back to Dashboard</span>
              </Button>
            </Link>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Training Course</DialogTitle>
                  <DialogDescription>
                    Create a comprehensive training course with videos, resources, and detailed information
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Course Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={courseForm.title}
                        onChange={handleInputChange}
                        placeholder="Enter course title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provider">Provider *</Label>
                      <Input
                        id="provider"
                        name="provider"
                        value={courseForm.provider}
                        onChange={handleInputChange}
                        placeholder="Enter provider name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="domain">Domain *</Label>
                      <Select name="domain" value={courseForm.domain} onValueChange={(value) => handleSelectChange("domain", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                          <SelectItem value="Backend Development">Backend Development</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                          <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Level *</Label>
                      <Select name="level" value={courseForm.level} onValueChange={(value) => handleSelectChange("level", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration *</Label>
                      <Input
                        id="duration"
                        name="duration"
                        value={courseForm.duration}
                        onChange={handleInputChange}
                        placeholder="e.g., 8 weeks"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Course Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={courseForm.description}
                      onChange={handleInputChange}
                      placeholder="Enter detailed course description"
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma separated) *</Label>
                    <Input
                      id="skills"
                      name="skills"
                      value={courseForm.skills}
                      onChange={handleInputChange}
                      placeholder="e.g., React, JavaScript, HTML, CSS"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prerequisites">Prerequisites</Label>
                    <Textarea
                      id="prerequisites"
                      name="prerequisites"
                      value={courseForm.prerequisites}
                      onChange={handleInputChange}
                      placeholder="Enter course prerequisites"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="learningOutcomes">Learning Outcomes</Label>
                    <Textarea
                      id="learningOutcomes"
                      name="learningOutcomes"
                      value={courseForm.learningOutcomes}
                      onChange={handleInputChange}
                      placeholder="Enter expected learning outcomes"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-medium">Course Videos</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addVideoField}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Video
                      </Button>
                    </div>
                    
                    {courseForm.videos.map((video, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                        <div className="md:col-span-2">
                          <Label htmlFor={`video-title-${index}`}>Video Title</Label>
                          <Input
                            id={`video-title-${index}`}
                            value={video.title}
                            onChange={(e) => handleVideoChange(index, "title", e.target.value)}
                            placeholder="Enter video title"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor={`video-url-${index}`}>Video URL</Label>
                          <Input
                            id={`video-url-${index}`}
                            value={video.url}
                            onChange={(e) => handleVideoChange(index, "url", e.target.value)}
                            placeholder="Enter video URL"
                          />
                        </div>
                        <div>
                          {courseForm.videos.length > 1 && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeVideoField(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-medium">Course Resources</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addResourceField}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Resource
                      </Button>
                    </div>
                    
                    {courseForm.resources.map((resource, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                        <div className="md:col-span-2">
                          <Label htmlFor={`resource-title-${index}`}>Resource Title</Label>
                          <Input
                            id={`resource-title-${index}`}
                            value={resource.title}
                            onChange={(e) => handleResourceChange(index, "title", e.target.value)}
                            placeholder="Enter resource title"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor={`resource-url-${index}`}>Resource URL</Label>
                          <Input
                            id={`resource-url-${index}`}
                            value={resource.url}
                            onChange={(e) => handleResourceChange(index, "url", e.target.value)}
                            placeholder="Enter resource URL"
                          />
                        </div>
                        <div>
                          {courseForm.resources.length > 1 && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeResourceField(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="icon">Course Icon</Label>
                    <Select name="icon" value={courseForm.icon} onValueChange={(value) => handleSelectChange("icon", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BookOpen">Book</SelectItem>
                        <SelectItem value="Code">Code</SelectItem>
                        <SelectItem value="Database">Database</SelectItem>
                        <SelectItem value="TrendingUp">Trending Up</SelectItem>
                        <SelectItem value="Palette">Palette</SelectItem>
                        <SelectItem value="Shield">Shield</SelectItem>
                        <SelectItem value="Network">Network</SelectItem>
                        <SelectItem value="Laptop">Laptop</SelectItem>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="File">File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddCourse}>
                      Add Course
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {domains.map((domain, index) => {
            const IconComponent = getIconComponent(domain.icon);
            return (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
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
            <h2 className="text-xl font-semibold">Training Courses ({filteredCourses.length})</h2>
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
                    <p className="text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.skills.slice(0, 3).map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {course.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{course.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{course.domain}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(course)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteCourse(course.id)}>
                          <Trash2 className="w-4 h-4" />
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

        {/* Edit Course Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Training Course</DialogTitle>
              <DialogDescription>
                Update all details of this training course
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Course Title *</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={courseForm.title}
                    onChange={handleInputChange}
                    placeholder="Enter course title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-provider">Provider *</Label>
                  <Input
                    id="edit-provider"
                    name="provider"
                    value={courseForm.provider}
                    onChange={handleInputChange}
                    placeholder="Enter provider name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-domain">Domain *</Label>
                  <Select name="domain" value={courseForm.domain} onValueChange={(value) => handleSelectChange("domain", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                      <SelectItem value="Backend Development">Backend Development</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                      <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-level">Level *</Label>
                  <Select name="level" value={courseForm.level} onValueChange={(value) => handleSelectChange("level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration *</Label>
                  <Input
                    id="edit-duration"
                    name="duration"
                    value={courseForm.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 8 weeks"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Course Description *</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={courseForm.description}
                  onChange={handleInputChange}
                  placeholder="Enter detailed course description"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-skills">Skills (comma separated) *</Label>
                <Input
                  id="edit-skills"
                  name="skills"
                  value={courseForm.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., React, JavaScript, HTML, CSS"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-prerequisites">Prerequisites</Label>
                <Textarea
                  id="edit-prerequisites"
                  name="prerequisites"
                  value={courseForm.prerequisites}
                  onChange={handleInputChange}
                  placeholder="Enter course prerequisites"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-learningOutcomes">Learning Outcomes</Label>
                <Textarea
                  id="edit-learningOutcomes"
                  name="learningOutcomes"
                  value={courseForm.learningOutcomes}
                  onChange={handleInputChange}
                  placeholder="Enter expected learning outcomes"
                  rows={2}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">Course Videos</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addVideoField}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Video
                  </Button>
                </div>
                
                {courseForm.videos.map((video, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                    <div className="md:col-span-2">
                      <Label htmlFor={`edit-video-title-${index}`}>Video Title</Label>
                      <Input
                        id={`edit-video-title-${index}`}
                        value={video.title}
                        onChange={(e) => handleVideoChange(index, "title", e.target.value)}
                        placeholder="Enter video title"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor={`edit-video-url-${index}`}>Video URL</Label>
                      <Input
                        id={`edit-video-url-${index}`}
                        value={video.url}
                        onChange={(e) => handleVideoChange(index, "url", e.target.value)}
                        placeholder="Enter video URL"
                      />
                    </div>
                    <div>
                      {courseForm.videos.length > 1 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeVideoField(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">Course Resources</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addResourceField}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Resource
                  </Button>
                </div>
                
                {courseForm.resources.map((resource, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                    <div className="md:col-span-2">
                      <Label htmlFor={`edit-resource-title-${index}`}>Resource Title</Label>
                      <Input
                        id={`edit-resource-title-${index}`}
                        value={resource.title}
                        onChange={(e) => handleResourceChange(index, "title", e.target.value)}
                        placeholder="Enter resource title"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor={`edit-resource-url-${index}`}>Resource URL</Label>
                      <Input
                        id={`edit-resource-url-${index}`}
                        value={resource.url}
                        onChange={(e) => handleResourceChange(index, "url", e.target.value)}
                        placeholder="Enter resource URL"
                      />
                    </div>
                    <div>
                      {courseForm.resources.length > 1 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeResourceField(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Course Icon</Label>
                <Select name="icon" value={courseForm.icon} onValueChange={(value) => handleSelectChange("icon", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BookOpen">Book</SelectItem>
                    <SelectItem value="Code">Code</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                    <SelectItem value="TrendingUp">Trending Up</SelectItem>
                    <SelectItem value="Palette">Palette</SelectItem>
                    <SelectItem value="Shield">Shield</SelectItem>
                    <SelectItem value="Network">Network</SelectItem>
                    <SelectItem value="Laptop">Laptop</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="File">File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditCourse}>
                  Update Course
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}