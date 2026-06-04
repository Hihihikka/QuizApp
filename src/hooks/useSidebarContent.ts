import { useEffect } from 'react'
import type { ComponentType } from 'react'
import { useSidebar } from '../hooks/useSidebar'

/**
 * Регистрирует компонент сайдбара для текущей страницы.
 * Передаётся сам компонент (не JSX) — RootLayout рендерит его сам,
 * поэтому GameSessionContext и другие контексты доступны в момент рендера.
 *
 * Пример:
 *   useSidebarContent(GameSidebar)   // не <GameSidebar />, а сам компонент
 */
export function useSidebarContent(Component: ComponentType) {
  const { setSidebarComponent } = useSidebar()

  useEffect(() => {
    setSidebarComponent(Component)
    return () => setSidebarComponent(null)
  }, [Component, setSidebarComponent])
}