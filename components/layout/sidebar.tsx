"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  User,
  Briefcase,
  FileText,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
  BookOpen,
  Building2,
  Users,
  BarChart3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

interface SidebarProps {
  userRole: "student" | "company" | "faculty" | "admin"
  className?: string
}

const navigationItems = {
  student: [
    { name: "Dashboard", href: "/student", icon: Home },
    // { name: "Profile", href: "/student/profile", icon: User },
    { name: "Opportunities", href: "/student/opportunities", icon: Briefcase },
    // { name: "Applications", href: "/student/applications", icon: FileText },
    { name: "Training", href: "/student/training", icon: BookOpen },
    { name: "Notifications", href: "/student/notifications", icon: Bell },
    { name: "Settings", href: "/student/settings", icon: Settings },
  ],
  company: [
    { name: "Dashboard", href: "/company", icon: Home },
    // { name: "Profile", href: "/company/profile", icon: Building2 },
    { name: "Job Posts", href: "/company/jobs", icon: Briefcase },
    // { name: "Applications", href: "/company/applications", icon: FileText },
    { name: "Colleges", href: "/company/colleges", icon: Users },
    { name: "Notifications", href: "/company/notifications", icon: Bell },
    { name: "Settings", href: "/company/settings", icon: Settings },
  ],
  faculty: [
    { name: "Dashboard", href: "/faculty", icon: Home },
    // { name: "Profile", href: "/faculty/profile", icon: User },
    { name: "Students", href: "/faculty/students", icon: Users },
    // { name: "Applications", href: "/faculty/applications", icon: FileText },
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

type MeResponse =
  | {
      user: {
        id: string
        email: string
        role: "STUDENT" | "FACULTY" | "ADMIN" | "COMPANY"
        student?: { firstName: string; lastName: string; rollNumber: string; department: string; year: string } | null
        faculty?: { name: string; department: string; designation: string | null } | null
        admin?: { name: string; department: string | null; college: { name: string; code: string } } | null
        company?: { name: string; isVerified: boolean; location: string | null } | null
      }
    }
  | { error: string }

export function Sidebar({ userRole, className }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const items = navigationItems[userRole]
  const [displayName, setDisplayName] = useState<string>("")
  const [subtitle, setSubtitle] = useState<string>("")
  const [avatarFallback, setAvatarFallback] = useState<string>("U")
  const [companyVerified, setCompanyVerified] = useState<boolean | null>(null)

  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        const res = await fetch("/api/auth/me", { method: "GET", credentials: "include" })
        if (!res.ok) return
        const data: MeResponse = await res.json()
        if ("error" in data || !data.user || ignore) return

        const role = data.user.role
        if (role === "STUDENT" && data.user.student) {
          const fn = data.user.student.firstName
          const ln = data.user.student.lastName
          setDisplayName(`${fn} ${ln}`.trim())
          setSubtitle(`${data.user.student.department} • ${data.user.student.year}`)
          setAvatarFallback(`${fn?.[0] || ""}${ln?.[0] || ""}`.toUpperCase() || "ST")
        } else if (role === "FACULTY" && data.user.faculty) {
          const nm = data.user.faculty.name
          setDisplayName(nm)
          setSubtitle(`${data.user.faculty.department}${data.user.faculty.designation ? " • " + data.user.faculty.designation : ""}`)
          setAvatarFallback(nm.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase() || "FA")
        } else if (role === "ADMIN" && data.user.admin) {
          const nm = data.user.admin.name
          setDisplayName(nm)
          setSubtitle(`${data.user.admin.college.name} (${data.user.admin.college.code})`)
          setAvatarFallback(nm.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase() || "AD")
        } else if (role === "COMPANY" && data.user.company) {
          const nm = data.user.company.name
          setDisplayName(nm)
          setSubtitle(data.user.company.location || "Company")
          setCompanyVerified(Boolean(data.user.company.isVerified))
          setAvatarFallback(nm.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase() || "CO")
        } else {
          setDisplayName(data.user.email)
          setSubtitle("")
          setAvatarFallback(data.user.email?.slice(0, 2).toUpperCase() || "U")
        }
      } catch {
        // ignore
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  const badgeNode = useMemo(() => {
    const label = userRole.charAt(0).toUpperCase() + userRole.slice(1)
    if (userRole === "company") {
      if (companyVerified === true) {
        return (
          <Badge variant="secondary" className="text-xs flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            {label} • Verified
          </Badge>
        )
      }
      if (companyVerified === false) {
        return (
          <Badge variant="destructive" className="text-xs flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {label} • Pending
          </Badge>
        )
      }
    }
    return (
      <Badge variant="secondary" className="text-xs">
        {label}
      </Badge>
    )
  }, [userRole, companyVerified])

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
              <p className="text-sm font-medium truncate">{displayName || "User"}</p>
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

      <div className="absolute left-3 right-3">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
