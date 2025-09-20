"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface UIFaculty {
  id: string
  name: string
  department: string
  email: string
  assignedStudents: number
  status: "Active" | "Inactive" | "On Leave"
}

export default function FacultyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const q = searchParams.get('q') || ''
  const department = searchParams.get('department') || 'all'

  const [faculty, setFaculty] = useState<UIFaculty[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(undefined)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (department && department !== 'all') params.set('department', department)
    params.set('take', '20')
    params.set('skip', '0')
    fetch(`/api/admin/faculty?${params.toString()}`)
      .then(async (res) => { if (!res.ok) throw new Error('Failed to load faculty'); return res.json() })
      .then((data) => { if (!isMounted) return; setFaculty(data.faculty || []) })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
    return () => { isMounted = false }
  }, [q, department])

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') params.set(key, value)
    else params.delete(key)
    router.push(`/admin/faculty?${params.toString()}`)
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Faculty Management</h1>
            <p className="text-muted-foreground">Manage faculty members and student assignments</p>
          </div>
          <Button asChild>
            <Link href="/admin/faculty/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Faculty
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email"
                  className="pl-8"
                  defaultValue={q}
                  onKeyDown={(e) => { if (e.key === 'Enter') setParam('q', (e.target as HTMLInputElement).value) }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select defaultValue={department} onValueChange={(v) => setParam('department', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                  <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                  <SelectItem value="Information Technology">Information Technology</SelectItem>
                  <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Apply Filters</Button>
            </div>
          </CardContent>
        </Card>

        {/* Faculty List */}
        <div className="space-y-4">
          {loading && <div className="text-sm text-muted-foreground">Loading faculty...</div>}
          {error && <div className="text-sm text-destructive">{error}</div>}
          {!loading && !error && faculty.map((f) => (
            <Card key={f.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>{f.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{f.name}</h3>
                      </div>
                      <div className="grid gap-1 md:grid-cols-2 text-sm text-muted-foreground mb-3">
                        <div>{f.email}</div>
                        <div>{f.department}</div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Assigned Students: {f.assignedStudents}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={f.status === "Active" ? "default" : "secondary"}>
                      {f.status}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/faculty/${f.id}/assign`}>
                        <User className="w-4 h-4 mr-1" />
                        Assign Students
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}