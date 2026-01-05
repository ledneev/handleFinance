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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TrendingDown,
  TrendingDownIcon,
  TrendingUpIcon,
  Wallet,
  BookOpen,
  Briefcase,
  Check,
  X,
} from 'lucide-react'
import { formatCurrency } from '@/utils'

const EVENT_ICONS: Record<string, React.ElementType> = {
  positive: CheckCircle,
  negative: XCircle,
  crisis: AlertCircle,
  opportunity: TrendingUp,
  neutral: Info,
} as const

const EVENT_COLORS: Record<string, string> = {
  positive: 'text-green-600 dark:text-green-400',
  negative: 'text-red-600 dark:text-red-400',
  crisis: 'text-yellow-600 dark:text-yellow-400',
  opportunity: 'text-blue-600 dark:text-blue-400',
  neutral: 'text-gray-600 dark:text-gray-400',
} as const

const EVENT_BG_COLORS: Record<string, string> = {
  positive: 'bg-green-50 dark:bg-green-900/20',
  negative: 'bg-red-50 dark:bg-red-900/20',
  crisis: 'bg-yellow-50 dark:bg-yellow-900/20',
  opportunity: 'bg-blue-50 dark:bg-blue-900/20',
  neutral: 'bg-gray-50 dark:bg-gray-900/20',
} as const

export const EventModal: React.FC = () => {
  const { modal, closeModal } = useUIStore()
  const { resolveEvent, balance, player, portfolio } = useGameStore()

  if (!isEventModal(modal) || !modal.data) return null

  const event = modal.data

  const Icon = EVENT_ICONS[event.type] || Info
  const colorClass = EVENT_COLORS[event.type] || EVENT_COLORS.neutral
  const bgClass = EVENT_BG_COLORS[event.type] || EVENT_BG_COLORS.neutral

  const handleChoice = (choiceIndex?: number) => {
    resolveEvent(event.id, choiceIndex)
    closeModal()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => {
          if (!event.choices) handleChoice()
        }}
      />

      <div className={`relative rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden ${bgClass}`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${colorClass} bg-white/50 dark:bg-black/20`}>
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{event.title}</h2>
          </div>

          <p className="text-gray-700 dark:text-gray-300">{event.description}</p>
        </div>

        <div className="p-6">
          {/* Прямой эффект (если нет выбора) */}
          {event.effect.balanceChange && !event.choices && (
            <div className="mb-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <div className="flex items-center gap-2">
                {event.effect.balanceChange > 0 ? (
                  <TrendingUpIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDownIcon className="h-5 w-5 text-red-500" />
                )}
                <span
                  className={event.effect.balanceChange > 0 ? 'text-green-600' : 'text-red-600'}
                >
                  {event.effect.balanceChange > 0 ? '+' : ''}
                  {formatCurrency(event.effect.balanceChange)}
                </span>
              </div>
            </div>
          )}

          {/* Варианты выбора */}
          <div className="space-y-3">
            {event.choices ? (
              event.choices.map((choice, index) => {
                // Проверка доступности выбора
                const isAvailable = !choice.requires
                  ? true
                  : (
                      // Проверка баланса
                      (choice.requires.minBalance === undefined || balance >= choice.requires.minBalance) &&
                      // Проверка навыков
                      (choice.requires.minSkills?.programming === undefined ||
                        player.skills.programming >= choice.requires.minSkills.programming) &&
                      (choice.requires.minSkills?.finance === undefined ||
                        player.skills.finance >= choice.requires.minSkills.finance) &&
                      (choice.requires.minSkills?.luck === undefined ||
                        player.skills.luck >= choice.requires.minSkills.luck) &&
                      // Проверка актива
                      (choice.requires.hasAsset === undefined ||
                        portfolio.some(item => item.assetId === choice.requires!.hasAsset))
                    )

                return (
                  <div key={choice.id} className="space-y-2">
                    <Button
                      variant={index === 0 ? 'primary' : 'secondary'}
                      fullWidth
                      onClick={() => isAvailable && handleChoice(index)}
                      disabled={!isAvailable}
                      className="justify-start text-left h-auto py-3"
                    >
                      <div className="text-left">
                        <div className="font-medium">{choice.text}</div>
                        {choice.description && (
                          <div className="text-sm opacity-75 mt-1">{choice.description}</div>
                        )}

                        {/* Стоимость и требования */}
                        {(choice.cost || choice.requires) && (
                          <div className="text-xs mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                            {choice.cost && (
                              <div className="flex items-center gap-1">
                                <Wallet className="h-3 w-3" />
                                Стоимость: {formatCurrency(choice.cost)}
                              </div>
                            )}
                            {choice.requires?.minBalance && (
                              <div
                                className={
                                  balance >= choice.requires.minBalance
                                    ? 'flex items-center gap-1 text-green-600 dark:text-green-400'
                                    : 'flex items-center gap-1 text-red-600 dark:text-red-400'
                                }
                              >
                                {balance >= choice.requires.minBalance ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                Мин. баланс: {formatCurrency(choice.requires.minBalance)}
                              </div>
                            )}
                            {choice.requires?.minSkills?.programming && (
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                Программирование: {choice.requires.minSkills.programming}
                              </div>
                            )}
                            {choice.requires?.minSkills?.finance && (
                              <div className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                Финансы: {choice.requires.minSkills.finance}
                              </div>
                            )}
                            {choice.requires?.hasAsset && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                🔑 Требуется актив
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Button>

                    {/* Сообщение, если недоступно */}
                    {!isAvailable && (
                      <div className="text-xs text-red-500 px-1">
                        {choice.requires?.minBalance && balance < choice.requires.minBalance && (
                          <span>Недостаточно средств: нужно {formatCurrency(choice.requires.minBalance)}</span>
                        )}
                        {choice.requires?.minSkills?.programming &&
                          player.skills.programming < choice.requires.minSkills.programming && (
                            <span>Низкий уровень программирования</span>
                          )}
                        {choice.requires?.hasAsset &&
                          !portfolio.some(item => item.assetId === choice.requires!.hasAsset) && (
                            <span>Отсутствует требуемый актив</span>
                          )}
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <Button fullWidth onClick={() => handleChoice()} className="mt-4">
                Продолжить
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
