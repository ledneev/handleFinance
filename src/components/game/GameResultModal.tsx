import { isInfoModal, useUIStore } from '@/store/uiStore'
import { useGameStore } from '@/store'
import { formatCurrency } from '@/utils'

export const GameResultModal = () => {
  const { modal, closeModal } = useUIStore()
  const { resetGame } = useGameStore()
  const { gameWon, balance, history, currentYear } = useGameStore()

  if (!isInfoModal(modal) || !modal.isOpen || gameWon === null) return null

  const { message } = modal.data

  const finalNetWorth = history[history.length - 1]?.netWorth || balance
  const yearsPlayed = currentYear - 2024

  const handleRestart = () => {
    resetGame()
    closeModal()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Заголовок */}
        <div
          className={`p-6 text-white text-center ${
            gameWon ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'
          }`}
        >
          <h2 className="text-3xl font-bold">{gameWon ? '🎉 Победа!' : '💀 Игра окончена'}</h2>
        </div>

        {/* Контент */}
        <div className="p-6 space-y-4">
          {/* ✅ Безопасное использование message */}
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {message}
          </p>

          {/* Статистика */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Годы игры:</span>
              <strong>{yearsPlayed}</strong>
            </div>
            <div className="flex justify-between">
              <span>Баланс:</span>
              <strong>{formatCurrency(balance)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Состояние:</span>
              <strong>{formatCurrency(finalNetWorth)}</strong>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleRestart}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
            >
              🚀 Начать заново
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
