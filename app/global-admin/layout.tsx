"use client"

import { useAuth } from "@/lib/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function GlobalAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated and has global admin role
    if (!loading) {
      // If user is logged in as global admin, allow access
      if (user && user.role === "global-admin") {
        return;
      }
      
      // If user is logged in as another role, redirect to their dashboard
      if (user && user.role !== "global-admin") {
        router.push(`/${user.role}`);
        return;
      }
      
      // If no user is logged in, redirect to global admin login
      router.push("/auth/login?role=global-admin");
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Only render children if user is a global admin
  if (user && user.role === "global-admin") {
    return <div className="min-h-screen bg-background">{children}</div>
  }

  // This shouldn't be reached due to the redirect, but just in case
  return null
}