"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Plus,
  Eye,
  Users,
  Calendar,
  Edit,
  Trash2,
  Copy,
  MoreHorizontal,
  MapPin,
  Clock,
  DollarSign,
  Pause,
  Play,
  X
} from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"

// Define types for better type safety
type JobStatus = "Active" | "Draft" | "Closed" | "Closing Soon" | "Paused"
type JobType = "Internship" | "Full-time" | "Part-time"

interface Job {
  id: number
  title: string
  location: string
  type: JobType
  duration: string
  stipend: string
  posted: string
  deadline: string
  status: JobStatus
  applications: number
  views: number
  description: string
  skills: string[]
}

export default function CompanyJobs() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 1,
      title: "Software Engineering Intern",
      location: "Mumbai, Maharashtra",
      type: "Internship",
      duration: "3 months",
      stipend: "₹25,000/month",
      posted: "2 weeks ago",
      deadline: "Dec 15, 2024",
      status: "Active",
      applications: 45,
      views: 234,
      description: "Join our engineering team to work on cutting-edge web applications...",
      skills: ["React", "Node.js", "JavaScript", "MongoDB"],
    },
    {
      id: 2,
      title: "Data Science Intern",
      location: "Remote",
      type: "Internship",
      duration: "6 months",
      stipend: "₹30,000/month",
      posted: "1 week ago",
      deadline: "Dec 20, 2024",
      status: "Active",
      applications: 32,
      views: 189,
      description: "Work with our data science team to build machine learning models...",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
    },
    {
      id: 3,
      title: "Frontend Developer Intern",
      location: "Bangalore, Karnataka",
      type: "Internship",
      duration: "4 months",
      stipend: "₹28,000/month",
      posted: "3 weeks ago",
      deadline: "Dec 10, 2024",
      status: "Closing Soon",
      applications: 28,
      views: 156,
      description: "Create beautiful and responsive user interfaces...",
      skills: ["React", "TypeScript", "CSS", "Figma"],
    },
    {
      id: 4,
      title: "Backend Developer Intern",
      location: "Hyderabad, Telangana",
      type: "Internship",
      duration: "3 months",
      stipend: "₹27,000/month",
      posted: "1 month ago",
      deadline: "Nov 30, 2024",
      status: "Closed",
      applications: 67,
      views: 312,
      description: "Build scalable backend systems and APIs...",
      skills: ["Node.js", "PostgreSQL", "Docker", "AWS"],
    },
    {
      id: 5,
      title: "Marketing Intern",
      location: "Pune, Maharashtra",
      type: "Internship",
      duration: "3 months",
      stipend: "₹20,000/month",
      posted: "5 days ago",
      deadline: "Jan 15, 2025",
      status: "Draft",
      applications: 0,
      views: 12,
      description: "Help develop marketing campaigns and analyze market trends...",
      skills: ["Marketing", "Analytics", "Photoshop", "Social Media"],
    },
    {
      id: 6,
      title: "Product Manager",
      location: "Chennai, Tamil Nadu",
      type: "Full-time",
      duration: "Permanent",
      stipend: "₹12,00,000/year",
      posted: "2 days ago",
      deadline: "Jan 30, 2025",
      status: "Paused",
      applications: 15,
      views: 89,
      description: "Lead product development and strategy for our main platform...",
      skills: ["Product Management", "Strategy", "Analytics", "Leadership"],
    },
  ])

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Advanced filter states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [minApplications, setMinApplications] = useState("")
  const [maxApplications, setMaxApplications] = useState("")
  const [skillFilter, setSkillFilter] = useState("")

  // Get unique values for filter options
  const uniqueLocations = useMemo(() => {
    const locations = [...new Set(jobs.map(job => job.location))]
    return locations.sort()
  }, [jobs])

  const uniqueSkills = useMemo(() => {
    const skills = [...new Set(jobs.flatMap(job => job.skills))]
    return skills.sort()
  }, [jobs])

  // Filter jobs based on all criteria
  const filteredJobs = useMemo(() => {
    let filtered = jobs

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query)) ||
        job.location.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(job => job.status.toLowerCase() === statusFilter.toLowerCase())
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(job => job.type.toLowerCase() === typeFilter.toLowerCase())
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter(job => job.location === locationFilter)
    }

    // Tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(job => job.status.toLowerCase() === activeTab.toLowerCase())
    }

    // Advanced filters
    if (minApplications) {
      filtered = filtered.filter(job => job.applications >= parseInt(minApplications))
    }

    if (maxApplications) {
      filtered = filtered.filter(job => job.applications <= parseInt(maxApplications))
    }

    if (skillFilter) {
      filtered = filtered.filter(job => 
        job.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))
      )
    }

    return filtered
  }, [jobs, searchQuery, statusFilter, typeFilter, locationFilter, activeTab, minApplications, maxApplications, skillFilter])

  // Get jobs for specific tab
  const getJobsForTab = (tab: string) => {
    if (tab === "all") return filteredJobs
    return filteredJobs.filter(job => job.status.toLowerCase() === tab.toLowerCase())
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setTypeFilter("all")
    setLocationFilter("all")
    setMinApplications("")
    setMaxApplications("")
    setSkillFilter("")
    setShowAdvancedFilters(false)
  }

  // Check if any filters are active
  const hasActiveFilters = searchQuery || statusFilter !== "all" || typeFilter !== "all" || 
                          locationFilter !== "all" || minApplications || maxApplications || skillFilter

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Closing Soon":
        return "bg-yellow-500"
      case "Closed":
        return "bg-red-500"
      case "Draft":
        return "bg-gray-500"
      case "Paused":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  // Function to toggle job status between Active and Paused
  const toggleJobStatus = (jobId: number) => {
    setJobs(prevJobs => 
      prevJobs.map(job => {
        if (job.id === jobId) {
          // If job is Active, pause it. If job is Paused, activate it.
          if (job.status === "Active") {
            return { ...job, status: "Paused" }
          } else if (job.status === "Paused") {
            return { ...job, status: "Active" }
          }
        }
        return job
      })
    )
  }

  // Function to publish a draft job
  const publishJob = (jobId: number) => {
    setJobs(prevJobs => 
      prevJobs.map(job => {
        if (job.id === jobId && job.status === "Draft") {
          return { ...job, status: "Active" }
        }
        return job
      })
    )
  }

  const renderJobCard = (job: Job) => (
    <Card key={job.id} className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <Badge variant="secondary" className="px-2 py-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(job.status)} mr-1`} />
                {job.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {job.duration}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {job.stipend}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Deadline: {job.deadline}
              </span>
            </div>
            <p className="text-sm mb-3 text-muted-foreground">{job.description}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {job.applications} applications
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {job.views} views
              </span>
              <span>Posted {job.posted}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/company/jobs/${job.id}`}>
                Detailed View
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/company/jobs/${job.id}#applicants`}>
                View Applications ({job.applications})
              </Link>
            </Button>
          </div>
          <div className="flex gap-2">
            {(job.status === "Active" || job.status === "Paused") && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => toggleJobStatus(job.id)}
              >
                {job.status === "Active" ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Job
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Resume Job
                  </>
                )}
              </Button>
            )}
            {job.status === "Draft" && (
              <Button size="sm" onClick={() => publishJob(job.id)}>
                Publish
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout userRole="company">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Job Posts</h1>
            <p className="text-muted-foreground">Manage your internship and job postings</p>
          </div>
          <Button asChild>
            <Link href="/company/jobs/new">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Main Search and Filter Row */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                      placeholder="Search job posts by title, description, skills, or location..." 
                      className="pl-10" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="closing soon">Closing Soon</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="border-t pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          {uniqueLocations.map(location => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Min Applications</label>
                      <Input 
                        type="number" 
                        placeholder="0"
                        value={minApplications}
                        onChange={(e) => setMinApplications(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Max Applications</label>
                      <Input 
                        type="number" 
                        placeholder="100"
                        value={maxApplications}
                        onChange={(e) => setMaxApplications(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Filter by Skill</label>
                    <Input 
                      placeholder="Enter skill name..."
                      value={skillFilter}
                      onChange={(e) => setSkillFilter(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Active Filters:</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="h-auto p-1 text-xs"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <Badge variant="secondary" className="gap-1">
                        Search: {searchQuery}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                      </Badge>
                    )}
                    {statusFilter !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        Status: {statusFilter}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
                      </Badge>
                    )}
                    {typeFilter !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        Type: {typeFilter}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setTypeFilter("all")} />
                      </Badge>
                    )}
                    {locationFilter !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        Location: {locationFilter}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setLocationFilter("all")} />
                      </Badge>
                    )}
                    {skillFilter && (
                      <Badge variant="secondary" className="gap-1">
                        Skill: {skillFilter}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSkillFilter("")} />
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                Showing {filteredJobs.length} of {jobs.length} job posts
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Jobs ({jobs.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({jobs.filter(j => j.status === "Active").length})</TabsTrigger>
            <TabsTrigger value="draft">Draft ({jobs.filter(j => j.status === "Draft").length})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({jobs.filter(j => j.status === "Closed").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {getJobsForTab("all").length > 0 ? (
              getJobsForTab("all").map(renderJobCard)
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {hasActiveFilters ? "No jobs match your current filters." : "No job posts found."}
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters} className="mt-2">
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {getJobsForTab("active").length > 0 ? (
              getJobsForTab("active").map(renderJobCard)
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active job posts found.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {getJobsForTab("draft").length > 0 ? (
              getJobsForTab("draft").map(renderJobCard)
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No draft job posts found.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="closed" className="space-y-4">
            {getJobsForTab("closed").length > 0 ? (
              getJobsForTab("closed").map(renderJobCard)
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No closed job posts found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}