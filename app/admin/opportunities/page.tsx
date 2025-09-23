"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Building2,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface UIOpportunity {
  id: string
  title: string
  company: { id: string; name: string; industry?: string; location?: string }
  location: string
  type: string
  duration?: string
  applications: number
  views?: number
  status: string
  postedDate?: string
  deadline: string
  salary?: string
  stipend?: string
  skills: string[]
}

export default function AdminOpportunities() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tab = (searchParams.get('tab') || 'all') as 'all'|'active'|'pending'|'closed'
  const q = searchParams.get('q') || ''

  const [opportunities, setOpportunities] = useState<UIOpportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const status = useMemo(() => {
    if (tab === 'active') return 'ACTIVE'
    if (tab === 'pending') return 'PENDING'
    if (tab === 'closed') return 'CLOSED'
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
    fetch(`/api/admin/opportunities?${params.toString()}`)
      .then(async (res) => { if (!res.ok) throw new Error('Failed to load opportunities'); return res.json() })
      .then((data) => { if (!isMounted) return; const mapped: UIOpportunity[] = (data.opportunities || []).map((o: any) => ({
        id: o.id,
        title: o.title,
        company: o.company,
        location: o.location,
        type: o.type,
        duration: o.duration || undefined,
        applications: o.totalApplications,
        status: o.status,
        deadline: o.deadline,
        salary: o.salary || undefined,
        stipend: o.stipend || undefined,
        skills: o.skills || [],
      })); setOpportunities(mapped) })
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
    router.push(`/admin/opportunities?${params.toString()}`)
  }

  const stats = [
    { title: "Total Opportunities", value: "-", change: "", icon: Briefcase },
    { title: "Active Postings", value: "-", change: "", icon: TrendingUp },
    { title: "Total Applications", value: "-", change: "", icon: Users },
    { title: "Pending Reviews", value: "-", change: "", icon: AlertCircle },
  ]

  const handleViewOpportunity = (opportunity: Opportunity) => {
    setViewingOpportunity(opportunity)
    setIsViewDialogOpen(true)
  }

  const handleEditOpportunity = (opportunityId: number) => {
    // Navigate to edit page using Next.js router
    router.push(`/admin/opportunities/${opportunityId}`)
  }

  const handleDeleteOpportunity = (opportunity: Opportunity) => {
    setDeletingOpportunity(opportunity)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteOpportunity = () => {
    if (deletingOpportunity) {
      setOpportunities(opportunities.filter(opp => opp.id !== deletingOpportunity.id))
      setIsDeleteDialogOpen(false)
      setDeletingOpportunity(null)
    }
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Opportunity Management</h1>
            <p className="text-muted-foreground">Manage and oversee all internship opportunities</p>
          </div>
          <Button asChild>
            <Link href="/admin/opportunities/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Opportunity
            </Link>
          </Button>
        </div>

        {/* Stats Cards (kept minimal) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue={tab} value={tab} onValueChange={(v) => setParam('tab', v)} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Opportunities</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending Review</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search opportunities..." 
                  className="pl-8 w-64"
                  defaultValue={q}
                  onKeyDown={(e) => { if (e.key === 'Enter') setParam('q', (e.target as HTMLInputElement).value) }}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closing soon">Closing Soon</SelectItem>
                  <SelectItem value="under review">Under Review</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Opportunities</CardTitle>
                <CardDescription>Complete list of internship opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading && <div className="text-sm text-muted-foreground">Loading opportunities...</div>}
                  {error && <div className="text-sm text-destructive">{error}</div>}
                  {!loading && !error && opportunities.map((opportunity) => (
                    <div
                      key={opportunity.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={`/placeholder-icon.png?height=48&width=48&text=${opportunity.company.name[0]}`}
                        />
                        <AvatarFallback>{opportunity.company.name[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {opportunity.company.name}
                            </p>
                          </div>
                          <Badge
                            variant={
                              opportunity.status === "ACTIVE"
                                ? "default"
                                : opportunity.status === "CLOSED"
                                  ? "outline"
                                  : opportunity.status === "PENDING"
                                    ? "secondary"
                                    : "outline"
                            }
                          >
                            {opportunity.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {opportunity.location}
                          </span>
                          {opportunity.duration && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {opportunity.duration}
                            </span>
                          )}
                          {opportunity.salary && (
                            <span className="font-medium text-foreground">{opportunity.salary}</span>
                          )}
                          {opportunity.stipend && (
                            <span className="font-medium text-foreground">{opportunity.stipend}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {opportunity.applications} applications
                          </span>
                          <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          {opportunity.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewOpportunity(opportunity)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditOpportunity(opportunity.id)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive bg-transparent"
                          onClick={() => handleDeleteOpportunity(opportunity)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs keep filtered or placeholder content as needed */}
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Opportunities</CardTitle>
                <CardDescription>Currently open positions accepting applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunities
                    .filter((opp) => opp.status === "ACTIVE")
                    .map((opportunity) => (
                      <div key={opportunity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={`/placeholder-icon.png?height=48&width=48&text=${opportunity.company.name[0]}`}
                          />
                          <AvatarFallback>{opportunity.company.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{opportunity.title}</h3>
                          <p className="text-sm text-muted-foreground">{opportunity.company.name}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{opportunity.applications} applications</span>
                          </div>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Review</CardTitle>
                <CardDescription>Opportunities awaiting admin approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunities
                    .filter((opp) => opp.status === "PENDING")
                    .map((opportunity) => (
                      <div key={opportunity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={`/placeholder-icon.png?height=48&width=48&text=${opportunity.company.name[0]}`}
                          />
                          <AvatarFallback>{opportunity.company.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{opportunity.title}</h3>
                          <p className="text-sm text-muted-foreground">{opportunity.company.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Reject
                          </Button>
                          <Button size="sm">Approve</Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="closed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Closed Opportunities</CardTitle>
                <CardDescription>Expired or completed opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No closed opportunities to display.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Opportunity Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Opportunity Details</DialogTitle>
              <DialogDescription>
                Detailed information for {viewingOpportunity?.title}
              </DialogDescription>
            </DialogHeader>
            {viewingOpportunity && (
              <div className="space-y-6 py-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={`/placeholder-icon.png?height=64&width=64&text=${viewingOpportunity.companyLogo}`}
                    />
                    <AvatarFallback className="text-xl">{viewingOpportunity.companyLogo}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{viewingOpportunity.title}</h3>
                    <p className="text-lg text-muted-foreground">{viewingOpportunity.company}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          viewingOpportunity.status === "Active"
                            ? "default"
                            : viewingOpportunity.status === "Closing Soon"
                              ? "destructive"
                              : viewingOpportunity.status === "Under Review"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {viewingOpportunity.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Location</h4>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {viewingOpportunity.location}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Type</h4>
                    <p className="text-muted-foreground">{viewingOpportunity.type}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Duration</h4>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {viewingOpportunity.duration}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Salary/Stipend</h4>
                    <p className="text-muted-foreground font-medium">{viewingOpportunity.salary}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Deadline</h4>
                    <p className="text-muted-foreground">
                      {new Date(viewingOpportunity.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Posted Date</h4>
                    <p className="text-muted-foreground">
                      {new Date(viewingOpportunity.postedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Skills Required</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingOpportunity.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <Users className="w-6 h-6 mx-auto text-muted-foreground" />
                      <p className="text-2xl font-bold mt-2">{viewingOpportunity.applications}</p>
                      <p className="text-sm text-muted-foreground">Applications</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <Eye className="w-6 h-6 mx-auto text-muted-foreground" />
                      <p className="text-2xl font-bold mt-2">{viewingOpportunity.views}</p>
                      <p className="text-sm text-muted-foreground">Views</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <TrendingUp className="w-6 h-6 mx-auto text-muted-foreground" />
                      <p className="text-2xl font-bold mt-2">
                        {viewingOpportunity.applications && viewingOpportunity.views
                          ? Math.round((viewingOpportunity.applications / viewingOpportunity.views) * 100)
                          : 0}
                        %
                      </p>
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Opportunity</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this opportunity? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {deletingOpportunity && (
              <div className="space-y-4">
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <p className="text-destructive font-medium">
                    Warning: This will permanently delete the opportunity "{deletingOpportunity.title}" and all associated data.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmDeleteOpportunity}>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}