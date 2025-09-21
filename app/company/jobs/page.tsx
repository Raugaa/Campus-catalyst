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
  Play
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

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
  ])

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
      case "Paused":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const toggleJobStatus = (jobId: number) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        if (job.status === "Active") {
          return { ...job, status: "Paused" }
        } else if (job.status === "Paused") {
          return { ...job, status: "Active" }
        }
      }
      return job
    }))
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
                  <Input placeholder="Search job posts..." className="pl-10" />
                </div>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
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
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {jobs.map((job) => (
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
                      {job.status === "Draft" && <Button size="sm">Publish</Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Active job posts will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Draft job posts will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="closed" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Closed job posts will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}