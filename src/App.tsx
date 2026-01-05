import React from 'react'
import { GameLayout } from '@/components/layout/GameLayout'
import { DashboardPage, PortfolioPage, CareerPage, HistoryPage } from '@/pages'
import { EventModal } from '@/components/game/EventModal'
import { useUIStore } from '@/store'
import { SettingsPage } from '@/pages/SettingsPage'
import { NotificationsPanel } from '@/components/game/NotificationsPanel'
import { ExpensesPage } from '@/pages/ExpensesPage'

function App() {
  const { activeView } = useUIStore()

  const renderContent = () => {
  switch (activeView) {
    case 'dashboard':
      return <DashboardPage />
    case 'invest':
      return <PortfolioPage />
    case 'career':
      return <CareerPage />
    case 'history':
      return <HistoryPage />
    case 'settings':
      return <SettingsPage />
    case 'help':
      return <div>Помощь (в разработке)</div>
    case 'expenses':
      return <ExpensesPage/>
    default:
      return <DashboardPage />
  }
}

  return (
    <>
      <GameLayout>
        {renderContent()}
      </GameLayout>
      
      <EventModal />
       <NotificationsPanel />
    </>
  )
}

export default App