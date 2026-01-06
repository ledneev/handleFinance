import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/utils';
import { GameGoal, GameSettings } from '@/types/game.types';
import { useGameStore } from '@/store';

export const StartScreen: React.FC = () => {
  const { setGameSettings } = useGameStore();

  const [form, setForm] = useState<Omit<GameSettings, 'startedAtYear'>>({
    playerName: 'Инвестор',
    initialBalance: 500000,
    initialSkills: { programming: 20, finance: 10, luck: 50 },
    goal: { type: 'wealth', targetAmount: 10_000_000 } as GameGoal,
    timeLimitYears: 20,
  });

  const handleSubmit = () => {
    setGameSettings({
      ...form,
      startedAtYear: 2024,
    });
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white">
          🎯 Настройка игры
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ваше имя
            </label>
            <input
              type="text"
              value={form.playerName}
              onChange={e => setForm({ ...form, playerName: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Стартовый капитал
            </label>
            <input
              type="number"
              value={form.initialBalance}
              onChange={e => setForm({ ...form, initialBalance: +e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formatCurrency(form.initialBalance)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Стартовые навыки
            </label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {(['programming', 'finance', 'luck'] as const).map(skill => (
                <div key={skill}>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {skill}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.initialSkills[skill]}
                    onChange={e =>
                      setForm({
                        ...form,
                        initialSkills: {
                          ...form.initialSkills,
                          [skill]: +e.target.value,
                        },
                      })
                    }
                    className="w-full"
                  />
                  <div className="text-xs text-center">{form.initialSkills[skill]}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Выберите цель
            </label>
            <select
              value={form.goal.type}
              onChange={e => {
                const type = e.target.value;
                setForm({
                  ...form,
                  goal:
                    type === 'wealth'
                      ? { type: 'wealth', targetAmount: 10_000_000 }
                      : type === 'lifestyle'
                        ? { type: 'lifestyle', description: 'Max lifestyle' }
                        : type === 'career'
                          ? { type: 'career', targetLevel: 'director' }
                          : { type: 'skill', skill: 'programming', target: 100 },
                });
              }}
              className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="wealth">Заработать 10 млн ₽</option>
              <option value="lifestyle">Максимум качества жизни</option>
              <option value="career">Достичь уровня Director</option>
              <option value="skill">Развить навык программирования до 100%</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Срок (лет): {form.timeLimitYears}
            </label>
            <input
              type="range"
              min="10"
              max="30"
              value={form.timeLimitYears}
              onChange={e => setForm({ ...form, timeLimitYears: +e.target.value })}
              className="w-full"
            />
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              От {form.timeLimitYears} лет
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button size="lg" onClick={handleSubmit}>
            🚀 Начать игру
          </Button>
        </div>
      </div>
    </div>
  );
};
