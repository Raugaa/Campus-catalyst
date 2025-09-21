import type React from "react"
import { Sidebar } from "../ui/sidebar"


interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: "student" | "company" | "faculty" | "admin"
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className="hidden md:block fixed inset-y-0 z-50 w-64 bg-card border-r border-border">
          <Sidebar userRole={userRole} />
        </div>
        <div className="flex-1 md:pl-64">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
