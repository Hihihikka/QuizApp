import { useContext } from 'react'
import { SidebarContext } from '../providers/SidebarContext'

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used inside SidebarProvider')
  return ctx
}
