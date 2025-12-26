import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Утилита для объединения Tailwind классов
 * Позволяет использовать conditional классы
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}