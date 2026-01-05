
import { CAREER_CONFIGS, CAREER_LEVELS } from '@/constants/careers'
import { notify } from '@/store/uiStore'
import { PlayerSlice } from '@/types/store.types'
import { formatCurrency } from '@/utils'

export const createPlayerSlice: PlayerSlice = (set, get) => ({
  upgradeCareer: () => {
    const state = get()
    const currentIndex = CAREER_LEVELS.indexOf(state.player.career)

    if (currentIndex >= CAREER_LEVELS.length - 1) {
      notify.info('Карьера', 'Вы достигли максимального уровня!')
      return
    }

    const nextLevel = CAREER_LEVELS[currentIndex + 1]
    const nextConfig = CAREER_CONFIGS[nextLevel]

    if (state.balance < nextConfig.upgradeCost) {
      notify.error('Недостаточно средств', `Нужно: ${formatCurrency(nextConfig.upgradeCost)}`)
      return
    }

    set({
      balance: state.balance - nextConfig.upgradeCost,
      player: {
        ...state.player,
        career: nextLevel,
        salary: nextConfig.baseSalary,
        skills: {
          ...state.player.skills,
          programming: Math.min(100, state.player.skills.programming + 10),
        },
      },
      eventLog: [
        ...state.eventLog,
        `🎓 Повышение до ${nextLevel}!`,
        `💼 Новая зарплата: ${formatCurrency(nextConfig.baseSalary)}/мес`,
      ],
    })

    notify.success('Повышение!', `Вы стали ${nextLevel} 🎉`)
  },
})
