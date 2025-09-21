"use client"

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
<<<<<<< HEAD
  Download,
=======
  Filter,
>>>>>>> admin
  Eye,
  Edit,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Users,
  Briefcase,
  Globe,
  MapPin,
} from "lucide-react"
<<<<<<< HEAD
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Company {
  id: number
  name: string
  email: string
  website: string
  location: string
  industry: string
  size: string
  status: string
  joinedDate: string
  activeJobs: number
  totalApplications: number
  hiredStudents: number
  description: string
  logo: string
}

export default function AdminCompanies() {
  const router = useRouter()
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null)
  const [contactingCompany, setContactingCompany] = useState<Company | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sizeFilter, setSizeFilter] = useState("all")
  
  const companies: Company[] = [
    {
      id: 1,
      name: "TCS",
      email: "hr@tcs.com",
      website: "www.tcs.com",
      location: "Mumbai, Maharashtra",
      industry: "Technology",
      size: "50-200 employees",
      status: "Active",
      joinedDate: "Jan 2024",
      activeJobs: 8,
      totalApplications: 156,
      hiredStudents: 12,
      description: "Leading technology company focused on innovative web solutions.",
      logo: "TC",
    },
    {
      id: 2,
      name: "Infosys",
      email: "careers@infosys.com",
      website: "www.infosys.com",
      location: "Bangalore, Karnataka",
      industry: "Data Analytics",
      size: "200-500 employees",
      status: "Active",
      joinedDate: "Mar 2024",
      activeJobs: 5,
      totalApplications: 89,
      hiredStudents: 8,
      description: "Data analytics and machine learning solutions provider.",
      logo: "IS",
    },
    {
      id: 3,
      name: "Wipro",
      email: "jobs@wipro.com",
      website: "www.wipro.com",
      location: "Hyderabad, Telangana",
      industry: "Digital Marketing",
      size: "10-50 employees",
      status: "Pending",
      joinedDate: "Nov 2024",
      activeJobs: 3,
      totalApplications: 45,
      hiredStudents: 2,
      description: "Creative digital marketing and web development agency.",
      logo: "WP",
    },
    {
      id: 4,
      name: "Tech Mahindra",
      email: "hr@techmahindra.com",
      website: "www.techmahindra.com",
      location: "Pune, Maharashtra",
      industry: "Cloud Computing",
      size: "500+ employees",
      status: "Inactive",
      joinedDate: "Sep 2023",
      activeJobs: 0,
      totalApplications: 234,
      hiredStudents: 18,
      description: "Enterprise cloud computing and infrastructure solutions.",
      logo: "TM",
    },
  ]
=======
import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface UICompany {
  id: string
  name: string
  email: string
  website?: string
  location?: string
  industry?: string
  size?: string
  status: "Active" | "Pending" | "Inactive"
  joinedDate?: string
  activeJobs: number
  totalApplications: number
  selectedStudents: number
  description?: string
  logo?: string
}

export default function AdminCompanies() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tab = (searchParams.get('tab') || 'all') as 'all'|'active'|'pending'|'inactive'
  const q = searchParams.get('q') || ''

  const [companies, setCompanies] = useState<UICompany[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const status = useMemo(() => {
    if (tab === 'active') return 'Active'
    if (tab === 'pending') return 'Pending'
    if (tab === 'inactive') return 'Inactive'
    return undefined
  }, [tab])

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(undefined)
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (q) params.set('q', q)
    params.set('take', '20')
    params.set('skip', '0')
    fetch(`/api/admin/companies?${params.toString()}`)
      .then(async (res) => { if (!res.ok) throw new Error('Failed to load companies'); return res.json() })
      .then((data) => { if (!isMounted) return; setCompanies(data.companies || []) })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
    return () => { isMounted = false }
  }, [status, q])

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    if (key !== 'tab') params.set('tab', tab)
    router.push(`/admin/companies?${params.toString()}`)
  }
