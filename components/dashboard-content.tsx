"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import {
  Loader2,
  LogOut,
  User,
  Award,
  BarChart2,
  BookOpen,
  Lock,
  CheckCircle,
  Circle,
  Bell,
  Settings,
  Search,
  Menu,
  X,
  Home,
  BookOpenCheck,
  Trophy,
  Users,
  ChevronRight,
  Zap,
  Lightbulb,
} from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

interface Level {
  id: number
  name: string
  order: number
  description: string
  status: "unlocked" | "ongoing" | "locked" | "completed"
  keterangan: string
}

export function DashboardContent() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [levels, setLevels] = useState<Level[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const apiUrl = "http://localhost:8000/api"

  useEffect(() => {
    fetchLevels()
  }, [])

  const fetchLevels = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${apiUrl}/levels`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLevels(data.data)
      } else {
        throw new Error("Failed to fetch levels")
      }
    } catch (error) {
      console.error("Error fetching levels:", error)
      // Use dummy data if API connection fails
      setLevels([
        {
          id: 1,
          name: "Pengenalan Struktur Data",
          order: 1,
          description: "Memahami konsep dasar struktur data",
          status: "completed",
          keterangan: "Level ini sudah selesai",
        },
        {
          id: 2,
          name: "Array dan Linked List",
          order: 2,
          description: "Mempelajari array dan linked list",
          status: "ongoing",
          keterangan: "Level ini sedang dipelajari",
        },
        {
          id: 3,
          name: "Stack dan Queue",
          order: 3,
          description: "Mempelajari stack dan queue",
          status: "unlocked",
          keterangan: "Level ini sudah terbuka",
        },
        {
          id: 4,
          name: "Tree dan Graph",
          order: 4,
          description: "Mempelajari tree dan graph",
          status: "locked",
          keterangan: "Selesaikan level sebelumnya untuk membuka level ini",
        },
      ])

      toast({
        title: "Koneksi ke server gagal",
        description: "Menggunakan data demo untuk sementara",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari akun",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "unlocked":
        return <Circle className="h-5 w-5 text-primary" />
      case "ongoing":
        return <Circle className="h-5 w-5 text-accent" />
      case "locked":
        return <Lock className="h-5 w-5 text-muted-foreground" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-quaternary" />
      default:
        return <Circle className="h-5 w-5" />
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "unlocked":
        return "border-l-4 border-primary"
      case "ongoing":
        return "border-l-4 border-accent"
      case "locked":
        return "opacity-70"
      case "completed":
        return "border-l-4 border-quaternary"
      default:
        return ""
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg">Memuat data level...</p>
        </div>
      </div>
    )
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
            <Link href="/dashboard" className="flex items-center gap-3 p-3 neumorphic-primary text-white rounded-xl">
              <Home className="h-5 w-5" />
              <span>Beranda</span>
            </Link>
            <Link href="/levels" className="flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors">
              <BookOpenCheck className="h-5 w-5" />
              <span>Level Saya</span>
            </Link>
            <Link
              href="/leaderboard"
              className="flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors"
            >
              <Trophy className="h-5 w-5" />
              <span>Papan Peringkat</span>
            </Link>
            <Link href="/badges" className="flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors">
              <Award className="h-5 w-5" />
              <span>Badge</span>
            </Link>
            <Link href="/community" className="flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors">
              <Users className="h-5 w-5" />
              <span>Komunitas</span>
            </Link>
          </div>

          <div className="mt-auto">
            <Button variant="outline" className="w-full neumorphic-btn justify-start" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 md:pt-4 overflow-auto">
        {/* Header */}
        <header className="neumorphic p-4 rounded-xl flex justify-between items-center mb-6 sticky top-0 z-30">
          <h1 className="text-xl font-bold hidden md:block">Beranda</h1>
          <div className="relative w-full md:w-1/3 mx-auto md:mx-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari materi..." className="neumorphic-inset pl-9 w-full" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 rounded-full neumorphic flex items-center justify-center">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-primary"></span>
            </button>
            <button className="w-10 h-10 rounded-full neumorphic flex items-center justify-center">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main>
          {/* Welcome Section */}
          <section className="mb-8">
            <div className="neumorphic p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/10 rounded-full -ml-20 -mb-20"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Selamat Datang, {user?.name}! 👋</h2>
                <p className="text-muted-foreground mb-4">
                  Lanjutkan perjalanan belajar struktur data Anda. Anda telah menyelesaikan 25% dari semua materi.
                </p>
                <div className="w-full bg-muted rounded-full h-2 mb-4">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }}></div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white neumorphic-primary">
                  Lanjutkan Belajar
                </Button>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Level Terbuka",
                  value: levels.filter((level) => level.status === "unlocked" || level.status === "ongoing").length,
                  icon: <BookOpen className="h-6 w-6 text-white" />,
                  color: "neumorphic-primary",
                },
                {
                  title: "XP Terkumpul",
                  value: "250 XP",
                  icon: <Zap className="h-6 w-6 text-white" />,
                  color: "neumorphic-secondary",
                },
                {
                  title: "Badge",
                  value: "2",
                  icon: <Award className="h-6 w-6 text-white" />,
                  color: "neumorphic-tertiary",
                },
                {
                  title: "Peringkat",
                  value: "#15",
                  icon: <BarChart2 className="h-6 w-6 text-white" />,
                  color: "neumorphic-quaternary",
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
                    <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Levels Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Level Pembelajaran</h2>
              <Link href="/levels">
                <Button variant="outline" className="neumorphic-btn">
                  Lihat Semua
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {levels.map((level, index) => (
                <motion.div
                  key={level.id}
                  className={`neumorphic p-5 rounded-xl ${getStatusClass(level.status)} card-hover`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold">{level.name}</h3>
                    {getStatusIcon(level.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{level.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">{level.keterangan}</div>
                    {level.status !== "locked" ? (
                      <Link href={`/level/${level.id}`}>
                        <Button
                          className={`${
                            level.status === "completed"
                              ? "bg-quaternary neumorphic-quaternary"
                              : level.status === "ongoing"
                                ? "bg-accent text-accent-foreground neumorphic-accent"
                                : "bg-primary neumorphic-primary"
                          } text-white`}
                        >
                          {level.status === "completed" ? "Ulangi" : level.status === "ongoing" ? "Lanjutkan" : "Mulai"}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled className="bg-muted text-muted-foreground">
                        Terkunci
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Recent Activity & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <Card className="neumorphic col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Aktivitas Terbaru
                </CardTitle>
                <CardDescription>Materi yang baru saja Anda pelajari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Array Satu Dimensi",
                      level: "Array dan Linked List",
                      time: "2 jam yang lalu",
                      progress: 80,
                      color: "bg-primary",
                    },
                    {
                      title: "Pengenalan Linked List",
                      level: "Array dan Linked List",
                      time: "Kemarin",
                      progress: 60,
                      color: "bg-secondary",
                    },
                    {
                      title: "Quiz: Struktur Data Dasar",
                      level: "Pengenalan Struktur Data",
                      time: "3 hari yang lalu",
                      progress: 100,
                      color: "bg-quaternary",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="neumorphic p-4 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground">{activity.level}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`${activity.color} h-2 rounded-full`}
                          style={{ width: `${activity.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full neumorphic-btn">
                    Lihat Semua Aktivitas
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="neumorphic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  Rekomendasi
                </CardTitle>
                <CardDescription>Materi yang mungkin Anda minati</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Pengenalan Stack",
                      level: "Stack dan Queue",
                      icon: <BookOpen className="h-4 w-4" />,
                    },
                    {
                      title: "Array Multi Dimensi",
                      level: "Array dan Linked List",
                      icon: <BookOpen className="h-4 w-4" />,
                    },
                    {
                      title: "Quiz: Array dan Linked List",
                      level: "Array dan Linked List",
                      icon: <Award className="h-4 w-4" />,
                    },
                  ].map((recommendation, index) => (
                    <div key={index} className="neumorphic p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full neumorphic-accent flex items-center justify-center text-accent-foreground">
                          {recommendation.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{recommendation.title}</h4>
                          <p className="text-xs text-muted-foreground">{recommendation.level}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full neumorphic-btn">
                    Lihat Semua Rekomendasi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Badges & Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="neumorphic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-tertiary" />
                  Badge Terbaru
                </CardTitle>
                <CardDescription>Penghargaan yang Anda dapatkan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 neumorphic-tertiary rounded-full flex items-center justify-center">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">Pemula Struktur Data</h4>
                    <p className="text-sm text-muted-foreground">Menyelesaikan level pertama</p>
                    <p className="text-xs text-muted-foreground mt-1">Diperoleh: 3 hari yang lalu</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full neumorphic-btn">
                  Lihat Semua Badge
                </Button>
              </CardContent>
            </Card>

            <Card className="neumorphic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-quaternary" />
                  Papan Peringkat
                </CardTitle>
                <CardDescription>Posisi Anda dalam peringkat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="neumorphic-quaternary p-4 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-bold">#15</span>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-quaternary">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Anda</span>
                      </div>
                      <span className="font-bold">250 XP</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full neumorphic-btn">
                    Lihat Papan Peringkat
                  </Button>
                </div>
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
