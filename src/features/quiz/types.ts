// ─── Источник правды ──────────────────────────────────────────────────────────
// Все типы ниже выводятся из api-types.ts — файла, сгенерированного автоматически
// командой `npm run generate:types` из реальной OpenAPI-спеки бэкенда (Swagger).
// Никогда не редактировать api-types.ts руками и не дублировать его поля здесь —
// при изменении формы DTO на бэке достаточно перегенерировать типы, и любой
// рассинхрон тут же подсветится ошибками TS по всему фронту.
import type { components } from './api-types'

type Schemas = components['schemas']

// ─── Base entities ───────────────────────────────────────────────────────────

export type QuizDifficulty = Schemas['QuizResponseDto']['difficulty']

// answers как минимум с одним элементом — гарантия, специфичная для фронта
// (бэк/OpenAPI этого не выражает), сужаем тип поверх сгенерированной схемы.
export type Question = Omit<Schemas['QuestionResponseDto'], 'answers'> & {
  answers: [string, ...string[]]
}

// Вопрос-черновик: ещё не сохранён в БД (импорт из JSON, форма создания/редактирования
// до сабмита) — поэтому без id/quizId, которые присваивает бэкенд. После сохранения
// квиза бэк вернёт уже полноценные Question.
export type DraftQuestion = Omit<Question, 'id' | 'quizId'>

export type Quiz = Omit<Schemas['QuizResponseDto'], 'questions'> & {
  questions: Question[]
}

// ─── Game sessions (needed when adding the backend) ──────────────────────────
// QuizAttempt пока не существует на бэке (нет своей Prisma-модели и эндпоинта),
// поэтому эта часть остаётся написанной вручную. Когда бэк появится — перенести
// сюда так же, через components['schemas'].

export type AnswerResult = 'correct' | 'wrong' | 'timeout'

export interface QuestionAttempt {
  questionId: number
  selectedAnswer: string | null
  result: AnswerResult
  timeSpent: number   // seconds
  pointsEarned: number
}

export interface QuizAttempt {
  id: string   // клиентский временный id (generateId()); своей модели на бэке пока нет
  quizId: number
  startedAt: string
  finishedAt?: string
  score: number
  correctCount: number
  attempts: QuestionAttempt[]
  // userId will be added when auth is integrated
}

// ─── CRUD operations ─────────────────────────────────────────────────────────
// Берутся напрямую из сгенерированных DTO бэка, а не выводятся через Omit<Quiz, ...> —
// это устраняет случай, когда форма "что отправляем" незаметно расходится
// с формой "что получаем" (раньше они совпадали только потому, что так написали руками).

export type CreateQuizDTO = Schemas['CreateQuizDto']
export type UpdateQuizDTO = Schemas['UpdateQuizDto']

// ─── JSON question import ────────────────────────────────────────────────────
export interface ImportedQuestion {
  text: string
  answers: string[]
  timeLimit?: number
}