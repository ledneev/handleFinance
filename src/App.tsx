import React from 'react'
import { GameLayout } from '@/components/layout/GameLayout'
import { DashboardPage, PortfolioPage, CareerPage, HistoryPage } from '@/pages'
import { EventModal } from '@/components/game/EventModal'
import { useUIStore } from '@/store'

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
    </>
  )
}

export default App