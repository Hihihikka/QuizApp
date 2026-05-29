import { useState, useMemo, useEffect, useCallback } from 'react'
import type { Quiz, QuizAttempt, QuestionAttempt, AnswerResult } from '../quiz/types'
import { quizService } from '../quiz/quizService'

const QUESTION_TIME_DEFAULT = 15

function generateId(): string {
  return `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
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
  const chestOrder: ('bronze' | 'silver' | 'gold')[] = ['bronze', 'silver', 'gold']
  const count = Math.min(Math.floor(points / 1000), 3 - alreadyOpened)
  return chestOrder.slice(alreadyOpened, alreadyOpened + count)
}

// ─── Публичный интерфейс хука ─────────────────────────────────────────────────

export interface GameSessionState {
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
  shuffledAnswers: string[]
  currentQuestion: Quiz['questions'][number]
  totalQuestions: number
}

export interface GameSessionActions {
  handleAnswer: (answer: string) => void
  handleNext: () => void
  handleRestart: () => void
  handleChestComplete: () => void
}

/**
 * Вся игровая логика изолирована здесь.
 * PlayPage становится чистым презентационным компонентом.
 *
 * quiz — объект Quiz. В будущем придёт из API или из контекста сессии.
 */
export function useGameSession(quiz: Quiz): GameSessionState & GameSessionActions {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isFinished, setIsFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(
    quiz.questions[0]?.timeLimit ?? quiz.defaultTimeLimit ?? QUESTION_TIME_DEFAULT
  )
  const [chestPoints, setChestPoints] = useState(0)
  const [chestsToOpen, setChestsToOpen] = useState<('bronze' | 'silver' | 'gold')[]>([])
  const [isOpeningChest, setIsOpeningChest] = useState(false)
  const [chestsOpenedToday, setChestsOpenedToday] = useState(0)

  // Храним попытки по вопросам для сохранения QuizAttempt
  const [questionAttempts, setQuestionAttempts] = useState<QuestionAttempt[]>([])
  const [attemptStartTime] = useState(() => new Date().toISOString())

  const currentQuestion = quiz.questions[currentIndex]
  const currentTimeLimit =
    currentQuestion?.timeLimit ?? quiz.defaultTimeLimit ?? QUESTION_TIME_DEFAULT

  const shuffledAnswers = useMemo(
    () => shuffleArray(currentQuestion.answers),
    [currentIndex] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // ─── Таймер ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (selectedAnswer || isFinished) return

    const timer = setTimeout(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setSelectedAnswer('__timeout__')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, selectedAnswer, isFinished])

  // ─── Действия ────────────────────────────────────────────────────────────────

  const handleAnswer = useCallback(
    (answer: string) => {
      setSelectedAnswer(answer)

      const isCorrect = answer === currentQuestion.answers[0]
      let pointsEarned = 0

      if (isCorrect) {
        setCorrectCount(prev => prev + 1)
        const bonus = calculateBonus(timeLeft, currentTimeLimit)
        pointsEarned = 500 + bonus
        setScore(prev => prev + pointsEarned)
        setChestPoints(prev => prev + pointsEarned)
      }

      const result: AnswerResult = !isCorrect
        ? answer === '__timeout__'
          ? 'timeout'
          : 'wrong'
        : 'correct'

      setQuestionAttempts(prev => [
        ...prev,
        {
          questionId: currentQuestion.id,
          selectedAnswer: answer === '__timeout__' ? null : answer,
          result,
          timeSpent: currentTimeLimit - timeLeft,
          pointsEarned,
        },
      ])
    },
    [currentQuestion, timeLeft, currentTimeLimit]
  )

  const handleNext = useCallback(() => {
    if (currentIndex + 1 < quiz.questions.length) {
      const nextQuestion = quiz.questions[currentIndex + 1]
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setTimeLeft(nextQuestion.timeLimit ?? quiz.defaultTimeLimit ?? QUESTION_TIME_DEFAULT)
    } else {
      // Игра окончена — сохраняем попытку
      const chests = calculateChests(chestPoints, chestsOpenedToday)
      setChestsToOpen(chests)
      setIsOpeningChest(chests.length > 0)
      setIsFinished(true)

      const attempt: QuizAttempt = {
        id: generateId(),
        quizId: quiz.id,
        startedAt: attemptStartTime,
        finishedAt: new Date().toISOString(),
        score,
        correctCount,
        attempts: questionAttempts,
      }
      quizService.saveAttempt(attempt)
    }
  }, [
    currentIndex,
    quiz,
    chestPoints,
    chestsOpenedToday,
    score,
    correctCount,
    questionAttempts,
    attemptStartTime,
  ])

  const handleRestart = useCallback(() => {
    setCurrentIndex(0)
    setCorrectCount(0)
    setScore(0)
    setSelectedAnswer(null)
    setIsFinished(false)
    setTimeLeft(quiz.questions[0]?.timeLimit ?? quiz.defaultTimeLimit ?? QUESTION_TIME_DEFAULT)
    setChestPoints(0)
    setChestsToOpen([])
    setIsOpeningChest(false)
    setQuestionAttempts([])
  }, [quiz])

  const handleChestComplete = useCallback(() => {
    setChestsOpenedToday(prev => prev + 1)
    setChestsToOpen(prev => {
      const next = prev.slice(1)
      if (next.length === 0) setIsOpeningChest(false)
      return next
    })
  }, [])

  return {
    // state
    currentIndex,
    correctCount,
    score,
    selectedAnswer,
    isFinished,
    timeLeft,
    chestPoints,
    chestsToOpen,
    isOpeningChest,
    chestsOpenedToday,
    shuffledAnswers,
    currentQuestion,
    totalQuestions: quiz.questions.length,
    // actions
    handleAnswer,
    handleNext,
    handleRestart,
    handleChestComplete,
  }
}
