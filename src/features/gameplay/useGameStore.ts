import { create } from 'zustand'
import type { Quiz, QuizAttempt, QuestionAttempt, AnswerResult } from '../quiz/types'

// ─── Типы ────────────────────────────────────────────────────────────────────

interface GameState {
  quiz: Quiz | null
  currentIndex: number
  correctCount: number
  score: number
  selectedAnswer: string | null
  isFinished: boolean
  timeLeft: number
  chestPoints: number
  chestsToOpen: ('bronze' | 'silver' | 'gold')[]
  isOpeningChest: boolean
  chestsOpenedToday: number
  questionAttempts: QuestionAttempt[]
  attemptStartTime: string | null
  shuffledAnswers: string[]
}

interface GameActions {
  initGame: (quiz: Quiz) => void
  answer: (answer: string) => void
  next: () => void
  restart: () => void
  chestComplete: () => void
  tick: () => void
  resetGame: () => void  // при уходе со страницы
}

// ─── Вспомогательные ─────────────────────────────────────────────────────────

function generateId(): string {
  return `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function calculateBonus(timeLeft: number, totalTime: number): number {
  const firstThird = totalTime * (2 / 3)
  if (timeLeft < firstThird) return 0
  return Math.round(
      30 * Math.log(1 + (timeLeft - firstThird) / (totalTime - firstThird)) / Math.log(2)
  )
}

function calculateChests(
    points: number,
    alreadyOpened: number
): ('bronze' | 'silver' | 'gold')[] {
  const order: ('bronze' | 'silver' | 'gold')[] = ['bronze', 'silver', 'gold']
  const count = Math.min(Math.floor(points / 1000), 3 - alreadyOpened)
  return order.slice(alreadyOpened, alreadyOpened + count)
}

function shuffleAnswers(answers: string[]): string[] {
  return [...answers].sort(() => Math.random() - 0.5)
}

const INITIAL_STATE: GameState = {
  quiz: null,
  currentIndex: 0,
  correctCount: 0,
  score: 0,
  selectedAnswer: null,
  isFinished: false,
  timeLeft: 15,
  chestPoints: 0,
  chestsToOpen: [],
  isOpeningChest: false,
  chestsOpenedToday: 0,
  questionAttempts: [],
  attemptStartTime: null,
  shuffledAnswers: [],
}

// ─── Стор ─────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...INITIAL_STATE,

  initGame: (quiz) => {
    set({
      ...INITIAL_STATE,
      quiz,
      timeLeft: quiz.questions[0]?.timeLimit ?? quiz.defaultTimeLimit,
      attemptStartTime: new Date().toISOString(),
      shuffledAnswers: quiz.questions[0] ? shuffleAnswers(quiz.questions[0].answers) : [],
    })
  },

  answer: (answer) => {
    const { quiz, currentIndex, timeLeft, correctCount, score, chestPoints, questionAttempts } = get()
    if (!quiz || get().selectedAnswer) return

    const currentQuestion = quiz.questions[currentIndex]
    const currentTimeLimit = currentQuestion.timeLimit ?? quiz.defaultTimeLimit
    const isCorrect = answer === currentQuestion.answers[0]

    let pointsEarned = 0
    if (isCorrect) {
      const bonus = calculateBonus(timeLeft, currentTimeLimit)
      pointsEarned = 500 + bonus
    }

    const result: AnswerResult =
        answer === '__timeout__' ? 'timeout' : isCorrect ? 'correct' : 'wrong'

    set({
      selectedAnswer: answer,
      correctCount: isCorrect ? correctCount + 1 : correctCount,
      score: score + pointsEarned,
      chestPoints: chestPoints + pointsEarned,
      questionAttempts: [
        ...questionAttempts,
        {
          // quiz здесь всегда загружен с бэка (см. PlayPage), поэтому id у вопроса
          // гарантированно есть; опциональность в типе нужна только для ещё
          // не сохранённых вопросов в CreateQuizDTO
          questionId: currentQuestion.id!,
          selectedAnswer: answer === '__timeout__' ? null : answer,
          result,
          timeSpent: currentTimeLimit - timeLeft,
          pointsEarned,
        },
      ],
    })
  },

  next: () => {
    const {
      quiz, currentIndex, chestPoints, chestsOpenedToday,
      score, correctCount, questionAttempts, attemptStartTime,
    } = get()
    if (!quiz) return

    if (currentIndex + 1 < quiz.questions.length) {
      const nextQuestion = quiz.questions[currentIndex + 1]
      set({
        currentIndex: currentIndex + 1,
        selectedAnswer: null,
        timeLeft: nextQuestion.timeLimit ?? quiz.defaultTimeLimit,
        shuffledAnswers: shuffleAnswers(nextQuestion.answers),
      })
    } else {
      const chests = calculateChests(chestPoints, chestsOpenedToday)

      const attempt: QuizAttempt = {
        id: generateId(),
        quizId: quiz.id,
        startedAt: attemptStartTime ?? new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        score,
        correctCount,
        attempts: questionAttempts,
      }
      // TODO: бэкенд пока не поддерживает сохранение попыток (нет модели QuizAttempt
      // в schema.prisma и эндпоинта в QuizController). Когда появится — отправлять
      // attempt туда, например через quizService.saveAttempt(attempt).
      console.info('Quiz attempt finished (not yet persisted):', attempt)

      set({
        isFinished: true,
        chestsToOpen: chests,
        isOpeningChest: chests.length > 0,
      })
    }
  },

  restart: () => {
    const { quiz } = get()
    if (!quiz) return
    set({
      ...INITIAL_STATE,
      quiz,
      timeLeft: quiz.questions[0]?.timeLimit ?? quiz.defaultTimeLimit,
      attemptStartTime: new Date().toISOString(),
      shuffledAnswers: quiz.questions[0] ? shuffleAnswers(quiz.questions[0].answers) : [],
    })
  },

  chestComplete: () => {
    const { chestsToOpen, chestsOpenedToday } = get()
    const remaining = chestsToOpen.slice(1)
    set({
      chestsToOpen: remaining,
      chestsOpenedToday: chestsOpenedToday + 1,
      isOpeningChest: remaining.length > 0,
    })
  },

  tick: () => {
    const { selectedAnswer, isFinished, timeLeft } = get()
    if (selectedAnswer || isFinished) return

    if (timeLeft <= 1) {
      set({ timeLeft: 0 })
      get().answer('__timeout__')
    } else {
      set({ timeLeft: timeLeft - 1 })
    }
  },

  resetGame: () => set(INITIAL_STATE),
}))

// ─── Селекторы (для удобства и оптимизации ре-рендеров) ──────────────────────

export const selectCurrentQuestion = (state: GameState) => {
  if (!state.quiz) return null
  return state.quiz.questions[state.currentIndex]
}