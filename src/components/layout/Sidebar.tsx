import React from 'react'
import { useUIStore } from '@/store'
import { 
  LayoutDashboard, 
  TrendingUp, 
  Briefcase, 
  History,
  Settings,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/utils/cn'

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, isSidebarOpen, toggleSidebar } = useUIStore()

  const navItems = [
    { id: 'dashboard', label: 'Главная', icon: LayoutDashboard },
    { id: 'invest', label: 'Инвестиции', icon: TrendingUp },
    { id: 'career', label: 'Карьера', icon: Briefcase },
    { id: 'history', label: 'История', icon: History },
  ]

  const bottomItems = [
    { id: 'settings', label: 'Настройки', icon: Settings },
    { id: 'help', label: 'Помощь', icon: HelpCircle },
  ]

  return (
    <>
      {/* Overlay для мобильных */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transition-transform duration-300 ease-in-out',
        'lg:translate-x-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Навигация */}
          <nav className="flex-1 p-4">
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Основное
              </h3>
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeView === item.id
                  
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          setActiveView(item.id as any)
                          // На мобильных закрываем сайдбар после выбора
                          if (window.innerWidth < 1024) {
                            toggleSidebar()
                          }
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                          isActive
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>

          {/* Нижняя часть */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <ul className="space-y-1">
              {bottomItems.map((item) => {
                const Icon = item.icon
                const isActive = activeView === item.id
                
                return (
                  <li key={item.id}>
                    <button
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onClick={() => setActiveView(item.id as any)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </aside>
    </>
  )
}