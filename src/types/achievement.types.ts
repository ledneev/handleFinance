import { GameState } from "./game.types"

export type AchievementId =
  | 'first_year'
  | 'millionaire'
  | 'full_portfolio'
  | 'zero_expenses'
  | 'educator'
  | 'lucky_strike'
  | 'career_master'

export interface Achievement {
  id: AchievementId
  title: string
  description: string
  icon: string
  hidden?: boolean
  condition: (state: GameState) => boolean
  bonus: AchievementBonus
  unlocked: boolean
  unlockDate?: string
}

export type AchievementBonus =
  | { type: 'money'; amount: number }
  | { type: 'skill'; skill: 'programming' | 'finance' | 'luck'; value: number }
  | { type: 'event'; chance: number }
  | { type: 'none' }