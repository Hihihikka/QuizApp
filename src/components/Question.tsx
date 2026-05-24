interface Props {
  text: string
  timeLeft: number
  maxTime: number
}

export default function Question({ text, timeLeft, maxTime }: Props) {
  const percentage = (timeLeft / maxTime) * 100
  const isUrgent = timeLeft <= 5

  return (
    <div className="question-card">
      <p className="question-card__text">{text}</p>
      <div className={`timer ${isUrgent ? 'timer--urgent' : ''}`}>
        <span className="timer__value">{timeLeft}</span>
        <span className="timer__label">sec.</span>
        <svg className="timer__ring" viewBox="0 0 76 76">
          <circle className="timer__ring-bg" cx="38" cy="38" r="34" />
          <circle
            className="timer__ring-fill"
            cx="38" cy="38" r="34"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - percentage / 100)}`}
          />
        </svg>
      </div>
    </div>
  )
}