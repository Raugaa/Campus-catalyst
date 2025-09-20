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
} from "lucide-react"
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
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
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
                    className="pl-10"
                    defaultValue={q}
                    onKeyDown={(e) => { if (e.key === 'Enter') setParam('q', (e.target as HTMLInputElement).value) }}
                  />
                </div>
              </div>
              {/* Placeholder selects for industry/size retained, not wired to API */}
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="startup">1-50</SelectItem>
                    <SelectItem value="medium">50-200</SelectItem>
                    <SelectItem value="large">200+</SelectItem>
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
            {loading && <div className="text-sm text-muted-foreground">Loading companies...</div>}
            {error && <div className="text-sm text-destructive">{error}</div>}
            {!loading && !error && companies.map((company) => (
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
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm">
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
            <div className="text-center py-8">
              <p className="text-muted-foreground">Active companies will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Companies pending approval will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Inactive companies will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
