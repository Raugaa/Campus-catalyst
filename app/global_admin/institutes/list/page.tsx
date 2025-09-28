"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Building2, 
  Search, 
  Filter,
  PlusCircle,
  MapPin,
  Globe,
  GraduationCap
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/dashboard-layout"

// Mock institute data
const mockInstitutes = [
  {
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
  {
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
  {
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
  {
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
]

export default function InstitutesList() {
  const [institutes] = useState(mockInstitutes)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredInstitutes = institutes.filter(institute => {
    const matchesSearch = institute.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          institute.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || institute.type.toLowerCase() === filterType.toLowerCase()
    return matchesSearch && matchesFilter
  })

  return (
    <DashboardLayout userRole="global_admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Institutes</h1>
            <p className="text-gray-600">Manage registered educational institutions</p>
          </div>
          <div className="flex gap-2">
            {/* Themed button for Add Institute */}
            <Link href="/global_admin/institutes/add">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Add Institute</span>
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

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search institutes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">All Types</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        {/* Institutes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutes.map((institute) => (
            <Card key={institute.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-blue-500" />
                      {institute.name}
                    </CardTitle>
                    <CardDescription>{institute.shortCode}</CardDescription>
                  </div>
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{institute.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="h-4 w-4" />
                  <span className="truncate">{institute.website}</span>
                </div>
                <div className="pt-2">
                  <Link href={`/global_admin/institutes/${institute.id}`}>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInstitutes.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No institutes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}