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
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useState, useMemo } from "react"

export default function CompanyJobs() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Software Engineering Intern",
      location: "San Francisco, CA",
      type: "Internship",
      duration: "3 months",
      stipend: "$2,000/month",
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
      stipend: "$1,800/month",
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
      location: "New York, NY",
      type: "Internship",
      duration: "4 months",
      stipend: "$2,200/month",
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
      location: "Austin, TX",
      type: "Internship",
      duration: "3 months",
      stipend: "$1,900/month",
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
      location: "Los Angeles, CA",
      type: "Internship",
      duration: "2 months",
      stipend: "$1,500/month",
      posted: "4 days ago",
      deadline: "Jan 10, 2025",
      status: "Draft",
      applications: 0,
      views: 12,
      description: "Help develop marketing strategies and campaigns...",
      skills: ["Marketing", "Social Media", "Analytics", "Content Creation"],
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const handleDeleteJob = (jobId: number) => {
    if (window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      setJobs(jobs.filter(job => job.id !== jobId))
    }
  }

  const handlePublishJob = (jobId: number) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: "Active" } : job
    ))
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))

      // Status filter
      const matchesStatus = statusFilter === "all" || job.status.toLowerCase() === statusFilter.toLowerCase()

      // Type filter
      const matchesType = typeFilter === "all" || job.type.toLowerCase() === typeFilter.toLowerCase()

      // Tab filter
      const matchesTab = activeTab === "all" || job.status.toLowerCase() === activeTab.toLowerCase()

      return matchesSearch && matchesStatus && matchesType && matchesTab
    })
  }, [jobs, searchQuery, statusFilter, typeFilter, activeTab])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Closing Soon":
        return "bg-yellow-500"
      case "Closed":
        return "bg-red-500"
      case "Draft":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getJobsByStatus = (status: string) => {
    return jobs.filter(job => job.status.toLowerCase() === status.toLowerCase()).length
  }

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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="Search job posts..." 
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
                    <SelectItem value="fulltime">Full-time</SelectItem>
                    <SelectItem value="parttime">Part-time</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                    setTypeFilter("all")
                  }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Jobs ({jobs.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({getJobsByStatus("Active")})</TabsTrigger>
            <TabsTrigger value="draft">Draft ({getJobsByStatus("Draft")})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({getJobsByStatus("Closed")})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all" 
                    ? "No jobs match your current filters." 
                    : `No ${activeTab === "all" ? "" : activeTab} job posts found.`}
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => (
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Job
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Public Page
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/company/jobs/${job.id}/applications`}>
                            View Applications ({job.applications})
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/company/jobs/${job.id}/edit`}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}