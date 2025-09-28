"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Users,
  Building2,
  Bookmark,
  Share2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Mock data for opportunities
const mockOpportunities = {
  1: {
    id: 1,
    title: "Software Engineering Intern",
    company: "TCS",
    location: "Mumbai, India",
    type: "Internship",
    duration: "3 months",
    stipend: "₹25,000/month",
    posted: "2 days ago",
    deadline: "Dec 15, 2024",
    applicants: 45,
    positions: 3,
    match: "95%",
    description: `We are looking for a passionate Software Engineering Intern to join our dynamic team. You will work on cutting-edge web applications using modern technologies and contribute to products used by millions of users worldwide.

This is an excellent opportunity to gain hands-on experience in a fast-paced startup environment while working alongside experienced engineers who are committed to your growth and development.`,
    responsibilities: [
      "Develop and maintain web applications using React and Node.js",
      "Collaborate with cross-functional teams to define and implement new features",
      "Write clean, maintainable, and well-documented code",
      "Participate in code reviews and contribute to technical discussions",
      "Work with databases and APIs to build full-stack solutions",
    ],
    requirements: [
      "Currently pursuing a degree in Computer Science or related field",
      "Strong knowledge of JavaScript, HTML, and CSS",
      "Experience with React and Node.js",
      "Familiarity with Git version control",
      "Strong problem-solving skills and attention to detail",
    ],
    preferred: [
      "Experience with TypeScript",
      "Knowledge of database systems (MongoDB, PostgreSQL)",
      "Understanding of RESTful APIs",
      "Previous internship or project experience",
    ],
    skills: ["React", "Node.js", "JavaScript", "MongoDB", "TypeScript", "Git"],
    benefits: [
      "Competitive stipend of ₹25,000/month",
      "Mentorship from senior engineers",
      "Flexible working hours",
      "Learning and development opportunities",
      "Potential for full-time offer",
    ],
    companyInfo: {
      name: "TCS",
      size: "200,000+ employees",
      industry: "Information Technology",
      founded: "1968",
      description:
        "Tata Consultancy Services is an Indian multinational information technology services and consulting company headquartered in Mumbai. It is part of the Tata Group and operates in 46 countries.",
    },
  },
  2: {
    id: 2,
    title: "Data Science Intern",
    company: "Infosys",
    location: "Bangalore, India",
    type: "Internship",
    duration: "6 months",
    stipend: "₹30,000/month",
    posted: "5 days ago",
    deadline: "Dec 20, 2024",
    applicants: 32,
    positions: 2,
    match: "88%",
    description: `Join our data science team to work on cutting-edge machine learning projects and analyze large datasets to drive business insights. You'll work with experienced data scientists on real-world problems and contribute to our research initiatives.`,
    responsibilities: [
      "Analyze large datasets to identify trends and insights",
      "Build and deploy machine learning models",
      "Create data visualizations and reports",
      "Collaborate with cross-functional teams to understand business requirements",
      "Document and present findings to stakeholders",
    ],
    requirements: [
      "Currently pursuing a degree in Data Science, Statistics, or related field",
      "Proficiency in Python and SQL",
      "Experience with machine learning libraries (scikit-learn, TensorFlow, PyTorch)",
      "Strong analytical and problem-solving skills",
      "Familiarity with data visualization tools",
    ],
    preferred: [
      "Experience with big data technologies (Spark, Hadoop)",
      "Knowledge of cloud platforms (AWS, GCP, Azure)",
      "Previous internship or project experience in data science",
    ],
    skills: ["Python", "SQL", "Machine Learning", "TensorFlow", "PyTorch", "Spark"],
    benefits: [
      "Competitive stipend of ₹30,000/month",
      "Flexible working hours",
      "Mentorship from senior data scientists",
      "Learning and development opportunities",
      "Potential for full-time offer",
    ],
    companyInfo: {
      name: "Infosys",
      size: "250,000+ employees",
      industry: "Information Technology",
      founded: "1981",
      description:
        "Infosys is an Indian multinational corporation that provides business consulting, information technology and outsourcing services. The company is headquartered in Bangalore, India.",
    },
  }
}

