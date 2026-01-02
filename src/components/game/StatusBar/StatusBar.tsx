import React, { useState } from 'react';
import { useGameMetrics } from './useGameMetrics';
import { StatusBarItem } from './StatusBarItem';
import { ProgressBar } from './ProgressBar';
import { Button } from '@/components/ui/Button';
import { Calendar, Wallet, TrendingUp, Briefcase, ChevronRight} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { notify } from '@/store/uiStore';
import { MobileMenuButton } from './MobileMenuButton';

export const StatusBar: React.FC = () => {
  const {
    currentYear,
    balance,
    netWorth,
    salary,
    skillProgress,
    advanceYear
  } = useGameMetrics();

  const [isBusy, setIsBusy] = useState(false);

  const format = (value: number) => formatCurrency(value, { maximumFractionDigits: 0 });

  const handleAdvance = async () => {
    if (isBusy) return;

    setIsBusy(true);
    notify.info('Год', 'Симулируем следующий год...', 2000);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      advanceYear();
      notify.success('Год завершён', `Теперь ${currentYear + 1} год`, 3000);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notify.error('Ошибка', 'Не удалось перейти к следующему году');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className={`
      fixed top-0 left-0 right-0 z-50
      bg-white dark:bg-gray-900
      border-b border-gray-200 dark:border-gray-700
      px-4 py-3
      shadow-sm
      flex items-center justify-between flex-wrap gap-2
      transition-colors duration-200
    `}>

      {/* Логотип */}
      <div className="flex items-center gap-4 min-w-0 flex-shrink-0">
        <span className="font-bold text-lg text-blue-600 dark:text-blue-400">FinSim</span>
      </div>
      
      <div className="hidden md:flex items-center gap-2 flex-wrap flex-1 min-w-0">
        <StatusBarItem
          icon={<Calendar className="w-4 h-4" />}
          label="Год"
          value={currentYear}
          tooltip="Текущий год"
        />
        <StatusBarItem
          icon={<Wallet className="w-4 h-4" />}
          label="Баланс"
          value={format(balance)}
          tooltip="Наличные средства"
        />
        <StatusBarItem
          icon={<TrendingUp className="w-4 h-4" />}
          label="Капитал"
          value={format(netWorth)}
          tooltip="Общая стоимость активов"
        />
        <StatusBarItem
          icon={<Briefcase className="w-4 h-4" />}
          label="Зарплата"
          value={format(salary)}
          tooltip="Ежемесячная зарплата"
        />
        <div className="hidden lg:block">
          <ProgressBar
            value={skillProgress.progress}
            label={skillProgress.label}
            color="purple"
          />
        </div>
      </div>

      {/* Адаптив: иконка меню на мобильных */}
      <div className="flex lg:hidden">
        <MobileMenuButton />
      </div>

      {/* Правая часть: кнопка */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <Button
          onClick={handleAdvance}
          disabled={isBusy}
          className={`
            bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
            text-white font-medium px-4 py-2 rounded-md
            flex items-center gap-2 shadow
            transition-all duration-200
            disabled:opacity-70 disabled:cursor-not-allowed
            ${isBusy ? 'animate-pulse' : ''}
          `}
        >
          {isBusy ? (
            <>
              Симулируем... <ChevronRight className="w-4 h-4 animate-spin" />
            </>
          ) : (
            <>
              Следующий год <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
