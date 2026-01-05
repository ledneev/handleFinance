import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Expense, GameEvent, GameStore, OngoingEffect } from '@/types/game.types';
import { notify, useUIStore } from './uiStore';

import { INITIAL_PLAYER, INITIAL_BALANCE, STARTING_YEAR, getRandomEvent } from '@/constants';
import { INITIAL_ASSETS } from '@/constants/assets';

import { CAREER_CONFIGS, CAREER_LEVELS } from '@/constants/careers';
import { formatCurrency } from '@/utils';
import { EXPENSES, ONE_TIME_PURCHASES } from '@/constants/expenses';

const calculateMonthlyExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.currentAmount, 0);
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      currentYear: STARTING_YEAR,
      balance: INITIAL_BALANCE,
      player: INITIAL_PLAYER,
      isGameActive: true,
      priceChanges: {} as Record<string, number>,
      portfolio: [],
      availableAssets: INITIAL_ASSETS,
      educationPurchases: [],
      ongoingEffects: [],

      events: [],
      history: [
        {
          year: STARTING_YEAR,
          balance: INITIAL_BALANCE,
          netWorth: INITIAL_BALANCE,
          salary: INITIAL_PLAYER.salary,
          majorEvents: ['Старт игры'],
        },
      ],
      eventLog: ['Добро пожаловать в симулятор финансов!'],

      selectedAssetId: null,
      delayedEffects: [],

      oneTimePurchases: ONE_TIME_PURCHASES,
      monthlyExpenses: calculateMonthlyExpenses(EXPENSES),
      expenses: EXPENSES,

      advanceYear: () => {
        const state = get();
        const monthlyExpenses = calculateMonthlyExpenses(state.expenses);
        const yearlyExpenses = monthlyExpenses * 12;
        const newYear = state.currentYear + 1;
        const yearlySalary = state.player.salary * 12;
        const projectedBalance = state.balance + yearlySalary - yearlyExpenses;

        const updatedEffects = [...state.ongoingEffects];
        let skillBonus = 0;
        const effectMessages: string[] = [];

        if (projectedBalance < 0) {
          notify.error(
            'Финансовый кризис',
            `Недостаточно средств к концу года! Недостаёт: ${formatCurrency(-projectedBalance)}`
          );
          return;
        }

        const newBalance = state.balance + yearlySalary - yearlyExpenses;

        updatedEffects.forEach(effect => {
          if (
            effect.type === 'college_education' &&
            !effect.appliedThisYear &&
            effect.remainingYears > 0
          ) {
            skillBonus += effect.yearlySkillBonus;
            effect.appliedThisYear = true;
          }
        });

        const newSkills = { ...state.player.skills };
        if (skillBonus > 0) {
          newSkills.programming = Math.min(100, newSkills.programming + skillBonus);
          effectMessages.push(`🎓 +${skillBonus} к программированию за обучение`);
        }

        updatedEffects.forEach(effect => {
          effect.appliedThisYear = false;
        });

        const activeEffects = updatedEffects.filter(effect => {
          if (effect.remainingYears <= 1) {
            effectMessages.push(`🎓 Завершено обучение: ${effect.type}`);
            return false;
          }
          effect.remainingYears -= 1;
          return true;
        });

        const updatedAssets = state.availableAssets.map(asset => ({
          ...asset,
          currentPrice: Math.max(
            1,
            asset.currentPrice * (1 + asset.trend * 0.1 + (Math.random() - 0.5) * asset.volatility)
          ),
        }));

        const priceChanges: Record<string, number> = {};
        state.availableAssets.forEach(asset => {
          priceChanges[asset.id] = asset.trend * 10 + (Math.random() - 0.5) * 5;
        });

        const portfolioValue = state.portfolio.reduce((total, item) => {
          const asset = updatedAssets.find(a => a.id === item.assetId);
          return total + (asset ? asset.currentPrice * item.quantity : 0);
        }, 0);

        const netWorth = newBalance + portfolioValue;

        const newHistoryEntry = {
          year: newYear,
          balance: newBalance,
          netWorth,
          salary: state.player.salary,
          majorEvents: state.events.map(e => e.title),
        };

        set({
          currentYear: newYear,
          balance: newBalance,
          availableAssets: updatedAssets,
          priceChanges,
          history: [...state.history, newHistoryEntry],
          events: [],
          eventLog: [
            ...state.eventLog,
            `Год ${newYear}: получена зарплата ${yearlySalary.toLocaleString()}₽`,
            ...effectMessages,
          ],
          player: {
            ...state.player,
            skills: newSkills,
          },
          ongoingEffects: activeEffects,
        });

        if (Math.random() < 0.8) {
          get().triggerRandomEvent();
        }
      },

      addMoney: (amount: number) => {
        if (amount <= 0) return;

        set(state => ({
          balance: state.balance + amount,
          eventLog: [...state.eventLog, `Получено: ${amount.toLocaleString()}₽`],
        }));
      },

      spendMoney: (amount: number) => {
        const state = get();

        if (state.balance < amount) {
          set({
            eventLog: [...state.eventLog, '❌ Недостаточно средств!'],
          });
          return;
        }

        set({
          balance: state.balance - amount,
          eventLog: [...state.eventLog, `Потрачено: ${amount.toLocaleString()}₽`],
        });
      },

      buyAsset: (assetId: string, quantity: number) => {
        const state = get();
        const asset = state.availableAssets.find(a => a.id === assetId);

        if (!asset) {
          notify.error('Ошибка', 'Актив не найден');
          set({ eventLog: [...state.eventLog, '❌ Актив не найден'] });
          return;
        }

        if (asset.id === 'college') {
          const alreadyHasCollege = state.ongoingEffects.some(e => e.type === 'college_education');
          if (alreadyHasCollege) {
            notify.error('Ограничение', 'Вы уже поступили в колледж. Можно только один раз.');
            return;
          }

          if (state.balance < asset.currentPrice) {
            notify.error('Недостаточно средств', `Нужно: ${formatCurrency(asset.currentPrice)}`);
            return;
          }

          const collegeEffect: OngoingEffect = {
            id: nanoid(),
            type: 'college_education',
            assetId: 'college',
            remainingYears: 3,
            yearlySkillBonus: 5,
            appliedThisYear: false,
          };

          set({
            balance: state.balance - asset.currentPrice,
            ongoingEffects: [...state.ongoingEffects, collegeEffect],
            eventLog: [
              ...state.eventLog,
              `🎓 Вы поступили в колледж! Будет давать +5 к программированию 3 года подряд.`,
            ],
          });

          notify.success('Колледж', 'Вы начали обучение! 🎓');
          return;
        }

        if (asset.type === 'consumable' || asset.isConsumable) {
          const alreadyPurchasedThisYear = state.educationPurchases.some(
            purchase => purchase.year === state.currentYear && purchase.assetId === assetId
          );

          if (alreadyPurchasedThisYear) {
            notify.error(
              'Ограничение',
              'Вы уже покупали курс в этом году. Можно — только один раз в год.'
            );
            return;
          }
          const totalCost = asset.currentPrice * quantity;

          if (state.balance < totalCost) {
            notify.error(
              'Недостаточно средств',
              `Для покупки ${asset.name} нужно: ${formatCurrency(totalCost)}`
            );
            set({ eventLog: [...state.eventLog, '❌ Недостаточно средств для покупки'] });
            return;
          }

          const effects = asset.effects || {};
          const newSkills = { ...state.player.skills };
          const messages: string[] = [];

          if (effects.skillBonus) {
            if (effects.skillBonus.programming) {
              const bonus = effects.skillBonus.programming * quantity;
              newSkills.programming = Math.min(100, newSkills.programming + bonus);
              messages.push(`📚 +${bonus} к программированию`);
            }
            if (effects.skillBonus.finance) {
              const bonus = effects.skillBonus.finance * quantity;
              newSkills.finance = Math.min(100, newSkills.finance + bonus);
              messages.push(`💰 +${bonus} к финансам`);
            }
            if (effects.skillBonus.luck) {
              const bonus = effects.skillBonus.luck * quantity;
              newSkills.luck = Math.min(100, newSkills.luck + bonus);
              messages.push(`🍀 +${bonus} к удаче`);
            }
          } else if (asset.skillBonus) {
            // Резервный вариант: если бонус прямо в asset
            const bonus = asset.skillBonus * quantity;
            newSkills.programming = Math.min(100, newSkills.programming + bonus);
            messages.push(`📚 +${bonus} к программированию`);
          }

          set({
            balance: state.balance - totalCost,
            player: {
              ...state.player,
              skills: newSkills,
            },
            educationPurchases: [...state.educationPurchases, { year: state.currentYear, assetId }],
            eventLog: [
              ...state.eventLog,
              `🎓 Куплено: ${asset.name} (${quantity} шт.)`,
              ...messages,
            ],
          });

          notify.success('Покупка', `Куплено: ${asset.name} ×${quantity}`);
          if (messages.length > 0) {
            notify.info('Навыки обновлены', messages.join(', '));
          }
          return;
        }

        const totalCost = asset.currentPrice * quantity;

        if (state.balance < totalCost) {
          notify.error(
            'Недостаточно средств',
            `Нужно: ${formatCurrency(totalCost)}, у вас: ${formatCurrency(state.balance)}`
          );
          set({ eventLog: [...state.eventLog, '❌ Недостаточно средств для покупки'] });
          return;
        }

        const existingItem = state.portfolio.find(item => item.assetId === assetId);
        let updatedPortfolio: typeof state.portfolio;

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          const newAvgPrice =
            (existingItem.purchasePrice * existingItem.quantity + totalCost) / newQuantity;
          updatedPortfolio = state.portfolio.map(item =>
            item.assetId === assetId
              ? { ...item, quantity: newQuantity, purchasePrice: newAvgPrice }
              : item
          );
        } else {
          updatedPortfolio = [
            ...state.portfolio,
            {
              assetId,
              quantity,
              purchasePrice: asset.currentPrice,
              purchaseDate: new Date(),
            },
          ];
        }

        set({
          balance: state.balance - totalCost,
          portfolio: updatedPortfolio,
          eventLog: [...state.eventLog, `✅ Куплено ${quantity} ${asset.name}`],
        });

        notify.success('Покупка', `Куплено ${quantity} ${asset.name}`);
      },

      sellAsset: (assetId: string, quantity: number) => {
        const state = get();
        const asset = state.availableAssets.find(a => a.id === assetId);
        const portfolioItem = state.portfolio.find(item => item.assetId === assetId);

        if (!asset || !portfolioItem) {
          notify.error('Ошибка', 'Актив не найден в портфеле');
          set({ eventLog: [...state.eventLog, '❌ Актив не найден в портфеле'] });
          return;
        }

        if (portfolioItem.quantity < quantity) {
          notify.error(
            'Ошибка',
            `Недостаточно активов. У вас: ${portfolioItem.quantity}, хотите продать: ${quantity}`
          );
          set({ eventLog: [...state.eventLog, '❌ Недостаточно активов для продажи'] });
          return;
        }

        const totalValue = asset.currentPrice * quantity;
        const profit = (asset.currentPrice - portfolioItem.purchasePrice) * quantity;

        let updatedPortfolio: typeof state.portfolio;

        if (portfolioItem.quantity === quantity) {
          updatedPortfolio = state.portfolio.filter(item => item.assetId !== assetId);
        } else {
          updatedPortfolio = state.portfolio.map(item =>
            item.assetId === assetId ? { ...item, quantity: item.quantity - quantity } : item
          );
        }

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
        });

        notify.success('Продажа', `Продано ${quantity} ${asset.name}`);
        if (profit !== 0) {
          notify[profit > 0 ? 'success' : 'warning'](
            profit > 0 ? 'Прибыль' : 'Убыток',
            `${profit > 0 ? '🎉' : '📉'} ${formatCurrency(Math.abs(profit))}`
          );
        }
      },

      updateExpenseLevel: (expenseId: string, newLevel: number) => {
        const state = get();

        const expense = state.expenses.find(e => e.id === expenseId);
        if (!expense || newLevel < 1 || newLevel > expense.maxLevel) {
          return;
        }

        const levelMultiplier = 1 + (newLevel - 1) * 0.5; // +50% за уровень
        const newAmount = Math.round(expense.baseAmount * levelMultiplier);

        set({
          expenses: state.expenses.map(exp =>
            exp.id === expenseId ? { ...exp, level: newLevel, currentAmount: newAmount } : exp
          ),
          monthlyExpenses: calculateMonthlyExpenses(state.expenses), // ✅ Пересчёт
          eventLog: [
            ...state.eventLog,
            `📊 Уровень расходов "${expense.name}" изменён на ${newLevel} (${formatCurrency(newAmount)}/мес)`,
          ],
        });

        notify.info('Расходы', `Вы изменили уровень: ${expense.name}`);
      },

      purchaseItem: (itemId: string) => {
        const state = get();
        const item = state.oneTimePurchases.find(i => i.id === itemId);

        if (!item) {
          notify.error('Ошибка', 'Товар не найден');
          return;
        }

        if (item.purchased) {
          notify.error('Ошибка', 'Этот товар уже куплен');
          return;
        }

        if (state.balance < item.price) {
          notify.error('Недостаточно средств', `Нужно: ${formatCurrency(item.price)}`);
          return;
        }

        let newSkills = { ...state.player.skills };
        let newExpenses = [...state.expenses];

        if (item.effects?.skillBonus) {
          newSkills = {
            programming: Math.min(
              100,
              newSkills.programming + (item.effects.skillBonus.programming || 0)
            ),
            finance: Math.min(100, newSkills.finance + (item.effects.skillBonus.finance || 0)),
            luck: Math.min(100, newSkills.luck + (item.effects.skillBonus.luck || 0)),
          };
        }

        if (item.effects?.expenseChange) {
          newExpenses = newExpenses.map(expense => {
            const change = item.effects!.expenseChange![expense.id];
            if (change !== undefined) {
              return {
                ...expense,
                currentAmount: Math.max(0, expense.currentAmount + change),
              };
            }
            return expense;
          });
        }

        set({
          balance: state.balance - item.price,
          player: {
            ...state.player,
            skills: newSkills,
          },
          expenses: newExpenses,
          monthlyExpenses: calculateMonthlyExpenses(newExpenses), // ✅ Пересчёт
          oneTimePurchases: state.oneTimePurchases.map(i =>
            i.id === itemId ? { ...i, purchased: true, purchaseDate: Date.now() } : i
          ),
          eventLog: [...state.eventLog, `🛒 Куплено: ${item.name}`],
        });

        notify.success('Покупка', `Приобретено: ${item.name}`);
      },

      upgradeCareer: () => {
        const state = get();
        const currentIndex = CAREER_LEVELS.indexOf(state.player.career);

        if (currentIndex >= CAREER_LEVELS.length - 1) {
          notify.info('Карьера', 'Вы достигли максимального уровня!');
          set({
            eventLog: [...state.eventLog, '🎖️ Вы уже достигли максимального уровня карьеры!'],
          });
          return;
        }

        const nextLevel = CAREER_LEVELS[currentIndex + 1];
        const nextConfig = CAREER_CONFIGS[nextLevel];

        if (state.balance < nextConfig.upgradeCost) {
          notify.error(
            'Недостаточно средств',
            `Для повышения нужно: ${formatCurrency(nextConfig.upgradeCost)}`
          );
          set({
            eventLog: [...state.eventLog, '❌ Недостаточно средств для повышения квалификации'],
          });
          return;
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
        });

        notify.success('Повышение!', `Вы стали ${nextLevel} 🎉`);
      },

      triggerRandomEvent: () => {
        const state = get();
        const eventTemplate = getRandomEvent(state.currentYear, state.player.skills);

        const event: GameEvent = {
          ...eventTemplate,
          id: nanoid(),
          year: state.currentYear,
          isResolved: false,
        };

        set({
          events: [...state.events, event],
          eventLog: [...state.eventLog, `⚡ Событие: ${event.title}`],
        });

        useUIStore.getState().openEventModal(event);
      },

      resolveEvent: (eventId: string, choiceIndex?: number) => {
        const state = get();
        const event = state.events.find(e => e.id === eventId);

        if (!event) return;

        if (choiceIndex === undefined) {
          if (event.effect.delayedEffect) {
            const delayedEffect = {
              id: nanoid(),
              effect: event.effect.delayedEffect.effect,
              triggerYear: state.currentYear + event.effect.delayedEffect.yearsDelay,
            };

            set({
              delayedEffects: [...state.delayedEffects, delayedEffect],
              eventLog: [
                ...state.eventLog,
                `⏳ Эффект "${event.title}" будет применён через ${event.effect.delayedEffect.yearsDelay} года`,
              ],
            });
          }

          set({
            events: state.events.filter(e => e.id !== eventId),
            eventLog: [...state.eventLog, `✅ Событие: ${event.title}`],
          });

          return;
        }

        const choice = event.choices[choiceIndex];
        if (!choice) {
          set({
            events: state.events.filter(e => e.id !== eventId),
            eventLog: [...state.eventLog, `❌ Неверный выбор для события: ${event.title}`],
          });
          return;
        }

        if (choice.requires) {
          const { minBalance, minSkills, hasAsset } = choice.requires;

          if (minBalance !== undefined && state.balance < minBalance) {
            notify.error('Недостаточно средств', `Требуется: ${formatCurrency(minBalance)}`);
            return;
          }

          if (minSkills) {
            const { programming, finance, luck } = state.player.skills;
            if (
              (minSkills.programming && programming < minSkills.programming) ||
              (minSkills.finance && finance < minSkills.finance) ||
              (minSkills.luck && luck < minSkills.luck)
            ) {
              notify.error('Условие не выполнено', 'Недостаточно навыков');
              return;
            }
          }

          if (hasAsset && !state.portfolio.some(item => item.assetId === hasAsset)) {
            notify.error('Условие не выполнено', 'Требуется актив: ' + hasAsset);
            return;
          }
        }

        if (choice.cost && state.balance < choice.cost) {
          notify.error('Недостаточно средств', `Нужно: ${formatCurrency(choice.cost)}`);
          return;
        }

        let newBalance = state.balance;
        let newSkills = { ...state.player.skills };

        if (choice.cost) {
          newBalance -= choice.cost;
        }

        if (choice.effect.balanceChange) {
          newBalance += choice.effect.balanceChange;
        }

        if (choice.effect.skillChange) {
          newSkills = {
            programming: Math.max(
              0,
              Math.min(100, newSkills.programming + (choice.effect.skillChange.programming || 0))
            ),
            finance: Math.max(
              0,
              Math.min(100, newSkills.finance + (choice.effect.skillChange.finance || 0))
            ),
            luck: Math.max(
              0,
              Math.min(100, newSkills.luck + (choice.effect.skillChange.luck || 0))
            ),
          };
        }

        if (choice.effect.delayedEffect) {
          const delayedEffect = {
            id: nanoid(),
            effect: choice.effect.delayedEffect.effect,
            triggerYear: state.currentYear + choice.effect.delayedEffect.yearsDelay,
          };

          set({
            delayedEffects: [...state.delayedEffects, delayedEffect],
            eventLog: [
              ...state.eventLog,
              `⏳ Эффект "${choice.text}" будет применён через ${choice.effect.delayedEffect.yearsDelay} года`,
            ],
          });
        }

        const majorEvent = `[${event.type.toUpperCase()}] ${event.title}: ${choice.text}`;
        const newHistory = state.history.map(entry =>
          entry.year === state.currentYear
            ? { ...entry, majorEvents: [...entry.majorEvents, majorEvent] }
            : entry
        );

        set({
          balance: newBalance,
          player: {
            ...state.player,
            skills: newSkills,
          },
          events: state.events.filter(e => e.id !== eventId),
          eventLog: [...state.eventLog, `✅ Решено: ${event.title} → ${choice.text}`],
          history: newHistory,
        });

        notify.success('Событие решено', choice.text);
      },

      resetGame: () => {
        set({
          currentYear: 2024,
          balance: 500000,
          player: INITIAL_PLAYER,
          isGameActive: true,
          portfolio: [],
          availableAssets: INITIAL_ASSETS,
          events: [],
          history: [
            {
              year: 2024,
              balance: 500000,
              netWorth: 500000,
              salary: 80000,
              majorEvents: ['Старт игры'],
            },
          ],
          eventLog: ['🎮 Игра сброшена, начинаем заново!'],
          selectedAssetId: null,
          delayedEffects: [],
          educationPurchases: [],
          ongoingEffects: [],


          expenses: JSON.parse(JSON.stringify(EXPENSES)),
          oneTimePurchases: JSON.parse(JSON.stringify(ONE_TIME_PURCHASES)),
          monthlyExpenses: calculateMonthlyExpenses(EXPENSES),
        });
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
      }),
    }
  )
);
