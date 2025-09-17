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
  Download,
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

export default function AdminCompanies() {
  const companies = [
    {
      id: 1,
      name: "TechCorp Inc.",
      email: "hr@techcorp.com",
      website: "www.techcorp.com",
      location: "San Francisco, CA",
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
      name: "DataSoft Solutions",
      email: "careers@datasoft.com",
      website: "www.datasoft.com",
      location: "New York, NY",
      industry: "Data Analytics",
      size: "200-500 employees",
      status: "Active",
      joinedDate: "Mar 2024",
      activeJobs: 5,
      totalApplications: 89,
      hiredStudents: 8,
      description: "Data analytics and machine learning solutions provider.",
      logo: "DS",
    },
    {
      id: 3,
      name: "WebFlow Agency",
      email: "jobs@webflow.com",
      website: "www.webflow.com",
      location: "Austin, TX",
      industry: "Digital Marketing",
      size: "10-50 employees",
      status: "Pending",
      joinedDate: "Nov 2024",
      activeJobs: 3,
      totalApplications: 45,
      hiredStudents: 2,
      description: "Creative digital marketing and web development agency.",
      logo: "WA",
    },
    {
      id: 4,
      name: "CloudTech Systems",
      email: "hr@cloudtech.com",
      website: "www.cloudtech.com",
      location: "Seattle, WA",
      industry: "Cloud Computing",
      size: "500+ employees",
      status: "Inactive",
      joinedDate: "Sep 2023",
      activeJobs: 0,
      totalApplications: 234,
      hiredStudents: 18,
      description: "Enterprise cloud computing and infrastructure solutions.",
      logo: "CS",
    },
  ]

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
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
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
                  <Input placeholder="Search companies..." className="pl-10" />
                </div>
              </div>
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
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Companies</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {companies.map((company) => (
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
