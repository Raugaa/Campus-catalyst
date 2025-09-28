"use client"

import { useState, useEffect } from "react"
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
  FileText,
  CheckCheck,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/dashboard-layout"

// Define the company data type
interface Document {
  name: string;
  status: "verified" | "pending";
}

interface CompanyData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  established: string;
  industry: string;
  employeeCount: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  registrationDocs: Document[];
}

// Mock company data - keeping consistent names with the companies list
const mockCompanyData: Record<number, CompanyData> = {
  1: {
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
  },
  2: {
    id: 2,
    name: "Innovatech Industries",
    email: "info@innovatech.com",
    phone: "+91 80 2345 6789",
    address: "Innovatech Park, Electronic City, Bangalore, Karnataka 560100",
    website: "https://www.innovatech.com",
    established: "2005",
    industry: "Manufacturing",
    employeeCount: "1000-5000",
    contactPerson: "Rajesh Kumar",
    contactEmail: "rajesh.kumar@innovatech.com",
    contactPhone: "+91 80 2345 6790",
    registrationDocs: [
      { name: "Company Registration Certificate", status: "verified" },
      { name: "Tax Identification Number", status: "verified" },
      { name: "Business License", status: "verified" }
    ]
  },
  3: {
    id: 3,
    name: "FinServe Global",
    email: "support@finserve.com",
    phone: "+91 11 2345 6789",
    address: "FinServe Tower, Connaught Place, Delhi 110001",
    website: "https://www.finserve.com",
    established: "2015",
    industry: "Financial Services",
    employeeCount: "200-500",
    contactPerson: "Anjali Mehta",
    contactEmail: "anjali.mehta@finserve.com",
    contactPhone: "+91 11 2345 6790",
    registrationDocs: [
      { name: "Company Registration Certificate", status: "verified" },
      { name: "Tax Identification Number", status: "pending" },
      { name: "Business License", status: "pending" }
    ]
  },
  4: {
    id: 4,
    name: "HealthPlus Medical",
    email: "careers@healthplus.com",
    phone: "+91 44 2345 6789",
    address: "HealthPlus House, Guindy, Chennai, Tamil Nadu 600032",
    website: "https://www.healthplus.com",
    established: "2008",
    industry: "Healthcare",
    employeeCount: "500-1000",
    contactPerson: "Dr. Suresh Rajan",
    contactEmail: "suresh.rajan@healthplus.com",
    contactPhone: "+91 44 2345 6790",
    registrationDocs: [
      { name: "Company Registration Certificate", status: "verified" },
      { name: "Tax Identification Number", status: "verified" },
      { name: "Business License", status: "verified" }
    ]
  },
  5: {
    id: 5,
    name: "EduLearn Academy",
    email: "info@edulearn.com",
    phone: "+91 40 2345 6789",
    address: "EduLearn Campus, HITEC City, Hyderabad, Telangana 500081",
    website: "https://www.edulearn.com",
    established: "2012",
    industry: "Education",
    employeeCount: "100-200",
    contactPerson: "Meera Nair",
    contactEmail: "meera.nair@edulearn.com",
    contactPhone: "+91 40 2345 6790",
    registrationDocs: [
      { name: "Company Registration Certificate", status: "verified" },
      { name: "Tax Identification Number", status: "verified" },
      { name: "Business License", status: "verified" }
    ]
  },
  6: {
    id: 6,
    name: "GreenEnergy Solutions",
    email: "contact@greenenergy.com",
    phone: "+91 20 2345 6789",
    address: "GreenEnergy Park, Hinjewadi, Pune, Maharashtra 411057",
    website: "https://www.greenenergy.com",
    established: "2018",
    industry: "Renewable Energy",
    employeeCount: "50-100",
    contactPerson: "Vikram Desai",
    contactEmail: "vikram.desai@greenenergy.com",
    contactPhone: "+91 20 2345 6790",
    registrationDocs: [
      { name: "Company Registration Certificate", status: "verified" },
      { name: "Tax Identification Number", status: "pending" },
      { name: "Business License", status: "pending" }
    ]
  }
}

export default function CompanyDetailPage({ params }: { params: { companyId: string } }) {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [isRejected, setIsRejected] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    const company = mockCompanyData[parseInt(params.companyId)]
    if (company) {
      setCompanyData(company)
      // Check if company is already approved (for demo purposes)
      setIsVerified(company.id === 2 || company.id === 4 || company.id === 5)
    }
  }, [params.companyId])

  const handleApprove = () => {
    if (companyData) {
      // Handle company approval logic
      console.log(`Company ${companyData.name} approved`)
      setIsVerified(true)
      setIsRejected(false)
      setShowSuccessMessage(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
      
      // In a real app, this would call an API to update the company status
      // alert(`Company ${companyData.name} has been approved!`)
    }
  }

  const handleReject = () => {
    if (companyData) {
      // Handle company rejection logic
      console.log(`Company ${companyData.name} rejected`)
      setIsRejected(true)
      setIsVerified(false)
      setShowSuccessMessage(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
      
      // In a real app, this would call an API to update the company status
      // alert(`Company ${companyData.name} has been rejected!`)
    }
  }

  if (!companyData) {
    return (
      <DashboardLayout userRole="global_admin">
        <div className="flex items-center justify-center h-64">
          <p>Company not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="global_admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Details</h1>
            <p className="text-gray-600">Review and verify company registration details</p>
          </div>
          <div className="flex gap-2">
            {/* Themed button for Back to Companies */}
            <Link href="/global_admin/companies">
              <Button variant="outline" className="flex items-center gap-2">
                <span>Back to Companies</span>
              </Button>
            </Link>
            {/* Themed button for Back to Dashboard */}
            <Link href="/global_admin">
              <Button variant="outline" className="flex items-center gap-2">
                <span>Back to Dashboard</span>
              </Button>
            </Link>
          </div>
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
                {companyData.registrationDocs.map((doc: Document, index: number) => (
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
                {showSuccessMessage ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-green-600">Action Completed!</p>
                    <p className="text-sm text-muted-foreground">Processing your request...</p>
                  </div>
                ) : isVerified ? (
                  <div className="text-center py-4">
                    <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                      <CheckCheck className="h-6 w-6" />
                      <span className="text-lg font-semibold">Company Verified</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This company has been successfully verified and approved.
                    </p>
                  </div>
                ) : isRejected ? (
                  <div className="text-center py-4">
                    <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                      <XCircle className="h-6 w-6" />
                      <span className="text-lg font-semibold">Registration Rejected</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This company registration has been rejected.
                    </p>
                  </div>
                ) : (
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
                )}
                
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