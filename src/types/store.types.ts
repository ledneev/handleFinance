/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameActions, GameState, GameStore } from '@/types/game.types'

export type GameStateSlice = (set: any, get: () => GameStore) => GameState
export type PlayerSlice = (set: any, get: () => GameStore) => Pick<GameActions, 'upgradeCareer'>
export type FinancesSlice = (set: any, get: () => GameStore) => Pick<GameActions, 'updateExpenseLevel' | 'purchaseItem'>
export type AssetsSlice = (set: any, get: () => GameStore) => Pick<GameActions, 'buyAsset' | 'sellAsset'>
export type EventsSlice = (set: any, get: () => GameStore) => Pick<GameActions, 'triggerRandomEvent' | 'resolveEvent'>
export type GoalsSlice = (set: any, get: () => GameStore) => Pick<GameActions, 'setGameSettings' | 'checkGoal'>
export type UtilsSlice = (set: any, get: () => GameStore) => Pick<GameActions, 'addMoney' | 'spendMoney' | 'resetGame'>