>>>>>>> admin

  // Filter companies based on search and filters
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSearch = 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesIndustry = 
        industryFilter === "all" || 
        company.industry.toLowerCase().includes(industryFilter.toLowerCase())
      
      const matchesStatus = 
        statusFilter === "all" || 
        company.status.toLowerCase() === statusFilter.toLowerCase()
      
      const matchesSize = 
        sizeFilter === "all" || 
        company.size.toLowerCase().includes(sizeFilter.toLowerCase())
      
      return matchesSearch && matchesIndustry && matchesStatus && matchesSize
    })
  }, [companies, searchTerm, industryFilter, statusFilter, sizeFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Pending":
        return "bg-yellow-500"
      case "Inactive":
        return "bg-gray-500"
      default:
        return "bg-red-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "Inactive":
        return <XCircle className="w-4 h-4 text-gray-500" />
      default:
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const handleViewProfile = (company: Company) => {
    setViewingCompany(company)
    setIsViewDialogOpen(true)
  }

  const handleContact = (company: Company) => {
    setContactingCompany(company)
    setIsContactDialogOpen(true)
  }

  const handleViewJobs = (companyId: number) => {
    // Navigate to jobs page for this company
    // Since there's no specific jobs page, we'll redirect to opportunities page with filter
    router.push(`/admin/opportunities?company=${companyId}`)
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Company Management</h1>
            <p className="text-muted-foreground">Manage partner companies and their recruitment activities</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats (static for now) */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Companies</p>
                  <p className="text-2xl font-bold">67</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Hires</p>
                  <p className="text-2xl font-bold">234</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="Search companies..." 
<<<<<<< HEAD
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
=======
                    className="pl-10"
                    defaultValue={q}
                    onKeyDown={(e) => { if (e.key === 'Enter') setParam('q', (e.target as HTMLInputElement).value) }}
>>>>>>> admin
                  />
                </div>
              </div>
              {/* Placeholder selects for industry/size retained, not wired to API */}
              <div className="flex gap-2">
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="data analytics">Data Analytics</SelectItem>
                    <SelectItem value="digital marketing">Digital Marketing</SelectItem>
                    <SelectItem value="cloud computing">Cloud Computing</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
<<<<<<< HEAD
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sizeFilter} onValueChange={setSizeFilter}>
                  <SelectTrigger className="w-[120px]">
=======
>>>>>>> admin
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="1-50">1-50</SelectItem>
                    <SelectItem value="50-200">50-200</SelectItem>
                    <SelectItem value="200-500">200-500</SelectItem>
                    <SelectItem value="500+">500+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue={tab} value={tab} onValueChange={(v) => setParam('tab', v)} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Companies</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
<<<<<<< HEAD
            {filteredCompanies.map((company) => (
=======
            {loading && <div className="text-sm text-muted-foreground">Loading companies...</div>}
            {error && <div className="text-sm text-destructive">{error}</div>}
            {!loading && !error && companies.map((company) => (
>>>>>>> admin
              <Card key={company.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`/placeholder-icon.png?height=48&width=48&text=${company.logo ?? company.name[0]}`} />
                        <AvatarFallback>{company.logo ?? company.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{company.name}</h3>
                          {getStatusIcon(company.status)}
                        </div>
                        <div className="grid gap-1 md:grid-cols-2 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {company.website}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {company.location}
                          </div>
                          <div>{company.industry}</div>
                          <div>{company.size}</div>
                        </div>
                        {company.description && (
                          <p className="text-sm text-muted-foreground mb-3">{company.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {company.activeJobs} active jobs
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {company.totalApplications} applications
                          </span>
                          <span>{company.selectedStudents} hires</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="px-3 py-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(company.status)} mr-2`} />
                      {company.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewProfile(company)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleContact(company)}>
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewJobs(company.id)}>
                        <Briefcase className="w-4 h-4 mr-1" />
                        View Jobs ({company.activeJobs})
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {company.status === "Pending" && (
                        <>
                          <Button size="sm" variant="outline">
                            Reject
                          </Button>
                          <Button size="sm">Approve</Button>
                        </>
                      )}
                      {company.status === "Active" && (
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      {company.status === "Inactive" && <Button size="sm">Reactivate</Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Other tabs keep placeholders */}
          <TabsContent value="active" className="space-y-4">
            {filteredCompanies.filter(company => company.status === "Active").length > 0 ? (
              filteredCompanies.filter(company => company.status === "Active").map((company) => (
                <Card key={company.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={`/placeholder-icon.png?height=48&width=48&text=${company.logo}`} />
                          <AvatarFallback>{company.logo}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{company.name}</h3>
                            {getStatusIcon(company.status)}
                          </div>
                          <div className="grid gap-1 md:grid-cols-2 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {company.website}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {company.location}
                            </div>
                            <div>{company.industry}</div>
                            <div>{company.size}</div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{company.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {company.activeJobs} active jobs
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {company.totalApplications} applications
                            </span>
                            <span>{company.hiredStudents} hires</span>
                            <span>Joined {company.joinedDate}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="px-3 py-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(company.status)} mr-2`} />
                        {company.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewProfile(company)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleContact(company)}>
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleViewJobs(company.id)}>
                          <Briefcase className="w-4 h-4 mr-1" />
                          View Jobs ({company.activeJobs})
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active companies found.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {filteredCompanies.filter(company => company.status === "Pending").length > 0 ? (
              filteredCompanies.filter(company => company.status === "Pending").map((company) => (
                <Card key={company.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={`/placeholder-icon.png?height=48&width=48&text=${company.logo}`} />
                          <AvatarFallback>{company.logo}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{company.name}</h3>
                            {getStatusIcon(company.status)}
                          </div>
                          <div className="grid gap-1 md:grid-cols-2 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {company.website}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {company.location}
                            </div>
                            <div>{company.industry}</div>
                            <div>{company.size}</div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{company.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {company.activeJobs} active jobs
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {company.totalApplications} applications
                            </span>
                            <span>{company.hiredStudents} hires</span>
                            <span>Joined {company.joinedDate}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="px-3 py-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(company.status)} mr-2`} />
                        {company.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewProfile(company)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleContact(company)}>
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleViewJobs(company.id)}>
                          <Briefcase className="w-4 h-4 mr-1" />
                          View Jobs ({company.activeJobs})
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No companies pending approval.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            {filteredCompanies.filter(company => company.status === "Inactive").length > 0 ? (
              filteredCompanies.filter(company => company.status === "Inactive").map((company) => (
                <Card key={company.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={`/placeholder-icon.png?height=48&width=48&text=${company.logo}`} />
                          <AvatarFallback>{company.logo}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{company.name}</h3>
                            {getStatusIcon(company.status)}
                          </div>
                          <div className="grid gap-1 md:grid-cols-2 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {company.website}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {company.location}
                            </div>
                            <div>{company.industry}</div>
                            <div>{company.size}</div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{company.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {company.activeJobs} active jobs
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {company.totalApplications} applications
                            </span>
                            <span>{company.hiredStudents} hires</span>
                            <span>Joined {company.joinedDate}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="px-3 py-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(company.status)} mr-2`} />
                        {company.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewProfile(company)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleContact(company)}>
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleViewJobs(company.id)}>
                          <Briefcase className="w-4 h-4 mr-1" />
                          View Jobs ({company.activeJobs})
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">Reactivate</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No inactive companies found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* View Company Profile Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Company Profile</DialogTitle>
            <DialogDescription>
              Detailed information for {viewingCompany?.name}
            </DialogDescription>
          </DialogHeader>
          {viewingCompany && (
            <div className="space-y-6 py-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={`/placeholder-icon.png?height=64&width=64&text=${viewingCompany.logo}`} />
                  <AvatarFallback className="text-xl">{viewingCompany.logo}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{viewingCompany.name}</h3>
                  <p className="text-muted-foreground">{viewingCompany.industry}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{viewingCompany.size}</Badge>
                    <Badge variant="secondary">{viewingCompany.location}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Contact Information</h4>
                  <p className="text-muted-foreground">Email: {viewingCompany.email}</p>
                  <p className="text-muted-foreground">Website: {viewingCompany.website}</p>
                  <p className="text-muted-foreground">Location: {viewingCompany.location}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Company Details</h4>
                  <p className="text-muted-foreground">Industry: {viewingCompany.industry}</p>
                  <p className="text-muted-foreground">Size: {viewingCompany.size}</p>
                  <p className="text-muted-foreground">Joined: {viewingCompany.joinedDate}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Description</h4>
                <p className="text-muted-foreground">{viewingCompany.description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-4 text-center">
                    <Briefcase className="w-6 h-6 mx-auto text-muted-foreground" />
                    <p className="text-2xl font-bold mt-2">{viewingCompany.activeJobs}</p>
                    <p className="text-sm text-muted-foreground">Active Jobs</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <Users className="w-6 h-6 mx-auto text-muted-foreground" />
                    <p className="text-2xl font-bold mt-2">{viewingCompany.totalApplications}</p>
                    <p className="text-sm text-muted-foreground">Applications</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <CheckCircle className="w-6 h-6 mx-auto text-muted-foreground" />
                    <p className="text-2xl font-bold mt-2">{viewingCompany.hiredStudents}</p>
                    <p className="text-sm text-muted-foreground">Students Hired</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Contact Company Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {contactingCompany?.name}</DialogTitle>
            <DialogDescription>
              Company contact information
            </DialogDescription>
          </DialogHeader>
          {contactingCompany && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`/placeholder-icon.png?height=48&width=48&text=${contactingCompany.logo}`} />
                  <AvatarFallback>{contactingCompany.logo}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{contactingCompany.name}</h3>
                  <p className="text-sm text-muted-foreground">{contactingCompany.industry}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span>{contactingCompany.email}</span>
                </div>
                {contactingCompany.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span>{contactingCompany.website}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{contactingCompany.location}</span>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => window.location.href = `mailto:${contactingCompany.email}`}>
                  Send Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}