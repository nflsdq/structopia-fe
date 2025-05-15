"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getMaterials, getLevels, createMaterial, updateMaterial, deleteMaterial } from "@/lib/api"
import type { Material, Level } from "@/lib/api-types"
import { Search, RefreshCw, Plus, Edit, Trash2, FileText, ImageIcon, Video, Code, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function AdminMaterials() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    type: "text",
    content: "",
    level_id: "",
    order: 1,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchLevels()
  }, [])

  useEffect(() => {
    if (selectedLevelId) {
      fetchMaterials(selectedLevelId)
    }
  }, [selectedLevelId])

  const fetchLevels = async () => {
    try {
      const response = await getLevels()
      setLevels(response.data)
      if (response.data.length > 0) {
        setSelectedLevelId(response.data[0].id)
        setFormData({ ...formData, level_id: response.data[0].id.toString() })
      }
    } catch (error) {
      console.error("Error fetching levels:", error)
      toast({
        title: "Gagal memuat level",
        description: "Terjadi kesalahan saat memuat data level. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  const fetchMaterials = async (levelId: number) => {
    setIsLoading(true)
    try {
      const response = await getMaterials(levelId)
      setMaterials(response.data)
    } catch (error) {
      console.error("Error fetching materials:", error)
      toast({
        title: "Gagal memuat materi",
        description: "Terjadi kesalahan saat memuat data materi. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMaterial = async () => {
    try {
      const response = await createMaterial({
        ...formData,
        level_id: Number.parseInt(formData.level_id),
      })
      setMaterials([...materials, response.data])
      setIsAddDialogOpen(false)
      setFormData({
        title: "",
        type: "text",
        content: "",
        level_id: selectedLevelId?.toString() || "",
        order: materials.length + 1,
      })
      toast({
        title: "Materi berhasil ditambahkan",
        description: "Materi baru telah berhasil ditambahkan.",
      })
    } catch (error) {
      console.error("Error adding material:", error)
      toast({
        title: "Gagal menambahkan materi",
        description: "Terjadi kesalahan saat menambahkan materi. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  const handleEditMaterial = async () => {
    if (!selectedMaterial) return

    try {
      const response = await updateMaterial(selectedMaterial.id, {
        ...formData,
        level_id: Number.parseInt(formData.level_id),
      })
      setMaterials(materials.map((material) => (material.id === selectedMaterial.id ? response.data : material)))
      setIsEditDialogOpen(false)
      setSelectedMaterial(null)
      toast({
        title: "Materi berhasil diperbarui",
        description: "Materi telah berhasil diperbarui.",
      })
    } catch (error) {
      console.error("Error updating material:", error)
      toast({
        title: "Gagal memperbarui materi",
        description: "Terjadi kesalahan saat memperbarui materi. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteMaterial = async () => {
    if (!selectedMaterial) return

    try {
      await deleteMaterial(selectedMaterial.id)
      setMaterials(materials.filter((material) => material.id !== selectedMaterial.id))
      setIsDeleteDialogOpen(false)
      setSelectedMaterial(null)
      toast({
        title: "Materi berhasil dihapus",
        description: "Materi telah berhasil dihapus.",
      })
    } catch (error) {
      console.error("Error deleting material:", error)
      toast({
        title: "Gagal menghapus materi",
        description: "Terjadi kesalahan saat menghapus materi. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (material: Material) => {
    setSelectedMaterial(material)
    setFormData({
      title: material.title,
      type: material.type,
      content: material.content,
      level_id: material.level_id.toString(),
      order: material.order,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (material: Material) => {
    setSelectedMaterial(material)
    setIsDeleteDialogOpen(true)
  }

  const filteredMaterials = materials.filter((material) =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="h-5 w-5 text-primary" />
      case "image":
        return <ImageIcon className="h-5 w-5 text-secondary" />
      case "video":
        return <Video className="h-5 w-5 text-tertiary" />
      case "code":
        return <Code className="h-5 w-5 text-accent-foreground" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="px-2 py-1 rounded-full text-xs bg-quaternary/10 text-quaternary">Selesai</span>
      case "reading":
        return <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">Sedang Dibaca</span>
      case "unread":
        return <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">Belum Dibaca</span>
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">{status}</span>
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Materi</h1>
        <div className="flex gap-2">
          <Button onClick={() => selectedLevelId && fetchMaterials(selectedLevelId)} className="neumorphic-btn">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground neumorphic-accent">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Materi
              </Button>
            </DialogTrigger>
            <DialogContent className="neumorphic">
              <DialogHeader>
                <DialogTitle>Tambah Materi Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="level_id">Level</Label>
                  <Select
                    value={formData.level_id}
                    onValueChange={(value) => setFormData({ ...formData, level_id: value })}
                  >
                    <SelectTrigger className="neumorphic-inset">
                      <SelectValue placeholder="Pilih level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level.id} value={level.id.toString()}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Materi</Label>
                  <Input
                    id="title"
                    placeholder="Masukkan judul materi"
                    className="neumorphic-inset"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipe Materi</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="neumorphic-inset">
                      <SelectValue placeholder="Pilih tipe materi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Teks</SelectItem>
                      <SelectItem value="image">Gambar</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="code">Kode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Konten</Label>
                  <Textarea
                    id="content"
                    placeholder="Masukkan konten materi"
                    className="neumorphic-inset min-h-[200px]"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                    onClick={handleAddMaterial}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground neumorphic-accent"
                  >
                    Tambah Materi
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-1">
          <Label htmlFor="level-filter" className="mb-2 block">
            Filter berdasarkan Level
          </Label>
          <Select
            value={selectedLevelId?.toString() || ""}
            onValueChange={(value) => setSelectedLevelId(Number.parseInt(value))}
          >
            <SelectTrigger className="neumorphic-inset">
              <SelectValue placeholder="Pilih level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level.id} value={level.id.toString()}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label htmlFor="search" className="mb-2 block">
            Cari Materi
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Cari materi berdasarkan judul..."
              className="neumorphic-inset pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card className="neumorphic mb-4">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Judul</th>
                  <th className="px-4 py-3 text-left font-medium">Tipe</th>
                  <th className="px-4 py-3 text-left font-medium">Level</th>
                  <th className="px-4 py-3 text-left font-medium">Urutan</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center">
                      <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    </td>
                  </tr>
                ) : filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      Tidak ada materi yang ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map((material) => (
                    <tr key={material.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3">{material.id}</td>
                      <td className="px-4 py-3 font-medium">{material.title}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(material.type)}
                          <span className="capitalize">{material.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {levels.find((level) => level.id === material.level_id)?.name || material.level_id}
                      </td>
                      <td className="px-4 py-3">{material.order}</td>
                      <td className="px-4 py-3">{getStatusBadge(material.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 neumorphic-btn"
                            onClick={() => openEditDialog(material)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 neumorphic-btn text-red-500"
                            onClick={() => openDeleteDialog(material)}
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
            <DialogTitle>Edit Materi</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-level_id">Level</Label>
              <Select
                value={formData.level_id}
                onValueChange={(value) => setFormData({ ...formData, level_id: value })}
              >
                <SelectTrigger className="neumorphic-inset">
                  <SelectValue placeholder="Pilih level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id.toString()}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-title">Judul Materi</Label>
              <Input
                id="edit-title"
                placeholder="Masukkan judul materi"
                className="neumorphic-inset"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Tipe Materi</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="neumorphic-inset">
                  <SelectValue placeholder="Pilih tipe materi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Teks</SelectItem>
                  <SelectItem value="image">Gambar</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="code">Kode</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Konten</Label>
              <Textarea
                id="edit-content"
                placeholder="Masukkan konten materi"
                className="neumorphic-inset min-h-[200px]"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                onClick={handleEditMaterial}
                className="bg-accent hover:bg-accent/90 text-accent-foreground neumorphic-accent"
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
            <DialogTitle>Hapus Materi</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              Apakah Anda yakin ingin menghapus materi <span className="font-bold">{selectedMaterial?.title}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="neumorphic-btn">
                Batal
              </Button>
              <Button onClick={handleDeleteMaterial} className="bg-red-500 hover:bg-red-600 text-white">
                Hapus Materi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
