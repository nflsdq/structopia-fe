// Tipe data untuk API

export interface User {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
  xp?: number
  rank?: number
  badges_count?: number
  joined_at?: string
}

export interface Level {
  id: number
  name: string
  order: number
  description: string
  status: "unlocked" | "ongoing" | "locked" | "completed"
  keterangan: string
  materials?: Material[]
  quizzes?: Quiz[]
}

export interface Material {
  id: number
  level_id: number
  title: string
  type: "text" | "image" | "video" | "code"
  content: string
  order: number
  status: "unread" | "reading" | "completed"
}

export interface Quiz {
  id: number
  level_id: number
  title: string
  description: string
  time_limit: number // dalam menit
  passing_score: number
  questions: Question[]
  status: "unattempted" | "in_progress" | "completed" | "failed" | "passed"
  user_score?: number
}

export interface Question {
  id: number
  quiz_id: number
  question: string
  type: "multiple_choice" | "true_false" | "matching"
  options: Option[]
  correct_answer: string | string[]
  explanation?: string
  points: number
}

export interface Option {
  id: string
  text: string
}

export interface QuizResult {
  quiz_id: number
  user_id: number
  score: number
  passed: boolean
  completed_at: string
  answers: {
    question_id: number
    user_answer: string | string[]
    is_correct: boolean
  }[]
}

export interface UserProgress {
  user_id: number
  level_id: number
  status: "not_started" | "in_progress" | "completed"
  progress_percentage: number
  completed_materials: number[]
  completed_quizzes: number[]
  xp_earned: number
  last_activity_at: string
}

export interface Badge {
  id: number
  name: string
  description: string
  image_url: string
  criteria: string
  earned_at?: string
}

export interface LeaderboardEntry {
  user_id: number
  user_name: string
  user_avatar?: string
  rank: number
  xp: number
  badges_count: number
  level_completed: number
}

export interface AdminStats {
  total_users: number
  active_users: number
  completed_levels: number
  average_quiz_score: number
  total_badges_earned: number
}
