import { useState, useMemo } from 'react'
import Header from './components/Header'
import Question from './components/Question'
import Answers from './components/Answers'
import Sidebar from './components/Sidebar'
import FinalScreen from './components/FinalScreen'
import NextButton from './components/NextButton'
import { questions } from './data/questions'

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isFinished, setIsFinished] = useState(false)

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
        setScore(prev => prev + 100)
      }
    }

  function handleNext(): void {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
    } else {
      setIsFinished(true)
    }
  }

  function handleRestart(): void {
    setCurrentIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setIsFinished(false)
  }

  return (
    <>
      <Header />
      <main className="main">
        <div className="progress">
          <span className="progress__label">QUESTION {currentIndex + 1} OF {questions.length}</span>
          <div className="progress__bar">
            <div className="progress__fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>

        {isFinished ? (
          <FinalScreen score={score} total={questions.length} onRestart={handleRestart} />
        ) : (
          <>
            <Question text={questions[currentIndex].text} />
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
      <Sidebar score={score} />
    </>
  )
}