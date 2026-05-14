interface Props {
  theme: string
  onThemeToggle: () => void
}

export default function Header({ theme, onThemeToggle }: Props) {
  return (
    <header className="header">
      <div className="header__logo">
        <span className="header__logo-icon">♠</span>
        <div className="header__logo-text">
          <h1>QUIZ & POKER</h1>
          <p>KNOWLEDGE. LUCK. GLORY.</p>
        </div>
      </div>
      <div className="header__controls">
        <button className="header__theme-btn" onClick={onThemeToggle}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className="header__rating-btn">🏆 Rating</button>
      </div>
    </header>
  )
}