import { notify } from '@/store/uiStore'
import { FinancesSlice } from '@/types/store.types'
import { formatCurrency } from '@/utils'
import { calculateMonthlyExpenses } from '@/utils/expenses'


export const createFinancesSlice: FinancesSlice = (set, get) => ({
  updateExpenseLevel: (expenseId: string, newLevel: number) => {
    const state = get()
    const expense = state.expenses.find(e => e.id === expenseId)
    if (!expense || newLevel < 1 || newLevel > expense.maxLevel) return

    const newAmount = Math.round(expense.baseAmount * (1 + (newLevel - 1) * 0.5))

    set({
      expenses: state.expenses.map(e =>
        e.id === expenseId ? { ...e, level: newLevel, currentAmount: newAmount } : e
      ),
      monthlyExpenses: calculateMonthlyExpenses(get().expenses),
      eventLog: [
        ...state.eventLog,
        `📊 Уровень "${expense.name}" → ${newLevel} (${formatCurrency(newAmount)}/мес)`,
      ],
    })

    notify.info('Расходы', `Уровень "${expense.name}" изменён`)
  },

  purchaseItem: (itemId: string) => {
    const state = get()
    const item = state.oneTimePurchases.find(i => i.id === itemId)
    if (!item || item.purchased || state.balance < item.price) return

    let newSkills = { ...state.player.skills }
    let newExpenses = [...state.expenses]

    if (item.effects?.skillBonus) {
      newSkills = {
        programming: Math.min(100, newSkills.programming + (item.effects.skillBonus.programming || 0)),
        finance: Math.min(100, newSkills.finance + (item.effects.skillBonus.finance || 0)),
        luck: Math.min(100, newSkills.luck + (item.effects.skillBonus.luck || 0)),
      }
    }

    if (item.effects?.expenseChange) {
      newExpenses = newExpenses.map(expense => {
        const change = item.effects!.expenseChange![expense.id]
        return change !== undefined
          ? { ...expense, currentAmount: Math.max(0, expense.currentAmount + change) }
          : expense
      })
    }

    set({
      balance: state.balance - item.price,
      player: { ...state.player, skills: newSkills },
      expenses: newExpenses,
      monthlyExpenses: calculateMonthlyExpenses(newExpenses),
      oneTimePurchases: state.oneTimePurchases.map(i =>
        i.id === itemId ? { ...i, purchased: true, purchaseDate: Date.now() } : i
      ),
      eventLog: [...state.eventLog, `🛒 Куплено: ${item.name}`],
    })

    notify.success('Покупка', `Приобретено: ${item.name}`)
  },
})
