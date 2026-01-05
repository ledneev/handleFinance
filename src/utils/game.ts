import { GameGoal } from "@/types/game.types"
import { formatCurrency } from "./formatters"

export const getGoalDescription = (goal: GameGoal): string => {
  switch (goal.type) {
    case 'wealth':
      return `Заработать ${formatCurrency(goal.targetAmount)}`
    case 'lifestyle':
      return 'Достичь максимального качества жизни'
    case 'career':
      return `Достичь уровня карьеры: ${goal.targetLevel}`
    case 'skill':
      return `Развить навык "${goal.skill}" до ${goal.target}%`
    default:
      return 'Выполнить цель'
  }
}