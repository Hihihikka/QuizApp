interface Props {
  text: string
}

export default function Question({ text }: Props) {
  return (
    <div className="question-card">
      <p className="question-card__text">{text}</p>
      <div className="timer">
        <span className="timer__value">12</span>
        <span className="timer__label">sec.</span>
      </div>
    </div>
  )
}