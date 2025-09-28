"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
} from "lucide-react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"

interface Opportunity {
  id: number
  title: string
  company: string
  location: string
  type: string
  duration: string
  stipend: string
  posted: string
  deadline: string
  description: string
  skills: string[]
  saved: boolean
  match: string
  applications?: number
}

export default function StudentOpportunities() {
  const router = useRouter()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "TCS",
      location: "Mumbai, India",
      type: "Internship",
      duration: "3 months",
      stipend: "₹25,000/month",
      posted: "2 days ago",
      deadline: "Dec 15, 2024",
      description: "Join our engineering team to work on cutting-edge web applications using React and Node.js.",
      skills: ["React", "Node.js", "JavaScript", "MongoDB"],
      saved: false,
      match: "95%",
      applications: 45,
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "Infosys",
      location: "Bangalore, India",
      type: "Internship",
      duration: "6 months",
      stipend: "₹30,000/month",
      posted: "5 days ago",
      deadline: "Dec 20, 2024",
      description: "Work with our data science team to build machine learning models and analyze large datasets.",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
      saved: true,
      match: "88%",
      applications: 32,
    },
    {
      id: 3,
      title: "Frontend Developer Intern",
      company: "Wipro",
      location: "Hyderabad, India",
      type: "Internship",
      duration: "4 months",
      stipend: "₹28,000/month",
      posted: "1 week ago",
      deadline: "Dec 10, 2024",
      description: "Create beautiful and responsive user interfaces for our client projects using modern frameworks.",
      skills: ["React", "TypeScript", "CSS", "Figma"],
      saved: false,
      match: "82%",
      applications: 28,
    },
    {
      id: 4,
      title: "Software Developer Intern",
      company: "Tech Mahindra",
      location: "Pune, India",
      type: "Internship",
      duration: "6 months",
      stipend: "₹27,000/month",
      posted: "3 days ago",
      deadline: "Dec 18, 2024",
      description: "Work on enterprise software solutions and gain experience in full-stack development.",
      skills: ["Java", "Spring Boot", "MySQL", "React"],
      saved: false,
      match: "90%",
      applications: 19,
    },
    {
      id: 5,
      title: "AI Research Intern",
      company: "Google",
      location: "Bangalore, India",
      type: "Internship",
      duration: "4 months",
      stipend: "₹45,000/month",
      posted: "1 week ago",
      deadline: "Dec 5, 2024",
      description: "Contribute to cutting-edge AI research projects and work with advanced machine learning models.",
      skills: ["Python", "TensorFlow", "PyTorch", "Research"],
      saved: false,
      match: "92%",
      applications: 41,
    },
  ])
  
  const [appliedOpportunities, setAppliedOpportunities] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Filter opportunities based on search and filters
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opportunity => {
      const matchesSearch = 
        opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.skills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      
      const matchesLocation = 
        locationFilter === "all" || 
        opportunity.location.toLowerCase().includes(locationFilter.toLowerCase())
      
      const matchesType = 
        typeFilter === "all" || 
        opportunity.type.toLowerCase().includes(typeFilter.toLowerCase())
      
      return matchesSearch && matchesLocation && matchesType
    })
  }, [opportunities, searchTerm, locationFilter, typeFilter])

  const handleViewDetails = (opportunityId: number) => {
    // Navigate to the detailed opportunity page
    router.push(`/student/opportunities/${opportunityId}`)
  }

  const handleApplyNow = (opportunityId: number) => {
    // Add to applied opportunities
    if (!appliedOpportunities.includes(opportunityId)) {
      setAppliedOpportunities([...appliedOpportunities, opportunityId])
      
      // Update application count
      setOpportunities(opportunities.map(opp => 
        opp.id === opportunityId 
          ? { ...opp, applications: (opp.applications || 0) + 1 } 
          : opp
      ))
      
      // Show success message
      alert("Applied successfully!")
    } else {
      alert("You have already applied for this opportunity!")
    }
  }

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Opportunities</h1>
            <p className="text-muted-foreground">Discover internships and job opportunities</p>
          </div>
          <div className="flex gap-2">
            <Link href="/student">
              <Button variant="outline" className="flex items-center gap-2">
                <span>Back to Dashboard</span>
              </Button>
            </Link>
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
                    placeholder="Search opportunities..." 
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="fulltime">Full-time</SelectItem>
                    <SelectItem value="parttime">Part-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Opportunities</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="applied">Applied</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={`/placeholder-icon.png?height=48&width=48&text=${opportunity.company[0]}`}
                        />
                        <AvatarFallback>{opportunity.company[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{opportunity.title}</h3>
                          <Badge variant="outline" className="text-green-600">
                            {opportunity.match} match
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{opportunity.company}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {opportunity.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {opportunity.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {opportunity.stipend}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Deadline: {opportunity.deadline}
                          </span>
                        </div>
                        <p className="text-sm mb-3">{opportunity.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {opportunity.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">Posted {opportunity.posted}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(opportunity.id)}>
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleApplyNow(opportunity.id)}
                        disabled={appliedOpportunities.includes(opportunity.id)}
                      >
                        {appliedOpportunities.includes(opportunity.id) ? "Applied" : "Apply Now"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="recommended" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Recommended opportunities will appear here based on your profile.</p>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Your saved opportunities will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="applied" className="space-y-4">
            {filteredOpportunities.filter(opp => appliedOpportunities.includes(opp.id)).length > 0 ? (
              filteredOpportunities.filter(opp => appliedOpportunities.includes(opp.id)).map((opportunity) => (
                <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={`/placeholder-icon.png?height=48&width=48&text=${opportunity.company[0]}`}
                          />
                          <AvatarFallback>{opportunity.company[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{opportunity.title}</h3>
                            <Badge variant="outline" className="text-green-600">
                              {opportunity.match} match
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">{opportunity.company}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {opportunity.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {opportunity.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {opportunity.stipend}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Deadline: {opportunity.deadline}
                            </span>
                          </div>
                          <p className="text-sm mb-3">{opportunity.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {opportunity.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">Posted {opportunity.posted}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(opportunity.id)}>
                          View Details
                        </Button>
                        <Button size="sm" disabled>
                          Applied
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Opportunities you've applied to will appear here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

    </DashboardLayout>
  )
}