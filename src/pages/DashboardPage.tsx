// src/pages/DashboardPage.tsx
import React, { useMemo, useState } from 'react'
import { useGameStore } from '@/store'
import { AssetCardConnected } from '@/components/game/AssetCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { TrendingUp, Wallet, Calendar, Briefcase } from 'lucide-react'
import { formatCurrency } from '@/utils'
import { AssetFilter, AssetFilterType } from '@/components/game/AssetFilter'

export const DashboardPage: React.FC = () => {
  const { currentYear, balance, player, portfolio, availableAssets, priceChanges } = useGameStore()
  
  const [assetFilter, setAssetFilter] = useState<AssetFilterType>('all')

  const filteredAssets = availableAssets.filter(asset => {
    if (assetFilter === 'all') return true
    return asset.type === assetFilter
  })

  const portfolioValue = useMemo(() => {
    return portfolio.reduce((total, item) => {
      const asset = availableAssets.find(a => a.id === item.assetId)
      return total + (asset ? asset.currentPrice * item.quantity : 0)
    }, 0)
  }, [portfolio, availableAssets])

  const netWorth = balance + portfolioValue

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Добро пожаловать, {player.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Управляйте финансами, инвестируйте и развивайте карьеру
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Текущий год</div>
                <div className="text-2xl font-bold">{currentYear}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Wallet className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Баланс</div>
                <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Чистый капитал</div>
                <div className="text-2xl font-bold">{formatCurrency(netWorth)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Briefcase className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Зарплата</div>
                <div className="text-2xl font-bold">{formatCurrency(player.salary)}/мес</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>📈 Доступные активы</span>
            {/* 🔹 Фильтр */}
            <div className="hidden md:block">
              <AssetFilter activeFilter={assetFilter} onFilterChange={setAssetFilter} />
            </div>
          </CardTitle>
        </CardHeader>

        <div className="md:hidden px-6 pt-4">
          <AssetFilter activeFilter={assetFilter} onFilterChange={setAssetFilter} />
        </div>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.length > 0 ? (
              filteredAssets.map(asset => (
                <AssetCardConnected
                  key={asset.id}
                  assetId={asset.id}
                  priceChange={priceChanges[asset.id] || asset.trend * 10}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                Активы не найдены по выбранному фильтру
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Быстрые действия */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Быстрые действия (в разработке)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left">
              <div className="font-medium text-blue-700 dark:text-blue-300">Купить криптовалюту</div>
              <div className="text-sm text-blue-600/70 dark:text-blue-400/70 mt-1">
                Инвестируйте в высокодоходные активы
              </div>
            </button>

            <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left">
              <div className="font-medium text-green-700 dark:text-green-300">Повысить квалификацию</div>
              <div className="text-sm text-green-600/70 dark:text-green-400/70 mt-1">
                Увеличьте зарплату и навыки
              </div>
            </button>

            <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left">
              <div className="font-medium text-purple-700 dark:text-purple-300">Анализ портфеля</div>
              <div className="text-sm text-purple-600/70 dark:text-purple-400/70 mt-1">
                Посмотрите детали своих инвестиций
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
