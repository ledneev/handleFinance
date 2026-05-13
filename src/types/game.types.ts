// ====================== БАЗОВЫЕ ТИПЫ ======================

//уровень карьеры
export type CareerLevel = 'intern' | 'junior' | 'middle' | 'senior' | 'lead' | 'director';

//типы активов
export type AssetType = 'stock' | 'crypto' | 'real_estate' | 'education' | 'bank' | 'consumable';

//типы событий
export type EventType = 'positive' | 'negative' | 'opportunity' | 'crisis' | 'life' | 'career';

// Типы расходов
export type ExpenseCategory =
  | 'housing'
  | 'food'
  | 'transport'
  | 'utilities'
  | 'entertainment'
  | 'health'
  | 'other';

// ====================== ИНТЕРФЕЙСЫ СУЩНОСТЕЙ ======================

export interface Player {
  id: string;
  name: string;
  age: number;
  career: CareerLevel;
  salary: number;

  skills: {
    programming: number;
    finance: number;
    luck: number;
  };
}

export interface CollegeEffect {
  type: 'college_education';
  durationYears: number;
  yearlySkillBonus: number;
}

export interface AssetEffects {
  skillBonus?: {
    programming?: number;
    finance?: number;
    luck?: number;
  };
  careerBoost?: number;
  immediateEffect?: boolean;
  oneTimeEffect?: CollegeEffect;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  currentPrice: number;
  volatility: number;
  trend: number;
  description: string;
  category?: string;
  dividendYield?: number;
  rentalYield?: number;
  interestRate?: number;
  skillBonus?: number; //(старое поле для обратной совместимости)
  effects?: AssetEffects;
  isConsumable?: boolean;
}

export interface PortfolioItem {
  assetId: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
}

export interface EventChoice {
  id: string;
  text: string;
  description?: string;
  cost?: number;
  effect: GameEvent['effect'];
  requires?: {
    minBalance?: number;
    minSkills?: Partial<Player['skills']>;
    hasAsset?: string;
  };
}

export interface Effect {
  balanceChange?: number;
  skillChange?: Partial<{
    programming: number;
    finance: number;
    luck: number;
  }>;
  assetEffect?: {
    assetId: string;
    priceChange: number;
  };
  expensesChange?: {
    [key: string]: number;
  };
  careerChange?: CareerLevel;

  delayedEffect?: {
    yearsDelay: number;
    effect: Effect;
  };
}

export interface DelayedEffect {
  id: string;
  effect: Effect;
  triggerYear: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  year: number;
  isResolved: boolean;

  effect: Effect;
  choices: EventChoice[];
}

export interface GameHistoryEntry {
  year: number;
  balance: number;
  netWorth: number;
  salary: number;
  majorEvents: string[];
}

export interface OngoingEffect {
  id: string;
  type: string;
  assetId: string;
  remainingYears: number;
  yearlySkillBonus: number;
  appliedThisYear: boolean;
}

export interface Expense {
  id: string;
  name: string;
  category: ExpenseCategory;
  baseAmount: number;
  currentAmount: number;
  level: number;
  maxLevel: number;
  description: string;
  icon?: string;
  benefits?: string[];
}

export interface OneTimePurchase {
  id: string;
  name: string;
  category: 'electronics' | 'clothing' | 'furniture' | 'car' | 'other';
  price: number;
  description: string;
  purchased: boolean;
  purchaseDate?: number;
  effects?: {
    skillBonus?: Partial<Player['skills']>;
    expenseChange?: { [key: string]: number };
    happiness?: number;
  };
}

export type GameGoal =
  | { type: 'wealth'; targetAmount: number }
  | { type: 'lifestyle'; description: string }
  | { type: 'career'; targetLevel: CareerLevel }
  | { type: 'skill'; skill: keyof Player['skills']; target: number }

export interface GameSettings {
  playerName: string
  initialBalance: number
  initialSkills: {
    programming: number
    finance: number
    luck: number
  }
  goal: GameGoal
  timeLimitYears: number
  startedAtYear: number
}

// ====================== ОСНОВНОЕ СОСТОЯНИЕ ИГРЫ ======================

export interface GameState {
  currentYear: number;
  balance: number;
  player: Player;
  isGameActive: boolean;
  priceChanges: Record<string, number>;

  portfolio: PortfolioItem[];
  availableAssets: Asset[];

  events: GameEvent[];
  history: GameHistoryEntry[];
  eventLog: string[];

  selectedAssetId: string | null; // Выбранный актив для деталей на будущее
  delayedEffects: DelayedEffect[];
  educationPurchases: EducationPurchase[];
  ongoingEffects: OngoingEffect[];

  expenses: Expense[];
  oneTimePurchases: OneTimePurchase[];
  monthlyExpenses: number;

  gameSettings: GameSettings | null
  gameOver: boolean
  gameWon: boolean | null
}

export interface EducationPurchase {
  year: number;
  assetId: string;
}

// ====================== ВСПОМОГАТЕЛЬНЫЕ ТИПЫ ======================

export type GameActions = {
  advanceYear: () => void;

  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => void;

  buyAsset: (assetId: string, quantity: number) => void;
  sellAsset: (assetId: string, quantity: number) => void;

  upgradeCareer: () => void;

  triggerRandomEvent: () => void;
  resolveEvent: (eventId: string, choiceIndex?: number) => void;

  resetGame: () => void;
  updateExpenseLevel: (expenseId: string, newLevel: number) => void;
  purchaseItem: (itemId: string) => void;
  setGameSettings: (settings: GameSettings) => void;
  checkGoal: () => void;
  getAdvice: () => import('@/utils/financialAdvisor').Advice | null;
};

export type GameStore = GameState & GameActions;

// ====================== ТИПЫ ДЛЯ ПРОПСОВ КОМПОНЕНТОВ ======================

export interface AssetCardProps {
  asset: Asset;
  ownedQuantity?: number;
  onBuy: (assetId: string) => void;
  onSell: (assetId: string) => void;
}

export interface EventModalProps {
  event: GameEvent;
  isOpen: boolean;
  onClose: () => void;
  onChoiceSelect: (choiceIndex: number) => void;
}
