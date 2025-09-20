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
import { ArrowLeft, Plus, X, Save, Eye } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function NewOpportunity() {
  const [skills, setSkills] = useState<string[]>(["React", "Node.js", "JavaScript"])
  const [newSkill, setNewSkill] = useState("")

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
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
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button>Publish Opportunity</Button>
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
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details about the position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Opportunity Title *</Label>
                  <Input id="jobTitle" placeholder="e.g., Software Engineering Intern" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="jobType">Opportunity Type *</Label>
                    <Select>
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
                    <Select>
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
                    <Input id="location" placeholder="e.g., San Francisco, CA or Remote" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workType">Work Type</Label>
                    <Select>
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
                    <Input id="duration" placeholder="e.g., 3 months" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stipend">Stipend/Salary</Label>
                    <Input id="stipend" placeholder="e.g., $2,000/month" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="positions">Number of Positions</Label>
                    <Input id="positions" type="number" placeholder="1" />
                  </div>
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Key Responsibilities</Label>
                  <Textarea
                    id="responsibilities"
                    rows={4}
                    placeholder="List the main responsibilities and tasks the intern will handle..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefits & Perks</Label>
                  <Textarea
                    id="benefits"
                    rows={3}
                    placeholder="Mention any benefits, perks, learning opportunities, or unique aspects of the role..."
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred">Preferred Qualifications</Label>
                  <Textarea
                    id="preferred"
                    rows={3}
                    placeholder="List any preferred but not required qualifications..."
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
                    <Select>
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
                    <Select>
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
                    <Input id="deadline" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Expected Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Application Requirements</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="resume" defaultChecked />
                      <Label htmlFor="resume">Resume required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="coverLetter" />
                      <Label htmlFor="coverLetter">Cover letter required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="portfolio" />
                      <Label htmlFor="portfolio">Portfolio/work samples required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="transcript" />
                      <Label htmlFor="transcript">Academic transcript required</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Visibility Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="public" defaultChecked />
                      <Label htmlFor="public">Make opportunity post public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="featured" />
                      <Label htmlFor="featured">Feature this opportunity post</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notifications" defaultChecked />
                      <Label htmlFor="notifications">Send email notifications for new applications</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea id="instructions" rows={3} placeholder="Any special instructions for applicants..." />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline">Save as Draft</Button>
              <Button>Publish Opportunity</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}