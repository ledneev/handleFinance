// ====================== БАЗОВЫЕ ТИПЫ ======================

//уровень карьеры
export type CareerLevel = 'intern' | 'junior' | 'middle' | 'senior' | 'lead' | 'director'

//типы активов
export type AssetType = 'stock' | 'crypto' | 'real_estate' | 'education' | 'bank' | 'consumable'

//типы событий
export type EventType = 'positive' | 'negative' | 'neutral' | 'crisis' | 'opportunity'

// ====================== ИНТЕРФЕЙСЫ СУЩНОСТЕЙ ======================

/**
 * Игрок - основная сущность
 * Интерфейс описывает структуру объекта
 */

export interface Player {
  id: string
  name: string
  age: number;
  career: CareerLevel
  salary: number

  // навыки игрока
  skills: {
    programming: number
    finance: number
    luck: number
  }
}

/**
 * Актив - во что можно инвестировать
 */

export interface AssetEffects {
  skillBonus?: {
    programming?: number
    finance?: number
    luck?: number
  }
  careerBoost?: number
  immediateEffect?: boolean
}

export interface Asset {
  id: string
  name: string
  type: AssetType
  currentPrice: number
  volatility: number
  trend: number
  description: string
  category?: string
  dividendYield?: number
  rentalYield?: number
  interestRate?: number
  skillBonus?: number //(старое поле для обратной совместимости)
  effects?: AssetEffects
  isConsumable?: boolean
}

/**
 * Элемент портфеля - что куплено и по какой цене
 */

export interface PortfolioItem {
  assetId: string
  quantity: number
  purchasePrice: number
  purchaseDate: Date
}

/**
 * Случайное событие в игре
 */

export interface GameEvent {
  id: string
  title: string
  description: string
  type: EventType

  // Эффект события на игрока
  effect: {
    balanceChange?: number
    skillChange?: {
      programming?: number
      finance?: number
      luck?: number
    }
  }
  //todo добавить еще эффектов

  // Варианты выбора (опционально)
  choices?: Array<{
    text: string
    effect: GameEvent['effect']
  }>
}

/**
 * Запись в истории игры (для графиков)
 */

export interface GameHistoryEntry {
  year: number
  balance: number
  netWorth: number //общая стоимость активов
  salary: number
  majorEvents: string[]
}

// ====================== ОСНОВНОЕ СОСТОЯНИЕ ИГРЫ ======================

/**
 * Полное состояние игры
 */

export interface GameState {
  // === Основные параметры ===
  currentYear: number
  balance: number
  player: Player
  isGameActive: boolean
  priceChanges: Record<string, number>

  // === Инвестиции ===
  portfolio: PortfolioItem[]
  availableAssets: Asset[] // Все доступные активы на рынке

  // === История и события ===
  events: GameEvent[]
  history: GameHistoryEntry[]
  eventLog: string[]

  // === UI состояние ===
  selectedAssetId: string | null // Выбранный актив для деталей
}

// ====================== ВСПОМОГАТЕЛЬНЫЕ ТИПЫ ======================

/**
 * Тип для действий (actions) в хранилище
 * Это функции которые меняют состояние
 */

export type GameActions = {
  //управление временем
  advanceYear: () => void

  //управление деньгами
  addMoney: (amount: number) => void
  spendMoney: (amount: number) => void

  //Инвестици
  buyAsset: (assetId: string, quantity: number) => void
  sellAsset: (assetId: string, quantity: number) => void

  // Карьера
  upgradeCareer: () => void

  // События
  triggerRandomEvent: () => void
  resolveEvent: (eventId: string, choiceIndex?: number) => void
  
  // Сброс игры
  resetGame: () => void
}

/**
 * Полный тип хранилища = состояние + действия
 */

export type GameStore = GameState & GameActions

// ====================== ТИПЫ ДЛЯ ПРОПСОВ КОМПОНЕНТОВ ======================

/**
 * Пропсы для карточки актива
 * Готовим заранее для компонента
 */

export interface AssetCardProps {
  asset: Asset
  ownedQuantity?: number
  onBuy: (assetId: string) => void
  onSell: (assetId: string) => void
}

/**
 * Пропсы для модального окна события
 */

export interface EventModalProps {
  event: GameEvent
  isOpen: boolean
  onClose: () => void
  onChoiceSelect: (choiceIndex: number) => void
}