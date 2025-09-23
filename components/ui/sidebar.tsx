"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Home, User, Briefcase, FileText, Bell, Settings, LogOut,
  GraduationCap, BookOpen, Building2, Users, BarChart3,
  CheckCircle2, AlertCircle, Loader2
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMemo } from "react"
import { useAuth } from "../../lib/contexts/AuthContext"

interface SidebarProps {
  userRole: "student" | "company" | "faculty" | "admin"
  className?: string
}

const navigationItems = {
  student: [
    { name: "Dashboard", href: "/student", icon: Home },
    { name: "Opportunities", href: "/student/opportunities", icon: Briefcase },
    { name: "Training", href: "/student/training", icon: BookOpen },
    { name: "Notifications", href: "/student/notifications", icon: Bell },
    { name: "Settings", href: "/student/settings", icon: Settings },
  ],
  company: [
    { name: "Dashboard", href: "/company", icon: Home },
    { name: "Job Posts", href: "/company/jobs", icon: Briefcase },
    { name: "Notifications", href: "/company/notifications", icon: Bell },
    { name: "Settings", href: "/company/settings", icon: Settings },
  ],
  faculty: [
    { name: "Dashboard", href: "/faculty", icon: Home },
    { name: "Students", href: "/faculty/students", icon: Users },
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
  
  // Destructure the hook properly
  const { user, loading, logout } = useAuth();
  console.log(user);

  const { displayName, subtitle, avatarFallback, badgeNode } = useMemo(() => {
    // Show loading state
    if (loading) {
      return {
        displayName: "Loading...",
        subtitle: "",
        avatarFallback: <Loader2 className="h-4 w-4 animate-spin" />,
        badgeNode: <Badge variant="secondary" className="text-xs">Loading...</Badge>
      }
    }

    // Show not authenticated state
    if (!user) {
      return {
        displayName: "Not authenticated",
        subtitle: "",
        avatarFallback: "?",
        badgeNode: <Badge variant="destructive" className="text-xs">Guest</Badge>
      }
    }

    let name = ""
    let sub = ""
    let fallback = "U"
    let companyVerified: boolean | null = null

    const role = user.role
    const profile = user.profile

    // ✅ Better fallback handling
    if (role === "STUDENT") {
      if (profile) {
        const fn = profile.firstName || ""
        const ln = profile.lastName || ""
        name = `${fn} ${ln}`.trim()
        sub = `${profile.department || ""} • ${profile.year || ""}`
        fallback = `${fn?.[0] || ""}${ln?.[0] || ""}`.toUpperCase() || "ST"
      } else {
        // Fallback when profile isn't loaded yet
        name = user.email?.split('@')[0] || "Student"
        sub = "Student"
        fallback = "ST"
      }
    } else if (role === "FACULTY") {
      if (profile) {
        const nm = profile.name || ""
        name = nm
        sub = `${profile.department || ""}${profile.designation ? " • " + profile.designation : ""}`
        fallback = nm.split(" ").map((s: any) => s[0]).slice(0, 2).join("").toUpperCase() || "FA"
      } else {
        name = user.email?.split('@')[0] || "Faculty"
        sub = "Faculty"
        fallback = "FA"
      }
    } else if (role === "ADMIN") {
      if (profile) {
        const nm = profile.name || ""
        name = nm
        sub = `${profile.department || "Admin"}`
        fallback = nm.split(" ").map((s: any) => s[0]).slice(0, 2).join("").toUpperCase() || "AD"
      } else {
        name = user.email?.split('@')[0] || "Admin"
        sub = "Admin"
        fallback = "AD"
      }
    } else if (role === "COMPANY") {
      if (profile) {
        const nm = profile.name || ""
        name = nm
        sub = profile.location || "Company"
        companyVerified = Boolean(profile.isVerified)
        fallback = nm.split(" ").map((s: any) => s[0]).slice(0, 2).join("").toUpperCase() || "CO"
      } else {
        name = user.email?.split('@')[0] || "Company"
        sub = "Company"
        fallback = "CO"
      }
    }

    // ✅ Ensure we always have a display name
    if (!name.trim()) {
      name = user.email?.split('@')[0] || "User"
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
      displayName: name,
      subtitle: sub,
      avatarFallback: fallback,
      badgeNode: badge
    }
  }, [user, loading, userRole])

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
              <AvatarFallback>
                {typeof avatarFallback === 'string' ? avatarFallback : avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {badgeNode}
                {subtitle && (
                  <span className="text-xs text-muted-foreground truncate">
                    {subtitle.includes('•') ? subtitle : `• ${subtitle}`}
                  </span>
                )}
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
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground" 
          onClick={logout}
          disabled={loading}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}