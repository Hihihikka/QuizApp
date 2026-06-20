import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import Question from '../components/Question'
import Answers from '../components/Answers'
import LootboxScreen from '../components/LootboxScreen'
import FinalScreen from '../components/FinalScreen'
import NextButton from '../components/NextButton'
import GameSidebar from '../../../components/GameSidebar'
import { useGameStore, selectCurrentQuestion } from '../useGameStore'
import { useSidebarContent } from '../../../hooks/useSidebarContent'
import { quizService } from '../../quiz/quizService'
import type { Quiz } from '../../quiz/types'

export default function PlayPage() {
  const { quizId } = useParams<{ quizId?: string }>()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [notFound, setNotFound] = useState(false)

  const {
    currentIndex, selectedAnswer, isFinished,
    timeLeft, score, chestsToOpen, isOpeningChest, correctCount,
    shuffledAnswers,
    initGame, resetGame, next, answer, restart, chestComplete, tick,
  } = useGameStore()

  const currentQuestion = useGameStore(selectCurrentQuestion)

  useEffect(() => {
    if (!quizId) return
    quizService.getById(quizId)
        .then(data => setQuiz(data))
        .catch(() => setNotFound(true))
  }, [quizId])

  useEffect(() => {
    if (!quiz) return
    initGame(quiz)
    return () => resetGame()
  }, [quiz?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!quiz || selectedAnswer || isFinished) return
    const id = setTimeout(tick, 1000)
    return () => clearTimeout(id)
  }, [quiz, timeLeft, selectedAnswer, isFinished]) // eslint-disable-line react-hooks/exhaustive-deps

  useSidebarContent(GameSidebar)

  if (notFound || (!quiz && !quizId)) {
    return (
        <div>
          <h2>Quiz not found</h2>
          <button type="button" onClick={() => navigate('/app/quizzes')}>
            Back to quizzes
          </button>
        </div>
    )
  }

  if (!quiz || !currentQuestion) return <div>Loading...</div>

  const totalQuestions = quiz.questions.length

  return (
      <>
        <ProgressBar
            current={currentIndex + 1}
            total={totalQuestions}
            filled={selectedAnswer ? (currentIndex + 1) / totalQuestions : currentIndex / totalQuestions}
        />

        {isOpeningChest && chestsToOpen.length > 0 ? (
            <LootboxScreen chestType={chestsToOpen[0]} onComplete={chestComplete} />
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
                  isPaused={!!selectedAnswer}
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