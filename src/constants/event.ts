import type { GameEvent } from '@/types/game.types'

/**
 * Шаблоны случайных событий
 * Можно расширять без изменения логики игры
 */

export const EVENT_TEMPLATES: Omit<GameEvent, 'id'>[] = [
  // Положительные события
  {
    title: 'Неожиданный бонус',
    description: 'Вы хорошо выполнили проект на работе, получили премию!',
    type: 'positive',
    effect: { balanceChange: 50000 }
  },
  {
    title: 'Наследство',
    description: 'Дальний родственник оставил вам небольшое наследство.',
    type: 'positive',
    effect: { balanceChange: 200000 }
  },
  {
    title: 'Выигрыш в лотерею',
    description: 'Купили лотерейный билет на сдачу и выиграли!',
    type: 'positive',
    effect: { balanceChange: 100000 }
  },
  
  // Негативные события
  {
    title: 'Поломка ноутбука',
    description: 'Ваш рабочий ноутбук сломался, нужен срочный ремонт.',
    type: 'negative',
    effect: { balanceChange: -30000 }
  },
  {
    title: 'Лечение зубов',
    description: 'Пришлось срочно лечить зубы, страховка не покрыла все расходы.',
    type: 'negative',
    effect: { balanceChange: -50000 }
  },
  {
    title: 'Штраф за превышение скорости',
    description: 'Попались камере на дороге, придется заплатить штраф.',
    type: 'negative',
    effect: { balanceChange: -5000 }
  },
  
  // События с выбором
  {
    title: 'Предложение о работе',
    description: 'Вас пригласили в другую компанию на более высокую должность, но нужно пройти сложное обучение.',
    type: 'opportunity',
    effect: {}, // Эффект зависит от выбора
    choices: [
      {
        text: 'Принять предложение (стоимость 150к)',
        effect: {
          balanceChange: -150000,
          skillChange: { programming: 20, finance: 5 }
        }
      },
      {
        text: 'Отказаться, остаться на текущем месте',
        effect: {}
      }
    ]
  },
  {
    title: 'Криптовалюта падает',
    description: 'Крипторынок резко просел. Что будете делать?',
    type: 'crisis',
    effect: {},
    choices: [
      {
        text: 'Продать всё чтобы избежать убытков',
        effect: { 
          skillChange: { finance: -5 }
        }
      },
      {
        text: 'Докупить на просадке (инвестировать 100к)',
        effect: {
          balanceChange: -100000,
          skillChange: { finance: 10 }
        }
      },
      {
        text: 'Ничего не делать, ждать восстановления',
        effect: {
          skillChange: { finance: 3 }
        }
      }
    ]
  },
  
  // Нейтральные/обучающие события
  {
    title: 'Бесплатный вебинар',
    description: 'Попали на бесплатный вебинар по инвестициям. Узнали что-то новое.',
    type: 'neutral',
    effect: { skillChange: { finance: 3 } }
  },
  {
    title: 'Опенсорс проект',
    description: 'Поработали над опенсорс проектом в свободное время.',
    type: 'neutral',
    effect: { skillChange: { programming: 5 } }
  }
]

/**
 * Шансы возникновения разных типов событий
 */

export const EVENT_PROBABILITIES = {
  positive: 0.25,
  negative: 0.25,
  opportunity: 0.2,
  crisis: 0.15,
  neutral: 0.15
}

/**
 * Получить случайное событие с учетом вероятностей
 */

export const getRandomEventTemplate = (): Omit<GameEvent, 'id'> => {
  const random = Math.random()
  let cumulative = 0
  
  for (const [type, probability] of Object.entries(EVENT_PROBABILITIES)) {
    cumulative += probability
    if (random <= cumulative) {
      const eventsOfType = EVENT_TEMPLATES.filter(e => e.type === type)
      return eventsOfType[Math.floor(Math.random() * eventsOfType.length)]
    }
  }
  
  // Fallback
  return EVENT_TEMPLATES[0]
}