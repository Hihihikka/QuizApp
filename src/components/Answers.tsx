import s from './Answers.module.css'

interface Props {
  answers: string[]
  correctAnswer: string
  selectedAnswer: string | null
  onAnswer: (answer: string) => void
}

export default function Answers({ answers, correctAnswer, selectedAnswer, onAnswer }: Props) {
  return (
    <div className={s.grid}>
      {answers.map(answer => {
        const isCorrect = selectedAnswer && answer === correctAnswer
        const isWrong = selectedAnswer && answer === selectedAnswer && answer !== correctAnswer

        const className = [
          s.btn,
          isCorrect && s.correct,
          isWrong && s.wrong,
        ].filter(Boolean).join(' ')

        return (
          <button
            key={answer}
            className={className}
            disabled={!!selectedAnswer}
            onClick={() => onAnswer(answer)}
          >
            {answer}
          </button>
        )
      })}
    </div>
  )
}