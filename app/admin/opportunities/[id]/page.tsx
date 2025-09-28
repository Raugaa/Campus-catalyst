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
import { ArrowLeft, Save, Eye, Trash2, Plus, X, Loader2, Building2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/contexts/AuthContext"

export default function EditOpportunityPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  
  // Convex hooks - Add validation for params.id
  const opportunity = useQuery(api.queries.getOpportunityById, 
    params?.id && params.id !== "undefined" ? { opportunityId: params.id as any } : "skip"
  )
  const updateOpportunity = useMutation(api.mutations.updateOpportunity)
  const updateOpportunityStatus = useMutation(api.mutations.updateOpportunityStatus)
  
  // Fetch companies for dropdown
  const companiesData = useQuery(api.queries.getCompanies, {
    collegeId: user?.profile?.collegeId,
  })
  
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  
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

  useEffect(() => {
    if (opportunity === undefined) {
      setLoading(true)
      return
    }
    
    if (opportunity === null) {
      toast({
        title: "Not Found",
        description: "Opportunity not found.",
        variant: "destructive"
      })
      router.push("/admin/opportunities")
      return
    }

    // Populate form data from Convex
    setOpportunityData({
      title: opportunity.title || "",
      type: opportunity.type || "",
      department: opportunity.department || "",
      location: opportunity.location || "",
      workType: opportunity.workType || "",
      duration: opportunity.duration || "",
      salary: opportunity.salary?.toString() || "",
      stipend: opportunity.stipend?.toString() || "",
      positions: opportunity.positions?.toString() || "",
      description: opportunity.description || "",
      responsibilities: opportunity.responsibilities || "",
      benefits: opportunity.benefits || "",
      requirements: opportunity.requirements || "",
      preferredQualifications: opportunity.preferredQualifications || "",
      experienceLevel: opportunity.experienceLevel || "",
      deadline: opportunity.deadline ? new Date(opportunity.deadline).toISOString().split('T')[0] : "",
      startDate: opportunity.startDate ? new Date(opportunity.startDate).toISOString().split('T')[0] : "",
      academicRequirements: {
        min10thPercentage: opportunity.academicRequirements?.min10thPercentage?.toString() || "",
        min12thPercentage: opportunity.academicRequirements?.min12thPercentage?.toString() || "",
        minCGPA: opportunity.academicRequirements?.minCGPA?.toString() || "",
        educationLevel: opportunity.academicRequirements?.educationLevel || ""
      },
      applicationRequirements: {
        resume: opportunity.applicationRequirements?.resume ?? true,
        coverLetter: opportunity.applicationRequirements?.coverLetter ?? false,
        portfolio: opportunity.applicationRequirements?.portfolio ?? false,
        transcript: opportunity.applicationRequirements?.transcript ?? false
      },
      visibility: {
        public: opportunity.isPublic ?? true,
        featured: opportunity.isFeatured ?? false,
        notifications: opportunity.emailNotifications ?? true
      },
      specialInstructions: opportunity.specialInstructions || ""
    })
    
    setSkills(opportunity.skills || [])
    
    // Set company selection
    if (opportunity.companyId) {
      setSelectedCompanyType(opportunity.companyId)
      setExternalCompanyName("")
    } else if (opportunity.externalCompanyName) {
      setSelectedCompanyType("other")
      setExternalCompanyName(opportunity.externalCompanyName)
    }
    
    setLoading(false)
  }, [opportunity?._id])

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

  const handleSave = async () => {

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
        opportunityId: params.id as any,
        title: opportunityData.title,
        description: opportunityData.description,
        responsibilities: opportunityData.responsibilities || undefined,
        benefits: opportunityData.benefits || undefined,
        requirements: opportunityData.requirements,
        preferredQualifications: opportunityData.preferredQualifications || undefined,
        
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
      }

      await updateOpportunity(payload as any)
      
      toast({
        title: "Success",
        description: "Opportunity updated successfully."
      })
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update opportunity.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    try {
      await updateOpportunityStatus({
        opportunityId: params.id as any,
        status: "CANCELLED"
      })
      
      toast({
        title: "Success",
        description: "Opportunity deleted successfully."
      })
      
      router.push("/admin/opportunities")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete opportunity.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  // Get company name for preview
  const getCompanyNameForPreview = () => {
    if (selectedCompanyType === "other") {
      return externalCompanyName || "External Company"
    }
    const selectedCompany = companiesData?.companies?.find((c: any) => c._id === selectedCompanyType)
    return selectedCompany?.name || "Company Name"
  }

  const getSelectedCompanyDisplayName = () => {
    return externalCompanyName || "Other/External Company";
  };

  // Preview component for opportunity posting
  function OpportunityPreview({ opportunityData }: { opportunityData: any }) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold">{opportunityData.title || "Opportunity Title"}</h2>
          <p className="text-blue-100">Posted by {getCompanyNameForPreview()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Type:</span>
            <span>{opportunityData.type || "Internship"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Location:</span>
            <span>{opportunityData.location || "Location"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Duration:</span>
            <span>{opportunityData.duration || "Duration"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Salary/Stipend:</span>
            <span>
              {opportunityData.stipend ? `₹${opportunityData.stipend}/month` : 
               opportunityData.salary ? `₹${opportunityData.salary}/month` : "₹0/month"}
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Description</h3>
          <p className="text-gray-600 whitespace-pre-line">{opportunityData.description || "Description will appear here..."}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Key Responsibilities</h3>
          <p className="text-gray-600 whitespace-pre-line">{opportunityData.responsibilities || "Responsibilities will appear here..."}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills && skills.length > 0 ? (
              skills.map((skill: string, index: number) => (
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

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
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
            <h1 className="text-3xl font-bold">Edit Opportunity</h1>
            <p className="text-muted-foreground">Update internship or job opportunity details</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
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
                  <DialogTitle>Opportunity Preview</DialogTitle>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                  <OpportunityPreview opportunityData={opportunityData} />
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-6">

            {/* Rest of Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Update the basic details about the position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Opportunity Title *</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Software Engineering Intern" 
                    value={opportunityData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Opportunity Type *</Label>
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

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Opportunity Description</CardTitle>
                <CardDescription>Provide detailed information about the role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
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

          {/* Requirements Tab */}
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

          {/* Settings Tab */}
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
                      <Label htmlFor="public">Make opportunity public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="featured" 
                        checked={opportunityData.visibility.featured}
                        onCheckedChange={(checked) => handleNestedInputChange('visibility', 'featured', checked as boolean)}
                      />
                      <Label htmlFor="featured">Feature this opportunity</Label>
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
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Opportunity
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Opportunity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Are you sure you want to delete this opportunity? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}