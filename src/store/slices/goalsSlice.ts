import { useUIStore } from '@/store/uiStore';
import { getGoalDescription } from '@/utils/game';
import type { GameStore } from '@/types/game.types';
import type { GameSettings } from '@/types/game.types';

type SetState = (partial: Partial<GameStore> | ((state: GameStore) => Partial<GameStore>)) => void;
type GetState = () => GameStore;

export const createGoalsSlice = (set: SetState, get: GetState) => ({
  setGameSettings: (settings: GameSettings) => {
    set({
      player: {
        ...get().player,
        name: settings.playerName,
        skills: { ...settings.initialSkills },
      },
      balance: settings.initialBalance,
      gameSettings: settings,
      currentYear: settings.startedAtYear,
      gameOver: false,
      gameWon: null,
      eventLog: [
        `🎯 Цель: ${getGoalDescription(settings.goal)}`,
        `⏳ До ${settings.startedAtYear + settings.timeLimitYears} года`,
      ],
    });
  },

  checkGoal: () => {
  const state = get()
  if (!state.gameSettings || state.gameOver) return

  const { gameSettings } = state
  const goal = gameSettings.goal
  const yearsPassed = state.currentYear - gameSettings.startedAtYear
  const isTimeUp = yearsPassed >= gameSettings.timeLimitYears

  let isGoalAchieved = false

  switch (goal.type) {
    case 'wealth':
      isGoalAchieved = state.balance >= goal.targetAmount
      break
    case 'lifestyle':
      isGoalAchieved =
        state.expenses.every(e => e.level === e.maxLevel) &&
        state.oneTimePurchases.every(i => i.purchased)
      break
    case 'career':
      isGoalAchieved = state.player.career === goal.targetLevel
      break
    case 'skill':
      isGoalAchieved = state.player.skills[goal.skill] >= goal.target
      break
    default:
      return
  }

  if (isGoalAchieved || isTimeUp) {
    const netWorth = state.balance + state.history[state.history.length - 1]?.netWorth || 0

    set({ gameOver: true, gameWon: isGoalAchieved })

    useUIStore.getState().openInfoModal({
      title: isGoalAchieved ? '🎉 Победа!' : '💀 Игра окончена',
      message: isGoalAchieved
        ? `Вы достигли цели: ${getGoalDescription(goal)}\n\nЗа ${yearsPassed} лет вы построили свою мечту!`
        : `Вы не успели достичь цели: ${getGoalDescription(goal)}\n\nВремя вышло — попробуйте снова!`,
      // Добавим статистику в data
    })
    console.log(netWorth)

    state.eventLog.push(isGoalAchieved ? '🏆 Цель достигнута!' : '⏳ Время вышло')
  }
}
});
