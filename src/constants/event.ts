import type { GameEvent } from '@/types/game.types'

export const EVENT_TEMPLATES: Omit<GameEvent, 'id' | 'year' | 'isResolved'>[] = [
  // Жизненные события
  {
    title: 'Свадьба',
    description: 'Вы решили пожениться! Это важное событие потребует расходов.',
    type: 'life',
    effect: {},
    choices: [
      {
        id: 'wedding1',
        text: 'Скромная свадьба',
        description: 'Только близкие родственники и друзья',
        cost: 200000,
        effect: { skillChange: { luck: 5 } }
      },
      {
        id: 'wedding2',
        text: 'Роскошная свадьба',
        description: 'Большой банкет на 100 человек',
        cost: 1000000,
        effect: { skillChange: { luck: 10, finance: -5 } }
      },
      {
        id: 'wedding3',
        text: 'Не жениться',
        description: 'Решить сосредоточиться на карьере',
        effect: { skillChange: { finance: 5 } }
      }
    ]
  },
  
  // Карьерные события
  {
    title: 'Предложение о работе',
    description: 'К вам поступило предложение о работе в другой компании.',
    type: 'career',
    effect: {},
    choices: [
      {
        id: 'job1',
        text: 'Принять предложение',
        description: 'Новая работа с более высокой зарплатой',
        effect: { balanceChange: 50000, skillChange: { programming: 10 } }
      },
      {
        id: 'job2',
        text: 'Остаться на текущем месте',
        description: 'Вы цените стабильность',
        effect: { skillChange: { finance: 5 } }
      },
      {
        id: 'job3',
        text: 'Поторговаться за повышение',
        description: 'Попросить повышение на текущем месте',
        requires: { minSkills: { programming: 60 } },
        effect: { balanceChange: 30000 }
      }
    ]
  },
  
  // Финансовые возможности
  {
    title: 'Инвестиционная возможность',
    description: 'Друг предлагает вложиться в стартап. Шанс высокого дохода, но и высокие риски.',
    type: 'opportunity',
    effect: {},
    choices: [
      {
        id: 'invest1',
        text: 'Вложить 200,000₽',
        description: 'Средний риск, средняя доходность',
        cost: 200000,
        requires: { minBalance: 300000 },
        effect: { 
          delayedEffect: {
            yearsDelay: 2,
            effect: { balanceChange: 500000 }
          }
        }
      },
      {
        id: 'invest2',
        text: 'Вложить 50,000₽',
        description: 'Минимальный риск, небольшая доходность',
        cost: 50000,
        effect: {
          delayedEffect: {
            yearsDelay: 3,
            effect: { balanceChange: 100000 }
          }
        }
      },
      {
        id: 'invest3',
        text: 'Отказаться',
        description: 'Не готов к риску',
        effect: { skillChange: { finance: -3 } }
      }
    ]
  },
  
  // Кризисы
  {
    title: 'Медицинские проблемы',
    description: 'Вам требуется серьёзное лечение. Стоимость зависит от выбора.',
    type: 'crisis',
    effect: {},
    choices: [
      {
        id: 'medical1',
        text: 'Дорогое лечение',
        description: 'Лучшие врачи и условия',
        cost: 500000,
        effect: { skillChange: { luck: 10 } }
      },
      {
        id: 'medical2',
        text: 'Бюджетное лечение',
        description: 'Государственная клиника',
        cost: 50000,
        effect: { skillChange: { luck: -5 } }
      },
      {
        id: 'medical3',
        text: 'Игнорировать проблему',
        description: 'Надеяться что само пройдёт',
        effect: { skillChange: { luck: -15 } }
      }
    ]
  },
  
  // Положительные события
  {
    title: 'Неожиданный бонус',
    description: 'Вы выиграли в корпоративной лотерее!',
    type: 'positive',
    effect: { balanceChange: 100000 },
    choices: [
      {
        id: 'bonus1',
        text: 'Потратить на отдых',
        description: 'Поездка на море',
        cost: 80000,
        effect: { skillChange: { luck: 5 } }
      },
      {
        id: 'bonus2',
        text: 'Инвестировать',
        description: 'Вложить в образование',
        cost: 100000,
        effect: { skillChange: { programming: 15, finance: 5 } }
      },
      {
        id: 'bonus3',
        text: 'Отложить',
        description: 'Добавить к сбережениям',
        effect: { skillChange: { finance: 10 } }
      }
    ]
  }
]

export const getRandomEvent = (
  year: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  playerSkills: unknown
): Omit<GameEvent, 'id' | 'isResolved'> => {
  const templates = [...EVENT_TEMPLATES]

  const availableTemplates = templates.filter(template => {
    if (!template.choices?.length) return true

    return template.choices.some(choice => {
      if (!choice.requires) return true
      return true
    })
  })
  
  const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)] 
    || templates[0]
  
  return {
    ...template,
    year
  }
}