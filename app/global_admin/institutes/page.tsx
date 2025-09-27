"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Key,
  CheckCircle,
  XCircle
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function InstituteRegistration() {
  // Mock institute data
  const instituteData = {
    id: 1,
    name: "Indian Institute of Technology Bombay",
    email: "admin@iitb.ac.in",
    phone: "+91 22 2576 6000",
    address: "IIT Bombay, Powai, Mumbai, Maharashtra 400076",
    website: "https://www.iitb.ac.in",
    established: "1958",
    type: "Public",
    accreditation: "NAAC A++",
    adminName: "Dr. Rajesh Sharma",
    adminEmail: "rajesh.sharma@iitb.ac.in",
    adminPhone: "+91 22 2576 6001",
  }

  const handleApprove = () => {
    // Handle institute approval logic
    console.log("Institute approved")
  }

  const handleReject = () => {
    // Handle institute rejection logic
    console.log("Institute rejected")
  }

  return (
    <DashboardLayout userRole="global_admin">
      <div className="space-y-6">
        <div>
          <Link href="/global-admin" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-2">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Institute Registration</h1>
          <p className="text-gray-600">Review and approve institute registration request</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Institute Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  Institute Information
                </CardTitle>
                <CardDescription>Basic details about the institution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Institute Name</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">{instituteData.name}</div>
                  </div>
                  <div>
                    <Label>Established</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">{instituteData.established}</div>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">{instituteData.type}</div>
                  </div>
                  <div>
                    <Label>Accreditation</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">{instituteData.accreditation}</div>
                  </div>
                </div>
                
                <div>
                  <Label>Address</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    {instituteData.address}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Website</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">{instituteData.website}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Credentials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-yellow-500" />
                  Admin Credentials
                </CardTitle>
                <CardDescription>Initial login credentials for placement cell admin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input id="admin-email" type="email" defaultValue={instituteData.adminEmail} />
                  </div>
                  <div>
                    <Label htmlFor="admin-password">Temporary Password</Label>
                    <Input id="admin-password" type="text" defaultValue="tempPass123!" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  These credentials will be sent to the institute's admin email for initial login.
                  They will be required to change the password on first login.
                </p>
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
                <CardDescription>Institute administrator details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {instituteData.adminName}
                  </div>
                </div>
                
                <div>
                  <Label>Email</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {instituteData.adminEmail}
                  </div>
                </div>
                
                <div>
                  <Label>Phone</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {instituteData.adminPhone}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Review and process this registration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={handleApprove}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Registration
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
                  <Label className="mb-2 block">Add Notes (Optional)</Label>
                  <Textarea 
                    placeholder="Add any additional notes or comments about this registration..." 
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