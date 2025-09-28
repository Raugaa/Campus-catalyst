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
import { ArrowLeft, Plus, X, Save, Eye, Briefcase, MapPin, Clock, DollarSign, Building2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/contexts/AuthContext"

// Preview component for opportunity posting
function OpportunityPreview({ opportunityData, companyName }: { opportunityData: any, companyName: string }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-lg">
        <h2 className="text-2xl font-bold">{opportunityData.title || "Opportunity Title"}</h2>
        <p className="text-blue-100">Posted by {companyName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <span>{opportunityData.type || "Opportunity Type"}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span>{opportunityData.location || "Location"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>{opportunityData.duration || "Duration"}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <span>
            {opportunityData.stipend ? `₹${opportunityData.stipend}` : 
             opportunityData.salary ? `₹${opportunityData.salary}` : "₹25,000/month"}
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Opportunity Description</h3>
        <p className="text-gray-600 whitespace-pre-line">{opportunityData.description || "Opportunity description will appear here..."}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Key Responsibilities</h3>
        <p className="text-gray-600 whitespace-pre-line">{opportunityData.responsibilities || "Responsibilities will appear here..."}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {opportunityData.skills && opportunityData.skills.length > 0 ? (
            opportunityData.skills.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary">{skill}</Badge>
            ))
          ) : (
            <span className="text-gray-500">Skills will appear here...</span>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Academic Requirements</h3>
        <div className="space-y-2 text-gray-600">
          {opportunityData.academicRequirements?.min10thPercentage && (
            <p>• Minimum 10th Grade: {opportunityData.academicRequirements.min10thPercentage}%</p>
          )}
          {opportunityData.academicRequirements?.min12thPercentage && (
            <p>• Minimum 12th Grade: {opportunityData.academicRequirements.min12thPercentage}%</p>
          )}
          {opportunityData.academicRequirements?.minCGPA && (
            <p>• Minimum CGPA: {opportunityData.academicRequirements.minCGPA}</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Application Requirements</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>{opportunityData.applicationRequirements?.resume ? "Resume required" : "Resume optional"}</li>
          <li>{opportunityData.applicationRequirements?.coverLetter ? "Cover letter required" : "Cover letter optional"}</li>
          <li>{opportunityData.applicationRequirements?.portfolio ? "Portfolio required" : "Portfolio optional"}</li>
          <li>{opportunityData.applicationRequirements?.transcript ? "Transcript required" : "Transcript optional"}</li>
        </ul>
      </div>
    </div>
  )
}

export default function NewOpportunity() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const createOpportunity = useMutation(api.mutations.createOpportunity)
  
  // Fetch companies for dropdown
  const companiesData = useQuery(api.queries.getCompanies, {
    collegeId: user?.profile?.collegeId,
  })
  
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Company selection state
  const [selectedCompanyType, setSelectedCompanyType] = useState<string>("") // Will be company ID or "other"
  const [externalCompanyName, setExternalCompanyName] = useState("")
  
  // State for form data
  const [opportunityData, setOpportunityData] = useState({
    title: "",
    type: "",
    department: "",
    location: "",
    workType: "",
    duration: "",
    salary: "",
    stipend: "",
    positions: "",
    description: "",
    responsibilities: "",
    benefits: "",
    requirements: "",
    preferredQualifications: "",
    experienceLevel: "",
    deadline: "",
    startDate: "",
    academicRequirements: {
      min10thPercentage: "",
      min12thPercentage: "",
      minCGPA: "",
      educationLevel: ""
    },
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
    setOpportunityData({ ...opportunityData, [field]: value })
  }

  const handleNestedInputChange = (parent: string, field: string, value: boolean | string) => {
    setOpportunityData({ 
      ...opportunityData, 
      [parent]: { 
        ...(opportunityData as any)[parent], 
        [field]: value 
      } 
    })
  }

  const handleCompanyChange = (value: string) => {
    setSelectedCompanyType(value)
    if (value !== "other") {
      setExternalCompanyName("") // Clear external company name if selecting from dropdown
    }
  }

  // Get company name for preview
  const getCompanyNameForPreview = () => {
    return externalCompanyName || "Other/External Company";
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!opportunityData.title || !opportunityData.description || !opportunityData.location || !opportunityData.deadline) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    // Validate company selection
    if (!selectedCompanyType) {
      toast({
        title: "Company Required",
        description: "Please select a company or choose 'Other' to enter external company.",
        variant: "destructive"
      })
      return
    }

    if (selectedCompanyType === "other" && !externalCompanyName.trim()) {
      toast({
        title: "External Company Name Required",
        description: "Please enter the external company name.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        title: opportunityData.title,
        description: opportunityData.description,
        responsibilities: opportunityData.responsibilities || undefined,
        benefits: opportunityData.benefits || undefined,
        requirements: opportunityData.requirements,
        preferredQualifications: opportunityData.preferredQualifications || undefined,
        collegeId: user?.profile?.collegeId, // Set collegeId from user context
        type: opportunityData.type,
        department: opportunityData.department || undefined,
        location: opportunityData.location,
        workType: opportunityData.workType || undefined,
        duration: opportunityData.duration || undefined,
        positions: opportunityData.positions ? parseInt(opportunityData.positions) : undefined,
        
        salary: opportunityData.salary ? parseFloat(opportunityData.salary) : undefined,
        stipend: opportunityData.stipend ? parseFloat(opportunityData.stipend) : undefined,
        
        academicRequirements: {
          min10thPercentage: opportunityData.academicRequirements.min10thPercentage ? 
            parseFloat(opportunityData.academicRequirements.min10thPercentage) : undefined,
          min12thPercentage: opportunityData.academicRequirements.min12thPercentage ? 
            parseFloat(opportunityData.academicRequirements.min12thPercentage) : undefined,
          minCGPA: opportunityData.academicRequirements.minCGPA ? 
            parseFloat(opportunityData.academicRequirements.minCGPA) : undefined,
          educationLevel: opportunityData.academicRequirements.educationLevel || undefined,
        },
        
        experienceLevel: opportunityData.experienceLevel || undefined,
        skills: skills,
        
        applicationRequirements: opportunityData.applicationRequirements,
        
        deadline: new Date(opportunityData.deadline).getTime(),
        startDate: opportunityData.startDate ? new Date(opportunityData.startDate).getTime() : undefined,
        
        isPublic: opportunityData.visibility.public,
        isFeatured: opportunityData.visibility.featured,
        emailNotifications: opportunityData.visibility.notifications,
        specialInstructions: opportunityData.specialInstructions || undefined,
        
        // Company context
        companyId: selectedCompanyType !== "other" ? selectedCompanyType as any : undefined,
        externalCompanyName: selectedCompanyType === "other" ? externalCompanyName.trim() : undefined,
        createdByType: "admin",
        
        status: isDraft ? "DRAFT" : "ACTIVE"
      }

      await createOpportunity(payload as any)
      
      toast({
        title: isDraft ? "Draft Saved" : "Opportunity Published",
        description: isDraft ? "Your opportunity has been saved as draft." : "Your opportunity has been published successfully."
      })
      
      router.push("/admin/opportunities")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create opportunity.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/opportunities">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Opportunities
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create New Opportunity</h1>
            <p className="text-muted-foreground">Post a new internship or job opportunity</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleSubmit(true)} 
              disabled={isSubmitting}
            >
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
                  <DialogTitle>Opportunity Posting Preview</DialogTitle>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                  <OpportunityPreview 
                    opportunityData={{...opportunityData, skills}} 
                    companyName={getCompanyNameForPreview()}
                  />
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              onClick={() => handleSubmit(false)} 
              disabled={isSubmitting}
            >
              Publish Opportunity
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Opportunity Details</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-6">
            {/* Company Selection Card */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Select the company for this opportunity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <div className="space-y-2">
                    <Input
                      id="externalCompany"
                      placeholder="e.g., Microsoft, Google, Amazon"
                      value={externalCompanyName}
                      onChange={(e) => setExternalCompanyName(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter the name of the external company not registered on the portal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details about the position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Opportunity Title *</Label>
                  <Input 
                    id="jobTitle" 
                    placeholder="e.g., Software Engineering Intern" 
                    value={opportunityData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="jobType">Opportunity Type *</Label>
                    <Select value={opportunityData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select opportunity type" />
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
                    <Select value={opportunityData.department} onValueChange={(value) => handleInputChange('department', value)}>
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
                      placeholder="e.g., Mumbai, Maharashtra or Remote" 
                      value={opportunityData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workType">Work Type</Label>
                    <Select value={opportunityData.workType} onValueChange={(value) => handleInputChange('workType', value)}>
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
                      value={opportunityData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stipend">Stipend (₹)</Label>
                    <Input 
                      id="stipend" 
                      type="number"
                      placeholder="25000" 
                      value={opportunityData.stipend}
                      onChange={(e) => handleInputChange('stipend', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary (₹)</Label>
                    <Input 
                      id="salary" 
                      type="number"
                      placeholder="50000" 
                      value={opportunityData.salary}
                      onChange={(e) => handleInputChange('salary', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="positions">Number of Positions</Label>
                  <Input 
                    id="positions" 
                    type="number" 
                    placeholder="1" 
                    value={opportunityData.positions}
                    onChange={(e) => handleInputChange('positions', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Opportunity Details */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Opportunity Description</CardTitle>
                <CardDescription>Provide detailed information about the role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Opportunity Description *</Label>
                  <Textarea
                    id="description"
                    rows={6}
                    placeholder="Describe the role, what the intern will be working on, and what they can expect to learn..."
                    value={opportunityData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Key Responsibilities</Label>
                  <Textarea
                    id="responsibilities"
                    rows={4}
                    placeholder="List the main responsibilities and tasks the intern will handle..."
                    value={opportunityData.responsibilities}
                    onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefits & Perks</Label>
                  <Textarea
                    id="benefits"
                    rows={3}
                    placeholder="Mention any benefits, perks, learning opportunities, or unique aspects of the role..."
                    value={opportunityData.benefits}
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
                    placeholder="List the required qualifications, experience, etc..."
                    value={opportunityData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred">Preferred Qualifications</Label>
                  <Textarea
                    id="preferred"
                    rows={3}
                    placeholder="List any preferred but not required qualifications..."
                    value={opportunityData.preferredQualifications}
                    onChange={(e) => handleInputChange('preferredQualifications', e.target.value)}
                  />
                </div>

                {/* Academic Requirements */}
                <div className="space-y-4">
                  <h4 className="font-medium">Academic Requirements</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="min10th">Minimum 10th Grade (%)</Label>
                      <Input 
                        id="min10th" 
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="75"
                        value={opportunityData.academicRequirements.min10thPercentage}
                        onChange={(e) => handleNestedInputChange('academicRequirements', 'min10thPercentage', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min12th">Minimum 12th Grade (%)</Label>
                      <Input 
                        id="min12th" 
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="75"
                        value={opportunityData.academicRequirements.min12thPercentage}
                        onChange={(e) => handleNestedInputChange('academicRequirements', 'min12thPercentage', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minCGPA">Minimum CGPA</Label>
                      <Input 
                        id="minCGPA" 
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        placeholder="7.5"
                        value={opportunityData.academicRequirements.minCGPA}
                        onChange={(e) => handleNestedInputChange('academicRequirements', 'minCGPA', e.target.value)}
                      />
                    </div>
                  </div>
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
                    <Select value={opportunityData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
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
                    <Select value={opportunityData.academicRequirements.educationLevel} onValueChange={(value) => handleNestedInputChange('academicRequirements', 'educationLevel', value)}>
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
                      value={opportunityData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Expected Start Date</Label>
                    <Input 
                      id="startDate" 
                      type="date" 
                      value={opportunityData.startDate}
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
                        checked={opportunityData.applicationRequirements.resume}
                        onCheckedChange={(checked) => handleNestedInputChange('applicationRequirements', 'resume', checked as boolean)}
                      />
                      <Label htmlFor="resume">Resume required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="coverLetter" 
                        checked={opportunityData.applicationRequirements.coverLetter}
                        onCheckedChange={(checked) => handleNestedInputChange('applicationRequirements', 'coverLetter', checked as boolean)}
                      />
                      <Label htmlFor="coverLetter">Cover letter required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="portfolio" 
                        checked={opportunityData.applicationRequirements.portfolio}
                        onCheckedChange={(checked) => handleNestedInputChange('applicationRequirements', 'portfolio', checked as boolean)}
                      />
                      <Label htmlFor="portfolio">Portfolio/work samples required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="transcript" 
                        checked={opportunityData.applicationRequirements.transcript}
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
                        checked={opportunityData.visibility.public}
                        onCheckedChange={(checked) => handleNestedInputChange('visibility', 'public', checked as boolean)}
                      />
                      <Label htmlFor="public">Make opportunity post public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="featured" 
                        checked={opportunityData.visibility.featured}
                        onCheckedChange={(checked) => handleNestedInputChange('visibility', 'featured', checked as boolean)}
                      />
                      <Label htmlFor="featured">Feature this opportunity post</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="notifications" 
                        checked={opportunityData.visibility.notifications}
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
                    value={opportunityData.specialInstructions}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleSubmit(true)} 
                disabled={isSubmitting}
              >
                Save as Draft
              </Button>
              <Button 
                onClick={() => handleSubmit(false)} 
                disabled={isSubmitting}
              >
                Publish Opportunity
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}