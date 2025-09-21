'use client'

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { Plus, Edit, Trash2, Search } from "lucide-react"

export default function CollegeManagementPage() {
  const [colleges, setColleges] = useState([
    { id: 1, name: "KJ Somaiya College of Engineering", shortName: "KJSCE", status: "active", students: 1247 },
    { id: 2, name: "DY Patil Institute", shortName: "DYP", status: "active", students: 892 },
    { id: 3, name: "Veermata Jijabai Technological Institute", shortName: "VJTI", status: "active", students: 1156 },
    { id: 4, name: "College of Engineering", shortName: "COE", status: "active", students: 980 },
    { id: 5, name: "Business School", shortName: "BS", status: "inactive", students: 0 },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentCollege, setCurrentCollege] = useState<{id: number | null, name: string, shortName: string}>({id: null, name: "", shortName: ""})

  const filteredColleges = colleges.filter(college => 
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCollege = () => {
    if (currentCollege.name && currentCollege.shortName) {
      if (currentCollege.id) {
        // Edit existing college
        setColleges(colleges.map(college => 
          college.id === currentCollege.id 
            ? {...college, name: currentCollege.name, shortName: currentCollege.shortName} 
            : college
        ))
      } else {
        // Add new college
        const newCollege = {
          id: Math.max(...colleges.map(c => c.id)) + 1,
          name: currentCollege.name,
          shortName: currentCollege.shortName,
          status: "active",
          students: 0
        }
        setColleges([...colleges, newCollege])
      }
      setIsDialogOpen(false)
      setCurrentCollege({id: null, name: "", shortName: ""})
    }
  }

  const handleEditCollege = (college: {id: number, name: string, shortName: string}) => {
    setCurrentCollege(college)
    setIsDialogOpen(true)
  }

  const handleDeleteCollege = (id: number) => {
    setColleges(colleges.filter(college => college.id !== id))
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">College Management</h1>
            <p className="text-muted-foreground">Manage colleges in the placement portal</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setCurrentCollege({id: null, name: "", shortName: ""})}>
                <Plus className="w-4 h-4 mr-2" />
                Add College
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{currentCollege.id ? "Edit College" : "Add New College"}</DialogTitle>
                <DialogDescription>
                  {currentCollege.id ? "Edit the college details below" : "Enter the details for the new college"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="collegeName">College Name</Label>
                  <Input 
                    id="collegeName" 
                    value={currentCollege.name}
                    onChange={(e) => setCurrentCollege({...currentCollege, name: e.target.value})}
                    placeholder="Enter full college name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortName">Short Name</Label>
                  <Input 
                    id="shortName" 
                    value={currentCollege.shortName}
                    onChange={(e) => setCurrentCollege({...currentCollege, shortName: e.target.value})}
                    placeholder="Enter short name (e.g., KJSCE)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddCollege}>Save College</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search colleges..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Colleges Table */}
        <Card>
          <CardHeader>
            <CardTitle>Colleges</CardTitle>
            <CardDescription>List of all colleges in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>College Name</TableHead>
                  <TableHead>Short Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredColleges.map((college) => (
                  <TableRow key={college.id}>
                    <TableCell className="font-medium">{college.name}</TableCell>
                    <TableCell>{college.shortName}</TableCell>
                    <TableCell>
                      <Badge variant={college.status === "active" ? "default" : "secondary"}>
                        {college.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{college.students}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditCollege({id: college.id, name: college.name, shortName: college.shortName})}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteCollege(college.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}