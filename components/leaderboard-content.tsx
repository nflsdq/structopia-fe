"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { getLeaderboard } from "@/lib/api"
import type { LeaderboardEntry } from "@/lib/api-types"
import {
  Trophy,
  Medal,
  Award,
  Home,
  ArrowLeft,
  Search,
  Filter,
  Menu,
  X,
  User,
  BookOpen,
  BarChart2,
  Loader2,
} from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

export function LeaderboardContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    setIsLoading(true)
    try {
      const response = await getLeaderboard(20) // Get top 20 users
      setLeaderboard(response.data)

      // Find current user's rank
      const currentUserRank = response.data.find((entry) => entry.user_id === user?.id)
      setUserRank(currentUserRank || null)
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      toast({
        title: "Gagal memuat papan peringkat",
        description: "Terjadi kesalahan saat memuat data papan peringkat. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredLeaderboard = leaderboard.filter((entry) =>
    (entry.user_name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" />
      default:
        return <span className="text-lg font-bold">{rank}</span>
    }
  }

  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/10 border-yellow-500"
      case 2:
        return "bg-gray-400/10 border-gray-400"
      case 3:
        return "bg-amber-700/10 border-amber-700"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-full neumorphic flex items-center justify-center"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-full w-64 neumorphic md:mr-4 z-40 transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-full neumorphic-primary flex items-center justify-center text-white font-bold">
              S
            </div>
            <h1 className="text-2xl font-bold text-primary">Structopia</h1>
          </div>

          <div className="flex flex-col gap-2 mb-8">
            <div className="flex items-center gap-3 p-3 neumorphic rounded-xl mb-2">
              <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.role === "student" ? "Siswa" : "Admin"}</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-2">Menu Utama</div>
            <Link href="/dashboard" className="flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors">
              <Home className="h-5 w-5" />
              <span>Beranda</span>
            </Link>
            <Link href="/levels" className="flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors">
              <BookOpen className="h-5 w-5" />
              <span>Level Saya</span>
            </Link>
            <Link href="/leaderboard" className="flex items-center gap-3 p-3 neumorphic-tertiary text-white rounded-xl">
              <BarChart2 className="h-5 w-5" />
              <span>Papan Peringkat</span>
            </Link>
            <Link href="/badges" className="flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors">
              <Award className="h-5 w-5" />
              <span>Badge</span>
            </Link>
          </div>

          <div className="mt-auto">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full neumorphic-btn justify-start">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {/* Header */}
        <header className="neumorphic p-4 rounded-xl flex justify-between items-center mb-6 sticky top-0 z-30">
          <h1 className="text-xl font-bold hidden md:block">Papan Peringkat</h1>
          <div className="relative w-full md:w-1/3 mx-auto md:mx-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari pengguna..."
              className="neumorphic-inset pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="neumorphic-btn">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </header>

        <main>
          {/* User's Rank */}
          {userRank && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Card className="neumorphic-tertiary text-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Peringkat Anda</span>
                    <span className="text-2xl font-bold">#{userRank.rank}</span>
                  </CardTitle>
                  <CardDescription className="text-white/80">Posisi Anda dalam papan peringkat global</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white/10">
                      <Image
                        src={userRank.user_avatar || "/placeholder.svg?height=50&width=50"}
                        alt={userRank.user_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{userRank.user_name}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          <span>{userRank.xp} XP</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          <span>{userRank.badges_count} Badge</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Leaderboard */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Top Learners</h2>
              <Button variant="outline" className="neumorphic-btn" onClick={fetchLeaderboard}>
                Refresh
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredLeaderboard.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada hasil yang ditemukan</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLeaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      className={`neumorphic hover:shadow-lg transition-all ${
                        entry.user_id === user?.id ? "border-l-4 border-tertiary" : ""
                      } ${getRankClass(entry.rank)}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 flex items-center justify-center">{getRankIcon(entry.rank)}</div>
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                            <Image
                              src={entry.user_avatar || "/placeholder.svg?height=50&width=50"}
                              alt={entry.user_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h3 className="font-bold">{entry.user_name}</h3>
                              <span className="font-bold text-lg">{entry.xp} XP</span>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Award className="h-4 w-4" />
                                <span>{entry.badges_count} Badge</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{entry.level_completed} Level Selesai</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Leaderboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="neumorphic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top XP
                </CardTitle>
                <CardDescription>Pengguna dengan XP tertinggi</CardDescription>
              </CardHeader>
              <CardContent>
                {leaderboard.length > 0 && (
                  <div className="space-y-4">
                    {leaderboard.slice(0, 3).map((entry) => (
                      <div key={entry.user_id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-yellow-500/10">
                          {getRankIcon(entry.rank)}
                        </div>
                        <div>
                          <p className="font-medium">{entry.user_name}</p>
                          <p className="text-sm text-muted-foreground">{entry.xp} XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="neumorphic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  Top Badge
                </CardTitle>
                <CardDescription>Pengguna dengan badge terbanyak</CardDescription>
              </CardHeader>
              <CardContent>
                {leaderboard.length > 0 && (
                  <div className="space-y-4">
                    {[...leaderboard]
                      .sort((a, b) => b.badges_count - a.badges_count)
                      .slice(0, 3)
                      .map((entry, index) => (
                        <div key={entry.user_id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500/10">
                            <span className="text-lg font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{entry.user_name}</p>
                            <p className="text-sm text-muted-foreground">{entry.badges_count} Badge</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="neumorphic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-500" />
                  Top Level
                </CardTitle>
                <CardDescription>Pengguna dengan level terbanyak</CardDescription>
              </CardHeader>
              <CardContent>
                {leaderboard.length > 0 && (
                  <div className="space-y-4">
                    {[...leaderboard]
                      .sort((a, b) => b.level_completed - a.level_completed)
                      .slice(0, 3)
                      .map((entry, index) => (
                        <div key={entry.user_id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500/10">
                            <span className="text-lg font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{entry.user_name}</p>
                            <p className="text-sm text-muted-foreground">{entry.level_completed} Level</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-8 py-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Structopia. Hak Cipta Dilindungi.
        </footer>
      </div>
    </div>
  )
}
