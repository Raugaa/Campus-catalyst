'use client'

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Upload, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  Award, 
  FileText,
  Save,
  Download,
  FileIcon,
  Eye,
  CheckCircle2,
  Loader2,
  Info
} from "lucide-react"
import { useState } from "react"
import { Education, Experience, Skill, Project, Certification } from "@/types/profile"
import PDFViewer from "@/components/resume/pdf-viewer"
import { parseResume } from "@/lib/resume-parser"

export default function StudentProfile() {
  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "Aarav",
    lastName: "Sharma",
    email: "aarav.sharma@college.edu",
    phone: "+91 98765 43210",
    address: "Mumbai, Maharashtra",
    linkedin: "linkedin.com/in/aaravsharma",
    github: "github.com/aaravsharma",
    portfolio: "aaravsharma.dev",
    about: "Passionate computer science student with expertise in full-stack development and machine learning. Seeking opportunities to apply my skills in real-world projects."
  })

  // Education State
  const [education, setEducation] = useState<Education[]>([
    {
      id: "1",
      degree: "B.Tech Computer Science",
      institution: "Indian Institute of Technology Bombay",
      startDate: "2022-08",
      endDate: "2026-05",
      grade: "8.7 CGPA",
      description: "Specialized in Artificial Intelligence and Machine Learning"
    }
  ])

  // Experience State
  const [experience, setExperience] = useState<Experience[]>([
    {
      id: "1",
      title: "Software Development Intern",
      company: "TCS",
      startDate: "2024-06",
      endDate: "2024-08",
      description: "Developed a customer portal using React and Node.js. Improved application performance by 30% through code optimization.",
      location: "Mumbai, India"
    }
  ])

  // Skills State
  const [skills, setSkills] = useState<Skill[]>([
    { id: "1", name: "JavaScript", level: "Advanced" },
    { id: "2", name: "React", level: "Advanced" },
    { id: "3", name: "Node.js", level: "Intermediate" },
    { id: "4", name: "Python", level: "Advanced" },
    { id: "5", name: "Machine Learning", level: "Intermediate" }
  ])

  // Projects State
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce platform with payment integration and inventory management.",
      technologies: "React, Node.js, MongoDB, Stripe",
      link: "github.com/aaravsharma/ecommerce",
      startDate: "2024-01",
      endDate: "2024-04"
    }
  ])

  // Certifications State
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: "1",
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2024-03",
      link: "credentials.aws/12345"
    }
  ])

  // Resume state
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [parsingSuccess, setParsingSuccess] = useState(false)

  // Handle personal info changes
  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }))
  }

  // Handle education changes
  const handleEducationChange = (id: string, field: string, value: string) => {
    setEducation(prev => prev.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ))
  }

  // Add new education
  const addEducation = () => {
    setEducation(prev => [...prev, {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      grade: "",
      description: ""
    }])
  }

  // Remove education
  const removeEducation = (id: string) => {
    setEducation(prev => prev.filter(edu => edu.id !== id))
  }

  // Handle experience changes
  const handleExperienceChange = (id: string, field: string, value: string) => {
    setExperience(prev => prev.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
  }

  // Add new experience
  const addExperience = () => {
    setExperience(prev => [...prev, {
      id: Date.now().toString(),
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      location: ""
    }])
  }

  // Remove experience
  const removeExperience = (id: string) => {
    setExperience(prev => prev.filter(exp => exp.id !== id))
  }

  // Handle skill changes
  const handleSkillChange = (id: string, field: string, value: string) => {
    setSkills(prev => prev.map(skill => 
      skill.id === id ? { ...skill, [field]: value as any } : skill
    ))
  }

  // Add new skill
  const addSkill = () => {
    setSkills(prev => [...prev, {
      id: Date.now().toString(),
      name: "",
      level: "Beginner"
    }])
  }

  // Remove skill
  const removeSkill = (id: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== id))
  }

  // Handle project changes
  const handleProjectChange = (id: string, field: string, value: string) => {
    setProjects(prev => prev.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ))
  }

  // Add new project
  const addProject = () => {
    setProjects(prev => [...prev, {
      id: Date.now().toString(),
      title: "",
      description: "",
      technologies: "",
      link: "",
      startDate: "",
      endDate: ""
    }])
  }

  // Remove project
  const removeProject = (id: string) => {
    setProjects(prev => prev.filter(proj => proj.id !== id))
  }

  // Handle certification changes
  const handleCertificationChange = (id: string, field: string, value: string) => {
    setCertifications(prev => prev.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ))
  }

  // Add new certification
  const addCertification = () => {
    setCertifications(prev => [...prev, {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
      link: ""
    }])
  }

  // Remove certification
  const removeCertification = (id: string) => {
    setCertifications(prev => prev.filter(cert => cert.id !== id))
  }

  // Handle resume file change
  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setResumeFile(file)
      setResumeUploaded(true)
      setParsingSuccess(false)
      
      // Parse resume and auto-fill form
      if (file.type === "application/pdf") {
        setIsParsing(true)
        try {
          const parsedData = await parseResume(file)
          
          // Update all form fields with parsed data
          setPersonalInfo(parsedData.personalInfo)
          setEducation(parsedData.education)
          setExperience(parsedData.experience)
          setSkills(parsedData.skills)
          setProjects(parsedData.projects)
          setCertifications(parsedData.certifications)
          
          // Set success state
          setParsingSuccess(true)
          
          // Show success notification
          setTimeout(() => {
            alert("Profile successfully auto-filled with information from your resume!");
          }, 100);
        } catch (error) {
          console.error("Error parsing resume:", error)
          alert("Failed to parse resume. Please try again.")
        } finally {
          setIsParsing(false)
        }
      }
    }
  }

  // Save profile
  const saveProfile = () => {
    // In a real app, this would send data to the backend
    console.log("Profile saved:", {
      personalInfo,
      education,
      experience,
      skills,
      projects,
      certifications
    })
    alert("Profile saved successfully!")
  }

  // Upload resume
  const uploadResume = () => {
    if (resumeFile) {
      // In a real app, this would upload the file to the backend
      console.log("Resume uploaded:", resumeFile)
      alert("Resume uploaded successfully!")
    } else {
      alert("Please select a resume file first!")
    }
  }

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and professional details</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={uploadResume} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Resume
            </Button>
            <Button onClick={saveProfile} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Profile
            </Button>
          </div>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your basic information and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder-40x40.png" />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  Change Photo
                </Button>
                <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={personalInfo.firstName} 
                  onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={personalInfo.lastName} 
                  onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={personalInfo.email} 
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={personalInfo.phone} 
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  value={personalInfo.address} 
                  onChange={(e) => handlePersonalInfoChange('address', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input 
                  id="linkedin" 
                  value={personalInfo.linkedin} 
                  onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input 
                  id="github" 
                  value={personalInfo.github} 
                  onChange={(e) => handlePersonalInfoChange('github', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio</Label>
                <Input 
                  id="portfolio" 
                  value={personalInfo.portfolio} 
                  onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About Me</Label>
              <Textarea 
                id="about" 
                rows={4} 
                value={personalInfo.about} 
                onChange={(e) => handlePersonalInfoChange('about', e.target.value)} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education
            </CardTitle>
            <CardDescription>Add your educational qualifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {education.map((edu, index) => (
              <div key={edu.id} className="space-y-4 p-4 border rounded-lg relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => removeEducation(edu.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                    <Input 
                      id={`degree-${edu.id}`} 
                      value={edu.degree} 
                      onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                    <Input 
                      id={`institution-${edu.id}`} 
                      value={edu.institution} 
                      onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${edu.id}`}>Start Date</Label>
                    <Input 
                      id={`startDate-${edu.id}`} 
                      type="month" 
                      value={edu.startDate} 
                      onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${edu.id}`}>End Date</Label>
                    <Input 
                      id={`endDate-${edu.id}`} 
                      type="month" 
                      value={edu.endDate} 
                      onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`grade-${edu.id}`}>Grade/CGPA</Label>
                    <Input 
                      id={`grade-${edu.id}`} 
                      value={edu.grade} 
                      onChange={(e) => handleEducationChange(edu.id, 'grade', e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`description-${edu.id}`}>Description</Label>
                  <Textarea 
                    id={`description-${edu.id}`} 
                    rows={2} 
                    value={edu.description} 
                    onChange={(e) => handleEducationChange(edu.id, 'description', e.target.value)} 
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addEducation} className="w-full flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Education
            </Button>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work Experience
            </CardTitle>
            <CardDescription>Add your professional experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {experience.map((exp, index) => (
              <div key={exp.id} className="space-y-4 p-4 border rounded-lg relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => removeExperience(exp.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${exp.id}`}>Job Title</Label>
                    <Input 
                      id={`title-${exp.id}`} 
                      value={exp.title} 
                      onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`company-${exp.id}`}>Company</Label>
                    <Input 
                      id={`company-${exp.id}`} 
                      value={exp.company} 
                      onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`location-${exp.id}`}>Location</Label>
                    <Input 
                      id={`location-${exp.id}`} 
                      value={exp.location} 
                      onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`expStartDate-${exp.id}`}>Start Date</Label>
                    <Input 
                      id={`expStartDate-${exp.id}`} 
                      type="month" 
                      value={exp.startDate} 
                      onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`expEndDate-${exp.id}`}>End Date</Label>
                    <Input 
                      id={`expEndDate-${exp.id}`} 
                      type="month" 
                      value={exp.endDate} 
                      onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`expDescription-${exp.id}`}>Description</Label>
                  <Textarea 
                    id={`expDescription-${exp.id}`} 
                    rows={3} 
                    value={exp.description} 
                    onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)} 
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addExperience} className="w-full flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Experience
            </Button>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Skills
            </CardTitle>
            <CardDescription>Add your technical and soft skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {skills.map((skill, index) => (
              <div key={skill.id} className="flex gap-4 items-end">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`skillName-${skill.id}`}>Skill</Label>
                    <Input 
                      id={`skillName-${skill.id}`} 
                      value={skill.name} 
                      onChange={(e) => handleSkillChange(skill.id, 'name', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`skillLevel-${skill.id}`}>Proficiency Level</Label>
                    <Select 
                      value={skill.level} 
                      onValueChange={(value) => handleSkillChange(skill.id, 'level', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeSkill(skill.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addSkill} className="w-full flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Skill
            </Button>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Projects
            </CardTitle>
            <CardDescription>Showcase your projects and achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {projects.map((proj, index) => (
              <div key={proj.id} className="space-y-4 p-4 border rounded-lg relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => removeProject(proj.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`projectTitle-${proj.id}`}>Project Title</Label>
                    <Input 
                      id={`projectTitle-${proj.id}`} 
                      value={proj.title} 
                      onChange={(e) => handleProjectChange(proj.id, 'title', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`technologies-${proj.id}`}>Technologies Used</Label>
                    <Input 
                      id={`technologies-${proj.id}`} 
                      value={proj.technologies} 
                      onChange={(e) => handleProjectChange(proj.id, 'technologies', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`projectStartDate-${proj.id}`}>Start Date</Label>
                    <Input 
                      id={`projectStartDate-${proj.id}`} 
                      type="month" 
                      value={proj.startDate} 
                      onChange={(e) => handleProjectChange(proj.id, 'startDate', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`projectEndDate-${proj.id}`}>End Date</Label>
                    <Input 
                      id={`projectEndDate-${proj.id}`} 
                      type="month" 
                      value={proj.endDate} 
                      onChange={(e) => handleProjectChange(proj.id, 'endDate', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`projectLink-${proj.id}`}>Project Link</Label>
                    <Input 
                      id={`projectLink-${proj.id}`} 
                      value={proj.link} 
                      onChange={(e) => handleProjectChange(proj.id, 'link', e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`projectDescription-${proj.id}`}>Description</Label>
                  <Textarea 
                    id={`projectDescription-${proj.id}`} 
                    rows={3} 
                    value={proj.description} 
                    onChange={(e) => handleProjectChange(proj.id, 'description', e.target.value)} 
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addProject} className="w-full flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
            </CardTitle>
            <CardDescription>Add your professional certifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {certifications.map((cert, index) => (
              <div key={cert.id} className="space-y-4 p-4 border rounded-lg relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => removeCertification(cert.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`certName-${cert.id}`}>Certification Name</Label>
                    <Input 
                      id={`certName-${cert.id}`} 
                      value={cert.name} 
                      onChange={(e) => handleCertificationChange(cert.id, 'name', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`issuer-${cert.id}`}>Issuing Organization</Label>
                    <Input 
                      id={`issuer-${cert.id}`} 
                      value={cert.issuer} 
                      onChange={(e) => handleCertificationChange(cert.id, 'issuer', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`certDate-${cert.id}`}>Issue Date</Label>
                    <Input 
                      id={`certDate-${cert.id}`} 
                      type="month" 
                      value={cert.date} 
                      onChange={(e) => handleCertificationChange(cert.id, 'date', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`certLink-${cert.id}`}>Credential Link</Label>
                    <Input 
                      id={`certLink-${cert.id}`} 
                      value={cert.link} 
                      onChange={(e) => handleCertificationChange(cert.id, 'link', e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addCertification} className="w-full flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Certification
            </Button>
          </CardContent>
        </Card>

        {/* Resume Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resume
            </CardTitle>
            <CardDescription>Upload your resume for employers to view</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!resumeUploaded ? (
              <div className="relative">
                <Input 
                  id="resume-upload"
                  type="file" 
                  accept=".pdf"
                  onChange={handleResumeChange}
                  className="hidden"
                />
                <Label 
                  htmlFor="resume-upload" 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center hover:border-primary/50 transition-all duration-300 bg-muted/20 hover:bg-muted/30 cursor-pointer block"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Drag and drop your PDF resume here, or click to browse files. 
                    Recommended format: PDF, maximum size: 5MB.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="default" className="px-6">
                      Browse Files
                    </Button>
                    <Button variant="outline" className="px-6">
                      Drag & Drop
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    By uploading, you agree to our terms of service
                  </p>
                </Label>
              </div>
            ) : isParsing ? (
              <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Parsing Your Resume</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  We're extracting your information from the resume. This may take a few seconds...
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{resumeFile?.name || "resume.pdf"}</h3>
                        <p className="text-sm text-muted-foreground">
                          {(resumeFile?.size || 0) > 0 ? `${Math.round((resumeFile?.size || 0) / 1024)} KB` : "PDF Document"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (resumeFile) {
                            const fileURL = URL.createObjectURL(resumeFile);
                            window.open(fileURL, '_blank');
                          }
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          if (resumeFile) {
                            const link = document.createElement('a');
                            const fileURL = URL.createObjectURL(resumeFile);
                            link.href = fileURL;
                            link.download = resumeFile.name || "resume.pdf";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(fileURL);
                          }
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-primary/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-green-700">Successfully Uploaded</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Ready for employers
                    </Badge>
                  </div>
                </div>
                {parsingSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-green-900">Profile Auto-Filled Successfully</h4>
                        <p className="text-sm text-green-800 mt-1">
                          Your profile has been automatically filled with information extracted from your resume. 
                          Please review and update any details as needed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-center">
                  <div className="relative">
                    <Input 
                      id="resume-upload-change"
                      type="file" 
                      accept=".pdf"
                      onChange={handleResumeChange}
                      className="hidden"
                    />
                    <Label htmlFor="resume-upload-change">
                      <Button asChild variant="outline" className="cursor-pointer">
                        <span>Replace Resume</span>
                      </Button>
                    </Label>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}