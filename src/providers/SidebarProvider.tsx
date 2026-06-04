import { useState, useCallback } from 'react'
import type { ComponentType, ReactNode } from 'react'
import { SidebarContext } from './SidebarContext'

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [SidebarComponent, setSidebarComponentState] = useState<ComponentType | null>(null)

  const setSidebarComponent = useCallback((component: ComponentType | null) => {
    setSidebarComponentState(() => component)
  }, [])

  return (
    <SidebarContext.Provider value={{ SidebarComponent, setSidebarComponent }}>
      {children}
    </SidebarContext.Provider>
  )
}
