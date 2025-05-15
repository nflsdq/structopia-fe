"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (user && user.role !== "admin") {
      router.push("/dashboard")
    } else if (user && user.role === "admin") {
      setIsLoading(false)
    }
  }, [user, authLoading, router])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg">Memuat panel admin...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null // Will redirect in useEffect
  }

  return <AdminDashboard />
}
