// Карьера
export * from './careers'

// Активы
export * from './assets'

// События
export * from './event'

// Начальный игрок
import type { Player } from '@/types/game.types'

export const INITIAL_PLAYER: Player = {
  id: 'player-1',
  name: 'Инвестор',
  age: 25,
  career: 'junior',
  salary: 80000,
  skills: {
    programming: 50,
    finance: 30,
    luck: 50,
  }
}

// Начальный баланс и другие константы
export const INITIAL_BALANCE = 500000
export const STARTING_YEAR = 2024
export const MONTHS_PER_YEAR = 12
export const TAX_RATE = 0.13 // 13% НДФЛ