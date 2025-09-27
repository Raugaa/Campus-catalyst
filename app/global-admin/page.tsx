"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  GraduationCap, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight 
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useAuth } from "@/lib/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function GlobalAdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Redirect to login if not authenticated as global admin
    if (!loading && (!user || user.role !== "global-admin")) {
      router.push("/auth/login?role=global-admin")
    }
  }, [user, loading, router])

  // Mock data for demonstration
  const instituteRequests = [
    { id: 1, name: "IIT Bombay", email: "admin@iitb.ac.in", status: "pending" },
    { id: 2, name: "IIM Ahmedabad", email: "admin@iima.ac.in", status: "approved" },
    { id: 3, name: "NIT Trichy", email: "admin@nitt.edu", status: "pending" },
  ]

  const companyRequests = [
    { id: 1, name: "Google Inc.", email: "careers@google.com", status: "pending" },
    { id: 2, name: "Microsoft", email: "jobs@microsoft.com", status: "approved" },
    { id: 3, name: "Amazon", email: "careers@amazon.com", status: "rejected" },
  ]

  // Show loading state
  if (loading || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Check if user is global admin
  if (!user || user.role !== "global-admin") {
    return null // Will be redirected by useEffect
  }

  return (
    <DashboardLayout userRole="global-admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Global Admin Dashboard</h1>
          <p className="text-gray-600">Manage and oversee all registered institutions and companies</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-500" />
                Total Institutes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-green-500" />
                Active Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">3 institutes, 2 companies</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Institute Registration Requests</CardTitle>
              <CardDescription>Review and approve new institute registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {instituteRequests.map((institute) => (
                  <div key={institute.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{institute.name}</h4>
                        <p className="text-sm text-gray-600">{institute.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {institute.status === "pending" && (
                        <Link href="/global-admin/institutes">
                          <Button variant="outline" size="sm">Review</Button>
                        </Link>
                      )}
                      {institute.status === "approved" && (
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Approved
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Verification Requests</CardTitle>
              <CardDescription>Review and verify company registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companyRequests.map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Building2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{company.name}</h4>
                        <p className="text-sm text-gray-600">{company.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {company.status === "pending" && (
                        <Link href="/global-admin/companies">
                          <Button variant="outline" size="sm">Review</Button>
                        </Link>
                      )}
                      {company.status === "approved" && (
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Verified
                        </span>
                      )}
                      {company.status === "rejected" && (
                        <span className="text-sm text-red-600 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}