import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { GameStore } from '@/types/game.types';
import { notify } from './uiStore';

import { INITIAL_PLAYER, INITIAL_BALANCE, STARTING_YEAR } from '@/constants';
import { INITIAL_ASSETS } from '@/constants/assets';
import { getRandomEventTemplate } from '@/constants/event';
import { CAREER_CONFIGS, CAREER_LEVELS } from '@/constants/careers';
import { formatCurrency } from '@/utils';

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

      advanceYear: () => {
        const state = get();
        const newYear = state.currentYear + 1;

        // Используем константу месяцев
        const yearlySalary = state.player.salary * 12;
        const newBalance = state.balance + yearlySalary;

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
          ],
        });

        if (Math.random() < 0.3) {
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

        // --- 🔹 Покупка consumable (учебники, курсы и т.д.) ---
        if (asset.type === 'consumable' || asset.isConsumable) {
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

          // Применяем бонусы по навыкам
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
            eventLog: [
              ...state.eventLog,
              `🎓 Куплено: ${asset.name} (${quantity} шт.)`,
              ...messages,
            ],
          });

          // ✅ Уведомление
          notify.success('Покупка', `Куплено: ${asset.name} ×${quantity}`);
          if (messages.length > 0) {
            notify.info('Навыки обновлены', messages.join(', '));
          }
          return;
        }

        // --- 🔹 Покупка инвестиционного актива (акции, недвижимость и т.д.) ---
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

        // ✅ Уведомление
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
        const template = getRandomEventTemplate();
        const event = {
          ...template,
          id: nanoid(),
        };

        set(state => ({
          events: [...state.events, event],
          eventLog: [...state.eventLog, `⚡ Событие: ${event.title}`],
        }));
      },

      resolveEvent: (eventId: string, choiceIndex?: number) => {
        const state = get();
        const event = state.events.find(e => e.id === eventId);

        if (!event) return;

        // Применяем эффект события
        if (choiceIndex !== undefined && event.choices) {
          const choice = event.choices[choiceIndex];
          if (choice.effect.balanceChange) {
            set({ balance: state.balance + choice.effect.balanceChange });
          }
        } else if (event.effect.balanceChange) {
          set({ balance: state.balance + event.effect.balanceChange });
        }

        // Удаляем обработанное событие
        set({
          events: state.events.filter(e => e.id !== eventId),
        });
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
      }),
    }
  )
);
