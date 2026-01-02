import React, { useState } from 'react'
import { Button } from '@/components/ui'
import { Filter, X } from 'lucide-react'

export type AssetFilterType = 'all' | 'stock' | 'crypto' | 'real_estate' | 'education' | 'bank' | 'consumable'

interface AssetFilterProps {
  activeFilter: AssetFilterType
  onFilterChange: (filter: AssetFilterType) => void
}

export const AssetFilter: React.FC<AssetFilterProps> = ({ activeFilter, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const filters: { id: AssetFilterType; label: string; emoji: string }[] = [
  { id: 'all', label: 'Все', emoji: '📊' },
  { id: 'stock', label: 'Акции', emoji: '📈' },
  { id: 'crypto', label: 'Криптовалюта', emoji: '💰' },
  { id: 'real_estate', label: 'Недвижимость', emoji: '🏠' },
  { id: 'education', label: 'Образование', emoji: '🎓' },
  { id: 'bank', label: 'Банк', emoji: '🏦' },
  { id: 'consumable', label: 'Курсы', emoji: '📚' },
]

  return (
    <div className="relative">
      {/* Кнопка фильтра на мобильных */}
      <Button
        variant="ghost"
        size="sm"
        icon={<Filter className="h-4 w-4" />}
        onClick={() => setIsExpanded(!isExpanded)}
        className="lg:hidden"
      >
        Фильтр
      </Button>

      {/* Десктопная версия */}
      <div className="hidden lg:flex items-center gap-2">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeFilter === filter.id
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }
            `}
          >
            <span className="mr-2">{filter.emoji}</span>
            {filter.label}
          </button>
        ))}
      </div>

      {/* Мобильное меню фильтров */}
      {isExpanded && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsExpanded(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 lg:hidden">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <span className="font-medium">Фильтры</span>
              <button onClick={() => setIsExpanded(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-2">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => {
                    onFilterChange(filter.id)
                    setIsExpanded(false)
                  }}
                  className={`
                    w-full text-left px-3 py-2 rounded text-sm mb-1
                    ${activeFilter === filter.id
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                    }
                  `}
                >
                  <span className="mr-2">{filter.emoji}</span>
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}