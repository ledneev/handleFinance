import React from 'react'
import { StatusBar } from '@/components/game/StatusBar'
import { Sidebar } from './Sidebar'
import { NotificationsContainer } from '@/components/ui'
import { useUIStore } from '@/store'

interface GameLayoutProps {
  children: React.ReactNode
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  const { notifications, removeNotification } = useUIStore()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <StatusBar />
      
      <div className="flex pt-16"> {/* Отступ под фиксированный StatusBar */}
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Уведомления поверх всего */}
      <NotificationsContainer
        notifications={notifications}
        onClose={removeNotification}
        position="top-right"
      />
    </div>
  )
}