export default function OpportunityDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isApplied, setIsApplied] = useState(false)
  
  // Get opportunity data based on ID
  const opportunity = mockOpportunities[parseInt(params.id) as keyof typeof mockOpportunities] || mockOpportunities[1]

  const handleApply = () => {
    // Simulate application submission
    setIsApplied(true)
    // After a short delay, redirect back to dashboard
    setTimeout(() => {
      router.push('/student')
    }, 1500)
  }

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/student/opportunities">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Opportunities
            </Link>
          </Button>
          <div className="flex gap-2">
            <Link href="/student">
              <Button variant="outline" className="flex items-center gap-2">
                <span>Back to Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Opportunity Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={`/placeholder-icon.png?height=64&width=64&text=${opportunity.company[0]}`} />
                      <AvatarFallback className="text-lg">{opportunity.company[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-2xl font-bold">{opportunity.title}</h1>
                        <Badge variant="outline" className="text-green-600">
                          {opportunity.match} match
                        </Badge>
                      </div>
                      <p className="text-lg text-muted-foreground mb-3">{opportunity.company}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {opportunity.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {opportunity.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {opportunity.stipend}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Deadline: {opportunity.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {opportunity.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {opportunity.applicants} applicants
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {opportunity.positions} positions
                  </span>
                  <span>Posted {opportunity.posted}</span>
                </div>
              </CardContent>
            </Card>

            {/* Opportunity Details */}
            <Tabs defaultValue="description" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Description</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-muted-foreground whitespace-pre-line">{opportunity.description}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-3">Key Responsibilities</h4>
                      <ul className="space-y-2">
                        {opportunity.responsibilities.map((responsibility, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        Required Qualifications
                      </h4>
                      <ul className="space-y-2">
                        {opportunity.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Preferred Qualifications
                      </h4>
                      <ul className="space-y-2">
                        {opportunity.preferred.map((preferred, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            {preferred}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="company" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {opportunity.companyInfo.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{opportunity.companyInfo.description}</p>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h5 className="font-medium mb-1">Company Size</h5>
                        <p className="text-sm text-muted-foreground">{opportunity.companyInfo.size}</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-1">Industry</h5>
                        <p className="text-sm text-muted-foreground">{opportunity.companyInfo.industry}</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-1">Founded</h5>
                        <p className="text-sm text-muted-foreground">{opportunity.companyInfo.founded}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="benefits" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Benefits & Perks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {opportunity.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Card */}
            <Card>
              <CardHeader>
                <CardTitle>Apply for this Position</CardTitle>
                <CardDescription>Submit your application before the deadline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Application Deadline</span>
                  <span className="font-medium">{opportunity.deadline}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Positions Available</span>
                  <span className="font-medium">{opportunity.positions}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Applicants</span>
                  <span className="font-medium">{opportunity.applicants}</span>
                </div>

                <Separator />

                {isApplied ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-green-600">Application Submitted!</p>
                    <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
                  </div>
                ) : (
                  <Button className="w-full" size="lg" onClick={handleApply}>
                    <FileText className="w-4 h-4 mr-2" />
                    Submit Application
                  </Button>
                )}
                <p className="text-xs text-muted-foreground text-center">Your profile and resume will be submitted</p>
              </CardContent>
            </Card>

            {/* Similar Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Frontend Developer Intern",
                    company: "Wipro",
                    match: "82%",
                  },
                  {
                    title: "Full Stack Developer Intern",
                    company: "Tech Mahindra",
                    match: "78%",
                  },
                ].map((similar, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <h4 className="font-medium text-sm mb-1">{similar.title}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{similar.company}</p>
                      <Badge variant="outline" className="text-xs">
                        {similar.match} match
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href="/student/opportunities">View More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}