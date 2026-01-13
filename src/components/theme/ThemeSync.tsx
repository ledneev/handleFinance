import { useEffect } from 'react'
import { useUIStore } from '@/store'

/**
 * Синхронизирует Zustand-состояние темы с DOM
 */
export const ThemeSync: React.FC = () => {
  const theme = useUIStore(state => state.theme)

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])

  return null
}