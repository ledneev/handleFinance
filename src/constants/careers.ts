import type { CareerLevel } from '@/types/game.types'

/**
 * Данные о карьерных уровнях
 * Массив для последовательного повышения
 */

export const CAREER_LEVELS: CareerLevel[] = [
  'intern',     // Стажёр
  'junior',     // Джуниор
  'middle',     // Миддл
  'senior',     // Сеньор
  'lead',       // Тимлид
  'director'    // Директор
]

/**
 * Конфигурация каждого уровня карьеры
 */

export interface CareerConfig {
  level: CareerLevel
  baseSalary: number      // Базовая зарплата в месяц
  upgradeCost: number     // Стоимость повышения (образование/курсы)
  skillRequirement: number // Требуемый уровень навыка программирования
  description: string
}

/**
 * Подробная конфигурация всех уровней
 */

export const CAREER_CONFIGS: Record<CareerLevel, CareerConfig> = {
  intern: {
    level: 'intern',
    baseSalary: 40000,
    upgradeCost: 0, // Стартовый уровень
    skillRequirement: 0,
    description: 'Стажёр. Только начинаете карьеру, учитесь основам.'
  },
  junior: {
    level: 'junior',
    baseSalary: 80000,
    upgradeCost: 50000,
    skillRequirement: 30,
    description: 'Джуниор разработчик. Выполняете простые задачи под руководством.'
  },
  middle: {
    level: 'middle',
    baseSalary: 150000,
    upgradeCost: 100000,
    skillRequirement: 50,
    description: 'Миддл разработчик. Самостоятельно решаете большинство задач.'
  },
  senior: {
    level: 'senior',
    baseSalary: 250000,
    upgradeCost: 200000,
    skillRequirement: 70,
    description: 'Сеньор разработчик. Руководите проектами, обучаете других.'
  },
  lead: {
    level: 'lead',
    baseSalary: 400000,
    upgradeCost: 500000,
    skillRequirement: 85,
    description: 'Тимлид. Управляете командой, принимаете архитектурные решения.'
  },
  director: {
    level: 'director',
    baseSalary: 700000,
    upgradeCost: 1000000,
    skillRequirement: 95,
    description: 'Директор по разработке. Стратегическое планирование, управление отделами.'
  }
}

/**
 * Рассчитать бонус к зарплате в зависимости от навыков
 */

export const calculateSalaryBonus = (baseSalary: number, skills: number): number => {
  const bonusMultiplier = 1 + (Math.floor(skills / 10) * 0.05)
  return Math.round(baseSalary * bonusMultiplier)
}