import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Header from '../components/Header'
import { useSidebar } from '../hooks/useSidebar'

export default function RootLayout() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const { SidebarComponent } = useSidebar()

  function handleThemeToggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.body.setAttribute('data-theme', next)
  }

  return (
    <>
      <Header theme={theme} onThemeToggle={handleThemeToggle} />
      <main className="main">
        <Outlet />
        <footer className="footer">
          <p>© 2026 Quiz &amp; Poker. All rights reserved.</p>
        </footer>
      </main>
      {SidebarComponent && <SidebarComponent />}
    </>
  )
}