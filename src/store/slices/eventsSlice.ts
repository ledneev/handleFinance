
import { nanoid } from 'nanoid'
import { notify } from '@/store/uiStore'
import { useUIStore } from '@/store'
import { formatCurrency } from '@/utils'
import { EventsSlice } from '@/types/store.types'
import { getRandomEvent } from '@/constants'

export const createEventsSlice: EventsSlice = (set, get) => ({
  triggerRandomEvent: () => {
    const state = get()
    const eventTemplate = getRandomEvent(state.currentYear, state.player.skills)
    const event = {
      ...eventTemplate,
      id: nanoid(),
      year: state.currentYear,
      isResolved: false,
    }

    set({
      events: [...state.events, event],
      eventLog: [...state.eventLog, `⚡ Событие: ${event.title}`],
    })

    useUIStore.getState().openEventModal(event)
  },

  resolveEvent: (eventId, choiceIndex) => {
    const state = get()
    const event = state.events.find(e => e.id === eventId)
    if (!event) return

    if (choiceIndex === undefined) {
      // Дефолтный эффект
      if (event.effect.delayedEffect) {
        const delayedEffect = {
          id: nanoid(),
          effect: event.effect.delayedEffect.effect,
          triggerYear: state.currentYear + event.effect.delayedEffect.yearsDelay,
        }
        set({
          delayedEffects: [...state.delayedEffects, delayedEffect],
          eventLog: [
            ...state.eventLog,
            `⏳ Эффект "${event.title}" через ${event.effect.delayedEffect.yearsDelay} года`,
          ],
        })
      }

      set({
        events: state.events.filter(e => e.id !== eventId),
        eventLog: [...state.eventLog, `✅ Событие: ${event.title}`],
      })
      return
    }

    const choice = event.choices[choiceIndex]
    if (!choice) return

    // Проверка условий
    if (choice.requires) {
      const { minBalance, minSkills, hasAsset } = choice.requires
      if (minBalance !== undefined && state.balance < minBalance) {
        notify.error('Недостаточно средств', `Нужно: ${formatCurrency(minBalance)}`)
        return
      }
      if (minSkills) {
        const { programming, finance, luck } = state.player.skills
        if (
          (minSkills.programming && programming < minSkills.programming) ||
          (minSkills.finance && finance < minSkills.finance) ||
          (minSkills.luck && luck < minSkills.luck)
        ) {
          notify.error('Условие', 'Недостаточно навыков')
          return
        }
      }
      if (hasAsset && !state.portfolio.some(i => i.assetId === hasAsset)) {
        notify.error('Условие', 'Нужен актив: ' + hasAsset)
        return
      }
    }

    if (choice.cost && state.balance < choice.cost) {
      notify.error('Недостаточно средств', `Нужно: ${formatCurrency(choice.cost)}`)
      return
    }

    let newBalance = state.balance
    let newSkills = { ...state.player.skills }

    if (choice.cost) newBalance -= choice.cost
    if (choice.effect.balanceChange) newBalance += choice.effect.balanceChange

    if (choice.effect.skillChange) {
      newSkills = {
        programming: Math.max(0, Math.min(100, newSkills.programming + (choice.effect.skillChange.programming || 0))),
        finance: Math.max(0, Math.min(100, newSkills.finance + (choice.effect.skillChange.finance || 0))),
        luck: Math.max(0, Math.min(100, newSkills.luck + (choice.effect.skillChange.luck || 0))),
      }
    }

    if (choice.effect.delayedEffect) {
      const delayedEffect = {
        id: nanoid(),
        effect: choice.effect.delayedEffect.effect,
        triggerYear: state.currentYear + choice.effect.delayedEffect.yearsDelay,
      }
      set({ delayedEffects: [...state.delayedEffects, delayedEffect] })
    }

    const majorEvent = `[${event.type.toUpperCase()}] ${event.title}: ${choice.text}`
    const updatedHistory = state.history.map(entry =>
      entry.year === state.currentYear
        ? { ...entry, majorEvents: [...entry.majorEvents, majorEvent] }
        : entry
    )

    set({
      balance: newBalance,
      player: { ...state.player, skills: newSkills },
      events: state.events.filter(e => e.id !== eventId),
      eventLog: [...state.eventLog, `✅ Решено: ${event.title} → ${choice.text}`],
      history: updatedHistory,
    })

    notify.success('Событие', choice.text)
  },
})
