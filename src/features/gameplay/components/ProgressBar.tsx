import s from './ProgressBar.module.css'

interface ProgressBarProps {
  current: number
  total: number
  filled: number
}

export default function ProgressBar({ current, total, filled }: ProgressBarProps) {
  return (
    <div className={s.progress}>
      <span className={s.progress__label}>
        QUESTION {current} OF {total}
      </span>
      <div className={s.progress__bar}>
        <div
          className={s.progress__fill}
          style={{ width: `${filled * 100}%` }}
        />
      </div>
    </div>
  )
}
