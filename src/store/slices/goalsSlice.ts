// store/slices/goalsSlice.ts
import { notify } from '@/store/uiStore';
import { getGoalDescription } from '@/utils/game';
import type { GameStore } from '@/types/game.types';
import type { GameSettings } from '@/types/game.types';

// Просто определим тип для set — Zustand-совместимый
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
    const state = get();
    if (!state.gameSettings || state.gameOver) return;

    const { gameSettings } = state;
    const goal = gameSettings.goal; // ✅ Теперь безопасно

    const yearsPassed = state.currentYear - gameSettings.startedAtYear;
    const isTimeUp = yearsPassed >= gameSettings.timeLimitYears;

    let isGoalAchieved = false;

    switch (goal.type) {
      case 'wealth':
        isGoalAchieved = state.balance >= goal.targetAmount;
        break;
      case 'lifestyle':
        isGoalAchieved =
          state.expenses.every(e => e.level === e.maxLevel) &&
          state.oneTimePurchases.every(i => i.purchased);
        break;
      case 'career':
        isGoalAchieved = state.player.career === goal.targetLevel;
        break;
      case 'skill':
        { const skillValue = state.player.skills[goal.skill];
        isGoalAchieved = skillValue >= goal.target;
        break; }
      default:
        return;
    }

    if (isGoalAchieved) {
      set({ gameOver: true, gameWon: true });
      notify.success('🎉 Победа!', `Цель достигнута за ${yearsPassed} лет!`);
    } else if (isTimeUp) {
      set({ gameOver: true, gameWon: false });
      notify.error('⏰ Время вышло!', 'Вы не успели.');
    }
  },
});
