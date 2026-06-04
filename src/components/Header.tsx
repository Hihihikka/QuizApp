import s from './Header.module.css'

interface Props {
  theme: string
  onThemeToggle: () => void
}

export default function Header({ theme, onThemeToggle }: Props) {
  return (
    <header className={s.header}>
      <div className={s.logo}>
        <span className={s.logoIcon}>♠</span>
        <div className={s.logoText}>
          <h1>QUIZ & POKER</h1>
          <p>KNOWLEDGE. LUCK. GLORY.</p>
        </div>
      </div>
      <div className={s.controls}>
        <button className={s.themeBtn} onClick={onThemeToggle}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className={s.ratingBtn}>🏆 Rating</button>
      </div>
    </header>
  )
}