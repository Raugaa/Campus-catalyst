"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
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
  userRole: "student" | "company" | "faculty" | "admin" | "global_admin"
  className?: string
}

const navigationItems = {
  student: [
    { name: "Dashboard", href: "/student", icon: Home },
    { name: "Profile", href: "/student/profile", icon: User },
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
    { name: "Mentees", href: "/faculty/mentees", icon: Users },
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
  global_admin: [
    { name: "Dashboard", href: "/global_admin", icon: Home },
    { name: "Companies", href: "/global_admin/companies", icon: Building2 },
    { name: "Institutes", href: "/global_admin/institutes", icon: GraduationCap },
    { name: "Settings", href: "/global_admin/settings", icon: Settings },
  ],
}

export function Sidebar({ userRole, className }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const items = navigationItems[userRole]
  
  const { user, loading, logout } = useAuth();

  const { displayName, subtitle, avatarFallback, badgeNode } = useMemo(() => {
    if (loading) {
      return {
        displayName: "Loading...",
        subtitle: "",
        avatarFallback: <Loader2 className="h-4 w-4 animate-spin" />,
        badgeNode: <Badge variant="secondary" className="text-xs">Loading...</Badge>
      }
    }

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

    const role = user.role?.toUpperCase() || userRole.toUpperCase()
    const profile = user?.profile

    if (role === "STUDENT") {
      if (profile) {
        const fn = profile.firstName || ""
        const ln = profile.lastName || ""
        name = `${fn} ${ln}`.trim()
        sub = `${profile.department || ""} • ${profile.year || ""}`
        fallback = `${fn?.[0] || ""}${ln?.[0] || ""}`.toUpperCase() || "ST"
      } else {
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
    } else if (role === "GLOBAL_ADMIN" || role === "GLOBAL-ADMIN") {
      if (profile && profile.name) {
        const nm = profile.name || ""
        name = nm
        sub = "Global Admin"
        fallback = nm.split(" ").map((s: any) => s[0]).slice(0, 2).join("").toUpperCase() || "GA"
      } else {
        const emailPrefix = user.email?.split('@')[0] || "globaladmin"
        name = emailPrefix === "globaladmin" ? "System Administrator" : emailPrefix
        sub = "Global Admin"
        fallback = "GA"
      }
    }

    if (!name.trim()) {
      name = user.email?.split('@')[0] || "User"
    }

    let label = userRole.charAt(0).toUpperCase() + userRole.slice(1)
    if (userRole === "global_admin") {
      label = "Global Admin"
    }
    
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
    <div className={cn("flex flex-col h-full w-64 bg-background border-r border-border", className)}>
      {/* Header Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Image 
              src="/assets/Logo.png" 
              alt="Campus Catalyst Logo" 
              width={36} 
              height={36} 
              className="rounded-lg shadow-sm"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">Campus Catalyst</h1>
            <p className="text-xs text-muted-foreground">Student Portal</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
          <Avatar className="w-10 h-10 ring-2 ring-primary/10">
            <AvatarImage src="/assets/Logo.png" alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
              {typeof avatarFallback === 'string' ? avatarFallback : avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
            <div className="flex items-center gap-2 mt-1">
              {badgeNode}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground mb-2 px-2">Navigation</h2>
        </div>
        
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 px-2 pb-4">
            {items && items.length > 0 ? items.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-10 px-3",
                  pathname === item.href 
                    ? "bg-primary/10 text-primary hover:bg-primary/15 font-medium shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              </Button>
            )) : (
              <div className="p-4 text-center">
                <p className="text-xs text-muted-foreground">No navigation items</p>
                <p className="text-xs text-muted-foreground mt-1">Role: {userRole}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer Section - Sign Out */}
      <div className="p-4 border-t border-border mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start h-10 px-3 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          onClick={logout}
          disabled={loading}
        >
          <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  )
}