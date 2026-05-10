export default function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <span className="header__logo-icon">♠</span>
        <div className="header__logo-text">
          <h1>QUIZ & POKER</h1>
          <p>KNOWLEDGE. LUCK. GLORY.</p>
        </div>
      </div>
      <button className="header__rating-btn">🏆 Rating</button>
    </header>
  )
}