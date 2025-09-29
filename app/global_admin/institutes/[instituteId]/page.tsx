"use client"

import { useState, useEffect } from "react"
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
  GraduationCap,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  X,
  Plus
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { toast } from "sonner"

// Define the institute data type
interface InstituteData {
  id: number;
  name: string;
  shortCode: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  established: string;
  type: string;
  image: string;
  adminName?: string;
  adminEmail?: string;
  adminPhone?: string;
}

// Mock institute data
const mockInstituteData: Record<number, InstituteData> = {
  1: {
    id: 1,
    name: "Indian Institute of Technology Bombay",
    shortCode: "IITB",
    email: "admin@iitb.ac.in",
    phone: "+91 22 2576 6000",
    address: "IIT Bombay, Powai, Mumbai, Maharashtra 400076",
    website: "https://www.iitb.ac.in",
    established: "1958",
    type: "Public",
    image: "/placeholder-college-1.jpg"
  },
  2: {
    id: 2,
    name: "Indian Institute of Management Ahmedabad",
    shortCode: "IIMA",
    email: "admin@iima.ac.in",
    phone: "+91 79 2630 4567",
    address: "IIM Ahmedabad, Vastrapur, Ahmedabad, Gujarat 380015",
    website: "https://www.iima.ac.in",
    established: "1961",
    type: "Public",
    image: "/placeholder-college-2.jpg"
  },
  3: {
    id: 3,
    name: "National Institute of Technology Trichy",
    shortCode: "NITT",
    email: "admin@nitt.edu",
    phone: "+91 431 250 3475",
    address: "NIT Trichy, Tiruchirappalli, Tamil Nadu 620015",
    website: "https://www.nitt.edu",
    established: "1964",
    type: "Public",
    image: "/placeholder-college-3.jpg"
  },
  4: {
    id: 4,
    name: "Birla Institute of Technology and Science",
    shortCode: "BITS",
    email: "admin@bits-pilani.ac.in",
    phone: "+91 1596 242 245",
    address: "BITS Pilani, Rajasthan 333031",
    website: "https://www.bits-pilani.ac.in",
    established: "1964",
    type: "Private",
    image: "/placeholder-college-4.jpg"
  }
}

// Predefined branches
const predefinedBranches = [
  "Computer Engineering",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
  "Chemical",
  "Biotechnology",
  "Aerospace",
  "Industrial"
]

export default function InstituteDetailPage({ params }: { params: { instituteId: string } }) {
  const [instituteData, setInstituteData] = useState<InstituteData | null>(null)
  const [adminCredentials, setAdminCredentials] = useState({
    email: "",
    password: ""
  })
  const [showAdminCreated, setShowAdminCreated] = useState(false)
  const [isAdminCreated, setIsAdminCreated] = useState(false)
  const [branches, setBranches] = useState<string[]>(["Computer Engineering", "Information Technology"])
  const [newBranch, setNewBranch] = useState("")

  useEffect(() => {
    const institute = mockInstituteData[parseInt(params.instituteId)]
    if (institute) {
      setInstituteData(institute)
      // Generate initial admin credentials
      const generatedEmail = `admin@${institute.shortCode.toLowerCase()}.edu`
      const generatedPassword = `${institute.shortCode.toLowerCase()}@2025`
      setAdminCredentials({
        email: generatedEmail,
        password: generatedPassword
      })
    }
  }, [params.instituteId])

  const handleAddAdmin = () => {
    if (instituteData) {
      // In a real app, this would call an API to create the admin
      console.log(`Admin created for ${instituteData.name}`)
      // setShowAdminCreated(true)
      setIsAdminCreated(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowAdminCreated(false)
      }, 3000)
      
      toast(`Admin account created for ${instituteData.name}!\nEmail: ${adminCredentials.email}\nPassword: ${adminCredentials.password}`)
    }
  }

  const handleAddBranch = () => {
    if (newBranch.trim() && !branches.includes(newBranch.trim())) {
      setBranches([...branches, newBranch.trim()])
      setNewBranch("")
    }
  }

  const handleRemoveBranch = (branch: string) => {
    setBranches(branches.filter(b => b !== branch))
  }

  const handleAddPredefinedBranch = (branch: string) => {
    if (!branches.includes(branch)) {
      setBranches([...branches, branch])
    }
  }

  if (!instituteData) {
    return (
      <DashboardLayout userRole="global_admin">
        <div className="flex items-center justify-center h-64">
          <p>Institute not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="global_admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Institute Details</h1>
            <p className="text-gray-600">View and manage institute information</p>
          </div>
          <div className="flex gap-2">
            {/* Themed button for Back to Institutes */}
            <Link href="/global_admin/institutes/list">
              <Button variant="outline" className="flex items-center gap-2">
                <span>Back to Institutes</span>
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

        {/* Admin Created Success Message */}
        {showAdminCreated && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center animate-pulse">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-600 mb-2">Admin Created!</h2>
              <p className="text-gray-600">Admin account for {instituteData.name} has been created successfully.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Institute Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  Institute Information
                </CardTitle>
                <CardDescription>Basic details about the institution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{instituteData.name}</h3>
                    <p className="text-gray-600">{instituteData.shortCode}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Institute Type</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">{instituteData.type}</div>
                  </div>
                  <div>
                    <Label>Established</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">{instituteData.established}</div>
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

            {/* Branches Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-green-500" />
                  Academic Branches
                </CardTitle>
                <CardDescription>Manage the academic branches offered by this institute</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add new branch */}
                <div className="flex gap-2">
                  <Input
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                    placeholder="Enter a new branch name"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddBranch()}
                  />
                  <Button onClick={handleAddBranch} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>

                {/* Predefined branches */}
                <div>
                  <Label className="mb-2 block">Quick Add:</Label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedBranches.map((branch) => (
                      <Button
                        key={branch}
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddPredefinedBranch(branch)}
                        disabled={branches.includes(branch)}
                        className="text-xs"
                      >
                        {branch}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Current branches */}
                <div>
                  <Label className="mb-2 block">Current Branches:</Label>
                  {branches.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {branches.map((branch, index) => (
                        <div 
                          key={index} 
                          className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                        >
                          {branch}
                          <button 
                            onClick={() => handleRemoveBranch(branch)}
                            className="ml-2 text-primary hover:text-primary/80"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No branches added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact and Admin Creation */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-500" />
                  Contact Information
                </CardTitle>
                <CardDescription>Institute contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {instituteData.email}
                  </div>
                </div>
                
                <div>
                  <Label>Phone</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {instituteData.phone}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-yellow-500" />
                  Admin Account
                </CardTitle>
                <CardDescription>Create admin credentials for placement cell</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isAdminCreated ? (
                  <div className="text-center py-4">
                    <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                      <CheckCircle className="h-6 w-6" />
                      <span className="text-lg font-semibold">Admin Created</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Admin account has been created successfully.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <Input 
                        id="admin-email" 
                        type="email" 
                        value={adminCredentials.email} 
                        readOnly 
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin-password">Temporary Password</Label>
                      <Input 
                        id="admin-password" 
                        type="text" 
                        value={adminCredentials.password} 
                        readOnly 
                      />
                    </div>
                    <Button 
                      onClick={handleAddAdmin}
                      className="w-full flex items-center gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Create Admin Account
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                      This will create an admin account for the institute's placement cell.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}