import React, { useState } from 'react';
import { AssetCard } from '@/components/game/AssetCard';
import { notify } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

// Тестовые данные
const mockAssets = [
  {
    id: 'apple-stock',
    name: 'Акции Apple',
    type: 'stock' as const,
    currentPrice: 150,
    volatility: 0.3,
    trend: 0.2,
    description: 'Стабильные акции технологического гиганта. Средний риск, стабильный рост.',
    category: 'tech'
  },
  {
    id: 'bitcoin',
    name: 'Биткоин',
    type: 'crypto' as const,
    currentPrice: 50000,
    volatility: 0.8,
    trend: 0.1,
    description: 'Криптовалюта с высокой волатильностью. Высокий риск, высокая потенциальная доходность.',
    category: 'crypto'
  },
  {
    id: 'real-estate',
    name: 'Недвижимость',
    type: 'real_estate' as const,
    currentPrice: 5000000,
    volatility: 0.2,
    trend: 0.3,
    description: 'Квартира в центре Москвы. Низкий риск, стабильный рост + арендный доход.',
    category: 'real_estate'
  }
];

export function TestAssetCard() {
  const [portfolio, setPortfolio] = useState<Record<string, number>>({
    'apple-stock': 10,
    'bitcoin': 0,
    'real-estate': 0
  });

  const priceChanges = useState<Record<string, number>>(() => {
    const changes: Record<string, number> = {};
    mockAssets.forEach(asset => {
      // Пример: базовое изменение = trend * 10, ±5% шума
      changes[asset.id] = asset.trend * 10 + (Math.random() - 0.5) * 5;
    });
    return changes;
  })[0]; // берем только значение состояния (не сеттер)

  const handleBuy = (assetId: string, quantity: number) => {
    setPortfolio(prev => ({
      ...prev,
      [assetId]: (prev[assetId] || 0) + quantity
    }));
    notify.success('Покупка', `Куплено ${quantity} шт.`);
  };

  const handleSell = (assetId: string, quantity: number) => {
    setPortfolio(prev => ({
      ...prev,
      [assetId]: Math.max(0, (prev[assetId] || 0) - quantity)
    }));
    notify.warning('Продажа', `Продано ${quantity} шт.`);
  };

  const handleDetails = (assetId: string) => {
    notify.info('Детали', `Актив: ${assetId}`);
  };

  return (
    <div className="p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>🎮 AssetCard Component Test</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Интерактивные карточки активов с графиками и торговлей
          </p>
        </CardHeader>

        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">📊 Портфель</h3>
            <div className="flex gap-4 text-sm">
              {Object.entries(portfolio).map(([assetId, quantity]) => {
                const asset = mockAssets.find(a => a.id === assetId);
                return asset ? (
                  <div key={assetId} className="bg-white dark:bg-gray-800 px-3 py-2 rounded">
                    <div className="font-medium">{asset.name}</div>
                    <div>{quantity} шт.</div>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockAssets.map(asset => (
              <AssetCard
                key={asset.id}
                asset={asset}
                ownedQuantity={portfolio[asset.id] || 0}
                priceChange={priceChanges[asset.id] || asset.trend * 10}
                onBuy={handleBuy}
                onSell={handleSell}
                onDetails={handleDetails}
              />
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h4 className="font-medium mb-2">🎯 Компонент готов к интеграции с:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>Zustand store (использование реальных данных активов)</li>
              <li>Recharts для настоящих графиков</li>
              <li>Системой событий покупки/продажи</li>
              <li>Расчетом прибыли/убытка</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
