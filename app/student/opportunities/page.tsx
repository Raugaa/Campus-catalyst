import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Calendar,
} from "lucide-react"

export default function StudentOpportunities() {
  const opportunities = [
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Internship",
      duration: "3 months",
      stipend: "$2,000/month",
      posted: "2 days ago",
      deadline: "Dec 15, 2024",
      description: "Join our engineering team to work on cutting-edge web applications using React and Node.js.",
      skills: ["React", "Node.js", "JavaScript", "MongoDB"],
      saved: false,
      match: "95%",
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "DataSoft Solutions",
      location: "Remote",
      type: "Internship",
      duration: "6 months",
      stipend: "$1,800/month",
      posted: "5 days ago",
      deadline: "Dec 20, 2024",
      description: "Work with our data science team to build machine learning models and analyze large datasets.",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
      saved: true,
      match: "88%",
    },
    {
      id: 3,
      title: "Frontend Developer Intern",
      company: "WebFlow Agency",
      location: "New York, NY",
      type: "Internship",
      duration: "4 months",
      stipend: "$2,200/month",
      posted: "1 week ago",
      deadline: "Dec 10, 2024",
      description: "Create beautiful and responsive user interfaces for our client projects using modern frameworks.",
      skills: ["React", "TypeScript", "CSS", "Figma"],
      saved: false,
      match: "82%",
    },
  ]

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Opportunities</h1>
            <p className="text-muted-foreground">Discover internships and job opportunities</p>
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search opportunities..." className="pl-10" />
                </div>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="sf">San Francisco</SelectItem>
                    <SelectItem value="ny">New York</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
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
            {opportunities.map((opportunity) => (
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
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        {opportunity.saved ? (
                          <BookmarkCheck className="w-4 h-4 text-primary" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">Posted {opportunity.posted}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">Apply Now</Button>
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
            <div className="text-center py-8">
              <p className="text-muted-foreground">Opportunities you've applied to will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
