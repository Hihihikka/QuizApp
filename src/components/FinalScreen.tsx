interface Props {
  score: number
  total: number
  onRestart: () => void
}

export default function FinalScreen({ score, total, onRestart }: Props) {
  return (
    <div className="final-screen">
      <h2 className="final-screen__title">GAME OVER</h2>
      <p className="final-screen__label">YOUR SCORE</p>
      <span className="final-screen__score">✦ {score}</span>
      <p className="final-screen__label">{score / 100} correct out of {total}</p>
      <button className="restart-btn" onClick={onRestart}>PLAY AGAIN</button>
    </div>
  )
}