// src/components/layout/GameLayout.tsx
import React from 'react'
import { StatusBar } from '@/components/game/StatusBar'
import { Sidebar } from './Sidebar'
import { NotificationsContainer } from '@/components/ui'
import { useUIStore } from '@/store'

interface GameLayoutProps {
  children: React.ReactNode
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  const { notifications, removeNotification, isSidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <StatusBar />
      
      <div className="flex pt-16"> 
        <Sidebar />

        <main className={`
          flex-1 min-h-[calc(100vh-4rem)]
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'ml-64 lg:ml-0' : 'ml-0'}
          lg:ml-64
        `}>
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>

      <NotificationsContainer
        notifications={notifications}
        onClose={removeNotification}
        position="top-right"
      />
    </div>
  )
}