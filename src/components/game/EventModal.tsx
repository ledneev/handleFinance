import React from 'react'
import { useUIStore } from '@/store'
import { useGameStore } from '@/store'
import { isEventModal } from '@/store/uiStore'
import { Button } from '@/components/ui'
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Info,
  TrendingUp,
  TrendingDown,
  LucideIcon
} from 'lucide-react'

// Создаем объект с иконками ВНЕ компонента (чтобы не создавать при каждом рендере)
const EVENT_ICONS: Record<string, LucideIcon> = {
  positive: CheckCircle,
  negative: XCircle,
  crisis: AlertCircle,
  opportunity: TrendingUp,
  neutral: Info
} as const

// Цветовые классы для разных типов событий
const EVENT_COLORS: Record<string, string> = {
  positive: 'text-green-600 dark:text-green-400',
  negative: 'text-red-600 dark:text-red-400',
  crisis: 'text-yellow-600 dark:text-yellow-400',
  opportunity: 'text-blue-600 dark:text-blue-400',
  neutral: 'text-gray-600 dark:text-gray-400'
} as const

// Фоновые цвета для разных типов событий
const EVENT_BG_COLORS: Record<string, string> = {
  positive: 'bg-green-50 dark:bg-green-900/20',
  negative: 'bg-red-50 dark:bg-red-900/20',
  crisis: 'bg-yellow-50 dark:bg-yellow-900/20',
  opportunity: 'bg-blue-50 dark:bg-blue-900/20',
  neutral: 'bg-gray-50 dark:bg-gray-900/20'
} as const

export const EventModal: React.FC = () => {
  const { modal, closeModal } = useUIStore()
  const { resolveEvent } = useGameStore()

  if (!isEventModal(modal) || !modal.data) return null

  const event = modal.data
  
  // Получаем иконку из предсозданного объекта
  const Icon = EVENT_ICONS[event.type] || Info
  const colorClass = EVENT_COLORS[event.type] || EVENT_COLORS.neutral
  const bgClass = EVENT_BG_COLORS[event.type] || EVENT_BG_COLORS.neutral

  const handleChoice = (choiceIndex?: number) => {
    resolveEvent(event.id, choiceIndex)
    closeModal()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => event.choices ? undefined : handleChoice()}
      />
      
      {/* Modal */}
      <div className={`relative rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden ${bgClass}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${colorClass} bg-white/50 dark:bg-black/20`}>
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {event.title}
            </h2>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300">
            {event.description}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Эффекты события */}
          {event.effect.balanceChange && (
            <div className="mb-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <div className="flex items-center gap-2">
                {event.effect.balanceChange > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
                <span className={event.effect.balanceChange > 0 ? 'text-green-600' : 'text-red-600'}>
                  {event.effect.balanceChange > 0 ? '+' : ''}
                  {event.effect.balanceChange.toLocaleString()}₽
                </span>
              </div>
            </div>
          )}

          {/* Варианты выбора */}
          <div className="space-y-3">
            {event.choices ? (
              event.choices.map((choice, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? 'primary' : 'secondary'}
                  fullWidth
                  onClick={() => handleChoice(index)}
                  className="justify-start text-left h-auto py-3"
                >
                  {choice.text}
                </Button>
              ))
            ) : (
              <Button
                fullWidth
                onClick={() => handleChoice()}
                className="mt-4"
              >
                Продолжить
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}