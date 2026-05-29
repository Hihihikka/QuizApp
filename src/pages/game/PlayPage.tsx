import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../components/Header'
import Question from '../../components/Question'
import Answers from '../../components/Answers'
import Sidebar from '../../components/Sidebar'
import LootboxScreen from '../../components/LootboxScreen'
import FinalScreen from '../../components/FinalScreen'
import NextButton from '../../components/NextButton'
import { useGameSession } from '../../features/gameplay/useGameSession'
import { quizService } from '../../features/quiz/quizService'
import type { Quiz } from '../../features/quiz/types'

// ─── Временный fallback-квиз из статичных данных ──────────────────────────────
// Удалить после подключения реального CRUD
import { questions as staticQuestions, QUESTION_TIME } from '../../data/questions'

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
  const [theme, setTheme] = useState('dark')

  // Загружаем квиз: из localStorage по id или fallback
  const quiz = useMemo<Quiz>(() => {
    if (quizId) {
      return quizService.getById(quizId) ?? FALLBACK_QUIZ
    }
    return FALLBACK_QUIZ
  }, [quizId])

  const {
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
    totalQuestions,
    handleAnswer,
    handleNext,
    handleRestart,
    handleChestComplete,
  } = useGameSession(quiz)

  function handleThemeToggle(): void {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.body.setAttribute('data-theme', newTheme)
  }

  return (
    <>
      <Header theme={theme} onThemeToggle={handleThemeToggle} />
      <main className="main">
        <div className="progress">
          <span className="progress__label">
            QUESTION {currentIndex + 1} OF {totalQuestions}
          </span>
          <div className="progress__bar">
            <div
              className="progress__fill"
              style={{
                width: `${
                  ((selectedAnswer ? currentIndex + 1 : currentIndex) / totalQuestions) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {isOpeningChest && chestsToOpen.length > 0 ? (
          <LootboxScreen chestType={chestsToOpen[0]} onComplete={handleChestComplete} />
        ) : isFinished ? (
          <FinalScreen
            score={score}
            total={totalQuestions}
            correctCount={correctCount}
            onRestart={handleRestart}
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
              onAnswer={handleAnswer}
            />
            {selectedAnswer && <NextButton onClick={handleNext} />}
          </>
        )}

        <footer className="footer">
          <p>© 2026 Quiz & Poker. All rights reserved.</p>
        </footer>
      </main>
      <Sidebar
        score={score}
        chestPoints={chestPoints}
        chestsOpenedToday={chestsOpenedToday}
      />
    </>
  )
}