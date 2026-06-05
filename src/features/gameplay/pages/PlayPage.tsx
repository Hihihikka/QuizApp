import { useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import Question from '../components/Question'
import Answers from '../components/Answers'
import LootboxScreen from '../components/LootboxScreen'
import FinalScreen from '../components/FinalScreen'
import NextButton from '../components/NextButton'
import GameSidebar from '../../../components/GameSidebar'
import { useGameStore, selectCurrentQuestion, selectShuffledAnswers } from '../useGameStore'
import { useSidebarContent } from '../../../hooks/useSidebarContent'
import { quizService } from '../../quiz/quizService'
import type { Quiz } from '../../quiz/types'

// ─── Временный fallback-квиз из статичных данных ──────────────────────────────
// Удалить после подключения реального CRUD
import { questions as staticQuestions, QUESTION_TIME } from '../../../data/questions'

const FALLBACK_QUIZ: Quiz = {
  id: 'static-fallback',
  title: 'Demo Quiz',
  difficulty: 'medium',
  defaultTimeLimit: QUESTION_TIME,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: staticQuestions.map((q, i) => ({
    id: `static-${i}`,
    text: q.text,
    answers: q.answers as [string, ...string[]],
  })),
}

// ─── Компонент ────────────────────────────────────────────────────────────────

export default function PlayPage() {
  const { quizId } = useParams<{ quizId?: string }>()
 
  const quiz = useMemo<Quiz>(() => {
    if (quizId) return quizService.getById(quizId) ?? FALLBACK_QUIZ
    return FALLBACK_QUIZ
  }, [quizId])
 
  const { initGame, resetGame, next, answer, restart, chestComplete, tick } = useGameStore()
 
  const {
    currentIndex, selectedAnswer, isFinished,
    timeLeft, score, chestsToOpen, isOpeningChest, correctCount,
  } = useGameStore()
 
  const currentQuestion = useGameStore(selectCurrentQuestion)
  const shuffledAnswers = useGameStore(selectShuffledAnswers)
 
  // Инициализируем игру при маунте / смене квиза
  useEffect(() => {
    initGame(quiz)
    return () => resetGame()
  }, [quiz.id]) // eslint-disable-line react-hooks/exhaustive-deps
 
  // Таймер — дёргает tick() каждую секунду
  useEffect(() => {
    if (selectedAnswer || isFinished) return
    const id = setTimeout(tick, 1000)
    return () => clearTimeout(id)
  }, [timeLeft, selectedAnswer, isFinished]) // eslint-disable-line react-hooks/exhaustive-deps
 
  // Регистрируем компонент сайдбара — GameSidebar читает стор сам
  useSidebarContent(GameSidebar)
 
  if (!currentQuestion) return null
 
  const totalQuestions = quiz.questions.length
 
  return (
    <>
      <ProgressBar
        current={currentIndex + 1}
        total={totalQuestions}
        filled={selectedAnswer ? (currentIndex + 1) / totalQuestions : currentIndex / totalQuestions}
      />
 
      {isOpeningChest && chestsToOpen.length > 0 ? (
        <LootboxScreen
          chestType={chestsToOpen[0]}
          onComplete={chestComplete}
        />
      ) : isFinished ? (
        <FinalScreen
          score={score}
          total={totalQuestions}
          correctCount={correctCount}
          onRestart={restart}
        />
      ) : (
        <>
          <Question
            text={currentQuestion.text}
            timeLeft={timeLeft}
            maxTime={currentQuestion.timeLimit ?? quiz.defaultTimeLimit}
          />
          <Answers
            answers={shuffledAnswers}
            correctAnswer={currentQuestion.answers[0]}
            selectedAnswer={selectedAnswer}
            onAnswer={answer}
          />
          {selectedAnswer && <NextButton onClick={next} />}
        </>
      )}
    </>
  )
}