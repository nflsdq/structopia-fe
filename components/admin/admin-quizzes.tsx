"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getQuizzes, getLevels, createQuiz, updateQuiz, deleteQuiz } from "@/lib/api"
import type { Quiz, Level } from "@/lib/api-types"
import { Search, RefreshCw, Plus, Edit, Trash2, Clock, Award, HelpCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time_limit: 15,
    passing_score: 70,
    level_id: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchLevels()
  }, [])

  useEffect(() => {
    if (selectedLevelId) {
      fetchQuizzes(selectedLevelId)
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

  const fetchQuizzes = async (levelId: number) => {
    setIsLoading(true)
    try {
      const response = await getQuizzes(levelId)
      setQuizzes(response.data)
    } catch (error) {
      console.error("Error fetching quizzes:", error)
      toast({
        title: "Gagal memuat quiz",
        description: "Terjadi kesalahan saat memuat data quiz. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddQuiz = async () => {
    try {
      const response = await createQuiz({
        ...formData,
        level_id: Number.parseInt(formData.level_id),
      })
      setQuizzes([...quizzes, response.data])
      setIsAddDialogOpen(false)
      setFormData({
        title: "",
        description: "",
        time_limit: 15,
        passing_score: 70,
        level_id: selectedLevelId?.toString() || "",
      })
      toast({
        title: "Quiz berhasil ditambahkan",
        description: "Quiz baru telah berhasil ditambahkan.",
      })
    } catch (error) {
      console.error("Error adding quiz:", error)
      toast({
        title: "Gagal menambahkan quiz",
        description: "Terjadi kesalahan saat menambahkan quiz. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  const handleEditQuiz = async () => {
    if (!selectedQuiz) return

    try {
      const response = await updateQuiz(selectedQuiz.id, {
        ...formData,
        level_id: Number.parseInt(formData.level_id),
      })
      setQuizzes(quizzes.map((quiz) => (quiz.id === selectedQuiz.id ? response.data : quiz)))
      setIsEditDialogOpen(false)
      setSelectedQuiz(null)
      toast({
        title: "Quiz berhasil diperbarui",
        description: "Quiz telah berhasil diperbarui.",
      })
    } catch (error) {
      console.error("Error updating quiz:", error)
      toast({
        title: "Gagal memperbarui quiz",
        description: "Terjadi kesalahan saat memperbarui quiz. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteQuiz = async () => {
    if (!selectedQuiz) return

    try {
      await deleteQuiz(selectedQuiz.id)
      setQuizzes(quizzes.filter((quiz) => quiz.id !== selectedQuiz.id))
      setIsDeleteDialogOpen(false)
      setSelectedQuiz(null)
      toast({
        title: "Quiz berhasil dihapus",
        description: "Quiz telah berhasil dihapus.",
      })
    } catch (error) {
      console.error("Error deleting quiz:", error)
      toast({
        title: "Gagal menghapus quiz",
        description: "Terjadi kesalahan saat menghapus quiz. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setFormData({
      title: quiz.title,
      description: quiz.description,
      time_limit: quiz.time_limit,
      passing_score: quiz.passing_score,
      level_id: quiz.level_id.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setIsDeleteDialogOpen(true)
  }

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <span className="px-2 py-1 rounded-full text-xs bg-quaternary/10 text-quaternary">Lulus</span>
      case "failed":
        return <span className="px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-500">Gagal</span>
      case "in_progress":
        return <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">Sedang Dikerjakan</span>
      case "completed":
        return <span className="px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary">Selesai</span>
      case "unattempted":
        return <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">Belum Dikerjakan</span>
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">{status}</span>
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Quiz</h1>
        <div className="flex gap-2">
          <Button onClick={() => selectedLevelId && fetchQuizzes(selectedLevelId)} className="neumorphic-btn">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-quaternary hover:bg-quaternary/90 text-white neumorphic-quaternary">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Quiz
              </Button>
            </DialogTrigger>
            <DialogContent className="neumorphic">
              <DialogHeader>
                <DialogTitle>Tambah Quiz Baru</DialogTitle>
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
                  <Label htmlFor="title">Judul Quiz</Label>
                  <Input
                    id="title"
                    placeholder="Masukkan judul quiz"
                    className="neumorphic-inset"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    placeholder="Masukkan deskripsi quiz"
                    className="neumorphic-inset"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time_limit">Batas Waktu (menit)</Label>
                    <Input
                      id="time_limit"
                      type="number"
                      min="1"
                      className="neumorphic-inset"
                      value={formData.time_limit}
                      onChange={(e) => setFormData({ ...formData, time_limit: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passing_score">Nilai Kelulusan (%)</Label>
                    <Input
                      id="passing_score"
                      type="number"
                      min="1"
                      max="100"
                      className="neumorphic-inset"
                      value={formData.passing_score}
                      onChange={(e) => setFormData({ ...formData, passing_score: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="neumorphic-btn">
                    Batal
                  </Button>
                  <Button
                    onClick={handleAddQuiz}
                    className="bg-quaternary hover:bg-quaternary/90 text-white neumorphic-quaternary"
                  >
                    Tambah Quiz
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
            Cari Quiz
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Cari quiz berdasarkan judul atau deskripsi..."
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
                  <th className="px-4 py-3 text-left font-medium">Level</th>
                  <th className="px-4 py-3 text-left font-medium">Waktu</th>
                  <th className="px-4 py-3 text-left font-medium">Nilai Lulus</th>
                  <th className="px-4 py-3 text-left font-medium">Pertanyaan</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
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
                ) : filteredQuizzes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      Tidak ada quiz yang ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredQuizzes.map((quiz) => (
                    <tr key={quiz.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3">{quiz.id}</td>
                      <td className="px-4 py-3 font-medium">{quiz.title}</td>
                      <td className="px-4 py-3">
                        {levels.find((level) => level.id === quiz.level_id)?.name || quiz.level_id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{quiz.time_limit} menit</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-secondary" />
                          <span>{quiz.passing_score}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <HelpCircle className="h-4 w-4 text-tertiary" />
                          <span>{quiz.questions?.length || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(quiz.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 neumorphic-btn"
                            onClick={() => openEditDialog(quiz)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 neumorphic-btn text-red-500"
                            onClick={() => openDeleteDialog(quiz)}
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
            <DialogTitle>Edit Quiz</DialogTitle>
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
              <Label htmlFor="edit-title">Judul Quiz</Label>
              <Input
                id="edit-title"
                placeholder="Masukkan judul quiz"
                className="neumorphic-inset"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Deskripsi</Label>
              <Textarea
                id="edit-description"
                placeholder="Masukkan deskripsi quiz"
                className="neumorphic-inset"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-time_limit">Batas Waktu (menit)</Label>
                <Input
                  id="edit-time_limit"
                  type="number"
                  min="1"
                  className="neumorphic-inset"
                  value={formData.time_limit}
                  onChange={(e) => setFormData({ ...formData, time_limit: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-passing_score">Nilai Kelulusan (%)</Label>
                <Input
                  id="edit-passing_score"
                  type="number"
                  min="1"
                  max="100"
                  className="neumorphic-inset"
                  value={formData.passing_score}
                  onChange={(e) => setFormData({ ...formData, passing_score: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="neumorphic-btn">
                Batal
              </Button>
              <Button
                onClick={handleEditQuiz}
                className="bg-quaternary hover:bg-quaternary/90 text-white neumorphic-quaternary"
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
            <DialogTitle>Hapus Quiz</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              Apakah Anda yakin ingin menghapus quiz <span className="font-bold">{selectedQuiz?.title}</span>? Tindakan
              ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="neumorphic-btn">
                Batal
              </Button>
              <Button onClick={handleDeleteQuiz} className="bg-red-500 hover:bg-red-600 text-white">
                Hapus Quiz
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
