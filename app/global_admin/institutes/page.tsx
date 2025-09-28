"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function InstituteRegistrationRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the institutes list page
    router.push("/global_admin/institutes/list")
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}