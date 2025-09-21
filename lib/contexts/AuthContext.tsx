"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type User = {
  id: string
  email: string
  role: "STUDENT" | "FACULTY" | "ADMIN" | "COMPANY"
  student?: { firstName: string; lastName: string; rollNumber: string; department: string; year: string } | null
  faculty?: { name: string; department: string; designation: string | null } | null
  admin?: { name: string; department: string | null; college: { name: string; code: string } } | null
  company?: { name: string; isVerified: boolean; location: string | null } | null
}

type AuthContextType = {
  user: User | null
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { method: "GET", credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        if (data.user) setUser(data.user)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}