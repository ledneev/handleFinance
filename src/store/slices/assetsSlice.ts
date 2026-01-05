import { nanoid } from 'nanoid'
import { notify } from '@/store/uiStore'
import { formatCurrency } from '@/utils'
import { AssetsSlice } from '@/types/store.types'

export const createAssetsSlice: AssetsSlice = (set, get) => ({
  buyAsset: (assetId, quantity) => {
    const state = get()
    const asset = state.availableAssets.find(a => a.id === assetId)
    if (!asset) {
      notify.error('Ошибка', 'Актив не найден')
      return
    }

    const totalCost = asset.currentPrice * quantity
    if (state.balance < totalCost) {
      notify.error('Недостаточно средств', `Нужно: ${formatCurrency(totalCost)}`)
      return
    }

    // Колледж (особое поведение)
    if (asset.id === 'college') {
      const alreadyHasCollege = state.ongoingEffects.some(e => e.type === 'college_education')
      if (alreadyHasCollege) {
        notify.error('Ограничение', 'Вы уже поступили в колледж')
        return
      }

      const collegeEffect = {
        id: nanoid(),
        type: 'college_education' as const,
        assetId: 'college',
        remainingYears: 3,
        yearlySkillBonus: 5,
        appliedThisYear: false,
      }

      set({
        balance: state.balance - asset.currentPrice,
        ongoingEffects: [...state.ongoingEffects, collegeEffect],
        eventLog: [...state.eventLog, '🎓 Вы поступили в колледж! +5 к программированию на 3 года'],
      })

      notify.success('Колледж', 'Обучение начато!')
      return
    }

    // Курсы (consumable)
    if (asset.type === 'consumable' || asset.isConsumable) {
      const alreadyPurchased = state.educationPurchases.some(
        p => p.year === state.currentYear && p.assetId === assetId
      )
      if (alreadyPurchased) {
        notify.error('Ограничение', 'Курс можно покупать только раз в год')
        return
      }

      const effects = asset.effects || {}
      const newSkills = { ...state.player.skills }
      const messages: string[] = []

      if (effects.skillBonus) {
        if (effects.skillBonus.programming) {
          const bonus = effects.skillBonus.programming * quantity
          newSkills.programming = Math.min(100, newSkills.programming + bonus)
          messages.push(`📚 +${bonus} к программированию`)
        }
        if (effects.skillBonus.finance) {
          const bonus = effects.skillBonus.finance * quantity
          newSkills.finance = Math.min(100, newSkills.finance + bonus)
          messages.push(`💰 +${bonus} к финансам`)
        }
        if (effects.skillBonus.luck) {
          const bonus = effects.skillBonus.luck * quantity
          newSkills.luck = Math.min(100, newSkills.luck + bonus)
          messages.push(`🍀 +${bonus} к удаче`)
        }
      }

      set({
        balance: state.balance - totalCost,
        player: { ...state.player, skills: newSkills },
        educationPurchases: [...state.educationPurchases, { year: state.currentYear, assetId }],
        eventLog: [...state.eventLog, `🎓 Куплен курс: ${asset.name}`, ...messages],
      })

      notify.success('Курс', `Куплен: ${asset.name}`)
      if (messages.length) notify.info('Навыки', messages.join(', '))
      return
    }

    // Обычные активы
    const existingItem = state.portfolio.find(item => item.assetId === assetId)
    const updatedPortfolio = existingItem
      ? state.portfolio.map(item =>
          item.assetId === assetId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                purchasePrice:
                  (item.purchasePrice * item.quantity + totalCost) / (item.quantity + quantity),
              }
            : item
        )
      : [
          ...state.portfolio,
          {
            assetId,
            quantity,
            purchasePrice: asset.currentPrice,
            purchaseDate: new Date(),
          },
        ]

    set({
      balance: state.balance - totalCost,
      portfolio: updatedPortfolio,
      eventLog: [...state.eventLog, `✅ Куплено ${quantity} ${asset.name}`],
    })

    notify.success('Покупка', `Куплено: ${quantity} ${asset.name}`)
  },

  sellAsset: (assetId, quantity) => {
    const state = get()
    const asset = state.availableAssets.find(a => a.id === assetId)
    const portfolioItem = state.portfolio.find(i => i.assetId === assetId)
    if (!asset || !portfolioItem || portfolioItem.quantity < quantity) return

    const totalValue = asset.currentPrice * quantity
    const profit = (asset.currentPrice - portfolioItem.purchasePrice) * quantity

    const updatedPortfolio =
      portfolioItem.quantity === quantity
        ? state.portfolio.filter(i => i.assetId !== assetId)
        : state.portfolio.map(i =>
            i.assetId === assetId ? { ...i, quantity: i.quantity - quantity } : i
          )

    set({
      balance: state.balance + totalValue,
      portfolio: updatedPortfolio,
      eventLog: [
        ...state.eventLog,
        `💰 Продано ${quantity} ${asset.name}`,
        profit > 0
          ? `🎉 Прибыль: ${formatCurrency(profit)}`
          : `📉 Убыток: ${formatCurrency(Math.abs(profit))}`,
      ],
    })

    notify.success('Продажа', `Продано: ${quantity} ${asset.name}`)
    if (profit !== 0)
      notify[profit > 0 ? 'success' : 'warning'](
        profit > 0 ? 'Прибыль' : 'Убыток',
        formatCurrency(Math.abs(profit))
      )
  },
})
