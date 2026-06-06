import type { Quiz, CreateQuizDTO, UpdateQuizDTO, QuizAttempt } from './types'

const STORAGE_KEYS = {
  QUIZZES: 'quizcraft:quizzes',
  ATTEMPTS: 'quizcraft:attempts',
} as const

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function now(): string {
  return new Date().toISOString()
}

function readStorage<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

function writeStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

// ─── Quiz CRUD ────────────────────────────────────────────────────────────────

export const quizService = {
  // READ
  getAll(): Quiz[] {
    return readStorage<Quiz>(STORAGE_KEYS.QUIZZES)
  },

  getById(id: string): Quiz | undefined {
    return this.getAll().find(q => q.id === id)
  },

  // CREATE
  create(dto: CreateQuizDTO): Quiz {
    const quiz: Quiz = {
      ...dto,
      id: generateId(),
      createdAt: now(),
      updatedAt: now(),
    }
    const all = this.getAll()
    writeStorage(STORAGE_KEYS.QUIZZES, [...all, quiz])
    return quiz
  },

  // UPDATE
  update(id: string, dto: UpdateQuizDTO): Quiz {
    const all = this.getAll()
    const index = all.findIndex(q => q.id === id)
    if (index === -1) throw new Error(`Quiz ${id} not found`)

    const updated: Quiz = {
      ...all[index],
      ...dto,
      updatedAt: now(),
    }
    all[index] = updated
    writeStorage(STORAGE_KEYS.QUIZZES, all)
    return updated
  },

  // DELETE
  delete(id: string): void {
    const filtered = this.getAll().filter(q => q.id !== id)
    writeStorage(STORAGE_KEYS.QUIZZES, filtered)
  },

  // ─── Attempts ──────────────────────────────────────────────────────────────

  saveAttempt(attempt: QuizAttempt): void {
    const all = readStorage<QuizAttempt>(STORAGE_KEYS.ATTEMPTS)
    writeStorage(STORAGE_KEYS.ATTEMPTS, [...all, attempt])
  },

  getAttemptsByQuiz(quizId: string): QuizAttempt[] {
    return readStorage<QuizAttempt>(STORAGE_KEYS.ATTEMPTS).filter(
      a => a.quizId === quizId
    )
  },
}
