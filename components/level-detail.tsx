"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { MaterialViewer } from "@/components/material-viewer"
import { QuizSystem } from "@/components/quiz-system"
import type { Level, Material, Quiz, UserProgress } from "@/lib/api-types"
import { getUserProgress, getMaterials, getQuizzes, markMaterialAsCompleted } from "@/lib/api"
import {
  ArrowLeft,
  BookOpen,
  Award,
  CheckCircle,
  Clock,
  FileText,
  ImageIcon,
  Video,
  Code,
  ChevronRight,
  ChevronLeft,
  Home,
  Menu,
  X,
  Loader2,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

interface LevelDetailProps {
  level: Level
}

export function LevelDetail({ level }: LevelDetailProps) {
  const [activeTab, setActiveTab] = useState("materi")
  const [materials, setMaterials] = useState<Material[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [activeMaterialIndex, setActiveMaterialIndex] = useState(0)
  const [activeQuizIndex, setActiveQuizIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [level.id])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [materialsResponse, quizzesResponse, progressResponse] = await Promise.all([
        getMaterials(level.id),
        getQuizzes(level.id),
        getUserProgress(level.id),
      ])

      setMaterials(materialsResponse.data)
      setQuizzes(quizzesResponse.data)
      setProgress(progressResponse.data)

      // Set active material to first unread or reading material
      const readingIndex = materialsResponse.data.findIndex((m) => m.status === "reading")
      const unreadIndex = materialsResponse.data.findIndex((m) => m.status === "unread")

      if (readingIndex !== -1) {
        setActiveMaterialIndex(readingIndex)
      } else if (unreadIndex !== -1) {
        setActiveMaterialIndex(unreadIndex)
      }

      // Set active quiz to first unattempted quiz
      const unattemptedIndex = quizzesResponse.data.findIndex((q) => q.status === "unattempted")
      if (unattemptedIndex !== -1) {
        setActiveQuizIndex(unattemptedIndex)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Gagal memuat data",
        description: "Terjadi kesalahan saat memuat data level. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMaterialComplete = async (materialId: number) => {
    try {
      await markMaterialAsCompleted(materialId)

      // Update local state
      setMaterials((prevMaterials) =>
        prevMaterials.map((m) => (m.id === materialId ? { ...m, status: "completed" } : m)),
      )

      // Update progress
      if (progress) {
        const updatedCompletedMaterials = [...progress.completed_materials]
        if (!updatedCompletedMaterials.includes(materialId)) {
          updatedCompletedMaterials.push(materialId)
        }

        const newProgressPercentage = Math.round((updatedCompletedMaterials.length / materials.length) * 100)

        setProgress({
          ...progress,
          completed_materials: updatedCompletedMaterials,
          progress_percentage: newProgressPercentage,
        })
      }

      toast({
        title: "Materi selesai",
        description: "Materi telah ditandai sebagai selesai.",
      })

      // Move to next material if available
      if (activeMaterialIndex < materials.length - 1) {
        setActiveMaterialIndex(activeMaterialIndex + 1)
      }
    } catch (error) {
      console.error("Error marking material as completed:", error)
      toast({
        title: "Gagal menandai materi",
        description: "Terjadi kesalahan saat menandai materi sebagai selesai.",
        variant: "destructive",
      })
    }
  }

  const handleQuizComplete = (quizId: number, passed: boolean, score: number) => {
    // Update local state
    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((q) => (q.id === quizId ? { ...q, status: passed ? "passed" : "failed", user_score: score } : q)),
    )

    // Update progress
    if (progress && passed) {
      const updatedCompletedQuizzes = [...progress.completed_quizzes]
      if (!updatedCompletedQuizzes.includes(quizId)) {
        updatedCompletedQuizzes.push(quizId)
      }

      setProgress({
        ...progress,
        completed_quizzes: updatedCompletedQuizzes,
      })
    }

    toast({
      title: passed ? "Quiz berhasil diselesaikan" : "Quiz gagal",
      description: passed
        ? `Selamat! Anda lulus quiz dengan skor ${score}.`
        : `Anda belum lulus quiz. Skor Anda: ${score}. Silakan coba lagi.`,
      variant: passed ? "default" : "destructive",
    })
  }

  const getNextMaterial = () => {
    if (activeMaterialIndex < materials.length - 1) {
      setActiveMaterialIndex(activeMaterialIndex + 1)
    }
  }

  const getPrevMaterial = () => {
    if (activeMaterialIndex > 0) {
      setActiveMaterialIndex(activeMaterialIndex - 1)
    }
  }

  const getNextQuiz = () => {
    if (activeQuizIndex < quizzes.length - 1) {
      setActiveQuizIndex(activeQuizIndex + 1)
    }
  }

  const getPrevQuiz = () => {
    if (activeQuizIndex > 0) {
      setActiveQuizIndex(activeQuizIndex - 1)
    }
  }

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="h-5 w-5" />
      case "image":
        return <ImageIcon className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "code":
        return <Code className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getMaterialStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "border-l-4 border-quaternary"
      case "reading":
        return "border-l-4 border-primary"
      case "unread":
        return ""
      default:
        return ""
    }
  }

  const getQuizStatusClass = (status: string) => {
    switch (status) {
      case "passed":
        return "border-l-4 border-quaternary"
      case "failed":
        return "border-l-4 border-red-500"
      case "in_progress":
        return "border-l-4 border-primary"
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
          <p className="mt-4 text-lg">Memuat materi...</p>
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
        <div className="p-4 flex flex-col h-full overflow-auto">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/dashboard"
              className="flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </div>

          <div className="neumorphic p-4 rounded-xl mb-4">
            <h1 className="text-xl font-bold mb-1">{level.name}</h1>
            <p className="text-sm text-muted-foreground mb-2">{level.description}</p>
            {progress && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{progress.progress_percentage}%</span>
                </div>
                <Progress value={progress.progress_percentage} className="h-2" />
              </div>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="materi" className="flex-1">
                <BookOpen className="h-4 w-4 mr-2" />
                Materi
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex-1">
                <Award className="h-4 w-4 mr-2" />
                Quiz
              </TabsTrigger>
            </TabsList>

            <TabsContent value="materi" className="mt-0">
              <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {materials.map((material, index) => (
                  <div
                    key={material.id}
                    className={`neumorphic p-3 rounded-xl cursor-pointer ${
                      activeMaterialIndex === index ? "bg-muted" : ""
                    } ${getMaterialStatusClass(material.status)}`}
                    onClick={() => setActiveMaterialIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getMaterialIcon(material.type)}
                        <div>
                          <p className="font-medium text-sm">{material.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {material.status === "completed" ? (
                              <span className="flex items-center text-quaternary">
                                <CheckCircle className="h-3 w-3 mr-1" /> Selesai
                              </span>
                            ) : material.status === "reading" ? (
                              <span className="flex items-center text-primary">
                                <Clock className="h-3 w-3 mr-1" /> Sedang dibaca
                              </span>
                            ) : (
                              <span>Belum dibaca</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="quiz" className="mt-0">
              <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {quizzes.map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className={`neumorphic p-3 rounded-xl cursor-pointer ${
                      activeQuizIndex === index ? "bg-muted" : ""
                    } ${getQuizStatusClass(quiz.status)}`}
                    onClick={() => setActiveQuizIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{quiz.title}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> {quiz.time_limit} menit
                          </span>
                          {quiz.status === "passed" && (
                            <span className="flex items-center text-quaternary">
                              <CheckCircle className="h-3 w-3 mr-1" /> Lulus ({quiz.user_score}%)
                            </span>
                          )}
                          {quiz.status === "failed" && (
                            <span className="flex items-center text-red-500">
                              <X className="h-3 w-3 mr-1" /> Gagal ({quiz.user_score}%)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-auto pt-4">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full neumorphic-btn justify-start">
                <Home className="h-4 w-4 mr-2" />
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {activeTab === "materi" && materials.length > 0 && (
          <motion.div
            key={`material-${materials[activeMaterialIndex].id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="neumorphic p-6 rounded-xl"
          >
            <MaterialViewer
              material={materials[activeMaterialIndex]}
              onComplete={() => handleMaterialComplete(materials[activeMaterialIndex].id)}
            />

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                className="neumorphic-btn"
                onClick={getPrevMaterial}
                disabled={activeMaterialIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                className="neumorphic-btn"
                onClick={getNextMaterial}
                disabled={activeMaterialIndex === materials.length - 1}
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {activeTab === "quiz" && quizzes.length > 0 && (
          <motion.div
            key={`quiz-${quizzes[activeQuizIndex].id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="neumorphic p-6 rounded-xl"
          >
            <QuizSystem
              quiz={quizzes[activeQuizIndex]}
              onComplete={(passed, score) => handleQuizComplete(quizzes[activeQuizIndex].id, passed, score)}
            />

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                className="neumorphic-btn"
                onClick={getPrevQuiz}
                disabled={activeQuizIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Quiz Sebelumnya
              </Button>
              <Button
                variant="outline"
                className="neumorphic-btn"
                onClick={getNextQuiz}
                disabled={activeQuizIndex === quizzes.length - 1}
              >
                Quiz Selanjutnya
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {activeTab === "materi" && materials.length === 0 && (
          <div className="neumorphic p-6 rounded-xl text-center">
            <h2 className="text-xl font-bold mb-2">Tidak ada materi</h2>
            <p className="text-muted-foreground mb-4">Belum ada materi yang tersedia untuk level ini.</p>
          </div>
        )}

        {activeTab === "quiz" && quizzes.length === 0 && (
          <div className="neumorphic p-6 rounded-xl text-center">
            <h2 className="text-xl font-bold mb-2">Tidak ada quiz</h2>
            <p className="text-muted-foreground mb-4">Belum ada quiz yang tersedia untuk level ini.</p>
          </div>
        )}
      </div>
    </div>
  )
}
