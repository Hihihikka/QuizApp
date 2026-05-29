// ─── Базовые сущности ────────────────────────────────────────────────────────

export interface Question {
  id: string
  text: string
  /** answers[0] — всегда правильный ответ (порядок перемешивается на UI) */
  answers: [string, ...string[]]
  timeLimit?: number // секунд, если не задано — берётся из Quiz.defaultTimeLimit
}

export type QuizDifficulty = 'easy' | 'medium' | 'hard'

export interface Quiz {
  id: string
  title: string
  description?: string
  difficulty: QuizDifficulty
  defaultTimeLimit: number // секунд на вопрос по умолчанию
  questions: Question[]
  createdAt: string   // ISO string
  updatedAt: string   // ISO string
}

// ─── Игровые сессии (понадобятся при добавлении бэкенда) ─────────────────────

export type AnswerResult = 'correct' | 'wrong' | 'timeout'

export interface QuestionAttempt {
  questionId: string
  selectedAnswer: string | null
  result: AnswerResult
  timeSpent: number   // секунд
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
  // userId будет добавлен при интеграции auth
}

// ─── CRUD-операции ────────────────────────────────────────────────────────────

export type CreateQuizDTO = Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateQuizDTO = Partial<Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>>

// ─── JSON-импорт вопросов ─────────────────────────────────────────────────────

/** Формат который пользователь вставляет в textarea */
export interface ImportedQuestion {
  text: string
  answers: string[]
  timeLimit?: number
}
