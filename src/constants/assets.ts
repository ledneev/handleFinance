import type { Asset } from '@/types/game.types'

/**
 * Все доступные активы в игре
 */

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'apple-stock',
    name: 'Акции Apple',
    type: 'stock',
    currentPrice: 150,
    volatility: 0.3,
    trend: 0.2,
    description: 'Стабильные акции технологического гиганта. Средний риск, стабильный рост.',
    category: 'tech',
    dividendYield: 0.015 // 1.5% дивиденды
  },
  {
    id: 'bitcoin',
    name: 'Биткоин',
    type: 'crypto',
    currentPrice: 50000,
    volatility: 0.8,
    trend: 0.1,
    description: 'Криптовалюта с высокой волатильностью. Высокий риск, высокая потенциальная доходность.',
    category: 'crypto'
  },
  {
    id: 'real-estate-moscow',
    name: 'Недвижимость в Москве',
    type: 'real_estate',
    currentPrice: 5000000,
    volatility: 0.2,
    trend: 0.3,
    description: 'Квартира в центре Москвы. Низкий риск, стабильный рост + арендный доход.',
    category: 'real_estate',
    rentalYield: 0.05 // 5% годовых от аренды
  },
  {
    id: 'online-courses',
    name: 'Онлайн-курсы',
    type: 'consumable', // Меняем на consumable
    currentPrice: 100000,
    volatility: 0.1,
    trend: 0.9,
    description: 'Инвестиция в себя. Повышает навыки программирования, ускоряет карьерный рост.',
    category: 'education',
    effects: {
      skillBonus: { programming: 15 },
      careerBoost: 0.3,
      immediateEffect: true
    },
    isConsumable: true
  },
  {
    id: 'bank-deposit',
    name: 'Банковский вклад',
    type: 'bank',
    currentPrice: 1,
    volatility: 0.05,
    trend: 0.1,
    description: 'Надежный, но низкий процент. Подходит для консервативных инвесторов.',
    category: 'bank',
    interestRate: 0.08 // 8% годовых
  },
  {
    id: 'tesla-stock',
    name: 'Акции Tesla',
    type: 'stock',
    currentPrice: 200,
    volatility: 0.5,
    trend: 0.4,
    description: 'Акции инновационной компании. Высокая волатильность, высокий потенциал роста.',
    category: 'tech'
  },
  {
    id: 'ethereum',
    name: 'Эфириум',
    type: 'crypto',
    currentPrice: 3000,
    volatility: 0.7,
    trend: 0.25,
    description: 'Вторая по капитализации криптовалюта. Платформа для смарт-контрактов.',
    category: 'crypto'
  },
  {
    id: 'finance-courses',
    name: 'Курсы по финансам',
    type: 'consumable',
    currentPrice: 75000,
    volatility: 0.05,
    trend: 0.8,
    description: 'Изучение основ инвестирования и управления финансами.',
    category: 'education',
    effects: {
      skillBonus: { finance: 20 },
      immediateEffect: true
    },
    isConsumable: true
  }
]

/**
 * Сгруппированные активы по категориям для UI
 */

export const ASSETS_BY_CATEGORY = {
  stock: INITIAL_ASSETS.filter(a => a.type === 'stock'),
  crypto: INITIAL_ASSETS.filter(a => a.type === 'crypto'),
  real_estate: INITIAL_ASSETS.filter(a => a.type === 'real_estate'),
  education: INITIAL_ASSETS.filter(a => a.type === 'education'),
  bank: INITIAL_ASSETS.filter(a => a.type === 'bank')
}

/**
 * Найти актив по ID
 */

export const getAssetById = (id: string): Asset | undefined => {
  return INITIAL_ASSETS.find(asset => asset.id === id)
}

/**
 * Рассчитать прогнозируемую доходность актива
 */

export const calculateExpectedReturn = (asset: Asset, years: number = 1): number => {
  // Формула: цена * (1 + тренд)^годы ± волатильность
  const baseGrowth = Math.pow(1 + (asset.trend * 0.1), years)
  const volatilityEffect = (Math.random() - 0.5) * asset.volatility
  return asset.currentPrice * (baseGrowth + volatilityEffect)
}