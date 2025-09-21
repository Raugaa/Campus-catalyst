"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Home, User, Briefcase, FileText, Bell, Settings, LogOut,
  GraduationCap, BookOpen, Building2, Users, BarChart3,
  CheckCircle2, AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMemo } from "react"
import { useAuth } from "@/lib/contexts/AuthContext"

interface SidebarProps {
  userRole: "student" | "company" | "faculty" | "admin"
  className?: string
}

const navigationItems = {
  student: [
    { name: "Dashboard", href: "/student", icon: Home },
    { name: "Profile", href: "/student/profile", icon: User },
    { name: "Opportunities", href: "/student/opportunities", icon: Briefcase },
    { name: "Applications", href: "/student/applications", icon: FileText },
    { name: "Training", href: "/student/training", icon: BookOpen },
    { name: "Notifications", href: "/student/notifications", icon: Bell },
    { name: "Settings", href: "/student/settings", icon: Settings },
  ],
  company: [
    { name: "Dashboard", href: "/company", icon: Home },
    { name: "Profile", href: "/company/profile", icon: Building2 },
    { name: "Job Posts", href: "/company/jobs", icon: Briefcase },
    { name: "Applications", href: "/company/applications", icon: FileText },
    { name: "Notifications", href: "/company/notifications", icon: Bell },
    { name: "Settings", href: "/company/settings", icon: Settings },
  ],
  faculty: [
    { name: "Dashboard", href: "/faculty", icon: Home },
    { name: "Profile", href: "/faculty/profile", icon: User },
    { name: "Students", href: "/faculty/students", icon: Users },
    { name: "Applications", href: "/faculty/applications", icon: FileText },
    { name: "Notifications", href: "/faculty/notifications", icon: Bell },
    { name: "Settings", href: "/faculty/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Students", href: "/admin/students", icon: Users },
    { name: "Faculty", href: "/admin/faculty", icon: User },
    { name: "Companies", href: "/admin/companies", icon: Building2 },
    { name: "Opportunities", href: "/admin/opportunities", icon: Briefcase },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ],
}

export function Sidebar({ userRole, className }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const items = navigationItems[userRole]
  const { user, loading } = useAuth()

  const { displayName, subtitle, avatarFallback, badgeNode } = useMemo(() => {
    if (loading || !user) {
      return {
        displayName: "Loading...",
        subtitle: "",
        avatarFallback: "L",
        badgeNode: <Badge variant="secondary" className="text-xs">...</Badge>
      }
    }

    let name = ""
    let sub = ""
    let fallback = "U"
    let companyVerified: boolean | null = null

    const role = user.role
    if (role === "STUDENT" && user.student) {
      const fn = user.student.firstName
      const ln = user.student.lastName
      name = `${fn} ${ln}`.trim()
      sub = `${user.student.department} • ${user.student.year}`
      fallback = `${fn?.[0] || ""}${ln?.[0] || ""}`.toUpperCase() || "ST"
    } else if (role === "FACULTY" && user.faculty) {
      const nm = user.faculty.name
      name = nm
      sub = `${user.faculty.department}${user.faculty.designation ? " • " + user.faculty.designation : ""}`
      fallback = nm.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase() || "FA"
    } else if (role === "ADMIN" && user.admin) {
      const nm = user.admin.name
      name = nm
      sub = `${user.admin.college.name} (${user.admin.college.code})`
      fallback = nm.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase() || "AD"
    } else if (role === "COMPANY" && user.company) {
      const nm = user.company.name
      name = nm
      sub = user.company.location || "Company"
      companyVerified = Boolean(user.company.isVerified)
      fallback = nm.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase() || "CO"
    } else {
      name = user.email
      sub = ""
      fallback = user.email?.slice(0, 2).toUpperCase() || "U"
    }

    const label = userRole.charAt(0).toUpperCase() + userRole.slice(1)
    let badge
    if (userRole === "company") {
      if (companyVerified === true) {
        badge = (
          <Badge variant="secondary" className="text-xs flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            {label} • Verified
          </Badge>
        )
      } else if (companyVerified === false) {
        badge = (
          <Badge variant="destructive" className="text-xs flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {label} • Pending
          </Badge>
        )
      } else {
        badge = <Badge variant="secondary" className="text-xs">{label}</Badge>
      }
    } else {
      badge = <Badge variant="secondary" className="text-xs">{label}</Badge>
    }

    return {
      displayName: name || "User",
      subtitle: sub,
      avatarFallback: fallback,
      badgeNode: badge
    }
  }, [user, loading, userRole])

  const onLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      router.push("/auth/login")
    }
  }

  return (
    <div className={cn("pb-12 w-64 relative", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Campus Portal</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-6">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <div className="flex items-center gap-2">
                {badgeNode}
                {subtitle && <span className="text-xs text-muted-foreground truncate">• {subtitle}</span>}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Navigation</h2>
            <ScrollArea className="h-[300px] px-1">
              {items.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-3 right-3">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}