
import { INITIAL_PLAYER } from '@/constants'
import { EXPENSES, ONE_TIME_PURCHASES } from '@/constants/expenses'
import { notify, useUIStore } from '@/store/uiStore'
import { UtilsSlice } from '@/types/store.types'
import { formatCurrency } from '@/utils'
import { calculateMonthlyExpenses } from '@/utils/expenses'

export const createUtilsSlice: UtilsSlice = (set, get) => ({
  addMoney: (amount) => {
    if (amount <= 0) return
    set({
      balance: get().balance + amount,
      eventLog: [...get().eventLog, `+ ${formatCurrency(amount)}`],
    })
    notify.success('Деньги', `Получено: ${formatCurrency(amount)}`)
  },

  spendMoney: (amount) => {
    const state = get()
    if (state.balance < amount) {
      notify.error('Ошибка', 'Недостаточно средств')
      return
    }
    set({
      balance: state.balance - amount,
      eventLog: [...state.eventLog, `- ${formatCurrency(amount)}`],
    })
    notify.info('Трата', `Потрачено: ${formatCurrency(amount)}`)
  },

  resetGame: () => {
    set({
      currentYear: 2024,
      balance: 500000,
      player: { ...INITIAL_PLAYER },
      portfolio: [],
      events: [],
      history: [
        {
          year: 2024,
          balance: 500000,
          netWorth: 500000,
          salary: INITIAL_PLAYER.salary,
          majorEvents: ['Старт игры'],
        },
      ],
      eventLog: ['🎮 Игра сброшена'],
      delayedEffects: [],
      educationPurchases: [],
      ongoingEffects: [],
      expenses: EXPENSES.map(e => ({ ...e })),
      oneTimePurchases: ONE_TIME_PURCHASES.map(p => ({ ...p })),
      monthlyExpenses: calculateMonthlyExpenses(EXPENSES),
      gameSettings: null,
      gameOver: false,
      gameWon: null,
    })

    useUIStore.getState().setShowStartScreen(true)

    notify.info('Игра', 'Состояние сброшено. Настройте игру заново.')
  },
})
