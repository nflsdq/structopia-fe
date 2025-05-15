"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAdminUsers } from "@/lib/api"
import type { User } from "@/lib/api-types"
import { Search, RefreshCw, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [currentPage])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await getAdminUsers(currentPage)
      setUsers(response.data)
      setTotalPages(response.meta?.last_page || 1)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Gagal memuat pengguna",
        description: "Terjadi kesalahan saat memuat data pengguna. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return format(new Date(dateString), "d MMMM yyyy", { locale: id })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
        <Button onClick={fetchUsers} className="neumorphic-btn">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pengguna berdasarkan nama atau email..."
            className="neumorphic-inset pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="neumorphic mb-4">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Pengguna</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Peran</th>
                  <th className="px-4 py-3 text-left font-medium">XP</th>
                  <th className="px-4 py-3 text-left font-medium">Peringkat</th>
                  <th className="px-4 py-3 text-left font-medium">Bergabung</th>
                  <th className="px-4 py-3 text-left font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center">
                      <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      Tidak ada pengguna yang ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3">{user.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                            <Image
                              src={user.avatar || "/placeholder.svg?height=50&width=50"}
                              alt={user.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.role === "admin" ? "bg-tertiary/10 text-tertiary" : "bg-primary/10 text-primary"
                          }`}
                        >
                          {user.role === "admin" ? "Admin" : "Siswa"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{user.xp || 0}</td>
                      <td className="px-4 py-3">#{user.rank || "-"}</td>
                      <td className="px-4 py-3">{formatDate(user.joined_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-8 px-2 neumorphic-btn">
                            Detail
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 px-2 neumorphic-btn">
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Halaman {currentPage} dari {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || isLoading}
            className="neumorphic-btn"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || isLoading}
            className="neumorphic-btn"
          >
            Selanjutnya <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
