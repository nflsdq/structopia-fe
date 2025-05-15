"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { LevelDetail } from "@/components/level-detail"
import { Loader2 } from "lucide-react"
import type { Level } from "@/lib/api-types"
import { getLevelDetail } from "@/lib/api"

export default function LevelPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [level, setLevel] = useState<Level | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const levelId = Number.parseInt(params.id as string)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (user) {
      fetchLevelDetail()
    }
  }, [user, authLoading, router])

  const fetchLevelDetail = async () => {
    setIsLoading(true)
    try {
      const response = await getLevelDetail(levelId)
      setLevel(response.data)
    } catch (error) {
      console.error("Error fetching level detail:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg">Memuat level...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Level tidak ditemukan</h1>
          <p className="text-muted-foreground mb-4">Level yang Anda cari tidak tersedia.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <LevelDetail level={level} />
}
