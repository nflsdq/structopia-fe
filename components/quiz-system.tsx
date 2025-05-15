"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import type { Quiz, Question } from "@/lib/api-types"
import { submitQuizAnswers } from "@/lib/api"
import { Clock, Award, AlertTriangle, CheckCircle, X, ArrowRight, RotateCcw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface QuizSystemProps {
  quiz: Quiz
  onComplete: (passed: boolean, score: number) => void
}

export function QuizSystem({ quiz, onComplete }: QuizSystemProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({})
  const [timeLeft, setTimeLeft] = useState(quiz.time_limit * 60) // Convert minutes to seconds
  const [quizState, setQuizState] = useState<"not_started" | "in_progress" | "completed">(
    quiz.status === "unattempted" || quiz.status === "failed" ? "not_started" : "completed",
  )
  const [result, setResult] = useState<{
    score: number
    passed: boolean
    answers: { question_id: number; user_answer: string | string[]; is_correct: boolean }[]
  } | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (quizState === "in_progress" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [quizState, timeLeft])

  const startQuiz = () => {
    setQuizState("in_progress")
    setTimeLeft(quiz.time_limit * 60)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setResult(null)
  }

  const handleAnswer = (questionId: number, answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      const unansweredCount = quiz.questions.length - Object.keys(answers).length
      toast({
        title: "Pertanyaan belum dijawab",
        description: `Anda masih memiliki ${unansweredCount} pertanyaan yang belum dijawab.`,
        variant: "destructive",
      })
      return
    }

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        question_id: Number.parseInt(questionId),
        answer,
      }))

      const response = await submitQuizAnswers(quiz.id, formattedAnswers)
      const quizResult = response.data

      setResult({
        score: quizResult.score,
        passed: quizResult.passed,
        answers: quizResult.answers,
      })

      setQuizState("completed")
      onComplete(quizResult.passed, quizResult.score)
    } catch (error) {
      console.error("Error submitting quiz:", error)
      toast({
        title: "Gagal mengirim jawaban",
        description: "Terjadi kesalahan saat mengirim jawaban quiz. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "multiple_choice":
        return (
          <RadioGroup
            value={answers[question.id]?.toString() || ""}
            onValueChange={(value) => handleAnswer(question.id, value)}
          >
            <div className="space-y-3">
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.id}
                    id={`option-${question.id}-${option.id}`}
                    className="neumorphic-inset"
                  />
                  <Label htmlFor={`option-${question.id}-${option.id}`} className="text-base">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )
      case "true_false":
        return (
          <RadioGroup
            value={answers[question.id]?.toString() || ""}
            onValueChange={(value) => handleAnswer(question.id, value)}
          >
            <div className="space-y-3">
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.id}
                    id={`option-${question.id}-${option.id}`}
                    className="neumorphic-inset"
                  />
                  <Label htmlFor={`option-${question.id}-${option.id}`} className="text-base">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )
      default:
        return <p>Tipe pertanyaan tidak didukung</p>
    }
  }

  const renderQuizContent = () => {
    if (quizState === "not_started") {
      return (
        <div className="text-center">
          <div className="w-16 h-16 neumorphic-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-accent-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
          <p className="text-muted-foreground mb-6">{quiz.description}</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
            <div className="neumorphic p-3 rounded-xl flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              <span>Waktu: {quiz.time_limit} menit</span>
            </div>
            <div className="neumorphic p-3 rounded-xl flex items-center">
              <Award className="h-5 w-5 mr-2 text-secondary" />
              <span>Nilai Lulus: {quiz.passing_score}%</span>
            </div>
            <div className="neumorphic p-3 rounded-xl flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-accent" />
              <span>Jumlah Soal: {quiz.questions.length}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Pastikan Anda memiliki waktu yang cukup untuk menyelesaikan quiz ini. Timer akan dimulai segera setelah Anda
            memulai quiz.
          </p>
          <Button
            onClick={startQuiz}
            className="bg-primary hover:bg-primary/90 text-white neumorphic-primary px-6 py-2"
          >
            Mulai Quiz
          </Button>
        </div>
      )
    }

    if (quizState === "in_progress") {
      const currentQuestion = quiz.questions[currentQuestionIndex]
      const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{quiz.title}</h2>
            <div className="neumorphic p-2 rounded-xl flex items-center text-primary">
              <Clock className="h-5 w-5 mr-2" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>
                Pertanyaan {currentQuestionIndex + 1} dari {quiz.questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="neumorphic p-6 rounded-xl mb-6">
            <h3 className="text-lg font-medium mb-4">
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </h3>
            {renderQuestion(currentQuestion)}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              className="neumorphic-btn"
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Sebelumnya
            </Button>
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <Button
                className="bg-primary hover:bg-primary/90 text-white neumorphic-primary"
                onClick={nextQuestion}
                disabled={!answers[currentQuestion.id]}
              >
                Selanjutnya
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                className="bg-quaternary hover:bg-quaternary/90 text-white neumorphic-quaternary"
                onClick={handleSubmit}
              >
                Selesai
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      )
    }

    if (quizState === "completed" && result) {
      return (
        <div className="text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              result.passed ? "neumorphic-quaternary" : "neumorphic-primary"
            }`}
          >
            {result.passed ? <CheckCircle className="h-8 w-8 text-white" /> : <X className="h-8 w-8 text-white" />}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {result.passed ? "Selamat! Anda Lulus Quiz" : "Maaf, Anda Belum Lulus Quiz"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {result.passed
              ? "Anda telah berhasil menyelesaikan quiz ini dengan baik."
              : "Jangan menyerah! Anda dapat mencoba lagi untuk meningkatkan pemahaman Anda."}
          </p>

          <div className="neumorphic p-6 rounded-xl mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Skor Anda</span>
              <span className="text-2xl font-bold">{result.score}%</span>
            </div>
            <Progress
              value={result.score}
              className={`h-3 ${result.passed ? "bg-quaternary/20" : "bg-primary/20"}`}
              indicatorClassName={result.passed ? "bg-quaternary" : "bg-primary"}
            />
            <div className="flex justify-between text-sm mt-1">
              <span>0%</span>
              <span className={`${result.passed ? "text-quaternary" : "text-primary"}`}>
                Nilai Lulus: {quiz.passing_score}%
              </span>
              <span>100%</span>
            </div>
          </div>

          <div className="neumorphic p-6 rounded-xl mb-6 text-left">
            <h3 className="text-lg font-medium mb-4">Ringkasan Jawaban</h3>
            <div className="space-y-4">
              {result.answers.map((answer, index) => {
                const question = quiz.questions.find((q) => q.id === answer.question_id)
                return (
                  <div key={answer.question_id} className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                        answer.is_correct ? "bg-quaternary text-white" : "bg-red-500 text-white"
                      }`}
                    >
                      {answer.is_correct ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">
                        {index + 1}. {question?.question}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Jawaban Anda:{" "}
                        {Array.isArray(answer.user_answer)
                          ? answer.user_answer.join(", ")
                          : question?.options.find((o) => o.id === answer.user_answer)?.text || answer.user_answer}
                      </p>
                      {!answer.is_correct && question && (
                        <p className="text-sm text-quaternary">
                          Jawaban Benar:{" "}
                          {Array.isArray(question.correct_answer)
                            ? question.correct_answer
                                .map((ans) => question.options.find((o) => o.id === ans)?.text || ans)
                                .join(", ")
                            : question.options.find((o) => o.id === question.correct_answer)?.text ||
                              question.correct_answer}
                        </p>
                      )}
                      {question?.explanation && !answer.is_correct && (
                        <p className="text-sm italic mt-1">{question.explanation}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {!result.passed && (
            <Button
              onClick={startQuiz}
              className="bg-primary hover:bg-primary/90 text-white neumorphic-primary px-6 py-2"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          )}
        </div>
      )
    }

    return null
  }

  return <div>{renderQuizContent()}</div>
}
