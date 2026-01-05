import {
  INITIAL_PLAYER,
  INITIAL_BALANCE,
  STARTING_YEAR,
  INITIAL_ASSETS,
} from '@/constants'
import { EXPENSES, ONE_TIME_PURCHASES } from '@/constants/expenses'
import { GameStateSlice } from '@/types/store.types'
import { calculateMonthlyExpenses } from '@/utils/expenses'


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createGameStateSlice: GameStateSlice = (set, get) => ({
  // === Состояние ===
  currentYear: STARTING_YEAR,
  balance: INITIAL_BALANCE,
  player: INITIAL_PLAYER,
  isGameActive: true,
  priceChanges: {} as Record<string, number>,
  portfolio: [],
  availableAssets: INITIAL_ASSETS,
  educationPurchases: [],
  ongoingEffects: [],
  events: [],
  history: [
    {
      year: STARTING_YEAR,
      balance: INITIAL_BALANCE,
      netWorth: INITIAL_BALANCE,
      salary: INITIAL_PLAYER.salary,
      majorEvents: ['Старт игры'],
    },
  ],
  eventLog: ['Добро пожаловать в симулятор финансов!'],
  selectedAssetId: null,
  delayedEffects: [],
  expenses: EXPENSES,
  oneTimePurchases: ONE_TIME_PURCHASES,
  monthlyExpenses: calculateMonthlyExpenses(EXPENSES),
  gameSettings: null,
  gameOver: false,
  gameWon: null,
})
