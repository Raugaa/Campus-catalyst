"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Globe,
  CheckCircle,
  XCircle,
  FileText
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function CompanyVerification() {
  // Mock company data
  const companyData = {
    id: 1,
    name: "TechCorp Solutions Pvt. Ltd.",
    email: "careers@techcorp.com",
    phone: "+91 22 2345 6789",
    address: "TechCorp Towers, Bandra-Kurla Complex, Mumbai, Maharashtra 400051",
    website: "https://www.techcorp.com",
    established: "2010",
    industry: "Information Technology",
    employeeCount: "500-1000",
    contactPerson: "Priya Menon",
    contactEmail: "priya.menon@techcorp.com",
    contactPhone: "+91 22 2345 6790",
    registrationDocs: [
      { name: "Company Registration Certificate", status: "verified" },
      { name: "Tax Identification Number", status: "verified" },
      { name: "Business License", status: "pending" }
    ]
  }

  const handleApprove = () => {
    // Handle company approval logic
    console.log("Company approved")
  }

  const handleReject = () => {
    // Handle company rejection logic
    console.log("Company rejected")
  }

  return (
    <DashboardLayout userRole="global-admin">
      <div className="space-y-6">
        <div>
          <Link href="/global-admin" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-2">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Company Verification</h1>
          <p className="text-gray-600">Review and verify company registration details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  Company Information
                </CardTitle>
                <CardDescription>Basic details about the company</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">{companyData.name}</div>
                  </div>
                  <div>
                    <Label>Industry</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">{companyData.industry}</div>
                  </div>
                  <div>
                    <Label>Established</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">{companyData.established}</div>
                  </div>
                  <div>
                    <Label>Employee Count</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">{companyData.employeeCount}</div>
                  </div>
                </div>
                
                <div>
                  <Label>Address</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    {companyData.address}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Website</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      {companyData.website}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  Registration Documents
                </CardTitle>
                <CardDescription>Submitted documents for verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {companyData.registrationDocs.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{doc.name}</span>
                    </div>
                    <div>
                      {doc.status === "verified" && (
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Verified
                        </span>
                      )}
                      {doc.status === "pending" && (
                        <span className="text-sm text-yellow-600">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contact and Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-500" />
                  Primary Contact
                </CardTitle>
                <CardDescription>Company representative details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Contact Person</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {companyData.contactPerson}
                  </div>
                </div>
                
                <div>
                  <Label>Email</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {companyData.contactEmail}
                  </div>
                </div>
                
                <div>
                  <Label>Phone</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {companyData.contactPhone}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Actions</CardTitle>
                <CardDescription>Review and process this company registration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={handleApprove}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Company
                  </Button>
                  <Button 
                    onClick={handleReject}
                    variant="destructive"
                    className="w-full"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Registration
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <Label className="mb-2 block">Verification Notes</Label>
                  <Textarea 
                    placeholder="Add notes about the verification process, documents checked, or any concerns..." 
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}