import type { Expense, OneTimePurchase } from '@/types/game.types'

export const EXPENSES: Expense[] = [
  {
    id: 'housing',
    name: 'Жильё',
    category: 'housing',
    baseAmount: 30000,
    currentAmount: 30000,
    level: 1,
    maxLevel: 5,
    description: 'Аренда жилья',
    icon: '🏠',
    benefits: [
      'Уровень 1: Комната в коммуналке',
      'Уровень 2: Однокомнатная квартира',
      'Уровень 3: Двухкомнатная квартира',
      'Уровень 4: Собственная квартира',
      'Уровень 5: Частный дом'
    ]
  },
  {
    id: 'food',
    name: 'Питание',
    category: 'food',
    baseAmount: 15000,
    currentAmount: 15000,
    level: 1,
    maxLevel: 5,
    description: 'Еда и напитки',
    icon: '🍕',
    benefits: [
      'Уровень 1: Экономное питание',
      'Уровень 2: Сбалансированное питание',
      'Уровень 3: Рестораны 1-2 раза в неделю',
      'Уровень 4: Премиум продукты',
      'Уровень 5: Личный повар'
    ]
  },
  {
    id: 'transport',
    name: 'Транспорт',
    category: 'transport',
    baseAmount: 5000,
    currentAmount: 5000,
    level: 1,
    maxLevel: 5,
    description: 'Проезд и транспортные расходы',
    icon: '🚗',
    benefits: [
      'Уровень 1: Общественный транспорт',
      'Уровень 2: Такси по необходимости',
      'Уровень 3: Аренда автомобиля',
      'Уровень 4: Кредит на автомобиль',
      'Уровень 5: Премиальный автомобиль'
    ]
  },
  {
    id: 'utilities',
    name: 'Коммуналка',
    category: 'utilities',
    baseAmount: 8000,
    currentAmount: 8000,
    level: 1,
    maxLevel: 3,
    description: 'Электричество, вода, интернет',
    icon: '💡',
    benefits: [
      'Уровень 1: Базовый пакет',
      'Уровень 2: Комфортный пакет',
      'Уровень 3: Премиум пакет'
    ]
  },
  {
    id: 'entertainment',
    name: 'Развлечения',
    category: 'entertainment',
    baseAmount: 5000,
    currentAmount: 5000,
    level: 1,
    maxLevel: 5,
    description: 'Кино, кафе, хобби',
    icon: '🎬',
    benefits: [
      'Уровень 1: Бесплатные развлечения',
      'Уровень 2: Бюджетные развлечения',
      'Уровень 3: Регулярные походы в кино/кафе',
      'Уровень 4: Концерты и мероприятия',
      'Уровень 5: Премиальные развлечения'
    ]
  },
  {
    id: 'health',
    name: 'Здоровье',
    category: 'health',
    baseAmount: 3000,
    currentAmount: 3000,
    level: 1,
    maxLevel: 4,
    description: 'Медицина и спорт',
    icon: '💊',
    benefits: [
      'Уровень 1: Базовая страховка',
      'Уровень 2: Полная страховка',
      'Уровень 3: Частная клиника',
      'Уровень 4: Персональный врач'
    ]
  }
]

export const ONE_TIME_PURCHASES: OneTimePurchase[] = [
  {
    id: 'smartphone',
    name: 'Смартфон',
    category: 'electronics',
    price: 50000,
    description: 'Новый флагманский смартфон',
    purchased: false
  },
  {
    id: 'laptop',
    name: 'Ноутбук',
    category: 'electronics',
    price: 80000,
    description: 'Мощный ноутбук для работы',
    purchased: false,
    effects: {
      skillBonus: { programming: 5 }
    }
  },
  {
    id: 'wardrobe',
    name: 'Гардероб',
    category: 'clothing',
    price: 30000,
    description: 'Обновление гардероба',
    purchased: false
  },
  {
    id: 'furniture',
    name: 'Мебель',
    category: 'furniture',
    price: 150000,
    description: 'Новая мебель для квартиры',
    purchased: false
  },
  {
    id: 'economy-car',
    name: 'Автомобиль (эконом)',
    category: 'car',
    price: 800000,
    description: 'Новый экономичный автомобиль',
    purchased: false,
    effects: {
      expenseChange: { transport: -2000 }
    }
  },
  {
    id: 'premium-car',
    name: 'Автомобиль (премиум)',
    category: 'car',
    price: 3000000,
    description: 'Премиальный автомобиль',
    purchased: false,
    effects: {
      expenseChange: { transport: -5000 }
    }
  },
  {
    id: 'tv',
    name: 'Телевизор',
    category: 'electronics',
    price: 60000,
    description: 'Большой 4K телевизор',
    purchased: false
  },
  {
    id: 'vacation',
    name: 'Отпуск',
    category: 'other',
    price: 150000,
    description: 'Отдых на море',
    purchased: false,
    effects: {
      skillBonus: { luck: 10 }
    }
  }
]