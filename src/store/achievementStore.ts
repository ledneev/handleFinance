import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { achievementsData } from '@/data/achievements';
import type { GameState } from '@/types/game.types';
import { notify } from './uiStore';
import { Achievement } from '@/types/achievement.types';
import { useGameStore } from '.';

interface AchievementState {
  achievements: Record<string, Omit<Achievement, 'condition'> & { unlockDate?: string }>;
}

interface AchievementActions {
  checkAchievements: (state: GameState) => void;
  grantAchievement: (id: string) => void;
}

export const useAchievementStore = create<AchievementState & AchievementActions>()(
  persist(
    (set, get) => ({
      achievements: Object.fromEntries(
        achievementsData.map(a => [a.id, { ...a, condition: undefined, unlocked: false }])
      ),

      checkAchievements: state => {
        const current = get().achievements;

        achievementsData.forEach(achievement => {
          if (current[achievement.id].unlocked) return;

          if (achievement.condition(state)) {
            get().grantAchievement(achievement.id);
          }
        });
      },

      grantAchievement: id => {
        const all = achievementsData.find(a => a.id === id);
        if (!all) return;

        const unlocked = {
          ...all,
          unlocked: true,
          unlockDate: new Date().toISOString(),
          condition: undefined,
        };

        set(state => ({
          achievements: {
            ...state.achievements,
            [id]: unlocked,
          },
        }));

        notify.success('🏆 Достижение получено!', unlocked.title, 5000);

        const bonus = unlocked.bonus;
        const game = useGameStore.getState();

        if (!game) return;

        switch (bonus.type) {
          case 'money':
            game.addMoney(bonus.amount);
            break;
          case 'skill':
            game.player.skills[bonus.skill] += bonus.value;
            break;
          case 'event':
            // Можно добавить шанс на событие — например, в advanceYear
            // Пока просто уведомление
            break;
        }
      },
    }),
    {
      name: 'achievements-storage',
    }
  )
);
