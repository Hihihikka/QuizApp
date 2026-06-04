import s from './FinalScreen.module.css'

interface Props {
  score: number
  total: number
  correctCount: number
  onRestart: () => void
}

export default function FinalScreen({ score, total, correctCount, onRestart }: Props) {
  return (
    <div className={s.screen}>
      <h2 className={s.title}>GAME OVER</h2>
      <p className={s.label}>YOUR SCORE</p>
      <span className={s.score}>✦ {score}</span>
      <p className={s.label}>{correctCount} correct out of {total}</p>
      <button className={s.restartBtn} onClick={onRestart}>PLAY AGAIN</button>
    </div>
  )
}