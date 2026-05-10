interface Props {
  score: number
}

export default function Sidebar({ score }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar__card">
        <span className="sidebar__card-label">SCORE</span>
        <span className="sidebar__card-value">✦ {score}</span>
      </div>
      <div className="sidebar__card">
        <span className="sidebar__card-label">UNTIL THE NEXT LOOTBOX</span>
        <span className="sidebar__card-value">650 / 1000</span>
        <div className="sidebar__progress-bar">
          <div className="sidebar__progress-fill"></div>
        </div>
      </div>
      <div className="sidebar__card">
        <span className="sidebar__card-label">OPENED LOOTBOXES</span>
        <span className="sidebar__card-value">1 / 3</span>
      </div>
      <div className="sidebar__card">
        <span className="sidebar__card-label">ACTIVE LUCK MULTIPLIER</span>
        <span className="sidebar__card-value sidebar__card-value--green">🍀 1.25x</span>
        <p className="sidebar__card-desc">Impact on probability of getting stronger cards in poker</p>
      </div>
    </aside>
  )
}