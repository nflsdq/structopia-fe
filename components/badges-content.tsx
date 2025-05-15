"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { getUserBadges } from "@/lib/api"
import type { Badge } from "@/lib/api-types"
import {
  Award,
  Home,
  ArrowLeft,
  Search,
  Menu,
  X,
  User,
  BookOpen,
  BarChart2,
  Lock,
  CheckCircle,
  Calendar,
  Loader2,
} from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export function BadgesContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [badges, setBadges] = useState<Badge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchBadges()
  }, [])

  const fetchBadges = async () => {
    setIsLoading(true)
    try {
      const response = await getUserBadges()
      setBadges(response.data)
    } catch (error) {
      console.error("Error fetching badges:", error)
      toast({
        title: "Gagal memuat badge",
        description: "Terjadi kesalahan saat memuat data badge. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBadges = badges.filter((badge) => {
    const matchesSearch =
      badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "earned") return matchesSearch && badge.earned_at
    if (activeTab === "unearned") return matchesSearch && !badge.earned_at

    return matchesSearch
  })

  const earnedBadges = badges.filter((badge) => badge.earned_at)
  const unearnedBadges = badges.filter((badge) => !badge.earned_at)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return format(new Date(dateString), "d MMMM yyyy", { locale: id })
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
            <Link
              href="/leaderboard"
              className="flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors"
            >
              <BarChart2 className="h-5 w-5" />
              <span>Papan Peringkat</span>
            </Link>
            <Link
              href="/badges"
              className="flex items-center gap-3 p-3 neumorphic-accent text-accent-foreground rounded-xl"
            >
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
          <h1 className="text-xl font-bold hidden md:block">Badge Saya</h1>
          <div className="relative w-full md:w-1/3 mx-auto md:mx-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari badge..."
              className="neumorphic-inset pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="neumorphic-btn" onClick={fetchBadges}>
              Refresh
            </Button>
          </div>
        </header>

        <main>
          {/* Badge Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Card className="neumorphic-accent text-accent-foreground">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Koleksi Badge</span>
                  <span className="text-2xl font-bold">
                    {earnedBadges.length}/{badges.length}
                  </span>
                </CardTitle>
                <CardDescription className="text-accent-foreground/80">Badge yang telah Anda kumpulkan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {earnedBadges.slice(0, 5).map((badge) => (
                    <div key={badge.id} className="relative w-12 h-12 rounded-full overflow-hidden bg-white/10">
                      <Image
                        src={badge.image_url || "/placeholder.svg"}
                        alt={badge.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {earnedBadges.length > 5 && (
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                      +{earnedBadges.length - 5}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Badge Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="neumorphic w-full">
              <TabsTrigger value="all" className="flex-1">
                Semua ({badges.length})
              </TabsTrigger>
              <TabsTrigger value="earned" className="flex-1">
                Diperoleh ({earnedBadges.length})
              </TabsTrigger>
              <TabsTrigger value="unearned" className="flex-1">
                Belum Diperoleh ({unearnedBadges.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Badge Grid */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredBadges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada badge yang ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    className={`neumorphic hover:shadow-lg transition-all ${badge.earned_at ? "border-l-4 border-quaternary" : "opacity-80"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted">
                          {badge.earned_at ? (
                            <Image
                              src={badge.image_url || "/placeholder.svg"}
                              alt={badge.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted">
                              <Lock className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold">{badge.name}</h3>
                            {badge.earned_at && (
                              <div className="flex items-center text-quaternary text-sm">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                <span>Diperoleh</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
                          {badge.earned_at && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(badge.earned_at)}</span>
                            </div>
                          )}
                          {!badge.earned_at && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              <p>Kriteria: {badge.criteria}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-8 py-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Structopia. Hak Cipta Dilindungi.
        </footer>
      </div>
    </div>
  )
}
