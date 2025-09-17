import DashboardLayout from "@/components/layout/dashboard-layout"
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

export default function AdminOpportunities() {
  const opportunities = [
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "TechCorp Inc.",
      companyLogo: "TC",
      location: "San Francisco, CA",
      type: "Internship",
      duration: "3 months",
      applications: 45,
      views: 234,
      status: "Active",
      postedDate: "2024-01-10",
      deadline: "2024-02-15",
      salary: "$5000/month",
      skills: ["JavaScript", "React", "Node.js"],
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "DataSoft Solutions",
      companyLogo: "DS",
      location: "New York, NY",
      type: "Internship",
      duration: "4 months",
      applications: 32,
      views: 189,
      status: "Active",
      postedDate: "2024-01-08",
      deadline: "2024-02-20",
      salary: "$4800/month",
      skills: ["Python", "Machine Learning", "SQL"],
    },
    {
      id: 3,
      title: "Frontend Developer Intern",
      company: "WebFlow Agency",
      companyLogo: "WA",
      location: "Remote",
      type: "Internship",
      duration: "3 months",
      applications: 28,
      views: 156,
      status: "Closing Soon",
      postedDate: "2024-01-05",
      deadline: "2024-01-25",
      salary: "$4500/month",
      skills: ["React", "TypeScript", "CSS"],
    },
    {
      id: 4,
      title: "DevOps Engineering Intern",
      company: "CloudTech Systems",
      companyLogo: "CS",
      location: "Austin, TX",
      type: "Internship",
      duration: "6 months",
      applications: 19,
      views: 98,
      status: "Under Review",
      postedDate: "2024-01-12",
      deadline: "2024-03-01",
      salary: "$5200/month",
      skills: ["AWS", "Docker", "Kubernetes"],
    },
    {
      id: 5,
      title: "UX Design Intern",
      company: "DesignStudio Pro",
      companyLogo: "DP",
      location: "Los Angeles, CA",
      type: "Internship",
      duration: "4 months",
      applications: 41,
      views: 203,
      status: "Paused",
      postedDate: "2024-01-03",
      deadline: "2024-02-10",
      salary: "$4200/month",
      skills: ["Figma", "User Research", "Prototyping"],
    },
  ]

  const stats = [
    { title: "Total Opportunities", value: "156", change: "+12 this month", icon: Briefcase },
    { title: "Active Postings", value: "89", change: "+5 this week", icon: TrendingUp },
    { title: "Total Applications", value: "2,341", change: "+234 this week", icon: Users },
    { title: "Pending Reviews", value: "23", change: "7 urgent", icon: AlertCircle },
  ]

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

        {/* Stats Cards */}
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

        <Tabs defaultValue="all" className="space-y-4">
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
                <Input placeholder="Search opportunities..." className="pl-8 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
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
                  {opportunities.map((opportunity) => (
                    <div
                      key={opportunity.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={`/placeholder-icon.png?height=48&width=48&text=${opportunity.companyLogo}`}
                        />
                        <AvatarFallback>{opportunity.companyLogo}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {opportunity.company}
                            </p>
                          </div>
                          <Badge
                            variant={
                              opportunity.status === "Active"
                                ? "default"
                                : opportunity.status === "Closing Soon"
                                  ? "destructive"
                                  : opportunity.status === "Under Review"
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
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {opportunity.duration}
                          </span>
                          <span className="font-medium text-foreground">{opportunity.salary}</span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {opportunity.applications} applications
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {opportunity.views} views
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
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive bg-transparent"
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

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Opportunities</CardTitle>
                <CardDescription>Currently open positions accepting applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunities
                    .filter((opp) => opp.status === "Active")
                    .map((opportunity) => (
                      <div key={opportunity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={`/placeholder-icon.png?height=48&width=48&text=${opportunity.companyLogo}`}
                          />
                          <AvatarFallback>{opportunity.companyLogo}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{opportunity.title}</h3>
                          <p className="text-sm text-muted-foreground">{opportunity.company}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{opportunity.applications} applications</span>
                            <span>{opportunity.views} views</span>
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
                    .filter((opp) => opp.status === "Under Review")
                    .map((opportunity) => (
                      <div key={opportunity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={`/placeholder-icon.png?height=48&width=48&text=${opportunity.companyLogo}`}
                          />
                          <AvatarFallback>{opportunity.companyLogo}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{opportunity.title}</h3>
                          <p className="text-sm text-muted-foreground">{opportunity.company}</p>
                          <p className="text-xs text-muted-foreground">
                            Posted: {new Date(opportunity.postedDate).toLocaleDateString()}
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
      </div>
    </DashboardLayout>
  )
}
