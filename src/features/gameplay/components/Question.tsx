import { useEffect, useRef } from 'react'
import s from './Question.module.css'

interface Props {
  text: string
  timeLeft: number
  maxTime: number
  isPaused?: boolean
}

export default function Question({ text, timeLeft, maxTime, isPaused = false }: Props) {
  const isUrgent = timeLeft <= 5
  const circumference = 2 * Math.PI * 34

  const circleRef = useRef<SVGCircleElement>(null)
  const preciseTimeRef = useRef<number>(timeLeft)
  const rafRef = useRef<number>(0)
  const lastTickRef = useRef<number>(0)
  const isPausedRef = useRef<boolean>(isPaused)

  // Синхронизируем isPausedRef чтобы RAF видел актуальное значение без перезапуска
  useEffect(() => {
    isPausedRef.current = isPaused
    if (!isPaused) {
      // Возобновляем — сбрасываем lastTick чтобы не было прыжка
      lastTickRef.current = 0
    }
  }, [isPaused])

  // Синхронизируем preciseTime когда стор меняет timeLeft (tick или таймаут)
  useEffect(() => {
    preciseTimeRef.current = timeLeft
  }, [timeLeft])

  // RAF-цикл: каждый кадр плавно уменьшаем preciseTime и обновляем кольцо
  useEffect(() => {
    const circle = circleRef.current
    if (!circle) return
 
    const animate = (timestamp: number) => {
      if (!isPausedRef.current) {
        if (lastTickRef.current === 0) lastTickRef.current = timestamp
 
        const delta = (timestamp - lastTickRef.current) / 1000
        preciseTimeRef.current = Math.max(0, preciseTimeRef.current - delta)
 
        const percentage = preciseTimeRef.current / maxTime
        const offset = circumference * (1 - percentage)
        circle.style.strokeDashoffset = String(offset)
      }
 
      lastTickRef.current = timestamp
      rafRef.current = requestAnimationFrame(animate)
    }
 
    lastTickRef.current = 0
    rafRef.current = requestAnimationFrame(animate)
 
    return () => cancelAnimationFrame(rafRef.current)
  }, [maxTime, circumference])

  // При смене вопроса сбрасываем точное время
  useEffect(() => {
    preciseTimeRef.current = timeLeft
    lastTickRef.current = 0
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxTime])

  return (
    <div className={s.card}>
      <p className={s.text}>{text}</p>
      <div className={s.timer} data-urgent={isUrgent}>
        <span className={s.timerValue}>{timeLeft}</span>
        <span className={s.timerLabel}>sec.</span>
        <svg className={s.timerRing} viewBox="0 0 76 76">
          <circle className={s.timerRingBg} cx="38" cy="38" r="34" />
          <circle
            ref={circleRef}
            className={s.timerRingFill}
            cx="38" cy="38" r="34"
            strokeDasharray={circumference}
            strokeDashoffset={0}
          />
        </svg>
      </div>
    </div>
  )
}
