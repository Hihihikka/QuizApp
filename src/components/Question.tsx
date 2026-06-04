import s from './Question.module.css'

interface Props {
  text: string
  timeLeft: number
  maxTime: number
}

export default function Question({ text, timeLeft, maxTime }: Props) {
  const percentage = (timeLeft / maxTime) * 100
  const isUrgent = timeLeft <= 5

  return (
    <div className={s.card}>
      <p className={s.text}>{text}</p>
      <div className={s.timer} data-urgent={isUrgent}>
        <span className={s.timerValue}>{timeLeft}</span>
        <span className={s.timerLabel}>sec.</span>
        <svg className={s.timerRing} viewBox="0 0 76 76">
          <circle className={s.timerRingBg} cx="38" cy="38" r="34" />
          <circle
            className={s.timerRingFill}
            cx="38" cy="38" r="34"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - percentage / 100)}`}
          />
        </svg>
      </div>
    </div>
  )
}