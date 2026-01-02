import React, { JSX, useState } from 'react';
import { cn } from '@/utils/cn';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Info } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui';
import { Button } from '@/components/ui';
import type { Asset } from '@/types/game.types';
import { formatCurrency, formatPercent } from '@/utils';

// Тип для пропсов
export interface AssetCardProps {
  asset: Asset;
  ownedQuantity?: number;
  currentPrice?: number;
  priceChange?: number;
  priceChange7d?: number[];
  onBuy?: (quantity: number) => void;
  onSell?: (quantity: number) => void;
  onDetails?: (assetId: string) => void;
  className?: string;
}

const assetIcons: Record<
  string,
  React.ComponentType<{ className?: string }> | (() => JSX.Element)
> = {
  stock: BarChart3,
  crypto: DollarSign,
  real_estate: () => <span className="text-lg">🏠</span>,
  education: () => <span className="text-lg">📚</span>,
  bank: () => <span className="text-lg">🏦</span>,
  consumable: () => <span className="text-lg">🎓</span>, // Добавляем для consumable
} as const;

// Цвета для разных типов активов
const assetColors: Record<string, string> = {
  stock: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  crypto: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  real_estate: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  education: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  bank: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
  consumable: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
} as const;

// Мини-график (упрощенный, без Recharts пока)
const MiniSparkline: React.FC<{ data: number[]; positive: boolean }> = ({ data, positive }) => {
  if (!data.length) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  return (
    <div className="flex items-end h-12 w-20 gap-0.5">
      {data.map((value, index) => {
        const height = range > 0 ? ((value - min) / range) * 100 : 50;
        return (
          <div
            key={index}
            className={cn(
              'flex-1 rounded-t',
              positive ? 'bg-green-500/70 dark:bg-green-600/70' : 'bg-red-500/70 dark:bg-red-600/70'
            )}
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
};

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  ownedQuantity = 0,
  currentPrice = asset.currentPrice,
  priceChange = asset.trend * 10,
  priceChange7d,
  onBuy,
  onSell,
  onDetails,
  className,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);
  const [isSelling, setIsSelling] = useState(false);

  // Генерируем тестовые данные для графика если нет
  const sparklineData =
    priceChange7d ||
    Array.from({ length: 7 }, (_, i) => {
      const base = currentPrice * 0.9;
      const variation = Math.sin(i * 0.5) * currentPrice * 0.1;
      return base + variation;
    });

  const isPositive = priceChange >= 0;
  const totalValue = ownedQuantity * currentPrice;
  const IconComponent = assetIcons[asset.type];

  const handleBuy = () => {
    if (onBuy && quantity > 0) {
      setIsBuying(true);
      onBuy(quantity);
      setTimeout(() => setIsBuying(false), 500);
      setQuantity(1);
    }
  };

  const handleSell = () => {
    if (onSell && quantity > 0 && quantity <= ownedQuantity) {
      setIsSelling(true);
      onSell(quantity);
      setTimeout(() => setIsSelling(false), 500);
      setQuantity(1);
    }
  };

  return (
    <Card variant="default" hoverable className={cn('relative overflow-hidden', className)}>
      <div
        className={cn(
          'absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium',
          assetColors[asset.type]
        )}
      >
        {asset.type.toUpperCase()}
      </div>

      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', assetColors[asset.type].split(' ')[0])}>
              <IconComponent />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{asset.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatCurrency(currentPrice)} / шт.
              </p>
            </div>
          </div>

          <div className="text-right">
            <div
              className={cn(
                'flex items-center gap-1 text-sm font-medium',
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {isPositive ? '+' : ''}
              {priceChange.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">24ч изменение</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <MiniSparkline data={sparklineData} positive={isPositive} />

          <div className="text-sm">
            <div className="text-gray-600 dark:text-gray-400">Волатильность</div>
            <div className="font-medium">
              {formatPercent(asset.volatility * 100, { minimumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {asset.description}
        </p>

        {ownedQuantity > 0 && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">В вашем портфеле</div>
                <div className="font-medium">{ownedQuantity} шт.</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">Общая стоимость</div>
                <div className="font-medium">{formatCurrency(totalValue)}</div>
              </div>
            </div>
          </div>
        )}

        {(asset.type === 'consumable' || asset.isConsumable) && (
          <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
            <div className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-1">
              Эффект при покупке
            </div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 space-y-1">
              {asset.effects?.skillBonus?.programming && (
                <div>📚 +{asset.effects.skillBonus.programming} к программированию</div>
              )}
              {asset.effects?.skillBonus?.finance && (
                <div>💰 +{asset.effects.skillBonus.finance} к финансам</div>
              )}
              {asset.effects?.skillBonus?.luck && (
                <div>🍀 +{asset.effects.skillBonus.luck} к удаче</div>
              )}
              {asset.effects?.careerBoost && (
                <div>💼 Карьера +{asset.effects.careerBoost * 100}% к прогрессу</div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Количество
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-l-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={ownedQuantity > 0 ? ownedQuantity : 999}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 w-16 px-3 py-1 text-center border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setQuantity(prev => prev + 1)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-r-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="text-sm">
            <div className="text-gray-500 dark:text-gray-400">Стоимость</div>
            <div className="font-medium">{formatCurrency(currentPrice * quantity)}</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button
          variant="success"
          size="sm"
          fullWidth
          isLoading={isBuying}
          onClick={handleBuy}
          disabled={isSelling}
        >
          Купить {quantity} шт.
        </Button>

        <Button
          variant="danger"
          size="sm"
          fullWidth
          isLoading={isSelling}
          onClick={handleSell}
          disabled={ownedQuantity === 0 || isBuying}
        >
          Продать {quantity} шт.
        </Button>

        {onDetails && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDetails(asset.id)}
            icon={<Info className="h-4 w-4" />}
            title="Подробнее"
          />
        )}
      </CardFooter>
    </Card>
  );
};
