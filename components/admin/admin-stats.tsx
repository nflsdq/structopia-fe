"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAdminStats } from "@/lib/api"
import type { AdminStats } from "@/lib/api-types"
import { Users, Award, BookOpen, HelpCircle, Activity, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

export function AdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const response = await getAdminStats()
      setStats(response.data)
    } catch (error) {
      console.error("Error fetching admin stats:", error)
      toast({
        title: "Gagal memuat statistik",
        description: "Terjadi kesalahan saat memuat data statistik. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Tidak ada data statistik yang tersedia</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          {
            title: "Total Pengguna",
            value: stats.total_users,
            icon: <Users className="h-6 w-6 text-white" />,
            color: "neumorphic-primary",
            description: "Jumlah total pengguna terdaftar",
          },
          {
            title: "Pengguna Aktif",
            value: stats.active_users,
            icon: <Activity className="h-6 w-6 text-white" />,
            color: "neumorphic-secondary",
            description: "Pengguna aktif dalam 30 hari terakhir",
          },
          {
            title: "Level Selesai",
            value: stats.completed_levels,
            icon: <BookOpen className="h-6 w-6 text-white" />,
            color: "neumorphic-tertiary",
            description: "Jumlah level yang telah diselesaikan",
          },
          {
            title: "Rata-rata Nilai Quiz",
            value: `${stats.average_quiz_score}%`,
            icon: <HelpCircle className="h-6 w-6 text-white" />,
            color: "neumorphic-quaternary",
            description: "Rata-rata nilai quiz semua pengguna",
          },
          {
            title: "Badge Diperoleh",
            value: stats.total_badges_earned,
            icon: <Award className="h-6 w-6 text-white" />,
            color: "neumorphic-accent",
            description: "Jumlah total badge yang diperoleh",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="neumorphic p-4 rounded-xl card-hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>{stat.icon}</div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="neumorphic">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Aktivitas pengguna dalam 7 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Grafik aktivitas akan ditampilkan di sini</p>
            </div>
          </CardContent>
        </Card>

        <Card className="neumorphic">
          <CardHeader>
            <CardTitle>Distribusi Level</CardTitle>
            <CardDescription>Distribusi pengguna berdasarkan level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Grafik distribusi level akan ditampilkan di sini</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
