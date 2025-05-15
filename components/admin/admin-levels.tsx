"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getLevels, createLevel, updateLevel, deleteLevel } from "@/lib/api"
import type { Level } from "@/lib/api-types"
import { Search, RefreshCw, Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function AdminLevels() {
  const [levels, setLevels] = useState<Level[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    order: 1,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchLevels()
  }, [])

  const fetchLevels = async () => {
    setIsLoading(true)
    try {
      const response = await getLevels()
      setLevels(response.data)
    } catch (error) {
      console.error("Error fetching levels:", error)
      toast({
        title: "Gagal memuat level",
        description: "Terjadi kesalahan saat memuat data level. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLevel = async () => {
    try {
      const response = await createLevel(formData)
      setLevels([...levels, response.data])
      setIsAddDialogOpen(false)
      setFormData({ name: "", description: "", order: levels.length + 1 })
      toast({
        title: "Level berhasil ditambahkan",
        description: "Level baru telah berhasil ditambahkan.",
      })
    } catch (error) {
      console.error("Error adding level:", error)
      toast({
        title: "Gagal menambahkan level",
        description: "Terjadi kesalahan saat menambahkan level. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  const handleEditLevel = async () => {
    if (!selectedLevel) return

    try {
      const response = await updateLevel(selectedLevel.id, formData)
      setLevels(levels.map((level) => (level.id === selectedLevel.id ? response.data : level)))
      setIsEditDialogOpen(false)
      setSelectedLevel(null)
      toast({
        title: "Level berhasil diperbarui",
        description: "Level telah berhasil diperbarui.",
      })
    } catch (error) {
      console.error("Error updating level:", error)
      toast({
        title: "Gagal memperbarui level",
        description: "Terjadi kesalahan saat memperbarui level. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLevel = async () => {
    if (!selectedLevel) return

    try {
      await deleteLevel(selectedLevel.id)
      setLevels(levels.filter((level) => level.id !== selectedLevel.id))
      setIsDeleteDialogOpen(false)
      setSelectedLevel(null)
      toast({
        title: "Level berhasil dihapus",
        description: "Level telah berhasil dihapus.",
      })
    } catch (error) {
      console.error("Error deleting level:", error)
      toast({
        title: "Gagal menghapus level",
        description: "Terjadi kesalahan saat menghapus level. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (level: Level) => {
    setSelectedLevel(level)
    setFormData({
      name: level.name,
      description: level.description,
      order: level.order,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (level: Level) => {
    setSelectedLevel(level)
    setIsDeleteDialogOpen(true)
  }

  const filteredLevels = levels.filter(
    (level) =>
      level.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      level.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="px-2 py-1 rounded-full text-xs bg-quaternary/10 text-quaternary">Selesai</span>
      case "ongoing":
        return <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">Sedang Dipelajari</span>
      case "unlocked":
        return <span className="px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary">Terbuka</span>
      case "locked":
        return <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">Terkunci</span>
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">{status}</span>
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Level</h1>
        <div className="flex gap-2">
          <Button onClick={fetchLevels} className="neumorphic-btn">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-tertiary hover:bg-tertiary/90 text-white neumorphic-tertiary">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Level
              </Button>
            </DialogTrigger>
            <DialogContent className="neumorphic">
              <DialogHeader>
                <DialogTitle>Tambah Level Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Level</Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama level"
                    className="neumorphic-inset"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    placeholder="Masukkan deskripsi level"
                    className="neumorphic-inset"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Urutan</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    className="neumorphic-inset"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="neumorphic-btn">
                    Batal
                  </Button>
                  <Button
                    onClick={handleAddLevel}
                    className="bg-tertiary hover:bg-tertiary/90 text-white neumorphic-tertiary"
                  >
                    Tambah Level
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari level berdasarkan nama atau deskripsi..."
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
                  <th className="px-4 py-3 text-left font-medium">Nama</th>
                  <th className="px-4 py-3 text-left font-medium">Deskripsi</th>
                  <th className="px-4 py-3 text-left font-medium">Urutan</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    </td>
                  </tr>
                ) : filteredLevels.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Tidak ada level yang ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredLevels.map((level) => (
                    <tr key={level.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3">{level.id}</td>
                      <td className="px-4 py-3 font-medium">{level.name}</td>
                      <td className="px-4 py-3">{level.description}</td>
                      <td className="px-4 py-3">{level.order}</td>
                      <td className="px-4 py-3">{getStatusBadge(level.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 neumorphic-btn"
                            onClick={() => openEditDialog(level)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 neumorphic-btn text-red-500"
                            onClick={() => openDeleteDialog(level)}
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="neumorphic">
          <DialogHeader>
            <DialogTitle>Edit Level</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama Level</Label>
              <Input
                id="edit-name"
                placeholder="Masukkan nama level"
                className="neumorphic-inset"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Deskripsi</Label>
              <Textarea
                id="edit-description"
                placeholder="Masukkan deskripsi level"
                className="neumorphic-inset"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-order">Urutan</Label>
              <Input
                id="edit-order"
                type="number"
                min="1"
                className="neumorphic-inset"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="neumorphic-btn">
                Batal
              </Button>
              <Button
                onClick={handleEditLevel}
                className="bg-tertiary hover:bg-tertiary/90 text-white neumorphic-tertiary"
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="neumorphic">
          <DialogHeader>
            <DialogTitle>Hapus Level</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              Apakah Anda yakin ingin menghapus level <span className="font-bold">{selectedLevel?.name}</span>? Tindakan
              ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="neumorphic-btn">
                Batal
              </Button>
              <Button onClick={handleDeleteLevel} className="bg-red-500 hover:bg-red-600 text-white">
                Hapus Level
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
