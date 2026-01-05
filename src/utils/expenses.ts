import { Expense } from "@/types/game.types";

export const calculateMonthlyExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.currentAmount, 0);
};