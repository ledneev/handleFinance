import React from 'react';
import { notify, useGameStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Button } from '@/components/ui';
import {
  Home,
  Pizza,
  Car,
  Zap,
  Film,
  Heart,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { formatCurrency } from '@/utils';

const expenseIcons = {
  housing: Home,
  food: Pizza,
  transport: Car,
  utilities: Zap,
  entertainment: Film,
  health: Heart,
};

export const ExpensesPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expenses, oneTimePurchases, updateExpenseLevel, purchaseItem, balance, monthlyExpenses, player, } =
    useGameStore();

  const totalMonthlyExpenses = expenses.reduce((sum, expense) => sum + expense.currentAmount, 0)
  const yearlyExpenses = totalMonthlyExpenses * 12
  const yearlySalary = player.salary * 12

  const projectedYearEndBalance = balance + yearlySalary - yearlyExpenses

  const handleLevelChange = (expenseId: string, newLevel: number) => {
    if (newLevel < 1 || newLevel > 5) return;

    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;

    const currentMultiplier = 1 + (expense.level - 1) * 0.5;
    const newMultiplier = 1 + (newLevel - 1) * 0.5;
    const costDifference = expense.baseAmount * (newMultiplier - currentMultiplier);

    if (balance < costDifference * 12) {
      notify.error(
        'Недостаточно средств',
        `Для повышения уровня нужно дополнительно ${formatCurrency(costDifference * 12)} в год`
      );
      return;
    }

    updateExpenseLevel(expenseId, newLevel);
    notify.success('Уровень обновлён', `${expense.name} повышен до уровня ${newLevel}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          💸 Управление расходами
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Контролируйте свои регулярные и разовые расходы
        </p>
      </div>

      {/* Сводка расходов */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Сводка расходов</CardTitle>
          <CardDescription>Обзор ваших текущих финансовых обязательств</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Ежемесячные расходы</div>
              <div className="text-2xl font-bold mt-1">{formatCurrency(totalMonthlyExpenses)}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">в месяц</div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Годовые расходы</div>
              <div className="text-2xl font-bold mt-1">{formatCurrency(yearlyExpenses)}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">в год</div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Остаток на год с учетом зарплаты</div>
              <div
                className={`text-2xl font-bold mt-1 ${
                  projectedYearEndBalance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(projectedYearEndBalance)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {projectedYearEndBalance >= 0 ? '✅ Хватит на год' : '❌ Не хватит на год'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔄 Регулярные расходы</CardTitle>
          <CardDescription>
            Управляйте качеством жизни. Каждый уровень повышает расходы на 50%.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map(expense => {
              const Icon = expenseIcons[expense.category as keyof typeof expenseIcons] || Home;

              return (
                <div key={expense.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{expense.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {expense.description}
                        </p>
                        <div className="mt-2">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Уровень {expense.level}/{expense.maxLevel} -{' '}
                            {formatCurrency(expense.currentAmount)}/мес
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {expense.benefits?.[expense.level - 1]}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-lg font-bold">
                        {formatCurrency(expense.currentAmount)}
                        <span className="text-sm text-gray-500">/мес</span>
                      </div>

                      <div className="flex gap-1">
                        {[...Array(expense.maxLevel)].map((_, i) => {
                          const level = i + 1;
                          const isCurrent = level === expense.level;
                          const isAvailable = level <= expense.level + 1;

                          return (
                            <button
                              key={level}
                              onClick={() => isAvailable && handleLevelChange(expense.id, level)}
                              disabled={!isAvailable}
                              className={`
                                w-8 h-8 rounded flex items-center justify-center text-sm
                                ${
                                  isCurrent
                                    ? 'bg-blue-500 text-white'
                                    : isAvailable
                                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                      : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                                }
                              `}
                              title={`Уровень ${level}: ${expense.benefits?.[i] || ''}`}
                            >
                              {level}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🛒 Разовые покупки</CardTitle>
          <CardDescription>Вещи, которые можно купить один раз</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {oneTimePurchases.map(item => {
              const canPurchase = !item.purchased && balance >= item.price;

              return (
                <div
                  key={item.id}
                  className={`
                    p-4 rounded-lg border
                    ${
                      item.purchased
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                        : 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">{formatCurrency(item.price)}</div>

                    <Button
                      size="sm"
                      variant={canPurchase ? 'primary' : 'secondary'}
                      onClick={() => purchaseItem(item.id)}
                      disabled={item.purchased || !canPurchase}
                    >
                      {item.purchased ? 'Куплено' : 'Купить'}
                    </Button>
                  </div>

                  {item.effects && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {item.effects.skillBonus?.programming &&
                          `+${item.effects.skillBonus.programming} программирование `}
                        {item.effects.skillBonus?.finance &&
                          `+${item.effects.skillBonus.finance} финансы `}
                        {item.effects.skillBonus?.luck && `+${item.effects.skillBonus.luck} удача `}
                        {item.effects.expenseChange &&
                          Object.entries(item.effects.expenseChange).map(([key, value]) => (
                            <div key={key}>
                              {value < 0 ? '📉' : '📈'} {key}: {formatCurrency(Math.abs(value))}/мес
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>💡 Советы по управлению финансами</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <span className="font-medium">Правило 50/30/20</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  50% доходов на необходимые расходы, 30% на желания, 20% на сбережения и
                  инвестиции.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <TrendingDown className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <span className="font-medium">Контролируйте повышение уровня жизни</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Каждое повышение уровня расходов увеличивает их на 50%. Убедитесь что доходы
                  растут быстрее.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <ShoppingBag className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <span className="font-medium">Планируйте крупные покупки</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Разовые покупки могут дать бонусы, но требуют значительных средств. Планируйте
                  заранее.
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
