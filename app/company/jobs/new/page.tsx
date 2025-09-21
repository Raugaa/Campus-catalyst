"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Plus, X, Save, Eye, Briefcase, MapPin, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Preview component for job posting
function JobPreview({ jobData }: { jobData: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-lg">
        <h2 className="text-2xl font-bold">{jobData.title || "Job Title"}</h2>
        <p className="text-blue-100">Posted by Your Company</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <span>{jobData.jobType || "Job Type"}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span>{jobData.location || "Location"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>{jobData.duration || "Duration"}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <span>{jobData.stipend || "₹25,000/month"}</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Job Description</h3>
        <p className="text-gray-600 whitespace-pre-line">{jobData.description || "Job description will appear here..."}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Key Responsibilities</h3>
        <p className="text-gray-600 whitespace-pre-line">{jobData.responsibilities || "Responsibilities will appear here..."}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {jobData.skills && jobData.skills.length > 0 ? (
            jobData.skills.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary">{skill}</Badge>
            ))
          ) : (
            <span className="text-gray-500">Skills will appear here...</span>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Application Requirements</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>{jobData.applicationRequirements?.resume ? "Resume required" : "Resume optional"}</li>
          <li>{jobData.applicationRequirements?.coverLetter ? "Cover letter required" : "Cover letter optional"}</li>
        </ul>
      </div>
    </div>
  )
}

export default function NewJobPost() {
  const [skills, setSkills] = useState<string[]>(["React", "Node.js", "JavaScript"])
  const [newSkill, setNewSkill] = useState("")
  // State for form data
  const [jobData, setJobData] = useState({
    title: "",
    jobType: "",
    department: "",
    location: "",
    workType: "",
    duration: "",
    stipend: "",
    positions: "",
    description: "",
    responsibilities: "",
    benefits: "",
    requirements: "",
    preferred: "",
    experienceLevel: "",
    educationLevel: "",
    deadline: "",
    startDate: "",
    applicationRequirements: {
      resume: true,
      coverLetter: false,
      portfolio: false,
      transcript: false
    },
    visibility: {
      public: true,
      featured: false,
      notifications: true
    },
    specialInstructions: ""
  })

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setJobData({ ...jobData, [field]: value })
  }

  const handleNestedInputChange = (parent: string, field: string, value: boolean) => {
    setJobData({ 
      ...jobData, 
      [parent]: { 
        ...(jobData as any)[parent], 
        [field]: value 
      } 
    })
  }

  return (
    <DashboardLayout userRole="company">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/company/jobs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create New Job Post</h1>
            <p className="text-muted-foreground">Post a new internship or job opportunity</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Job Posting Preview</DialogTitle>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                  <JobPreview jobData={{...jobData, skills}} />
                </div>
              </DialogContent>
            </Dialog>
            <Button>Publish Job</Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Job Details</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details about the position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input 
                    id="jobTitle" 
                    placeholder="e.g., Software Engineering Intern" 
                    value={jobData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="jobType">Job Type *</Label>
                    <Select value={jobData.jobType} onValueChange={(value) => handleInputChange('jobType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="fulltime">Full-time</SelectItem>
                        <SelectItem value="parttime">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={jobData.department} onValueChange={(value) => handleInputChange('department', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input 
                      id="location" 
                      placeholder="e.g., San Francisco, CA or Remote" 
                      value={jobData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workType">Work Type</Label>
                    <Select value={jobData.workType} onValueChange={(value) => handleInputChange('workType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select work type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onsite">On-site</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input 
                      id="duration" 
                      placeholder="e.g., 3 months" 
                      value={jobData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stipend">Stipend/Salary</Label>
                    <Input 
                      id="stipend" 
                      placeholder="e.g., ₹25,000/month" 
                      value={jobData.stipend}
                      onChange={(e) => handleInputChange('stipend', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="positions">Number of Positions</Label>
                    <Input 
                      id="positions" 
                      type="number" 
                      placeholder="1" 
                      value={jobData.positions}
                      onChange={(e) => handleInputChange('positions', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Details */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
                <CardDescription>Provide detailed information about the role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    rows={6}
                    placeholder="Describe the role, what the intern will be working on, and what they can expect to learn..."
                    value={jobData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Key Responsibilities</Label>
                  <Textarea
                    id="responsibilities"
                    rows={4}
                    placeholder="List the main responsibilities and tasks the intern will handle..."
                    value={jobData.responsibilities}
                    onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefits & Perks</Label>
                  <Textarea
                    id="benefits"
                    rows={3}
                    placeholder="Mention any benefits, perks, learning opportunities, or unique aspects of the role..."
                    value={jobData.benefits}
                    onChange={(e) => handleInputChange('benefits', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requirements */}
          <TabsContent value="requirements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Requirements & Skills</CardTitle>
                <CardDescription>Specify the qualifications and skills needed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="requirements">Required Qualifications *</Label>
                  <Textarea
                    id="requirements"
                    rows={4}
                    placeholder="List the required qualifications, education level, experience, etc..."
                    value={jobData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred">Preferred Qualifications</Label>
                  <Textarea
                    id="preferred"
                    rows={3}
                    placeholder="List any preferred but not required qualifications..."
                    value={jobData.preferred}
                    onChange={(e) => handleInputChange('preferred', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Required Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1">
                        {skill}
                        <X className="w-3 h-3 ml-2 cursor-pointer" onClick={() => removeSkill(skill)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button type="button" variant="outline" onClick={addSkill}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select value={jobData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education">Education Level</Label>
                    <Select value={jobData.educationLevel} onValueChange={(value) => handleInputChange('educationLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="highschool">High School</SelectItem>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>Configure how applications are handled</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline *</Label>
                    <Input 
                      id="deadline" 
                      type="date" 
                      value={jobData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Expected Start Date</Label>
                    <Input 
                      id="startDate" 
                      type="date" 
                      value={jobData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Application Requirements</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="resume" 
                        checked={jobData.applicationRequirements.resume}
                        onCheckedChange={(checked) => handleNestedInputChange('applicationRequirements', 'resume', checked as boolean)}
                      />
                      <Label htmlFor="resume">Resume required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="coverLetter" 
                        checked={jobData.applicationRequirements.coverLetter}
                        onCheckedChange={(checked) => handleNestedInputChange('applicationRequirements', 'coverLetter', checked as boolean)}
                      />
                      <Label htmlFor="coverLetter">Cover letter required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="portfolio" 
                        checked={jobData.applicationRequirements.portfolio}
                        onCheckedChange={(checked) => handleNestedInputChange('applicationRequirements', 'portfolio', checked as boolean)}
                      />
                      <Label htmlFor="portfolio">Portfolio/work samples required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="transcript" 
                        checked={jobData.applicationRequirements.transcript}
                        onCheckedChange={(checked) => handleNestedInputChange('applicationRequirements', 'transcript', checked as boolean)}
                      />
                      <Label htmlFor="transcript">Academic transcript required</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Visibility Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="public" 
                        checked={jobData.visibility.public}
                        onCheckedChange={(checked) => handleNestedInputChange('visibility', 'public', checked as boolean)}
                      />
                      <Label htmlFor="public">Make job post public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="featured" 
                        checked={jobData.visibility.featured}
                        onCheckedChange={(checked) => handleNestedInputChange('visibility', 'featured', checked as boolean)}
                      />
                      <Label htmlFor="featured">Feature this job post</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="notifications" 
                        checked={jobData.visibility.notifications}
                        onCheckedChange={(checked) => handleNestedInputChange('visibility', 'notifications', checked as boolean)}
                      />
                      <Label htmlFor="notifications">Send email notifications for new applications</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea 
                    id="instructions" 
                    rows={3} 
                    placeholder="Any special instructions for applicants..." 
                    value={jobData.specialInstructions}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline">Save as Draft</Button>
              <Button>Publish Job Post</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}