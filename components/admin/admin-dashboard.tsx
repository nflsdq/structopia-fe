"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { AdminStats } from "@/components/admin/admin-stats"
import { AdminUsers } from "@/components/admin/admin-users"
import { AdminLevels } from "@/components/admin/admin-levels"
import { AdminMaterials } from "@/components/admin/admin-materials"
import { AdminQuizzes } from "@/components/admin/admin-quizzes"
import { LayoutDashboard, Users, BookOpen, FileText, HelpCircle, LogOut, Menu, X, User, Home } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  const handleLogout = async () => {
    await logout()
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari akun",
    })
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
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
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-2">Menu Admin</div>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                activeTab === "dashboard" ? "neumorphic-primary text-white" : "hover:bg-muted"
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                activeTab === "users" ? "neumorphic-secondary text-white" : "hover:bg-muted"
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Pengguna</span>
            </button>
            <button
              onClick={() => setActiveTab("levels")}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                activeTab === "levels" ? "neumorphic-tertiary text-white" : "hover:bg-muted"
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Level</span>
            </button>
            <button
              onClick={() => setActiveTab("materials")}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                activeTab === "materials" ? "neumorphic-accent text-accent-foreground" : "hover:bg-muted"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Materi</span>
            </button>
            <button
              onClick={() => setActiveTab("quizzes")}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                activeTab === "quizzes" ? "neumorphic-quaternary text-white" : "hover:bg-muted"
              }`}
            >
              <HelpCircle className="h-5 w-5" />
              <span>Quiz</span>
            </button>
          </div>

          <div className="mt-auto space-y-2">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full neumorphic-btn justify-start">
                <Home className="h-4 w-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
            <Button variant="outline" className="w-full neumorphic-btn justify-start" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="dashboard" className="mt-0">
            <AdminStats />
          </TabsContent>
          <TabsContent value="users" className="mt-0">
            <AdminUsers />
          </TabsContent>
          <TabsContent value="levels" className="mt-0">
            <AdminLevels />
          </TabsContent>
          <TabsContent value="materials" className="mt-0">
            <AdminMaterials />
          </TabsContent>
          <TabsContent value="quizzes" className="mt-0">
            <AdminQuizzes />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-8 py-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Structopia. Panel Admin. Hak Cipta Dilindungi.
        </footer>
      </div>
    </div>
  )
}
