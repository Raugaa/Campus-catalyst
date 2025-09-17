import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, GraduationCap, BookOpen, Users, Award, Save, Upload, Edit } from "lucide-react"

export default function FacultyProfile() {
  return (
    <DashboardLayout userRole="faculty">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Faculty Profile</h1>
            <p className="text-muted-foreground">Manage your academic profile and mentoring information</p>
          </div>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="academic">Academic Details</TabsTrigger>
            <TabsTrigger value="mentoring">Mentoring</TabsTrigger>
            <TabsTrigger value="research">Research & Publications</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your basic profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-xl">DR</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-sm text-muted-foreground">Recommended: 200x200px, PNG or JPG</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" defaultValue="Dr. Rajesh" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" defaultValue="Kumar" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="rajesh.kumar@university.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee-id">Employee ID</Label>
                    <Input id="employee-id" defaultValue="FAC001234" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="office">Office Location</Label>
                    <Input id="office" defaultValue="Engineering Building, Room 301" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    defaultValue="Dr. Rajesh Kumar is a Professor of Computer Science with over 15 years of experience in software engineering and artificial intelligence. He has mentored over 200 students and published numerous research papers in top-tier conferences."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Academic Information
                </CardTitle>
                <CardDescription>Your academic qualifications and position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input id="designation" defaultValue="Professor" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" defaultValue="Computer Science & Engineering" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joining-date">Joining Date</Label>
                    <Input id="joining-date" type="date" defaultValue="2008-08-15" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Total Experience (Years)</Label>
                    <Input id="experience" type="number" defaultValue="15" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Educational Qualifications</Label>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Ph.D. in Computer Science</h4>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">Stanford University, 2008</p>
                      <p className="text-sm text-muted-foreground">Specialization: Artificial Intelligence</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">M.S. in Computer Science</h4>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">MIT, 2004</p>
                      <p className="text-sm text-muted-foreground">Specialization: Software Engineering</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">B.Tech in Computer Science</h4>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">IIT Delhi, 2002</p>
                      <p className="text-sm text-muted-foreground">First Class with Distinction</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Add Qualification
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Areas of Expertise</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Artificial Intelligence",
                      "Machine Learning",
                      "Software Engineering",
                      "Data Structures",
                      "Algorithms",
                      "Database Systems",
                      "Web Development",
                      "Mobile Computing",
                    ].map((area) => (
                      <Badge key={area} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        {area}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Areas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Mentoring Information
                </CardTitle>
                <CardDescription>Your student mentoring details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Current Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Active Mentees</span>
                        <span className="font-medium">24</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Mentored</span>
                        <span className="font-medium">156</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Successful Placements</span>
                        <span className="font-medium">142</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Success Rate</span>
                        <span className="font-medium text-green-600">91%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Mentoring Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="max-mentees">Maximum Mentees</Label>
                        <Input id="max-mentees" type="number" defaultValue="25" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferred-domains">Preferred Domains</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {["Software Development", "Data Science", "AI/ML", "Web Development"].map((domain) => (
                            <Badge key={domain} variant="outline" className="cursor-pointer">
                              {domain}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Label>Mentoring Philosophy</Label>
                  <Textarea
                    rows={4}
                    defaultValue="I believe in guiding students to discover their potential through hands-on experience and industry exposure. My approach focuses on building both technical skills and professional confidence to ensure successful career transitions."
                  />
                </div>

                <div className="space-y-4">
                  <Label>Office Hours</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="office-days">Available Days</Label>
                      <Input id="office-days" defaultValue="Monday - Friday" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="office-hours">Available Hours</Label>
                      <Input id="office-hours" defaultValue="10:00 AM - 4:00 PM" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="research" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Research & Publications
                </CardTitle>
                <CardDescription>Your research work and academic publications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-500" />
                        Publications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">45</div>
                      <p className="text-sm text-muted-foreground">Total Publications</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="w-5 h-5 text-green-500" />
                        Citations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,234</div>
                      <p className="text-sm text-muted-foreground">Total Citations</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-500" />
                        H-Index
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">18</div>
                      <p className="text-sm text-muted-foreground">Current H-Index</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Recent Publications</Label>
                    <Button variant="outline" size="sm">
                      Add Publication
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        title: "Advanced Machine Learning Techniques for Software Bug Prediction",
                        journal: "IEEE Transactions on Software Engineering",
                        year: "2024",
                        citations: 23,
                      },
                      {
                        title: "Automated Code Review Using Deep Learning Models",
                        journal: "ACM Computing Surveys",
                        year: "2023",
                        citations: 45,
                      },
                      {
                        title: "Enhancing Student Learning Through AI-Powered Educational Tools",
                        journal: "Computers & Education",
                        year: "2023",
                        citations: 31,
                      },
                    ].map((publication, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{publication.title}</h4>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{publication.journal}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Year: {publication.year}</span>
                          <span>Citations: {publication.citations}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Current Research Interests</Label>
                  <Textarea
                    rows={3}
                    defaultValue="My current research focuses on applying machine learning techniques to software engineering problems, particularly in automated code analysis, bug prediction, and educational technology."
                  />
                </div>

                <div className="space-y-4">
                  <Label>Research Projects</Label>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">AI-Powered Code Analysis Platform</h4>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Developing an intelligent platform for automated code review and quality assessment
                      </p>
                      <p className="text-xs text-muted-foreground">Funding: NSF Grant • Duration: 2023-2026</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Educational Technology for Programming</h4>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Adaptive learning system for computer science education
                      </p>
                      <p className="text-xs text-muted-foreground">Funding: University Grant • Duration: 2021-2023</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Add Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
