"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Building2, 
  Upload,
  PlusCircle
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function AddInstitute() {
  const [formData, setFormData] = useState({
    name: "",
    shortCode: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    type: "",
    image: null as File | null
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API to create the institute
    console.log("Institute data submitted:", formData)
    alert(`Institute ${formData.name} has been added successfully!`)
    // Redirect to institutes list
    window.location.href = "/global_admin/institutes/list"
  }

  return (
    <DashboardLayout userRole="global_admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Institute</h1>
            <p className="text-gray-600">Register a new educational institution</p>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-500" />
              Institute Information
            </CardTitle>
            <CardDescription>Enter the basic details of the educational institution</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Institute Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full institute name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shortCode">Short Code *</Label>
                  <Input
                    id="shortCode"
                    name="shortCode"
                    value={formData.shortCode}
                    onChange={handleChange}
                    placeholder="Enter short code (e.g., IITB)"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter contact email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter contact phone"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Institute Type *</Label>
                  <Input
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder="Enter institute type (e.g., Public, Private)"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website *</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="Enter website URL"
                    required
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="image">Institute Photo</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Upload a photo of the institute (optional)
                      </p>
                    </div>
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Link href="/global_admin/institutes/list">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Institute
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}