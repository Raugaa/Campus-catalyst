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
  Filter,
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
  Download,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCompanies } from "@/lib/convex-hooks"
import { useAuth } from "@/lib/contexts/AuthContext"

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
  const {user} = useAuth()

  // ✅ Local filter state for client-side filtering
  const [industryFilter, setIndustryFilter] = useState("all")
  const [sizeFilter, setSizeFilter] = useState("all")

  // ✅ Dialog state
  const [viewingCompany, setViewingCompany] = useState<UICompany | null>(null)
  const [contactingCompany, setContactingCompany] = useState<UICompany | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)

  // ✅ Create stable query params
  const queryParams = useMemo(() => {
    const statusFilter = (() => {
      if (tab === 'active') return 'Active'
      if (tab === 'pending') return 'Pending'
      if (tab === 'inactive') return 'Inactive'
      return undefined
    })()

    return {
      q: q || undefined,
      status: statusFilter,
      collegeId: user?.profile?.collegeId || undefined,
      take: 100,
      skip: 0,
    }
  }, [q, tab])

  // ✅ Use Convex hook
  const companiesData = useCompanies(queryParams)
  const loading = companiesData === undefined
  const error = companiesData === null ? "Failed to load companies" : undefined

  // ✅ Normalize companies data
  const companies = useMemo(() => {
    if (!companiesData) return []
    
    let companyArray = []
    if (Array.isArray(companiesData)) {
      companyArray = companiesData
    } else if (companiesData.companies && Array.isArray(companiesData.companies)) {
      companyArray = companiesData.companies
    } else if (companiesData.company) {
      companyArray = [companiesData.company]
    } else {
      console.log("Unexpected companies data structure:", companiesData)
      return []
    }

    return companyArray.map((c: any) => ({
      id: c.id || c._id,
      name: c.name || c.companyName,
      email: c.email,
      website: c.website,
      location: c.location || c.address,
      industry: c.industry || "Technology",
      size: c.size || c.companySize || "50-200",
      status: c.isVerified ? 'Active' : (c.status === 'Pending' ? 'Pending' : 'Inactive'),
      joinedDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "2024-01-01",
      activeJobs: c.activeJobs || 0,
      totalApplications: c.totalApplications || 0,
      selectedStudents: c.selectedStudents || 0,
      description: c.description || c.about,
      logo: c.logo || c.name?.[0] || 'C'
    }))
  }, [companiesData])

  // ✅ Client-side filtering
  const filteredCompanies = useMemo(() => {
    let filtered = companies

    // Apply search filter
    if (q.trim()) {
      const searchTerm = q.toLowerCase().trim()
      filtered = filtered.filter(company => 
        company.name?.toLowerCase().includes(searchTerm) ||
        company.email?.toLowerCase().includes(searchTerm) ||
        company.industry?.toLowerCase().includes(searchTerm) ||
        company.location?.toLowerCase().includes(searchTerm)
      )
    }

    // Apply industry filter
    if (industryFilter !== "all") {
      filtered = filtered.filter(company => 
        company.industry?.toLowerCase().includes(industryFilter.toLowerCase())
      )
    }

    // Apply size filter
    if (sizeFilter !== "all") {
      filtered = filtered.filter(company => 
        company.size?.toLowerCase().includes(sizeFilter.toLowerCase())
      )
    }

    return filtered
  }, [companies, q, industryFilter, sizeFilter])

  // ✅ Filter by tab status on client side
  const displayCompanies = useMemo(() => {
    if (tab === 'active') return filteredCompanies.filter(c => c.status === 'Active')
    if (tab === 'pending') return filteredCompanies.filter(c => c.status === 'Pending')
    if (tab === 'inactive') return filteredCompanies.filter(c => c.status === 'Inactive')
    return filteredCompanies
  }, [filteredCompanies, tab])

  // ✅ Stable callbacks
  const setParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    if (key !== 'tab') params.set('tab', tab)
    router.push(`/admin/companies?${params.toString()}`)
  }, [searchParams, tab, router])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Active": return "bg-green-500"
      case "Pending": return "bg-yellow-500"
      case "Inactive": return "bg-gray-500"
      default: return "bg-red-500"
    }
  }, [])

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "Active": return <CheckCircle className="w-4 h-4 text-green-500" />
      case "Pending": return <Clock className="w-4 h-4 text-yellow-500" />
      case "Inactive": return <XCircle className="w-4 h-4 text-gray-500" />
      default: return <XCircle className="w-4 h-4 text-red-500" />
    }
  }, [])

  const handleViewProfile = useCallback((company: UICompany) => {
    setViewingCompany(company)
    setIsViewDialogOpen(true)
  }, [])

  const handleContact = useCallback((company: UICompany) => {
    setContactingCompany(company)
    setIsContactDialogOpen(true)
  }, [])

  const handleViewJobs = useCallback((companyId: string) => {
    router.push(`/admin/opportunities?company=${companyId}`)
  }, [router])

  // ✅ Reusable CompanyCard component
  const CompanyCard = useCallback(({ company }: { company: UICompany }) => (
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
                  {company.website || "No website"}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {company.location || "No location"}
                </div>
                <div>{company.industry}</div>
                <div>{company.size}</div>
              </div>
              {company.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{company.description}</p>
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
                <Button size="sm" variant="outline">Reject</Button>
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
  ), [getStatusIcon, getStatusColor, handleViewProfile, handleContact, handleViewJobs])

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

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                  <p className="text-2xl font-bold">{filteredCompanies.length}</p>
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
                  <p className="text-2xl font-bold">{filteredCompanies.filter(c => c.status === 'Active').length}</p>
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
                  <p className="text-2xl font-bold">{filteredCompanies.filter(c => c.status === 'Pending').length}</p>
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
                  <p className="text-2xl font-bold">{filteredCompanies.reduce((sum, c) => sum + c.selectedStudents, 0)}</p>
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
                    className="pl-10"
                    defaultValue={q}
                    onKeyDown={(e) => { if (e.key === 'Enter') setParam('q', (e.target as HTMLInputElement).value) }}
                  />
                </div>
              </div>
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
                <Select value={sizeFilter} onValueChange={setSizeFilter}>
                  <SelectTrigger className="w-[120px]">
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
            <TabsTrigger value="all">All Companies ({filteredCompanies.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({filteredCompanies.filter(c => c.status === 'Active').length})</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval ({filteredCompanies.filter(c => c.status === 'Pending').length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({filteredCompanies.filter(c => c.status === 'Inactive').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading && <div className="text-sm text-muted-foreground">Loading companies...</div>}
            {error && <div className="text-sm text-destructive">{error}</div>}
            {!loading && !error && displayCompanies.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No companies found.</p>
              </div>
            )}
            {!loading && !error && displayCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {displayCompanies.length > 0 ? (
              displayCompanies.map((company) => <CompanyCard key={company.id} company={company} />)
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active companies found.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {displayCompanies.length > 0 ? (
              displayCompanies.map((company) => <CompanyCard key={company.id} company={company} />)
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No companies pending approval.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            {displayCompanies.length > 0 ? (
              displayCompanies.map((company) => <CompanyCard key={company.id} company={company} />)
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
                  <p className="text-muted-foreground">Website: {viewingCompany.website || "Not provided"}</p>
                  <p className="text-muted-foreground">Location: {viewingCompany.location || "Not provided"}</p>
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
                <p className="text-muted-foreground">{viewingCompany.description || "No description provided"}</p>
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
                    <p className="text-2xl font-bold mt-2">{viewingCompany.selectedStudents}</p>
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
                  <span>{contactingCompany.location || "Location not provided"}</span>
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