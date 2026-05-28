import { useState, useMemo, useEffect, useCallback } from 'react'
//import { useParams } from 'react-router-dom'
import Header from '../../components/Header'
import Question from '../../components/Question'
import Answers from '../../components/Answers'
import Sidebar from '../../components/Sidebar'
import LootboxScreen from '../../components/LootboxScreen'
import FinalScreen from '../../components/FinalScreen'
import NextButton from '../../components/NextButton'
import { questions, QUESTION_TIME } from '../../data/questions'

export default function PlayPage() {
  //const { sessionCode } = useParams()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isFinished, setIsFinished] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [chestPoints, setChestPoints] = useState(0)
  const [chestsToOpen, setChestsToOpen] = useState<('bronze' | 'silver' | 'gold')[]>([])
  const [isOpeningChest, setIsOpeningChest] = useState(false)
  const [chestsOpenedToday, setChestsOpenedToday] = useState(0)

  function handleThemeToggle(): void {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.body.setAttribute('data-theme', newTheme)
  }

  function shuffleAnswers(answers: string[]): string[] {
    return [...answers].sort(() => Math.random() - 0.5)
  }

  const shuffledAnswers = useMemo(
    () => shuffleAnswers(questions[currentIndex].answers),
    [currentIndex]
  )

  function handleAnswer(answer: string): void {
    setSelectedAnswer(answer)
    if (answer === questions[currentIndex].answers[0]) {
      setCorrectCount(prev => prev + 1)

      const bonus = (() => {
        const firstThird = QUESTION_TIME * (2 / 3)
        if (timeLeft < firstThird) return 0
        return Math.round(30 * Math.log(1 + (timeLeft - firstThird) / (QUESTION_TIME - firstThird)) / Math.log(2))
      })()

      const points = 500 + bonus
      setScore(prev => prev + points)
      setChestPoints(prev => prev + points)
    }
  }

  function handleNext(): void {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setTimeLeft(QUESTION_TIME)
    } else {
      const chests = calculateChests(chestPoints)
      setChestsToOpen(chests)
      setIsOpeningChest(chests.length > 0)
      setIsFinished(true)
    }
  }

  function handleRestart(): void {
    setCurrentIndex(0)
    setCorrectCount(0)
    setScore(0)
    setSelectedAnswer(null)
    setIsFinished(false)
    setTimeLeft(QUESTION_TIME)
  }

  function calculateChests(points: number): ('bronze' | 'silver' | 'gold')[] {
    const chestOrder: ('bronze' | 'silver' | 'gold')[] = ['bronze', 'silver', 'gold']
    const count = Math.min(Math.floor(points / 1000), 3 - chestsOpenedToday)
    return chestOrder.slice(chestsOpenedToday, chestsOpenedToday + count)
  }

  const handleChestComplete = useCallback((): void => {
    setChestsOpenedToday(prev => prev + 1)
    setChestsToOpen(prev => prev.slice(1))
    if (chestsToOpen.length <= 1) {
      setIsOpeningChest(false)
    }
  }, [chestsToOpen.length])

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

  return (
    <>
      <Header theme={theme} onThemeToggle={handleThemeToggle} />
      <main className="main">
        <div className="progress">
          <span className="progress__label">QUESTION {currentIndex + 1} OF {questions.length}</span>
          <div className="progress__bar">
            <div className="progress__fill" style={{ width: `${(selectedAnswer ? currentIndex + 1 : currentIndex) / questions.length * 100}%` }}></div>
          </div>
        </div>

        {isOpeningChest && chestsToOpen.length > 0 ? (
          <LootboxScreen
            chestType={chestsToOpen[0]}
            onComplete={handleChestComplete}
          />
        ) : isFinished ? (
          <FinalScreen score={score} total={questions.length} correctCount={correctCount} onRestart={handleRestart} />
        ) : (
          <>
            <Question
              text={questions[currentIndex].text}
              timeLeft={timeLeft}
              maxTime={QUESTION_TIME}
            />
            <Answers
              answers={shuffledAnswers}
              correctAnswer={questions[currentIndex].answers[0]}
              selectedAnswer={selectedAnswer}
              onAnswer={handleAnswer}
            />
            {selectedAnswer && (
              <NextButton onClick={handleNext} />
            )}
          </>
        )}
        <footer className="footer">
          <p>© 2026 Quiz & Poker. All rights reserved.</p>
        </footer>
      </main>
      <Sidebar score={score} chestPoints={chestPoints} chestsOpenedToday={chestsOpenedToday} />
    </>
  )
}