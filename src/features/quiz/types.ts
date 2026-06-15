// ─── Base entities ───────────────────────────────────────────────────────────

export interface Question {
  id: string
  text: string
  answers: [string, ...string[]]
  timeLimit?: number
}

export type QuizDifficulty = 'easy' | 'medium' | 'hard'

export interface Quiz {
  id: string
  title: string
  description?: string
  difficulty: QuizDifficulty
  defaultTimeLimit: number
  questions: Question[]
  createdAt: string
  updatedAt: string
}

// ─── Game sessions (needed when adding the backend) ──────────────────────────

export type AnswerResult = 'correct' | 'wrong' | 'timeout'

export interface QuestionAttempt {
  questionId: string
  selectedAnswer: string | null
  result: AnswerResult
  timeSpent: number   // seconds
  pointsEarned: number
}

export interface QuizAttempt {
  id: string
  quizId: string
  startedAt: string
  finishedAt?: string
  score: number
  correctCount: number
  attempts: QuestionAttempt[]
  // userId will be added when auth is integrated
}

// ─── CRUD operations ─────────────────────────────────────────────────────────

export type CreateQuizDTO = Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateQuizDTO = Partial<Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>>

// ─── JSON question import ────────────────────────────────────────────────────
export interface ImportedQuestion {
  text: string
  answers: string[]
  timeLimit?: number
}
