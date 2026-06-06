// ─── Base entities ───────────────────────────────────────────────────────────

export interface Question {
  id: string
  text: string
  /** answers[0] is always the correct answer (order is shuffled in the UI) */
  answers: [string, ...string[]]
  timeLimit?: number // seconds; if omitted, Quiz.defaultTimeLimit is used
}

export type QuizDifficulty = 'easy' | 'medium' | 'hard'

export interface Quiz {
  id: string
  title: string
  description?: string
  difficulty: QuizDifficulty
  defaultTimeLimit: number // default seconds per question
  questions: Question[]
  createdAt: string   // ISO string
  updatedAt: string   // ISO string
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

/** Format pasted by the user into the textarea */
export interface ImportedQuestion {
  text: string
  answers: string[]
  timeLimit?: number
}
