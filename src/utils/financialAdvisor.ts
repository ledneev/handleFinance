import { GameStore } from '@/types/game.types'
import { formatCurrency } from './formatters'
import { calculateMonthlyExpenses } from './expenses'

export interface Advice {
  id: string
  title: string
  message: string
  priority: number
  icon: string
}

export function getFinancialAdvice(state: GameStore): Advice | null {
  const monthlyExpenses = calculateMonthlyExpenses(state.expenses)
  const yearlyExpenses = monthlyExpenses * 12
  const yearlySalary = state.player.salary * 12

  const portfolioValue = state.portfolio.reduce((total, item) => {
    const asset = state.availableAssets.find(a => a.id === item.assetId)
    return total + (asset ? asset.currentPrice * item.quantity : 0)
  }, 0)

  const netWorth = state.balance + portfolioValue

  const expensesRatio = yearlyExpenses / yearlySalary
  const cashRatio = netWorth > 0 ? state.balance / netWorth : 1
  const emergencyFundMonths = monthlyExpenses > 0 ? state.balance / monthlyExpenses : 0

  const adviceList: Advice[] = []

  // Резервный фонд
  if (emergencyFundMonths < 3) {
    adviceList.push({
      id: 'emergency-fund',
      title: 'Создайте резервный фонд',
      message: `У вас ${Math.floor(emergencyFundMonths)} месяцев резерва. Рекомендуется хранить 3-6 месяцев расходов (${formatCurrency(monthlyExpenses * 6)}).`,
      priority: 1,
      icon: '🏦',
    })
  }

  // Соотношение расходов к доходу
  if (expensesRatio > 0.7) {
    adviceList.push({
      id: 'high-expenses',
      title: 'Высокие расходы',
      message: `Расходы составляют ${Math.round(expensesRatio * 100)}% дохода! Попробуйте сократить необязательные траты для ускорения накоплений.`,
      priority: 2,
      icon: '📉',
    })
  } else if (expensesRatio < 0.4) {
    adviceList.push({
      id: 'low-expenses',
      title: 'Отличное соотношение',
      message: `Расходы составляют только ${Math.round(expensesRatio * 100)}% дохода — это отличный показатель!`,
      priority: 4,
      icon: '✅',
    })
  }

  // Соотношение наличных к капиталу
  if (cashRatio > 0.5 && netWorth > 100000) {
    adviceList.push({
      id: 'excess-cash',
      title: 'Время инвестировать',
      message: `${Math.round(cashRatio * 100)}% капитала в наличных. Рассмотрите диверсификацию в активы для роста.`,
      priority: 3,
      icon: '📈',
    })
  }

  // Диверсификация портфеля
  if (state.portfolio.length > 0 && portfolioValue > 50000) {
    const uniqueAssets = new Set(state.portfolio.map(p => p.assetId)).size
    if (uniqueAssets < 2) {
      adviceList.push({
        id: 'low-diversification',
        title: 'Низкая диверсификация',
        message: 'Все инвестиции в одном активе. Диверсификация снижает риски.',
        priority: 3,
        icon: '🎯',
      })
    }
  }

  // Карьерный рост
  if (state.player.skills.programming >= 80) {
    adviceList.push({
      id: 'career-upgrade',
      title: 'Готовы к карьерному росту',
      message: `Ваш навык программирования (${state.player.skills.programming}) позволяет повысить карьерный уровень и зарплату!`,
      priority: 4,
      icon: '🚀',
    })
  }

  // Баланс низкий
  if (state.balance < monthlyExpenses * 2 && state.balance < 50000) {
    adviceList.push({
      id: 'low-balance',
      title: 'Критически низкий баланс',
      message: `Баланс ${formatCurrency(state.balance)} — меньше 2 месяцев расходов. Избегайте крупных покупок.`,
      priority: 1,
      icon: '⚠️',
    })
  }

  // Активы на спаде
  const losingAssets = state.priceChanges
    ? Object.entries(state.priceChanges)
        .filter(([_, change]) => change < -5)
        .map(([id]) => state.availableAssets.find(a => a.id === id))
        .filter(Boolean)
    : []

  if (losingAssets.length > 0 && portfolioValue > 30000) {
    adviceList.push({
      id: 'falling-assets',
      title: 'Активы на спаде',
      message: `${losingAssets.length} актив(ов) показывают снижение цен. Возможно, стоит подождать или диверсифицировать.`,
      priority: 3,
      icon: '📊',
    })
  }

  // Нет активов
  if (state.portfolio.length === 0 && state.balance > 100000) {
    adviceList.push({
      id: 'no-investments',
      title: 'Начните инвестировать',
      message: 'У вас достаточно средств для начала инвестирования. Рассмотрите акции или депозит.',
      priority: 2,
      icon: '💰',
    })
  }

  // Положительный баланс
  if (adviceList.length === 0 || netWorth > 1000000) {
    adviceList.push({
      id: 'great-position',
      title: 'Отличная позиция!',
      message: `Ваш капитал: ${formatCurrency(netWorth)}. Продолжайте в том же духе!`,
      priority: 5,
      icon: '🏆',
    })
  }

  // Сортируем по приоритету и возвращаем первый (самый важный)
  adviceList.sort((a, b) => b.priority - a.priority)
  return adviceList[0] || null
}