import { Achievement } from '@/types/achievement.types';

export const achievementsData: Achievement[] = [
  {
    id: 'first_year',
    title: 'Первый год',
    description: 'Успешно завершил первый год игры',
    icon: '🎉',
    condition: state => {
      const startedAtYear = state.gameSettings?.startedAtYear;
      return startedAtYear != null && state.currentYear >= startedAtYear + 1;
    },
    bonus: { type: 'money', amount: 500 },
    unlocked: false,
  },
  {
    id: 'millionaire',
    title: 'Миллионер',
    description: 'Твой чистый капитал превысил 1 000 000',
    icon: '💰',
    condition: state => {
      const lastEntry = state.history.at(-1);
      return lastEntry !== undefined && lastEntry.netWorth >= 1_000_000;
    },
    bonus: { type: 'skill', skill: 'finance', value: 5 },
    unlocked: false,
  },
  {
    id: 'full_portfolio',
    title: 'Инвестор',
    description: 'Приобрел по одному активу каждого типа',
    icon: '📊',
    condition: state => {
      const types = new Set(
        state.portfolio.map(p => {
          const asset = state.availableAssets.find(a => a.id === p.assetId);
          return asset?.type;
        })
      );
      return types.size >= 4;
    },
    bonus: { type: 'money', amount: 2000 },
    unlocked: false,
  },
  {
    id: 'zero_expenses',
    title: 'Монах',
    description: 'Прожил год без расходов',
    icon: '🧘',
    condition: state => {
      const lastYear = state.currentYear;
      const logEntry = state.history.find(h => h.year === lastYear);
      return logEntry?.majorEvents.includes('Нулевые расходы') ?? false;
    },
    bonus: { type: 'event', chance: 0.3 },
    unlocked: false,
  },
  {
    id: 'educator',
    title: 'Выпускник',
    description: 'Завершил 3-летнее обучение в колледже',
    icon: '🎓',
    condition: state => {
      const collegePurchase = state.educationPurchases.find(p => p.assetId === 'college');
      if (!collegePurchase) return false;

      const yearsSincePurchase = state.currentYear - collegePurchase.year;
      return yearsSincePurchase >= 3;
    },
    bonus: { type: 'skill', skill: 'programming', value: 10 },
    unlocked: false,
  },
  {
    id: 'lucky_strike',
    title: 'Везунчик',
    description: 'Получил событие более 10 раз',
    icon: '🍀',
    condition: state => state.eventLog.length >= 10,
    bonus: { type: 'money', amount: 1000 },
    unlocked: false,
  },
  {
    id: 'career_master',
    title: 'Карьерный рост',
    description: 'Достиг уровня Director',
    icon: '💼',
    condition: state => state.player.career === 'director',
    bonus: { type: 'none' },
    unlocked: false,
  },
];
