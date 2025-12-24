/**
 * Форматирование денежных значений
 */
export const formatCurrency = (
  value: number,
  options: Intl.NumberFormatOptions = {}
): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options
  }).format(value)
}

/**
 * Форматирование процентов
 */
export const formatPercent = (
  value: number,
  options: Intl.NumberFormatOptions = {}
): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
    ...options
  }).format(value / 100)
}

/**
 * Форматирование даты
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Сокращение больших чисел
 */
export const abbreviateNumber = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)} млрд`
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)} млн`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} тыс`
  }
  return value.toString()
}