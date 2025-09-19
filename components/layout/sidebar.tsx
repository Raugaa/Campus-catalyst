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
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
  const pathname = usePathname()
  const items = navigationItems[userRole]

  return (
    <div className={cn("pb-12 w-64", className)}>
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
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </Badge>
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
        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
