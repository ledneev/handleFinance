import React from 'react';
import { useGameStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Briefcase,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatPercent } from '@/utils';

export const HistoryPage: React.FC = () => {
  const { history, currentYear } = useGameStore();

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 text-4xl mb-4">📜</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          История пока пуста
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Начните играть, и здесь появятся записи о ваших достижениях
        </p>
      </div>
    );
  }

  const totalYears = history.length;
  const firstYear = history[0];
  const lastYear = history[history.length - 1];

  const totalBalanceGrowth = lastYear.balance - firstYear.balance;
  const totalNetWorthGrowth = lastYear.netWorth - firstYear.netWorth;
  const avgSalaryGrowth =
    history.reduce((sum, year, index, array) => {
      if (index === 0) return 0;
      return sum + (year.salary - array[index - 1].salary);
    }, 0) /
    (totalYears - 1);

  // Подготавливаем данные для графика (упрощенный вид)
  const chartData = history.map(year => ({
    year: year.year,
    balance: year.balance,
    netWorth: year.netWorth,
    salary: year.salary,
    isCurrent: year.year === currentYear,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📜 История игры</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Анализ вашего финансового прогресса по годам
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Пройдено лет</div>
                <div className="text-2xl font-bold">{totalYears}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {firstYear.year} - {lastYear.year}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Рост баланса</div>
                <div
                  className={`text-2xl font-bold ${totalBalanceGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {formatCurrency(totalBalanceGrowth)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {totalBalanceGrowth >= 0 ? '📈' : '📉'}
                  {formatPercent((totalBalanceGrowth / firstYear.balance) * 100)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Рост капитала</div>
                <div
                  className={`text-2xl font-bold ${totalNetWorthGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {formatCurrency(totalNetWorthGrowth)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {totalNetWorthGrowth >= 0 ? '📈' : '📉'}
                  {formatPercent((totalNetWorthGrowth / firstYear.netWorth) * 100)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Briefcase className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Средний рост зарплаты
                </div>
                <div
                  className={`text-2xl font-bold ${avgSalaryGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {formatCurrency(avgSalaryGrowth)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">в год</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>📊 Подробная история по годам</CardTitle>
          <CardDescription>
            Детальный анализ ваших финансовых показателей за каждый год
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Год
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Баланс
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Капитал
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Зарплата
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Изменение
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    События
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, index) => {
                  const prevItem = index > 0 ? chartData[index - 1] : null;
                  const balanceChange = prevItem ? item.balance - prevItem.balance : 0;
                  const netWorthChange = prevItem ? item.netWorth - prevItem.netWorth : 0;

                  return (
                    <tr
                      key={item.year}
                      className={`
                        border-b border-gray-100 dark:border-gray-800 
                        ${item.isCurrent ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
                        transition-colors
                      `}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{item.year}</span>
                          {item.isCurrent && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-full">
                              Текущий
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium">{formatCurrency(item.balance)}</div>
                        {index > 0 && (
                          <div
                            className={`text-xs flex items-center gap-1 ${balanceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {balanceChange >= 0 ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {formatCurrency(Math.abs(balanceChange))}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium">{formatCurrency(item.netWorth)}</div>
                        {index > 0 && (
                          <div
                            className={`text-xs flex items-center gap-1 ${netWorthChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {netWorthChange >= 0 ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {formatCurrency(Math.abs(netWorthChange))}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium">{formatCurrency(item.salary)}/мес</div>
                        {index > 0 && prevItem && (
                          <div className="text-xs text-gray-500">
                            {item.salary > prevItem.salary
                              ? '↑'
                              : item.salary < prevItem.salary
                                ? '↓'
                                : '→'}
                            {formatCurrency(Math.abs(item.salary - prevItem.salary))}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {index > 0 && (
                          <div
                            className={`flex items-center gap-1 ${netWorthChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {netWorthChange >= 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            <span>
                              {formatPercent((netWorthChange / prevItem!.netWorth) * 100)}
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                          {history[index]?.majorEvents.slice(0, 2).map((event, i) => (
                            <div key={i} className="truncate">
                              • {event}
                            </div>
                          ))}
                          {history[index]?.majorEvents.length > 2 && (
                            <div className="text-xs text-gray-500">
                              и ещё {history[index].majorEvents.length - 2} событий
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>📈 Динамика баланса</CardTitle>
            <CardDescription>Изменение наличных средств по годам</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-72 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis
                    width={38}
                    tickFormatter={value => formatCurrency(value)}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickLine={false}
                    domain={['dataMin', 'dataMax']}
                  />
                  <Tooltip
                    labelFormatter={value => `${value} год`}
                    formatter={(value, name) => {
                      if (typeof value !== 'number') return ['', name];
                      const roundedValue = Math.round(value);
                      if (name === 'balance') return [formatCurrency(roundedValue), 'Баланс'];
                      return [formatCurrency(roundedValue), name];
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    name="Баланс"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🏦 Динамика капитала</CardTitle>
            <CardDescription>Изменение чистого капитала (баланс + активы)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-72 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis
                    width={60}
                    tickFormatter={value => formatCurrency(value)}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickLine={false}
                    domain={['dataMin', 'dataMax']}
                  />
                  <Tooltip
                    labelFormatter={value => `${value} год`}
                    formatter={(value, name) => {
                      if (typeof value !== 'number') return ['', name];
                      const roundedValue = Math.round(value);
                      if (name === 'netWorth')
                        return [formatCurrency(roundedValue), 'Чистый капитал'];
                      return [formatCurrency(roundedValue), name];
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="netWorth"
                    name="Чистый капитал"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🧠 Анализ вашего прогресса</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {totalNetWorthGrowth > 0 ? (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-300">
                      Отличный прогресс!
                    </h4>
                    <p className="text-green-700 dark:text-green-400 mt-1">
                      Ваш капитал вырос на{' '}
                      {formatPercent((totalNetWorthGrowth / firstYear.netWorth) * 100)}
                      за {totalYears} лет. Продолжайте в том же духе!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">
                      Есть куда расти
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-400 mt-1">
                      Ваш капитал не показал значительного роста. Попробуйте более агрессивные
                      стратегии инвестирования или фокусируйтесь на карьерном росте.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  Рекомендации
                </h4>
                <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                  <li>• Диверсифицируйте портфель для снижения рисков</li>
                  <li>• Реинвестируйте доходы для ускорения роста</li>
                  <li>• Следите за инфляцией при долгосрочном планировании</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-2">Что дальше?</h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
                  <li>• Поставьте финансовую цель на следующие 5 лет</li>
                  <li>• Проанализируйте наиболее доходные активы</li>
                  <li>• Запланируйте повышение квалификации</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
