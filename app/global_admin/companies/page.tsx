"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Building2, 
  Search, 
  CheckCircle2,
  XCircle,
  Eye,
  Users,
  MapPin,
  Filter,
  CheckCheck
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/dashboard-layout"

// Mock company data - keeping consistent names with the detail pages
const initialCompanies = [
  {
    id: 1,
    name: "TechCorp Solutions Pvt. Ltd.",
    sector: "Information Technology",
    location: "Mumbai, Maharashtra",
    status: "pending" as "pending" | "approved" | "rejected",
    established: "2010",
    employeeCount: "500-1000"
  },
  {
    id: 2,
    name: "Innovatech Industries",
    sector: "Manufacturing",
    location: "Bangalore, Karnataka",
    status: "approved" as "pending" | "approved" | "rejected",
    established: "2005",
    employeeCount: "1000-5000"
  },
  {
    id: 3,
    name: "FinServe Global",
    sector: "Financial Services",
    location: "Delhi, India",
    status: "pending" as "pending" | "approved" | "rejected",
    established: "2015",
    employeeCount: "200-500"
  },
  {
    id: 4,
    name: "HealthPlus Medical",
    sector: "Healthcare",
    location: "Chennai, Tamil Nadu",
    status: "rejected" as "pending" | "approved" | "rejected",
    established: "2008",
    employeeCount: "500-1000"
  },
  {
    id: 5,
    name: "EduLearn Academy",
    sector: "Education",
    location: "Hyderabad, Telangana",
    status: "approved" as "pending" | "approved" | "rejected",
    established: "2012",
    employeeCount: "100-200"
  },
  {
    id: 6,
    name: "GreenEnergy Solutions",
    sector: "Renewable Energy",
    location: "Pune, Maharashtra",
    status: "pending" as "pending" | "approved" | "rejected",
    established: "2018",
    employeeCount: "50-100"
  }
]

export default function CompaniesVerification() {
  const [companies, setCompanies] = useState(initialCompanies)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Filter companies based on search term and status
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           company.sector.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           company.location.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === "all" || company.status === filterStatus
      
      return matchesSearch && matchesStatus
    })
  }, [companies, searchTerm, filterStatus])

  // Group companies by status
  const companiesByStatus = useMemo(() => {
    const pending = filteredCompanies.filter(company => company.status === "pending")
    const approved = filteredCompanies.filter(company => company.status === "approved")
    const rejected = filteredCompanies.filter(company => company.status === "rejected")
    
    return { pending, approved, rejected }
  }, [filteredCompanies])

  const handleApprove = (companyId: number) => {
    const company = companies.find(c => c.id === companyId)
    if (company) {
      console.log(`Approved company: ${company.name}`)
      // Update company status dynamically
      setCompanies(prev => 
        prev.map(c => 
          c.id === companyId ? {...c, status: "approved" as const} : c
        )
      )
      // In a real app, this would call an API to update the company status
      alert(`Company ${company.name} has been approved!`)
    }
  }

  const handleReject = (companyId: number) => {
    const company = companies.find(c => c.id === companyId)
    if (company) {
      console.log(`Rejected company: ${company.name}`)
      // Update company status dynamically
      setCompanies(prev => 
        prev.map(c => 
          c.id === companyId ? {...c, status: "rejected" as const} : c
        )
      )
      // In a real app, this would call an API to update the company status
      alert(`Company ${company.name} has been rejected!`)
    }
  }

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: companies.length,
      pending: companies.filter(c => c.status === "pending").length,
      approved: companies.filter(c => c.status === "approved").length,
      rejected: companies.filter(c => c.status === "rejected").length
    }
  }, [companies])

  return (
    <DashboardLayout userRole="global_admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Verification</h1>
            <p className="text-gray-600">Review and verify company registrations</p>
          </div>
          {/* Themed button for Back to Dashboard */}
          <Link href="/global_admin">
            <Button variant="outline" className="flex items-center gap-2">
              <span>Back to Dashboard</span>
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <Filter className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search companies by name, sector, or location..." 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={filterStatus === "all" ? "default" : "outline"} 
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button 
                  variant={filterStatus === "pending" ? "default" : "outline"} 
                  onClick={() => setFilterStatus("pending")}
                >
                  Pending
                </Button>
                <Button 
                  variant={filterStatus === "approved" ? "default" : "outline"} 
                  onClick={() => setFilterStatus("approved")}
                >
                  Approved
                </Button>
                <Button 
                  variant={filterStatus === "rejected" ? "default" : "outline"} 
                  onClick={() => setFilterStatus("rejected")}
                >
                  Rejected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Companies List */}
        <div className="space-y-8">
          {/* Pending Companies */}
          {companiesByStatus.pending.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5 text-yellow-500" />
                Pending Verification ({companiesByStatus.pending.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companiesByStatus.pending.map(company => (
                  <CompanyCard 
                    key={company.id} 
                    company={company} 
                    onApprove={handleApprove} 
                    onReject={handleReject} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Approved Companies */}
          {companiesByStatus.approved.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Approved Companies ({companiesByStatus.approved.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companiesByStatus.approved.map(company => (
                  <CompanyCard 
                    key={company.id} 
                    company={company} 
                    onApprove={handleApprove} 
                    onReject={handleReject} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Rejected Companies */}
          {companiesByStatus.rejected.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Rejected Companies ({companiesByStatus.rejected.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companiesByStatus.rejected.map(company => (
                  <CompanyCard 
                    key={company.id} 
                    company={company} 
                    onApprove={handleApprove} 
                    onReject={handleReject} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredCompanies.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No companies found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

// Company Card Component
function CompanyCard({ company, onApprove, onReject }: { 
  company: typeof initialCompanies[0], 
  onApprove: (id: number) => void, 
  onReject: (id: number) => void 
}) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            {company.name}
          </CardTitle>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            company.status === "approved" 
              ? "bg-green-100 text-green-800" 
              : company.status === "rejected" 
                ? "bg-red-100 text-red-800" 
                : "bg-yellow-100 text-yellow-800"
          }`}>
            {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
          </span>
        </div>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {company.location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Sector</p>
            <p className="font-medium">{company.sector}</p>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm" asChild>
              {/* Fixed the link to match the correct routing structure */}
              <Link href={`/global_admin/companies/${company.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </Button>
            
            {company.status === "pending" && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => onReject(company.id)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onApprove(company.id)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {company.status === "approved" && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCheck className="h-4 w-4" />
                <span className="text-sm">Verified</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}