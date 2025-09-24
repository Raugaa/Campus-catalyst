"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
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
  Clock,
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
    { name: "Profile", href: "/student/profile", icon: User },
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
    { name: "Students", href: "/faculty/mentees", icon: Users },
    { name: "Pending Approvals", href: "/faculty/approvals", icon: Clock },
    { name: "Feedback", href: "/faculty/reports", icon: FileText },
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

export function Sidebar({ userRole, className }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const items = navigationItems[userRole]
  const [displayName, setDisplayName] = useState<string>("")
  const [subtitle, setSubtitle] = useState<string>("")
  const [avatarFallback, setAvatarFallback] = useState<string>("U")
  const [companyVerified, setCompanyVerified] = useState<boolean | null>(null)

  useEffect(() => {
    // Set mock user data based on role
    switch (userRole) {
      case "student":
        setDisplayName("Rahul Sharma")
        setSubtitle("Computer Science • Senior")
        setAvatarFallback("RS")
        break
      case "faculty":
        setDisplayName("Dr. Priya Patel")
        setSubtitle("Computer Science • Professor")
        setAvatarFallback("PP")
        break
      case "admin":
        setDisplayName("Placement Cell")
        setSubtitle("IIT Bombay (IITB)")
        setAvatarFallback("PC")
        break
      case "company":
        setDisplayName("TCS")
        setSubtitle("Mumbai, India")
        setCompanyVerified(true)
        setAvatarFallback("TC")
        break
      default:
        setDisplayName("User")
        setAvatarFallback("U")
    }
  }, [userRole])

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

  const onLogout = () => {
    // Redirect to home page instead of login page
    router.push("/")
  }

  return (
    <div className={cn("w-64 h-full flex flex-col justify-between border-r bg-background", className)}>
      {/* Top Section */}
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {/* Logo and user info */}
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Image 
                src="/assets/LOGO (Campus Connect).png" 
                alt="Campus Connect Logo" 
                width={28} 
                height={28} 
                className="rounded-md"
              />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Campus Connect
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-6 hover:bg-muted transition-colors">
            <Avatar className="w-10 h-10 ring-2 ring-primary/20">
              <AvatarImage src="/assets/LOGO (Campus Connect).png" />
              <AvatarFallback className="font-medium">{avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName || "User"}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {badgeNode}
                {subtitle && <span className="text-xs text-muted-foreground truncate">• {subtitle}</span>}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Navigation
            </h2>
            <ScrollArea className="h-[300px] px-1">
              {items.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start mb-1",
                    pathname === item.href 
                      ? "bg-primary/10 text-primary hover:bg-primary/15" 
                      : "hover:bg-muted"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Bottom Sign Out */}
      <div className="px-3 py-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={onLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}