interface Props {
  answers: string[]
  correctAnswer: string
  selectedAnswer: string | null
  onAnswer: (answer: string) => void
}

export default function Answers({ answers, correctAnswer, selectedAnswer, onAnswer }: Props) {
  return (
    <div className="answers-grid">
      {answers.map(answer => {
        let className = 'answer-btn'
        if (selectedAnswer) {
          if (answer === correctAnswer) className += ' answer-btn--correct'
          else if (answer === selectedAnswer) className += ' answer-btn--wrong'
        }
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