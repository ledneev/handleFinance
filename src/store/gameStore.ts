import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { createGameStateSlice } from './slices/gameStateSlice'
import { createPlayerSlice } from './slices/playerSlice'
import { createFinancesSlice } from './slices/financesSlice'
import { createAssetsSlice } from './slices/assetsSlice'
import { createEventsSlice } from './slices/eventsSlice'
import { createGoalsSlice } from './slices/goalsSlice'
import { createUtilsSlice } from './slices/utilsSlice'

import { calculateMonthlyExpenses } from '@/utils/expenses'
import { formatCurrency } from '@/utils'
import { notify } from '@/store/uiStore'
import { GameStore } from '@/types/game.types'
import { useAchievementStore } from './achievementStore'

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Состояние
      ...createGameStateSlice(set, get),
      // Действия
      ...createPlayerSlice(set, get),
      ...createFinancesSlice(set, get),
      ...createAssetsSlice(set, get),
      ...createEventsSlice(set, get),
      ...createGoalsSlice(set, get),
      ...createUtilsSlice(set, get),

      // Координирующие действия
      advanceYear: () => {
        const state = get()
        const monthlyExpenses = calculateMonthlyExpenses(state.expenses)
        const yearlyExpenses = monthlyExpenses * 12
        const newYear = state.currentYear + 1
        const yearlySalary = state.player.salary * 12
        const projectedBalance = state.balance + yearlySalary - yearlyExpenses

        const updatedEffects = [...state.ongoingEffects]
        let skillBonus = 0
        const effectMessages: string[] = []

        if (projectedBalance < 0) {
          notify.error(
            'Финансовый кризис',
            `Недостаточно средств! Недостаёт: ${formatCurrency(-projectedBalance)}`
          )
          return
        }

        const newBalance = state.balance + yearlySalary - yearlyExpenses

        updatedEffects.forEach(effect => {
          if (
            effect.type === 'college_education' &&
            !effect.appliedThisYear &&
            effect.remainingYears > 0
          ) {
            skillBonus += effect.yearlySkillBonus
            effect.appliedThisYear = true
          }
        })

        const newSkills = { ...state.player.skills }
        if (skillBonus > 0) {
          newSkills.programming = Math.min(100, newSkills.programming + skillBonus)
          effectMessages.push(`🎓 +${skillBonus} к программированию`)
        }

        updatedEffects.forEach(effect => {
          effect.appliedThisYear = false
        })

        const activeEffects = updatedEffects.filter(effect => {
          if (effect.remainingYears <= 1) {
            effectMessages.push(`🎓 Завершено обучение: ${effect.type}`)
            return false
          }
          effect.remainingYears -= 1
          return true
        })

        const updatedAssets = state.availableAssets.map(asset => ({
          ...asset,
          currentPrice: Math.max(
            1,
            asset.currentPrice * (1 + asset.trend * 0.1 + (Math.random() - 0.5) * asset.volatility)
          ),
        }))

        const priceChanges: Record<string, number> = {}
        state.availableAssets.forEach(asset => {
          priceChanges[asset.id] = asset.trend * 10 + (Math.random() - 0.5) * 5
        })

        const portfolioValue = state.portfolio.reduce((total, item) => {
          const asset = updatedAssets.find(a => a.id === item.assetId)
          return total + (asset ? asset.currentPrice * item.quantity : 0)
        }, 0)

        const netWorth = newBalance + portfolioValue

        const newHistoryEntry = {
          year: newYear,
          balance: newBalance,
          netWorth,
          salary: state.player.salary,
          majorEvents: state.events.map(e => e.title),
        }

        set({
          currentYear: newYear,
          balance: newBalance,
          availableAssets: updatedAssets,
          priceChanges,
          history: [...state.history, newHistoryEntry],
          events: [],
          eventLog: [
            ...state.eventLog,
            `Год ${newYear}: зарплата ${formatCurrency(yearlySalary)}`,
            ...effectMessages,
          ],
          player: { ...state.player, skills: newSkills },
          ongoingEffects: activeEffects,
        })

        useAchievementStore.getState().checkAchievements(get())

        if (Math.random() < 0.8) get().triggerRandomEvent()
        get().checkGoal() 
      },
    }),
    {
      name: 'financial-simulator-storage',
      partialize: state => ({
        currentYear: state.currentYear,
        balance: state.balance,
        player: state.player,
        portfolio: state.portfolio,
        history: state.history,
        delayedEffects: state.delayedEffects,
        educationPurchases: state.educationPurchases,
        ongoingEffects: state.ongoingEffects,
        expenses: state.expenses,
        oneTimePurchases: state.oneTimePurchases,
        monthlyExpenses: state.monthlyExpenses,
        gameSettings: state.gameSettings,
      }),
    }
  )
)
