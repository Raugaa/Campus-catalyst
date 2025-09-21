"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Briefcase,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock student data - in a real app this would come from an API
const mockStudentData = {
  id: 1,
  name: "Rahul Sharma",
  email: "rahul.sharma@university.edu",
  phone: "+91 98765 43210",
  college: "KJ Somaiya College of Engineering",
  department: "Computer Science",
  year: "TY",
  position: "Software Engineering Intern",
  match: 95,
  skills: ["React", "Node.js", "JavaScript", "Python", "SQL"],
  experience: [
    {
      id: 1,
      title: "Web Developer Intern",
      company: "TCS",
      duration: "Jun 2023 - Aug 2023",
      description: "Developed responsive web applications using React and Node.js"
    },
    {
      id: 2,
      title: "Software Engineer Intern",
      company: "Infosys",
      duration: "Jan 2023 - Mar 2023",
      description: "Worked on backend services using Java and Spring Boot"
    }
  ],
  education: [
    {
      id: 1,
      degree: "Bachelor of Technology",
      field: "Computer Science",
      institution: "KJ Somaiya College of Engineering",
      duration: "2021 - 2025",
      gpa: "8.5/10"
    }
  ],
  projects: [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution with payment integration",
      technologies: ["React", "Node.js", "MongoDB", "Express"]
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Collaborative task management application with real-time updates",
      technologies: ["React Native", "Firebase", "Redux"]
    }
  ]
}

export default function StudentProfile({ params }: { params: { id: string } }) {
  const router = useRouter()
  
  // In a real app, you would fetch the student data based on the ID
  // const student = fetchStudentData(params.id)
  const student = mockStudentData

  return (
    <DashboardLayout userRole="company">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={`/placeholder.svg?height=80&width=80&text=${student.name.charAt(0)}`} />
                    <AvatarFallback className="text-2xl">{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-2xl font-bold">{student.name}</h1>
                        <p className="text-muted-foreground">{student.position}</p>
                      </div>
                      <Badge variant="secondary" className="text-lg">
                        {student.match}% Match
                      </Badge>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{student.college}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{student.department} ({student.year})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{student.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {student.experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{exp.title}</h3>
                      <span className="text-sm text-muted-foreground">{exp.duration}</span>
                    </div>
                    <p className="text-sm font-medium text-primary">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">{exp.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {student.projects.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {student.education.map((edu) => (
                  <div key={edu.id} className="space-y-1">
                    <h3 className="font-medium">{edu.degree}</h3>
                    <p className="text-sm font-medium text-primary">{edu.field}</p>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{edu.duration}</span>
                      <span className="text-sm font-medium">{edu.gpa}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  <Award className="w-4 h-4 mr-2" />
                  Send Offer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}