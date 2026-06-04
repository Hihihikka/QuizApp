import { createContext } from 'react'
import type { ComponentType } from 'react'

export interface SidebarContextValue {
  SidebarComponent: ComponentType | null
  setSidebarComponent: (component: ComponentType | null) => void
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)
