import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, MapPin, Globe, Users, Calendar, Edit, Save, Upload } from "lucide-react"

export default function CompanyProfile() {
  return (
    <DashboardLayout userRole="company">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Company Profile</h1>
            <p className="text-muted-foreground">Manage your company information and branding</p>
          </div>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="details">Company Details</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>Essential company details visible to students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" />
                    <AvatarFallback className="text-lg">TC</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-sm text-muted-foreground">Recommended: 200x200px, PNG or JPG</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="TechCorp Inc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" defaultValue="Technology" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-size">Company Size</Label>
                    <Input id="company-size" defaultValue="500-1000 employees" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="founded">Founded</Label>
                    <Input id="founded" defaultValue="2010" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    defaultValue="TechCorp Inc. is a leading technology company specializing in innovative software solutions and digital transformation services. We help businesses leverage cutting-edge technology to achieve their goals."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location & Contact
                </CardTitle>
                <CardDescription>Company location and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="headquarters">Headquarters</Label>
                    <Input id="headquarters" defaultValue="San Francisco, CA" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="https://techcorp.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input id="email" defaultValue="careers@techcorp.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    rows={3}
                    defaultValue="123 Tech Street, Suite 400, San Francisco, CA 94105, United States"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Company Culture
                </CardTitle>
                <CardDescription>Showcase your company culture and values</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mission">Mission Statement</Label>
                  <Textarea
                    id="mission"
                    rows={3}
                    defaultValue="To empower businesses through innovative technology solutions that drive growth and transformation."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="values">Core Values</Label>
                  <Textarea
                    id="values"
                    rows={4}
                    defaultValue="Innovation, Integrity, Collaboration, Excellence, Customer Focus"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company Benefits</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Health Insurance",
                      "Flexible Hours",
                      "Remote Work",
                      "Professional Development",
                      "Stock Options",
                      "Gym Membership",
                      "Free Meals",
                      "Paid Time Off",
                    ].map((benefit) => (
                      <Badge key={benefit} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Benefits
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Brand Assets
                </CardTitle>
                <CardDescription>Upload and manage your company's visual identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label>Company Logo</Label>
                      <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Upload your company logo</p>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          Choose File
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Cover Image</Label>
                      <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Upload cover image for your profile</p>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          Choose File
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Company Gallery</Label>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground">Office photo {i}</p>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          Upload
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recruitment Preferences
                </CardTitle>
                <CardDescription>Set your hiring preferences and requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Preferred Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["JavaScript", "React", "Node.js", "Python", "Java", "SQL", "AWS", "Docker", "Git", "Agile"].map(
                        (skill) => (
                          <Badge key={skill} variant="outline" className="cursor-pointer hover:bg-accent">
                            {skill}
                          </Badge>
                        ),
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      <Edit className="w-4 h-4 mr-2" />
                      Manage Skills
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="min-gpa">Minimum GPA Requirement</Label>
                      <Input id="min-gpa" defaultValue="3.0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="graduation-year">Target Graduation Year</Label>
                      <Input id="graduation-year" defaultValue="2024-2025" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Universities</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["UC Berkeley", "Stanford", "MIT", "Carnegie Mellon", "Georgia Tech"].map((university) => (
                        <Badge key={university} variant="secondary" className="cursor-pointer">
                          {university}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Universities
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
